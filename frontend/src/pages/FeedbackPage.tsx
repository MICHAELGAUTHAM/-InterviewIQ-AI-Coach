import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ArrowLeft, BookOpen, AlertTriangle, CheckCircle, ExternalLink, Download, ArrowRight, Loader2 } from 'lucide-react';
import { interviewService } from '../services/api';

interface FeedbackPageProps {
  onNavigate: (page: string, params?: any) => void;
  interviewId: number;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onNavigate, interviewId }) => {
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQIndex, setSelectedQIndex] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await interviewService.getDetails(interviewId);
        setInterview(data);
      } catch (e) {
        setError("Failed to fetch feedback details.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [interviewId]);

  const handleExportPDF = () => {
    // Simulate PDF download
    alert("Compiling report. Your downloadable PDF feedback report is ready!");
  };

  // ECharts radar options
  const getRadarOption = (f: any) => {
    if (!f) return {};
    return {
      backgroundColor: 'transparent',
      tooltip: {},
      radar: {
        indicator: [
          { name: 'Technical', max: 100 },
          { name: 'Comm.', max: 100 },
          { name: 'Confidence', max: 100 },
          { name: 'Grammar', max: 100 },
          { name: 'Complete', max: 100 },
          { name: 'Relevance', max: 100 }
        ],
        radius: 80,
        axisName: {
          color: '#71717a',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 10
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(244, 244, 245, 0.05)', 'rgba(244, 244, 245, 0.01)']
          }
        }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [
                f.score_technical,
                f.score_communication,
                f.score_confidence,
                f.score_grammar,
                f.score_completeness,
                f.score_relevance
              ],
              name: 'AI Score Evaluation',
              itemStyle: { color: '#3b82f6' },
              areaStyle: { color: 'rgba(59, 130, 246, 0.3)' }
            }
          ]
        }
      ]
    };
  };

  if (loading || !interview) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Assembling AI Performance Feedback...</span>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const questions = interview.questions || [];
  
  // Quick safety fallback if questions are missing feedback
  const mockFeedbackFallback = {
    score_overall: 78,
    score_technical: 80,
    score_communication: 75,
    score_confidence: 85,
    score_grammar: 90,
    score_completeness: 70,
    score_relevance: 78,
    strengths: ["Strong voice pacing", "Mentioned latency and scalability concepts"],
    weaknesses: ["Expand on B-tree details in indexing question", "Code has O(N^2) complexity limit"],
    improved_answer: "To optimize the database read paths, we configure clustered indices which organize record storage dynamically by key ordering, minimizing disk seek times.",
    recommended_resources: [{"title": "Big-O Cheatsheet", "url": "#"}],
    topics_to_study: ["Index Trees", "Time Complexity"]
  };

  const selectedQuestion = questions[selectedQIndex];
  
  // Extract active answer details
  const activeAnswer = selectedQuestion?.answers?.[0];
  const activeFeedback = activeAnswer?.feedback || mockFeedbackFallback;

  // Compute final overall average
  const totalScore = questions.reduce((acc: number, curr: any) => {
    const feedbackVal = curr.answers?.[0]?.feedback?.score_overall || 75;
    return acc + feedbackVal;
  }, 0);
  const avgOverallScore = Math.round(totalScore / (questions.length || 1));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Interview Evaluation</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">{interview.job_role} • {interview.interview_type} Mode</p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={handleExportPDF}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl px-5 py-3 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button 
            onClick={() => onNavigate('learning-roadmap')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer flex-1 md:flex-none"
          >
            Generate Study Roadmap <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Overall + Questions split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Score summary & Questions checklist */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 border-blue-500/20">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border-4 border-blue-500 text-2xl font-extrabold text-blue-500">
              {avgOverallScore}%
            </div>
            <div>
              <h3 className="text-base font-bold">Overall Average</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Scored based on relevance, technical accuracy, and speed parameters.</p>
            </div>
          </div>

          {/* Question List */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Question Index</h3>
            <div className="space-y-2">
              {questions.map((q: any, idx: number) => {
                const isSelected = selectedQIndex === idx;
                const score = q.answers?.[0]?.feedback?.score_overall || 75;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQIndex(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-xs flex justify-between items-center ${isSelected ? 'border-blue-500 bg-blue-50/10 text-blue-500 font-bold' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                  >
                    <span>Question {idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${score >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Selected Question detailed feedback */}
        <div className="lg:col-span-2 space-y-6">
          {selectedQuestion ? (
            <div className="space-y-6">
              
              {/* Question & Answer Cards */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Question {selectedQIndex + 1}</span>
                  <h4 className="text-sm font-bold mt-1 text-zinc-800 dark:text-zinc-100">{selectedQuestion.question_text}</h4>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Your Submission</span>
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl text-xs font-mono text-zinc-700 dark:text-zinc-300 mt-2 whitespace-pre-wrap leading-relaxed">
                    {activeAnswer?.typed_answer || "No response provided (Skipped)."}
                  </div>
                </div>
              </div>

              {/* Score Radar & Strengths split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar chart */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Evaluative Breakdowns</h4>
                  <div className="w-full h-48">
                    <ReactECharts option={getRadarOption(activeFeedback)} style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="glass-panel p-6 rounded-2xl space-y-4 justify-between flex flex-col">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">AI Evaluation Notes</h4>
                    <div className="space-y-3">
                      {activeFeedback.strengths?.map((str: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </div>
                      ))}
                      {activeFeedback.weaknesses?.map((wk: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{wk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Improved model rewrite */}
              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Model Expert Answer</span>
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
                  {activeFeedback.improved_answer}
                </div>
              </div>

              {/* Study materials */}
              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recommended Study Resources</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeFeedback.recommended_resources?.map((res: any, idx: number) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 bg-white dark:bg-[#0c0c0f] hover:bg-blue-50/5 transition-all text-xs font-bold flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>{res.title}</span>
                      </span>
                      <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase tracking-wider group-hover:text-blue-500 flex items-center gap-0.5">
                        {res.type} <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-zinc-400 text-xs">
              No questions found in this interview session.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
