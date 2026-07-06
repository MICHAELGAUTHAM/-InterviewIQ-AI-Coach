from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import models
from app.schemas import schemas
from app.services.ai_service import AIService

router = APIRouter()

@router.get("/roadmap", response_model=schemas.LearningPlanOut)
def get_roadmap(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    plan = db.query(models.LearningPlan).filter(models.LearningPlan.user_id == current_user.id).order_by(models.LearningPlan.created_at.desc()).first()
    if not plan:
        # Auto-generate a new plan based on user skills/weaknesses
        profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
        skills = profile.skills if profile else []
        
        # Pull weak topics from feedback
        feedbacks = db.query(models.Feedback).join(models.Answer).filter(models.Answer.interview_id.in_(
            db.query(models.Interview.id).filter(models.Interview.user_id == current_user.id)
        )).all()
        weak_topics = []
        for f in feedbacks:
            if f.score_technical < 75:
                weak_topics.extend(f.topics_to_study)
                
        roadmap_data = AIService.generate_roadmap(skills, list(set(weak_topics)))
        
        plan = models.LearningPlan(
            user_id=current_user.id,
            weak_topics=roadmap_data["weak_topics"],
            daily_study_plan=roadmap_data["daily_study_plan"],
            recommended_projects=roadmap_data["recommended_projects"],
            practice_questions=roadmap_data["practice_questions"],
            learning_resources=roadmap_data["learning_resources"],
            weekly_goals=roadmap_data["weekly_goals"]
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)
        
    return plan

@router.post("/roadmap/generate", response_model=schemas.LearningPlanOut)
def generate_new_roadmap(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    skills = profile.skills if profile else []
    
    # Force query for new weaknesses
    feedbacks = db.query(models.Feedback).join(models.Answer).filter(models.Answer.interview_id.in_(
        db.query(models.Interview.id).filter(models.Interview.user_id == current_user.id)
    )).all()
    
    weak_topics = []
    for f in feedbacks:
        if f.score_technical < 75:
            weak_topics.extend(f.topics_to_study)
            
    roadmap_data = AIService.generate_roadmap(skills, list(set(weak_topics)))
    
    plan = models.LearningPlan(
        user_id=current_user.id,
        weak_topics=roadmap_data["weak_topics"],
        daily_study_plan=roadmap_data["daily_study_plan"],
        recommended_projects=roadmap_data["recommended_projects"],
        practice_questions=roadmap_data["practice_questions"],
        learning_resources=roadmap_data["learning_resources"],
        weekly_goals=roadmap_data["weekly_goals"]
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    
    return plan
