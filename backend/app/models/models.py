from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    learning_plans = relationship("LearningPlan", back_populates="user", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")
    practice_history = relationship("PracticeHistory", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    full_name = Column(String, default="User")
    photo_url = Column(String, nullable=True)
    preferred_role = Column(String, default="Software Engineer")
    target_company = Column(String, default="Google")
    education = Column(JSON, default=list) # List of dicts: school, degree, year
    skills = Column(JSON, default=list) # List of strings
    achievements = Column(JSON, default=list) # List of strings
    certificates = Column(JSON, default=list) # List of dicts

    user = relationship("User", back_populates="profile")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    
    # Parser results
    skills = Column(JSON, default=list)
    education = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    experience = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    
    # ATS Review results
    ats_score = Column(Integer, default=0)
    grammar_score = Column(Integer, default=0)
    keyword_match = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    formatting_suggestions = Column(JSON, default=list)
    summary_suggestions = Column(JSON, default=list)
    project_suggestions = Column(JSON, default=list)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="resumes")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=True)

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    job_role = Column(String, nullable=False)
    experience_level = Column(String, nullable=False)
    interview_type = Column(String, nullable=False) # HR, Technical, Coding, Mixed
    difficulty = Column(String, nullable=False) # Beginner, Intermediate, Advanced
    num_questions = Column(Integer, default=5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="interviews")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"))
    question_text = Column(Text, nullable=False)
    expected_keywords = Column(JSON, default=list)
    order_num = Column(Integer, nullable=False)
    
    # Coding interview specific details
    is_coding = Column(Boolean, default=False)
    code_template = Column(Text, nullable=True)
    test_cases = Column(JSON, default=list) # List of input/output pairs
    hidden_test_cases = Column(JSON, default=list)

    interview = relationship("Interview", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"))
    
    # Text or transcription
    typed_answer = Column(Text, nullable=True)
    voice_answer_path = Column(String, nullable=True)
    
    # Coding submissions
    is_coding = Column(Boolean, default=False)
    code_content = Column(Text, nullable=True)
    code_language = Column(String, nullable=True)
    execution_time = Column(Float, nullable=True) # milliseconds
    memory_usage = Column(Float, nullable=True) # MB
    code_passed_cases = Column(Integer, nullable=True)
    code_total_cases = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    question = relationship("Question", back_populates="answers")
    feedback = relationship("Feedback", back_populates="answer", uselist=False, cascade="all, delete-orphan")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    answer_id = Column(Integer, ForeignKey("answers.id", ondelete="CASCADE"), unique=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    
    # Evaluation Scores (0-100)
    score_overall = Column(Integer, default=0)
    score_technical = Column(Integer, default=0)
    score_communication = Column(Integer, default=0)
    score_confidence = Column(Integer, default=0)
    score_grammar = Column(Integer, default=0)
    score_completeness = Column(Integer, default=0)
    score_relevance = Column(Integer, default=0)
    
    strengths = Column(JSON, default=list) # List of strings
    weaknesses = Column(JSON, default=list) # List of strings
    improved_answer = Column(Text, nullable=True)
    recommended_resources = Column(JSON, default=list) # List of dicts: title, url, type
    topics_to_study = Column(JSON, default=list) # List of strings

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    answer = relationship("Answer", back_populates="feedback")

class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    
    weak_topics = Column(JSON, default=list)
    daily_study_plan = Column(JSON, default=list) # List of day schedule items
    recommended_projects = Column(JSON, default=list)
    practice_questions = Column(JSON, default=list)
    learning_resources = Column(JSON, default=list)
    weekly_goals = Column(JSON, default=list)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="learning_plans")

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    badge_name = Column(String, nullable=False)
    badge_image_url = Column(String, nullable=True)
    issue_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="certificates")

class PracticeHistory(Base):
    __tablename__ = "practice_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"))
    score = Column(Integer, default=0)
    status = Column(String, default="completed") # completed, active, partial
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="practice_history")
    interview = relationship("Interview")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    logo_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    questions = Column(JSON, default=list) # Custom bank of questions for this company

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")
