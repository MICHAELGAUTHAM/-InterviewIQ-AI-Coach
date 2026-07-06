# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models import models

router = APIRouter()

@router.get("/analytics")
def get_admin_analytics(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    # Total Users
    total_users = db.query(models.User).count()
    
    # Total Interviews
    total_interviews = db.query(models.Interview).count()
    
    # Completed Interviews
    completed_interviews = db.query(models.PracticeHistory).count()
    
    # Avg Score
    histories = db.query(models.PracticeHistory).all()
    avg_score = int(sum(h.score for h in histories) / len(histories)) if histories else 0
    
    # Role distribution
    profiles = db.query(models.Profile).all()
    roles = {}
    for p in profiles:
        roles[p.preferred_role] = roles.get(p.preferred_role, 0) + 1
        
    return {
        "total_users": total_users,
        "total_interviews": total_interviews,
        "completed_interviews": completed_interviews,
        "average_score": avg_score,
        "role_distribution": roles
    }

@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    users = db.query(models.User).all()
    out = []
    for u in users:
        profile = db.query(models.Profile).filter(models.Profile.user_id == u.id).first()
        out.append({
            "id": u.id,
            "email": u.email,
            "is_admin": u.is_admin,
            "full_name": profile.full_name if profile else "N/A",
            "preferred_role": profile.preferred_role if profile else "N/A",
            "created_at": u.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return out

@router.get("/reports")
def list_reports(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    # Custom compilation of practice histories
    histories = db.query(models.PracticeHistory).order_by(models.PracticeHistory.completed_at.desc()).all()
    out = []
    for h in histories:
        user = db.query(models.User).filter(models.User.id == h.user_id).first()
        interview = db.query(models.Interview).filter(models.Interview.id == h.interview_id).first()
        out.append({
            "id": h.id,
            "email": user.email if user else "Deleted User",
            "job_role": interview.job_role if interview else "Deleted Interview",
            "interview_type": interview.interview_type if interview else "Deleted Interview",
            "score": h.score,
            "completed_at": h.completed_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return out

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Admins cannot delete their own accounts.")
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully."}
