from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import models
from app.schemas import schemas
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/setup", response_model=schemas.InterviewOut)
def setup_interview(
    setup_in: schemas.InterviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Generate questions using AI Service
    questions_data = AIService.generate_questions(
        job_role=setup_in.job_role,
        experience_level=setup_in.experience_level,
        interview_type=setup_in.interview_type,
        difficulty=setup_in.difficulty,
        num_questions=setup_in.num_questions
    )
    
    # Save interview
    db_interview = models.Interview(
        user_id=current_user.id,
        job_role=setup_in.job_role,
        experience_level=setup_in.experience_level,
        interview_type=setup_in.interview_type,
        difficulty=setup_in.difficulty,
        num_questions=setup_in.num_questions
    )
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    
    # Save questions
    for q in questions_data:
        db_q = models.Question(
            interview_id=db_interview.id,
            question_text=q["question_text"],
            expected_keywords=q.get("expected_keywords", []),
            order_num=q["order_num"],
            is_coding=q["is_coding"],
            code_template=q.get("code_template"),
            test_cases=q.get("test_cases", []),
            hidden_test_cases=q.get("hidden_test_cases", [])
        )
        db.add(db_q)
    
    db.commit()
    db.refresh(db_interview)
    
    return db_interview

@router.post("/submit-answer", response_model=schemas.AnswerOut)
def submit_answer(
    answer_in: schemas.AnswerSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Fetch question and verify ownership
    question = db.query(models.Question).filter(models.Question.id == answer_in.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    interview = db.query(models.Interview).filter(
        models.Interview.id == question.interview_id,
        models.Interview.user_id == current_user.id
    ).first()
    if not interview:
        raise HTTPException(status_code=403, detail="Unauthorized access to this interview session")
        
    # Standardize answer content (decode speech-to-text mock or take input)
    answer_text = answer_in.typed_answer or ""
    if answer_in.voice_answer_base64:
        # Visualizer / voice data conversion simulated
        answer_text = "Highly optimized concurrency models are vital in high-frequency trading platforms. I leverage lock-free ring buffers to control latency."
        
    # Evaluate answer using AIService
    eval_result = AIService.evaluate_answer(
        question_text=question.question_text,
        user_answer=answer_text,
        is_coding=answer_in.is_coding,
        code_lang=answer_in.code_language
    )
    
    # Save Answer record
    db_answer = models.Answer(
        question_id=question.id,
        interview_id=interview.id,
        typed_answer=answer_text,
        is_coding=answer_in.is_coding,
        code_language=answer_in.code_language,
        execution_time=eval_result.get("execution_time"),
        memory_usage=eval_result.get("memory_usage"),
        code_passed_cases=eval_result.get("passed_cases"),
        code_total_cases=eval_result.get("total_cases")
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    
    # Save Feedback record
    db_feedback = models.Feedback(
        answer_id=db_answer.id,
        question_id=question.id,
        score_overall=eval_result["score_overall"],
        score_technical=eval_result["score_technical"],
        score_communication=eval_result["score_communication"],
        score_confidence=eval_result["score_confidence"],
        score_grammar=eval_result["score_grammar"],
        score_completeness=eval_result["score_completeness"],
        score_relevance=eval_result["score_relevance"],
        strengths=eval_result["strengths"],
        weaknesses=eval_result["weaknesses"],
        improved_answer=eval_result["improved_answer"],
        recommended_resources=eval_result["recommended_resources"],
        topics_to_study=eval_result["topics_to_study"]
    )
    db.add(db_feedback)
    
    # Check if this completes the interview
    all_qs = db.query(models.Question).filter(models.Question.interview_id == interview.id).count()
    sub_ans = db.query(models.Answer).filter(models.Answer.interview_id == interview.id).count()
    
    if all_qs == sub_ans:
        # Calculate final average score
        feedbacks = db.query(models.Feedback).join(models.Answer).filter(models.Answer.interview_id == interview.id).all()
        avg_score = int(sum(f.score_overall for f in feedbacks) / len(feedbacks)) if feedbacks else 70
        
        # Save practice history
        history = models.PracticeHistory(
            user_id=current_user.id,
            interview_id=interview.id,
            score=avg_score,
            status="completed"
        )
        db.add(history)
        
        # Award certificate/badge randomly if score is exceptional
        if avg_score >= 80:
            badge_name = "Elite Interviewer" if avg_score >= 90 else "Pro Communicator"
            db_cert = models.Certificate(
                user_id=current_user.id,
                title=f"Mock Placement Certificate - {interview.job_role}",
                badge_name=badge_name,
                badge_image_url=""
            )
            db.add(db_cert)
            
            db.add(models.Notification(
                user_id=current_user.id,
                message=f"Congratulations! You unlocked the '{badge_name}' badge for scoring {avg_score}% on your {interview.job_role} interview."
            ))
            
        db.add(models.Notification(
            user_id=current_user.id,
            message=f"Mock interview for {interview.job_role} completed! Final score: {avg_score}%."
        ))
        
    db.commit()
    db.refresh(db_answer)
    
    return db_answer

@router.get("/companies", response_model=list[schemas.CompanyOut])
def get_companies(db: Session = Depends(get_db)):
    companies = db.query(models.Company).all()
    if not companies:
        # Seed default companies
        seeds = [
            {"name": "Google", "description": "Rigorous technical reviews focusing heavily on algorithms, big-O complexity, and scale design.", "questions": ["Two Sum", "Merge Intervals", "Virtual Memory"]},
            {"name": "Meta", "description": "Fast-paced system architecture and engineering challenges emphasizing product design.", "questions": ["Two Sum", "Longest Substring", "REST vs GraphQL"]},
            {"name": "Amazon", "description": "Heavily evaluates behavioral aspects based on Leadership Principles and scale APIs.", "questions": ["Tell me about a time you failed.", "Describe a time you faced a conflict.", "Database Indexes"]}
        ]
        for s in seeds:
            comp = models.Company(
                name=s["name"],
                description=s["description"],
                questions=s["questions"],
                logo_url=""
            )
            db.add(comp)
        db.commit()
        companies = db.query(models.Company).all()
    return companies

@router.get("/history", response_model=list[schemas.PracticeHistory])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.PracticeHistory).filter(models.PracticeHistory.user_id == current_user.id).order_by(models.PracticeHistory.completed_at.desc()).all()

@router.get("/{interview_id}", response_model=schemas.InterviewOut)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id,
        models.Interview.user_id == current_user.id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")
    return interview
