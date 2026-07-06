# InterviewIQ AI – Your Personal AI Interview Coach

InterviewIQ AI is a modern, responsive, full-stack web application designed to help students and job seekers prepare for interviews using Artificial Intelligence.

## Key Features

- **ATS Resume Scan**: Upload PDF or Word resumes to receive keyword optimization advice, missing skill recommendations, and professional summary improvements.
- **AI Mock Arena**: Practice HR, Technical, or Mixed rounds. Supports typed and speech-to-text answers with an interactive listening avatar.
- **Coding Arena**: Compile and run code in Python, JavaScript, Java, and C++ inside Monaco Editor, validating performance across sample and hidden test cases.
- **AI Performance Feedback**: Get comprehensive evaluations (technical accuracy, confidence, grammar, communication, completeness, and relevance) mapped on radar charts, plus improved model answers.
- **AI Learning Roadmaps**: Auto-generate personalized daily study schedules, recommended projects, and focus practice materials based on weak areas.
- **Platform Console**: Admin controls to monitor global statistics, view completion reports, and manage user lists.

---

## Technical Stack

- **Frontend**: React (v19), TypeScript, Tailwind CSS (v4), Monaco Editor, Apache ECharts (via `echarts-for-react`), and Lucide Icons.
- **Backend**: FastAPI, SQLAlchemy (relational database ORM), PyPDF, and python-docx.
- **Database**: SQLite (default for zero-config local verification) and PostgreSQL support (production ready).
- **Deployment**: Docker, docker-compose, and environment variables configurations.

---

## Getting Started

### Option A: Local Run (Recommended for Dev/Testing)

#### 1. Launch FastAPI Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Windows PowerShell**:
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
   - **Command Prompt (cmd)**:
     ```cmd
     .venv\Scripts\activate.bat
     ```
3. Run the API server:
   ```bash
   uvicorn app.main:app --reload
   ```
The backend API is now running at `http://localhost:8000`. You can inspect the Swagger interactive docs at `http://localhost:8000/docs`.

#### 2. Launch Vite React Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Launch the developer server:
   ```bash
   npm run dev
   ```
The frontend is now running at `http://localhost:5173`. Open this URL in your web browser.

---

### Option B: Docker Compose

Build and launch the entire stack using Docker Compose:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
