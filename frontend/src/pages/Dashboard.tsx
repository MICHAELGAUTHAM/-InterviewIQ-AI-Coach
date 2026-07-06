import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Brain, Award, Flame, FileText, CheckCircle2, ChevronRight, Play, UploadCloud, Map, User, LogOut, Settings2, Bell, AlertTriangle } from 'lucide-react';
import { analyticsService, profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface DashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await analyticsService.getDashboardStats();
        setStats(statsData);
        
        const lbData = await analyticsService.getLeaderboard();
        setLeaderboard(lbData);
        
        const notifData = await profileService.getNotifications();
        setNotifications(notifData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReadNotification = async (id: number) => {
    try {
      await profileService.readNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // ECharts config
  const getChartOption = () => {
    if (!stats) return {};
    const days = stats.weekly_progress.map((d: any) => d.day);
    const values = stats.weekly_progress.map((d: any) => d.score);
    
    const isDark = theme === 'dark';
    
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: {
          color: isDark ? '#fafafa' : '#09090b',
          fontFamily: 'DM Sans, sans-serif'
        }
      },
      grid: {
        top: 20,
        bottom: 40,
        left: 40,
        right: 20,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: days,
        axisLine: {
          lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' }
        },
        axisLabel: {
          color: isDark ? '#a1a1aa' : '#71717a',
          fontFamily: 'DM Sans, sans-serif'
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        splitLine: {
          lineStyle: { color: isDark ? '#1e1e24' : '#f4f4f5' }
        },
        axisLabel: {
          color: isDark ? '#a1a1aa' : '#71717a',
          fontFamily: 'DM Sans, sans-serif'
        }
      },
      series: [
        {
          data: values,
          type: 'line',
          smooth: true,
          symbolSize: 8,
          itemStyle: {
            color: '#3b82f6'
          },
          lineStyle: {
            width: 3,
            color: '#3b82f6'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.01)' }
              ]
            }
          }
        }
      ]
    };
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Loading Dashboard Metrics...</span>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-6 bg-white dark:bg-[#0c0c0f] shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl text-white">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              InterviewIQ AI
            </span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"
            >
              <Award className="w-4 h-4" /> Dashboard
            </button>
            <button 
              onClick={() => onNavigate('resume-upload')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" /> Resume Scan
            </button>
            <button 
              onClick={() => onNavigate('interview-setup')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl transition-colors"
            >
              <Play className="w-4 h-4" /> Mock Arena
            </button>
            <button 
              onClick={() => onNavigate('learning-roadmap')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl transition-colors"
            >
              <Map className="w-4 h-4" /> Study Roadmap
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl transition-colors"
            >
              <User className="w-4 h-4" /> My Profile
            </button>
            {user?.is_admin && (
              <button 
                onClick={() => onNavigate('admin')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl transition-colors"
              >
                <Settings2 className="w-4 h-4" /> Admin Console
              </button>
            )}
          </nav>
        </div>

        <div className="space-y-4">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <span>Theme Mode</span>
            <span>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
          </button>
          
          <button 
            onClick={() => { logout(); onNavigate('landing'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome, Prepared Candidate!</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Let's refine your skills and boost your job placement opportunities.</p>
          </div>
          
          {/* Notification dropdown icon */}
          <div className="relative group">
            <button className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-blue-500 transition-colors relative">
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            
            {/* Notification Drawer */}
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-4 hidden group-hover:block z-40">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-3">Notifications</h4>
              {unreadNotifications.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2">No unread notifications.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {unreadNotifications.map(n => (
                    <div key={n.id} className="text-xs pb-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between gap-2">
                      <p className="text-zinc-600 dark:text-zinc-300">{n.message}</p>
                      <button 
                        onClick={() => handleReadNotification(n.id)}
                        className="text-[10px] text-blue-500 hover:underline shrink-0"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Interview Challenge Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
              🔥 Daily Challenge
            </div>
            <h2 className="text-xl font-bold">Solve a standard sliding window coding test today!</h2>
            <p className="text-sm text-white/80 mt-1 max-w-xl">Complete this challenge to earn 15 XP, maintain your streak, and unlock the 'Sliding Master' badge.</p>
          </div>
          <button 
            onClick={() => onNavigate('interview-setup')}
            className="bg-white hover:bg-zinc-100 text-blue-600 rounded-xl px-5 py-3 text-sm font-bold transition-all shadow-md hover:scale-[1.02]"
          >
            Start Challenge
          </button>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Interview Rating</span>
              <h3 className="text-3xl font-extrabold mt-1.5">{stats.overall_score}%</h3>
              <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 4.2% since last trial</p>
            </div>
            <div className="bg-blue-500/10 p-3.5 rounded-xl text-blue-500">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Practice Streak</span>
              <h3 className="text-3xl font-extrabold mt-1.5">{stats.streak} Days</h3>
              <p className="text-[10px] text-zinc-400 mt-1">Practice daily to build speed</p>
            </div>
            <div className="bg-orange-500/10 p-3.5 rounded-xl text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Resume ATS Score</span>
              <h3 className="text-3xl font-extrabold mt-1.5">{stats.resume_score}%</h3>
              <p className="text-[10px] text-emerald-500 font-bold mt-1">Scanned match OK</p>
            </div>
            <div className="bg-purple-500/10 p-3.5 rounded-xl text-purple-500">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Weekly Target</span>
              <h3 className="text-3xl font-extrabold mt-1.5">3 / 5</h3>
              <p className="text-[10px] text-zinc-400 mt-1">2 remaining mock drives</p>
            </div>
            <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Grid: Weekly Progress (Chart) & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ECharts Chart Card */}
          <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold mb-1">Weekly Interview Trend</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">Score trends across recent mock assessments.</p>
            </div>
            <div className="w-full h-72">
              {stats.overall_score === 0 && stats.weekly_progress.every((d: any) => d.score === 0) ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                  <AlertTriangle className="w-8 h-8 text-zinc-300 mb-2" />
                  <p className="text-xs font-semibold">No performance data yet</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Start your first Mock Interview to populate analytics.</p>
                </div>
              ) : (
                <ReactECharts option={getChartOption()} style={{ width: '100%', height: '100%' }} />
              )}
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold mb-4">Preparation Leaderboard</h3>
            <div className="space-y-4">
              {leaderboard.map((u, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${u.username.includes('(You)') ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-zinc-100/50 dark:bg-zinc-900/50'}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-xs text-zinc-400">#{u.rank}</span>
                    <div>
                      <h4 className="text-xs font-bold">{u.username}</h4>
                      <p className="text-[10px] text-zinc-500">{u.badge}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-blue-500">{u.score}%</span>
                    <p className="text-[9px] text-zinc-400">{u.streak}d streak</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals, Study Roadmaps, and History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Goals Card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold mb-4">Upcoming Practice Goals</h3>
            <div className="space-y-3">
              {stats.upcoming_goals.map((g: string, i: number) => (
                <div key={i} className="flex gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold mb-1">Quick Actions</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">Select a preparation task to execute now.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onNavigate('interview-setup')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-500 transition-colors text-center text-xs font-bold gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 text-blue-500" />
                Start AI Mock
              </button>
              <button 
                onClick={() => onNavigate('resume-upload')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-500 transition-colors text-center text-xs font-bold gap-2 cursor-pointer"
              >
                <UploadCloud className="w-5 h-5 text-purple-500" />
                ATS Scanner
              </button>
            </div>
          </div>
        </div>

        {/* Recent Mocks History */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold">Recent Practice Mocks</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">View evaluations and feedbacks of your history.</p>
            </div>
            <button 
              onClick={() => onNavigate('profile')} 
              className="text-xs text-blue-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              See all history <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {stats.recent_interviews.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-xs">
              No completed interviews. Configure and start an interview to begin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800">
                    <th className="p-4">Target Job Role</th>
                    <th className="p-4">Interview Type</th>
                    <th className="p-4">Overall Score</th>
                    <th className="p-4">Completed Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_interviews.map((item: any) => (
                    <tr key={item.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4 font-bold">{item.role}</td>
                      <td className="p-4">{item.type}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold ${item.score >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {item.score}%
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500">{item.date}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => onNavigate('feedback', { interview_id: item.id })}
                          className="text-blue-500 hover:underline font-semibold cursor-pointer"
                        >
                          View Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
