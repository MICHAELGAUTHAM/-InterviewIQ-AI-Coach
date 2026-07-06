from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from io import BytesIO
import pypdf
import docx

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import models
from app.schemas import schemas
from app.services.ai_service import AIService

router = APIRouter()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = pypdf.PdfReader(BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF file: {str(e)}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(BytesIO(file_bytes))
        text = []
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
        return "\n".join(text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse Word document: {str(e)}")

@router.post("/upload", response_model=schemas.ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify extension
    filename = file.filename
    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX file types are supported.")
    
    file_content = await file.read()
    
    # Extract text content
    if filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_content)
    else:
        extracted_text = extract_text_from_docx(file_content)
        
    # Trigger AI resume parser & ATS scanner
    parsed = AIService.parse_resume(filename, extracted_text)
    
    # Save resume record
    resume_rec = models.Resume(
        user_id=current_user.id,
        filename=filename,
        skills=parsed["skills"],
        education=parsed["education"],
        projects=parsed["projects"],
        experience=parsed["experience"],
        certifications=parsed["certifications"],
        ats_score=parsed["ats_score"],
        grammar_score=parsed["grammar_score"],
        keyword_match=parsed["keyword_match"],
        missing_skills=parsed["missing_skills"],
        formatting_suggestions=parsed["formatting_suggestions"],
        summary_suggestions=parsed["summary_suggestions"],
        project_suggestions=parsed["project_suggestions"]
    )
    db.add(resume_rec)
    db.commit()
    db.refresh(resume_rec)
    
    # Update profile education and skills
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if profile:
        profile.skills = list(set(profile.skills + parsed["skills"]))
        if parsed["education"]:
            profile.education = parsed["education"]
        db.commit()
        
    # Create notification
    notification = models.Notification(
        user_id=current_user.id,
        message=f"Resume '{filename}' parsed successfully. ATS Score: {parsed['ats_score']}%"
    )
    db.add(notification)
    db.commit()
    
    return resume_rec

@router.get("/history", response_model=list[schemas.ResumeOut])
def get_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.created_at.desc()).all()

@router.get("/{resume_id}", response_model=schemas.ResumeOut)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
