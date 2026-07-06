import React, { useState, useEffect } from 'react';
import { Mic, Square, ArrowRight, Loader2, Play, Volume2, SkipForward, Clock } from 'lucide-react';
import { interviewService } from '../services/api';

interface InterviewScreenProps {
  onNavigate: (page: string, params?: any) => void;
  sessionId: number;
  questionIndex: number;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({ onNavigate, sessionId, questionIndex }) => {
  const [interview, setInterview] = useState<any>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await interviewService.getDetails(sessionId);
        setInterview(data);
      } catch (e) {
        setError("Failed to fetch interview details.");
      } finally {
        setFetching(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // Timer interval
  useEffect(() => {
    if (fetching || !interview) return;
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [fetching, interview]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTypedAnswer("");
    } else {
      setIsRecording(false);
      // Simulate speech to text transcription
      setTypedAnswer("I design reliable APIs by partitioning layers and using Redis as a database cache to maintain sub-10ms response times. I balance system latency and scalability via connection pools.");
    }
  };

  const handleSubmit = async (isSkipping: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const currentQ = interview.questions[questionIndex];
      const answerVal = isSkipping ? "I don't know the answer to this question." : typedAnswer;
      
      await interviewService.submitAnswer({
        question_id: currentQ.id,
        typed_answer: answerVal,
        is_coding: false
      });
      
      const nextIdx = questionIndex + 1;
      if (nextIdx < interview.num_questions) {
        const nextQ = interview.questions[nextIdx];
        setTypedAnswer('');
        setTimer(0);
        
        if (nextQ.is_coding) {
          onNavigate('coding-interview', { session_id: sessionId, question_index: nextIdx });
        } else {
          onNavigate('interview-screen', { session_id: sessionId, question_index: nextIdx });
        }
      } else {
        // Complete - Route to feedback page
        onNavigate('feedback', { interview_id: sessionId });
      }
    } catch (e) {
      setError("Failed to submit answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !interview) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Entering AI Interview Chamber...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = interview.questions[questionIndex];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex flex-col justify-between p-8 max-w-[1000px] mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold uppercase">
            {interview.interview_type} Practice Round
          </span>
          <h2 className="text-sm font-bold text-zinc-500 mt-1">{interview.job_role}</h2>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-semibold bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl">
          <Clock className="w-4 h-4 text-blue-500 animate-pulse" /> {formatTime(timer)}
        </div>
      </div>

      {/* Main Avatar & Question Container */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Animated Avatar Column */}
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-3xl h-60 text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white relative shadow-lg shadow-blue-500/20">
            <Volume2 className="w-10 h-10 animate-bounce" />
            
            {/* Visualizer rings */}
            {isRecording && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping"></span>
                <span className="absolute inset-2 rounded-full border-2 border-purple-500/50 animate-ping delay-75"></span>
              </>
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold">Interview IQ Coach</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Active Listener</p>
          </div>
        </div>

        {/* Question Text Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span>Progress Indicator</span>
            <span>Question {questionIndex + 1} of {interview.num_questions}</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${((questionIndex + 1) / interview.num_questions) * 100}%` }}
            ></div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <p className="text-base font-bold leading-relaxed">{currentQuestion.question_text}</p>
          </div>
        </div>
      </div>

      {/* Answer Input Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Your Answer</span>
          <span className="text-xs text-zinc-500">{typedAnswer.split(/\s+/).filter(Boolean).length} words</span>
        </div>

        {isRecording ? (
          // Recording Audio Visualizer Panel
          <div className="border border-red-500/20 bg-red-500/5 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-end justify-center gap-1.5 h-10">
              <div className="w-1.5 bg-red-500 rounded-full bar-anim h-4"></div>
              <div className="w-1.5 bg-red-500 rounded-full bar-anim-fast h-6"></div>
              <div className="w-1.5 bg-red-500 rounded-full bar-anim-slow h-2"></div>
              <div className="w-1.5 bg-red-500 rounded-full bar-anim h-8"></div>
              <div className="w-1.5 bg-red-500 rounded-full bar-anim-fast h-5"></div>
              <div className="w-1.5 bg-red-500 rounded-full bar-anim-slow h-3"></div>
            </div>
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest animate-pulse">Capturing audio answer...</p>
          </div>
        ) : (
          <textarea
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder="Type your response here or click 'Record Answer' to capture audio transcription..."
            rows={5}
            className="w-full bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100 shadow-sm leading-relaxed"
          />
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 rounded-xl p-4 text-xs">
            {error}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex gap-4">
          <button
            onClick={handleToggleRecord}
            disabled={loading}
            className={`px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'}`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-blue-500" /> Record Answer
              </>
            )}
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={loading || isRecording}
            className="px-6 py-4 rounded-xl text-sm font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <SkipForward className="w-4 h-4" /> Skip Question
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={loading || isRecording || !typedAnswer.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-bold text-sm shadow-md transition-all flex-1 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Submit & Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
