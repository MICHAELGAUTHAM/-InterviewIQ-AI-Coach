import React, { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, Calendar, Target, Code, MessageSquare, Award, CheckCircle2 } from 'lucide-react';
import { learningService } from '../services/api';

interface LearningRoadmapProps {
  onNavigate: (page: string) => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ onNavigate }) => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async () => {
    try {
      const data = await learningService.getRoadmap();
      setPlan(data);
    } catch (e) {
      setError("Failed to retrieve learning roadmap.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const data = await learningService.regenerateRoadmap();
      setPlan(data);
    } catch (e) {
      setError("Failed to regenerate learning roadmap.");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading || !plan) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Assembling AI Study Roadmaps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Learning Roadmap</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Personalized study plan generated dynamically based on your weak interview topics.</p>
          </div>
        </div>

        <button 
          onClick={handleRegenerate}
          disabled={regenerating}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl px-5 py-3 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} /> {regenerating ? "Regenerating..." : "Regenerate Roadmap"}
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Goals & Weakness checklist */}
        <div className="space-y-6">
          
          {/* Weekly Goals */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Target className="w-5 h-5 text-blue-500" /> Weekly Goals
            </h3>
            <div className="space-y-3">
              {plan.weekly_goals?.map((g: string, i: number) => (
                <div key={i} className="flex gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Award className="w-5 h-5 text-purple-500" /> Weak Topics to Address
            </h3>
            <div className="flex flex-wrap gap-2">
              {plan.weak_topics?.map((topic: string, i: number) => (
                <span key={i} className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-bold">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Resources */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Code className="w-5 h-5 text-indigo-500" /> Curated Resources
            </h3>
            <div className="space-y-3">
              {plan.learning_resources?.map((res: any, idx: number) => (
                <a
                  key={idx}
                  href={res.url}
                  className="block p-3 bg-zinc-100/50 dark:bg-zinc-900/50 hover:bg-blue-500/5 hover:border-blue-500/30 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all text-xs"
                >
                  <span className="font-bold block">{res.title}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mt-1">{res.type}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Day plans & Projects */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Daily Schedule */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" /> Daily Study Schedule
            </h3>

            <div className="space-y-6 relative border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 ml-3">
              {plan.daily_study_plan?.map((day: any, i: number) => (
                <div key={i} className="relative space-y-1">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-[#09090b]"></span>
                  
                  <span className="text-xs font-bold text-blue-500">{day.day}</span>
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{day.topic}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{day.activity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project Suggestions */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-500" /> Suggested Projects
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.recommended_projects?.map((proj: any, idx: number) => (
                <div key={idx} className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold">{proj.title}</h4>
                    <span className="text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-bold uppercase">{proj.difficulty}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.skills_gained?.map((sk: string, i: number) => (
                      <span key={i} className="text-[9px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Questions */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" /> Focus Practice Questions
            </h3>
            <div className="space-y-3">
              {plan.practice_questions?.map((q: string, i: number) => (
                <div key={i} className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-xs font-bold leading-relaxed shadow-sm">
                  {q}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
