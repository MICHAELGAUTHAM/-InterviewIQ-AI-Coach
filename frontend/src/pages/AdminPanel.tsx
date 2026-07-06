import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, FileSpreadsheet, Settings2, BarChart3, Trash2, Award, ShieldAlert, Loader2 } from 'lucide-react';
import { adminService } from '../services/api';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const analyticData = await adminService.getAnalytics();
      setAnalytics(analyticData);

      const usersData = await adminService.getUsers();
      setUsers(usersData);

      const reportsData = await adminService.getReports();
      setReports(reportsData);
    } catch (e) {
      console.error(e);
      setError("Unauthorized access or API offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    setDeletingId(id);
    setError(null);
    try {
      await adminService.deleteUser(id);
      // reload
      await fetchAdminData();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Entering Administrator Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-rose-500 flex items-center gap-2">
            <Settings2 className="w-8 h-8" /> Admin Management Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Review user accounts, compile mock drive metrics, and monitor platform reports.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 rounded-xl p-4 flex gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Registered</span>
            <h3 className="text-3xl font-extrabold mt-1">{analytics.total_users} Users</h3>
          </div>
          <div className="bg-blue-500/10 p-3.5 rounded-xl text-blue-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Sessions Spawned</span>
            <h3 className="text-3xl font-extrabold mt-1">{analytics.total_interviews} Practice</h3>
          </div>
          <div className="bg-purple-500/10 p-3.5 rounded-xl text-purple-500">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Mock Completions</span>
            <h3 className="text-3xl font-extrabold mt-1">{analytics.completed_interviews} Runs</h3>
          </div>
          <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-500">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">System Avg Score</span>
            <h3 className="text-3xl font-extrabold mt-1">{analytics.average_score}%</h3>
          </div>
          <div className="bg-amber-500/10 p-3.5 rounded-xl text-amber-500">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Management table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold">User Management</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Remove accounts or change administrative parameters.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/30">
                    <td className="p-4 font-bold">{u.full_name}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1">
                        {u.email}
                        {u.is_admin && <span className="bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">Admin</span>}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500">{u.created_at?.split(' ')[0]}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={deletingId === u.id || u.is_admin}
                        className="text-red-500 hover:underline cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Completion Reports table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold">System Placement Reports</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Review practice scores from placement runs.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold">
                  <th className="p-4">Seeker</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Score</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/30">
                    <td className="p-4 font-semibold">{r.email}</td>
                    <td className="p-4">{r.job_role}</td>
                    <td className="p-4 text-zinc-500">{r.interview_type}</td>
                    <td className="p-4 font-bold text-blue-500">{r.score}%</td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500">No mock reports available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
