import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Brain, Target, Shield, Terminal, Award, MessageSquare, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);

  const features = [
    { icon: <Brain className="w-6 h-6 text-blue-500" />, title: "AI-Powered Coding Arena", desc: "Write code in Python, C++, Java, or JS inside Monaco Editor and receive compile execution analysis." },
    { icon: <Target className="w-6 h-6 text-purple-500" />, title: "Resume ATS Review", desc: "Get instanct scoring matching your target role with keywords check and grammar review suggestions." },
    { icon: <MessageSquare className="w-6 h-6 text-indigo-500" />, title: "Voice & Speech Evaluation", desc: "Answer verbal questions. Simulate real communication and confidence scoring." },
    { icon: <Shield className="w-6 h-6 text-emerald-500" />, title: "Admin Portal", desc: "Institutions and placement cells can track mock drives, view global analytics, and manage users." }
  ];

  const pricing = [
    {
      name: "Free Coach",
      price: "0",
      desc: "Perfect for testing the platform and starting your prep journey.",
      features: [
        "2 AI Mock Interviews per month",
        "Basic Resume Parsing",
        "Standard Coding Editor access",
        "Standard Performance stats"
      ],
      cta: "Get Started Free",
      isPopular: false
    },
    {
      name: "Pro Coach",
      price: isAnnual ? "19" : "29",
      desc: "For serious job seekers looking to land major tech offers.",
      features: [
        "Unlimited AI Mock Interviews",
        "Deep ATS optimization audit",
        "Company-specific mock drives",
        "Unlimited Coding Arena compiling",
        "Dynamic study roadmaps",
        "Verified achievement badges"
      ],
      cta: "Go Pro Coach",
      isPopular: true
    }
  ];

  const faqs = [
    { q: "How does the AI evaluate my verbal answers?", a: "We transcribe your voice answer and analyze keywords match, grammar, confidence metrics, completeness, and relevance compared to typical expert solutions." },
    { q: "Can I simulate interviews for specific companies?", a: "Yes! Pro members can launch company-specific drives for companies like Google, Meta, and Amazon." },
    { q: "How accurate is the resume ATS score?", a: "Our ATS parser mimics industry standard screening algorithms to identify missing skills, format improvements, and key matches." }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50/80 dark:bg-[#09090b]/80 backdrop-blur-md z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl text-white">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              InterviewIQ AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-500 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="text-sm font-medium hover:text-blue-500 transition-colors text-zinc-600 dark:text-zinc-300"
            >
              Sign In
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Award className="w-3.5 h-3.5" /> Next Gen AI Placement Preparation
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
            Ace Your Next Interview with <br />
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Personalized AI Coaching
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume, practice coding and speech feedback, track compliance score targets, and step into mock drives custom-tailored by Artificial Intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-4 font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              Start Preparing Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-xl px-8 py-4 font-semibold shadow-sm transition-colors"
            >
              Explore Demo Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Complete AI Preparation Suite</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Everything you need to master your communication, technical skills, and algorithms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl flex gap-6 hover:translate-y-[-2px] transition-all">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm h-fit">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How InterviewIQ Works</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Master the hiring workflow in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hidden md:block z-0"></div>
            {[
              { num: "01", title: "Upload Resume", desc: "Our ATS engine parses your skills and compiles feedback matching target roles." },
              { num: "02", title: "Practice Mock Mocks", desc: "Engage in HR, System Design, or Coding arena rounds with real-time compilers." },
              { num: "03", title: "Receive AI Feedback", desc: "Get immediate score cards, study roadmaps, and optimal answer rewrites." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 bg-zinc-50 dark:bg-[#09090b] p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Choose the perfect plan to boost your placement results.</p>
            
            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-blue-500' : 'text-zinc-400'}`}>Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-12 h-6 bg-zinc-300 dark:bg-zinc-800 rounded-full p-1 transition-colors relative"
              >
                <div className={`w-4 h-4 bg-blue-600 rounded-full transition-transform ${isAnnual ? 'translate-x-6' : ''}`}></div>
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-blue-500' : 'text-zinc-400'}`}>Annual (Save 30%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {pricing.map((p, idx) => (
              <div key={idx} className={`glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between ${p.isPopular ? 'border-blue-500 dark:border-blue-500 shadow-md shadow-blue-500/5' : ''}`}>
                {p.isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">{p.desc}</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">${p.price}</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">/ month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {p.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => onNavigate('register')}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${p.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20' : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'}`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Find quick answers to common platform questions.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h3 className="text-base font-bold flex items-center gap-2 mb-2 text-zinc-800 dark:text-zinc-200">
                  <HelpCircle className="w-4 h-4 text-blue-500" /> {faq.q}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-[#09090b]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">InterviewIQ AI</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">© 2026 InterviewIQ AI. Built with DeepMind Gemini pairing. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <a href="#" className="hover:text-blue-500">Terms</a>
            <a href="#" className="hover:text-blue-500">Privacy</a>
            <a href="#" className="hover:text-blue-500">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
