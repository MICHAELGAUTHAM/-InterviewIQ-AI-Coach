import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { Dashboard } from './pages/Dashboard';
import { ResumeUpload } from './pages/ResumeUpload';
import { InterviewSetup } from './pages/InterviewSetup';
import { InterviewScreen } from './pages/InterviewScreen';
import { CodingInterview } from './pages/CodingInterview';
import { FeedbackPage } from './pages/FeedbackPage';
import { LearningRoadmap } from './pages/LearningRoadmap';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPanel } from './pages/AdminPanel';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Custom router state
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [params, setParams] = useState<any>({});

  const handleNavigate = (page: string, navigationParams: any = {}) => {
    setCurrentPage(page);
    setParams(navigationParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Authenticating credentials...</span>
        </div>
      </div>
    );
  }

  // Route protection
  const publicPages = ['landing', 'login', 'register', 'forgot'];
  const isPublic = publicPages.includes(currentPage);
  
  if (!isAuthenticated && !isPublic) {
    // Force login
    return <AuthPages onNavigate={handleNavigate} initialMode="login" />;
  }

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <AuthPages onNavigate={handleNavigate} initialMode="login" />}
      {currentPage === 'register' && <AuthPages onNavigate={handleNavigate} initialMode="register" />}
      {currentPage === 'forgot' && <AuthPages onNavigate={handleNavigate} initialMode="forgot" />}
      
      {isAuthenticated && (
        <>
          {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentPage === 'resume-upload' && <ResumeUpload onNavigate={handleNavigate} />}
          {currentPage === 'interview-setup' && <InterviewSetup onNavigate={handleNavigate} />}
          {currentPage === 'interview-screen' && (
            <InterviewScreen 
              onNavigate={handleNavigate} 
              sessionId={params.session_id} 
              questionIndex={params.question_index || 0} 
            />
          )}
          {currentPage === 'coding-interview' && (
            <CodingInterview 
              onNavigate={handleNavigate} 
              sessionId={params.session_id} 
              questionIndex={params.question_index || 0} 
            />
          )}
          {currentPage === 'feedback' && (
            <FeedbackPage 
              onNavigate={handleNavigate} 
              interviewId={params.interview_id} 
            />
          )}
          {currentPage === 'learning-roadmap' && <LearningRoadmap onNavigate={handleNavigate} />}
          {currentPage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
          {currentPage === 'admin' && <AdminPanel onNavigate={handleNavigate} />}
        </>
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
