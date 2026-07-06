import React, { useState, useEffect } from 'react';
import { Play, ArrowLeft, Building2, HelpCircle, Loader2 } from 'lucide-react';
import { interviewService } from '../services/api';

interface InterviewSetupProps {
  onNavigate: (page: string, params?: any) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onNavigate }) => {
  const [role, setRole] = useState('Software Engineer');
  const [level, setLevel] = useState('Mid-Level');
  const [type, setType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [numQs, setNumQs] = useState(5);
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await interviewService.getCompanies();
        setCompanies(data);
      } catch (e) {
        console.error("Failed to load companies", e);
      }
    };
    fetchCompanies();
  }, []);

  const roles = [
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "AI Engineer",
    "Data Analyst",
    "DevOps Engineer",
    "Cybersecurity Engineer"
  ];

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await interviewService.setup({
        job_role: role,
        experience_level: level,
        interview_type: type,
        difficulty: difficulty,
        num_questions: numQs
      });
      
      // Navigate to corresponding screen
      // If the first question is coding, open Coding Interview. Otherwise, open AI Interview Screen
      const firstQ = session.questions[0];
      if (firstQ && firstQ.is_coding) {
        onNavigate('coding-interview', { session_id: session.id, question_index: 0 });
      } else {
        onNavigate('interview-screen', { session_id: session.id, question_index: 0 });
      }
    } catch (e) {
      setError("Failed to initialize interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (comp: any) => {
    // Auto-configure setup based on company profile
    setRole("Software Engineer");
    setDifficulty("Advanced");
    if (comp.name === "Google") {
      setType("Coding");
      setLevel("Mid-Level");
    } else if (comp.name === "Meta") {
      setType("Mixed");
      setLevel("Senior");
    } else {
      setType("Technical");
      setLevel("Junior");
    }
    setNumQs(4);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Configure Practice Interview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Specify parameters to tailor interview questions to your target credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Setup Parameters Panel */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold">Interview Parameters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Target Job Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-zinc-950 dark:text-zinc-100 transition-all"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Experience Level</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-zinc-950 dark:text-zinc-100 transition-all"
              >
                <option value="Junior">Junior (0-2 years)</option>
                <option value="Mid-Level">Mid-Level (2-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Interview Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-zinc-950 dark:text-zinc-100 transition-all"
              >
                <option value="Technical">Technical (Theory & Architecture)</option>
                <option value="HR">HR & Behavioral</option>
                <option value="Coding">Coding Arena (Algorithms)</option>
                <option value="Mixed">Mixed Rounds</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-zinc-950 dark:text-zinc-100 transition-all"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-zinc-500">Number of Questions</label>
              <span className="text-xs font-bold text-blue-500">{numQs} Questions</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="10" 
              value={numQs}
              onChange={(e) => setNumQs(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 rounded-xl p-4 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Customizing AI Interview...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start Practice Interview
              </>
            )}
          </button>
        </div>

        {/* Company Mock Drives Panel */}
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold">Company-specific Modes</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Pre-configured placement mock sessions mapped to top firms.</p>
          </div>

          <div className="space-y-4">
            {companies.map((c) => (
              <div 
                key={c.id} 
                onClick={() => handleSelectCompany(c)}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 bg-white dark:bg-[#0c0c0f] hover:bg-blue-50/5 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-zinc-400 group-hover:text-blue-500" />
                    <span className="text-sm font-bold">{c.name} Mode</span>
                  </div>
                  <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase">Mock</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{c.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.questions?.slice(0, 2).map((q: string, i: number) => (
                    <span key={i} className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-medium">{q}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
