from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Fetch practice history
    history = db.query(models.PracticeHistory).filter(models.PracticeHistory.user_id == current_user.id).all()
    
    # Compute overall average score
    scores = [h.score for h in history]
    overall_score = int(sum(scores) / len(scores)) if scores else 0
    
    # Calculate streak (mock/dynamic)
    streak = 3 if len(history) > 0 else 0
    
    # Fetch latest resume score
    latest_resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.created_at.desc()).first()
    resume_score = latest_resume.ats_score if latest_resume else 0
    
    # Weekly progress (mock series of past 7 days)
    today = datetime.now()
    weekly_progress = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_str = day.strftime("%a")
        
        # Check if there were interviews on that day
        day_history = [h for h in history if h.completed_at.date() == day.date()]
        day_score = int(sum(h.score for h in day_history) / len(day_history)) if day_history else 0
        
        weekly_progress.append({
            "day": day_str,
            "score": day_score if day_score > 0 else (random.randint(60, 85) if i % 2 == 1 and len(history) > 0 else 0)
        })
        
    # Topics Analysis
    # Get all feedback records
    feedbacks = db.query(models.Feedback).join(models.Answer).filter(models.Answer.interview_id.in_(
        db.query(models.Interview.id).filter(models.Interview.user_id == current_user.id)
    )).all()
    
    weak_topics = set()
    strong_topics = set()
    for f in feedbacks:
        if f.score_technical < 70 or f.score_relevance < 70:
            weak_topics.update(f.topics_to_study)
        else:
            strong_topics.update(f.topics_to_study)
            
    # Clean intersections
    weak_topics = list(weak_topics - strong_topics)
    strong_topics = list(strong_topics)
    
    # Default fallbacks
    if not weak_topics:
        weak_topics = ["Memory Management", "Sliding Window Algorithms"] if len(history) > 0 else ["No interviews completed yet"]
    if not strong_topics:
        strong_topics = ["REST API Concepts", "Basic Big-O Theory"] if len(history) > 0 else ["No data available"]
        
    upcoming_goals = [
        "Improve technical accuracy in System Design",
        "Practice 15 minutes of Coding Interview",
        "Upload a revised resume with quantified metrics"
    ]
    
    recent_interviews = []
    for h in history[:5]: # Take top 5
        interview = db.query(models.Interview).filter(models.Interview.id == h.interview_id).first()
        if interview:
            recent_interviews.append({
                "id": interview.id,
                "role": interview.job_role,
                "type": interview.interview_type,
                "score": h.score,
                "date": h.completed_at.strftime("%b %d, %Y")
            })
            
    return {
        "overall_score": overall_score,
        "weekly_progress": weekly_progress,
        "streak": streak,
        "resume_score": resume_score,
        "upcoming_goals": upcoming_goals,
        "weak_topics": weak_topics[:5],
        "strong_topics": strong_topics[:5],
        "recent_interviews": recent_interviews
    }

@router.get("/leaderboard", response_model=list[schemas.LeaderboardEntry])
def get_leaderboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Mock leaderboard list
    mock_users = [
        {"rank": 1, "username": "CodeNinja", "score": 96, "streak": 14, "badge": "Elite Interviewer"},
        {"rank": 2, "username": "SystemArchitect", "score": 92, "streak": 8, "badge": "Elite Interviewer"},
        {"rank": 3, "username": "AIGuru", "score": 89, "streak": 6, "badge": "Pro Communicator"},
        {"rank": 4, "username": "PythonDev", "score": 85, "streak": 10, "badge": "Pro Communicator"}
    ]
    
    # Insert current user if they have practice history
    history = db.query(models.PracticeHistory).filter(models.PracticeHistory.user_id == current_user.id).all()
    if history:
        avg_score = int(sum(h.score for h in history) / len(history))
        profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
        username = profile.full_name if profile else "You"
        
        # Insert user at correct position
        user_rank = 5
        for idx, u in enumerate(mock_users):
            if avg_score > u["score"]:
                user_rank = idx + 1
                break
                
        mock_users.insert(user_rank - 1, {
            "rank": user_rank,
            "username": username + " (You)",
            "score": avg_score,
            "streak": 3,
            "badge": "Pro Communicator" if avg_score >= 80 else "Regular Practice"
        })
        
        # Re-assign ranks
        for idx, u in enumerate(mock_users):
            u["rank"] = idx + 1
            
    else:
        # Default placeholder entry for user
        mock_users.append({
            "rank": 5,
            "username": "You",
            "score": 0,
            "streak": 0,
            "badge": "Beginner"
        })
        
    return mock_users
