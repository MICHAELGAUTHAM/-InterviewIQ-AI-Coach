import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Brain, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPagesProps {
  onNavigate: (page: string) => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ onNavigate, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, register, googleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Form validations
    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (mode !== 'forgot' && !password) {
      setError("Password is required.");
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        await login(formData);
        onNavigate('dashboard');
      } else if (mode === 'register') {
        await register(email, password);
        onNavigate('dashboard');
      } else {
        // Forgot Password
        await new Promise((res) => setTimeout(res, 1200)); // Simulate API
        setMessage("Password reset instructions have been dispatched to your email.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const simulatedToken = "google-oauth-sim-token-" + Math.random().toString(36).substring(7);
      await googleLogin(simulatedToken, email || "micha.dev@gmail.com");
      onNavigate('dashboard');
    } catch (err: any) {
      setError("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center px-6 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              InterviewIQ AI
            </span>
          </div>
          <h2 className="text-xl font-semibold mt-4 text-zinc-800 dark:text-zinc-200">
            {mode === 'login' && "Sign in to your coaching space"}
            {mode === 'register' && "Create your preparation profile"}
            {mode === 'forgot' && "Recover your password credentials"}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            {mode === 'login' && "Access your personalized mock roadmaps"}
            {mode === 'register' && "Join other seekers leveling up their skills"}
            {mode === 'forgot' && "Supply your registered email address"}
          </p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel p-8 rounded-3xl shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 rounded-xl p-4 flex gap-3 text-sm mb-6 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300 rounded-xl p-4 flex gap-3 text-sm mb-6 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-zinc-950 dark:text-zinc-100 transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-zinc-950 dark:text-zinc-100 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-zinc-950 dark:text-zinc-100 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold text-sm shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && "Sign In"}
                  {mode === 'register' && "Create Account"}
                  {mode === 'forgot' && "Send Reset Link"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social login line divider */}
          <div className="relative my-6 text-center">
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white dark:bg-[#0c0c0f] text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-xl py-3 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#ea4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.93 1 12 1 7.35 1 3.39 3.65 1.41 7.55l3.77 2.92c.88-2.65 3.38-4.43 6.82-4.43z"
              />
              <path
                fill="#4285f4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.44c-.28 1.47-1.11 2.71-2.35 3.55l3.66 2.84c2.14-1.97 3.74-4.88 3.74-8.49z"
              />
              <path
                fill="#fbbc05"
                d="M5.18 10.47c-.22-.65-.35-1.35-.35-2.07s.13-1.42.35-2.07L1.41 3.41C.51 5.22 0 7.24 0 9.4c0 2.16.51 4.18 1.41 5.99l3.77-2.92z"
              />
              <path
                fill="#34a853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.76 1.08-3.44 0-5.94-1.78-6.82-4.43L1.41 16.81C3.39 20.71 7.35 23 12 23z"
              />
            </svg>
            Google Sign-In
          </button>
        </div>

        {/* Foot Links */}
        <div className="text-center mt-6 text-sm text-zinc-500">
          {mode === 'login' ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode('register')}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </>
          ) : mode === 'register' ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode('login')}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
