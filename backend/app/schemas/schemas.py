from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None

# --- PROFILE SCHEMAS ---
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    photo_url: Optional[str] = None
    preferred_role: Optional[str] = None
    target_company: Optional[str] = None
    education: Optional[List[Dict[str, Any]]] = None
    skills: Optional[List[str]] = None
    achievements: Optional[List[str]] = None

class ProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    photo_url: Optional[str]
    preferred_role: str
    target_company: str
    education: List[Dict[str, Any]]
    skills: List[str]
    achievements: List[str]

    class Config:
        from_attributes = True

# --- INTERVIEW SCHEMAS ---
class InterviewCreate(BaseModel):
    job_role: str
    experience_level: str
    interview_type: str
    difficulty: str
    num_questions: int

class QuestionOut(BaseModel):
    id: int
    interview_id: int
    question_text: str
    order_num: int
    is_coding: bool
    code_template: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None

    class Config:
        from_attributes = True

class InterviewOut(BaseModel):
    id: int
    job_role: str
    experience_level: str
    interview_type: str
    difficulty: str
    num_questions: int
    created_at: datetime
    questions: List[QuestionOut] = []

    class Config:
        from_attributes = True

# --- ANSWER & EVALUATION SCHEMAS ---
class AnswerSubmit(BaseModel):
    question_id: int
    typed_answer: Optional[str] = None
    voice_answer_base64: Optional[str] = None # For voice uploads
    is_coding: bool = False
    code_language: Optional[str] = None

class FeedbackOut(BaseModel):
    id: int
    answer_id: int
    question_id: int
    score_overall: int
    score_technical: int
    score_communication: int
    score_confidence: int
    score_grammar: int
    score_completeness: int
    score_relevance: int
    strengths: List[str]
    weaknesses: List[str]
    improved_answer: Optional[str] = None
    recommended_resources: List[Dict[str, Any]]
    topics_to_study: List[str]

    class Config:
        from_attributes = True

class AnswerOut(BaseModel):
    id: int
    question_id: int
    interview_id: int
    typed_answer: Optional[str]
    is_coding: bool
    code_language: Optional[str]
    execution_time: Optional[float]
    memory_usage: Optional[float]
    code_passed_cases: Optional[int]
    code_total_cases: Optional[int]
    feedback: Optional[FeedbackOut] = None

    class Config:
        from_attributes = True

# --- RESUME SCHEMAS ---
class ResumeOut(BaseModel):
    id: int
    filename: str
    skills: List[str]
    education: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    experience: List[Dict[str, Any]]
    certifications: List[str]
    ats_score: int
    grammar_score: int
    keyword_match: List[str]
    missing_skills: List[str]
    formatting_suggestions: List[str]
    summary_suggestions: List[str]
    project_suggestions: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- ROADMAP SCHEMAS ---
class LearningPlanOut(BaseModel):
    id: int
    weak_topics: List[str]
    daily_study_plan: List[Dict[str, Any]]
    recommended_projects: List[Dict[str, Any]]
    practice_questions: List[str]
    learning_resources: List[Dict[str, Any]]
    weekly_goals: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- DASHBOARD & GENERAL SCHEMAS ---
class DashboardStats(BaseModel):
    overall_score: int
    weekly_progress: List[Dict[str, Any]]
    streak: int
    resume_score: int
    upcoming_goals: List[str]
    weak_topics: List[str]
    strong_topics: List[str]
    recent_interviews: List[Dict[str, Any]]

class CompanyOut(BaseModel):
    id: int
    name: str
    logo_url: Optional[str]
    description: Optional[str]
    questions: List[str]

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    score: int
    streak: int
    badge: str

class PracticeHistory(BaseModel):
    id: int
    user_id: int
    interview_id: int
    score: int
    status: str
    completed_at: datetime

    class Config:
        from_attributes = True
