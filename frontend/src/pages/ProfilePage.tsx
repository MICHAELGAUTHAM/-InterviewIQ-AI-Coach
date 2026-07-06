import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Shield, Award, Edit3, Trash2, Save, Plus, Search, Filter, Calendar } from 'lucide-react';
import { profileService, interviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  
  // Profile form states
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  // Lists
  const [history, setHistory] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profData = await profileService.get();
        setProfile(profData);
        setFullName(profData.full_name);
        setRole(profData.preferred_role);
        setCompany(profData.target_company);
        setSkills(profData.skills || []);

        const histData = await interviewService.getHistory();
        setHistory(histData);

        const certsData = await profileService.getCertificates();
        setCerts(certsData);
      } catch (e) {
        console.error(e);
        setError("Failed to load user profile information.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (sk: string) => {
    setSkills(skills.filter(s => s !== sk));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await profileService.update({
        full_name: fullName,
        preferred_role: role,
        target_company: company,
        skills
      });
      setProfile(updated);
      setSuccess("Profile settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  // Filter history
  const filteredHistory = history.filter(item => {
    const interviewRole = item.interview?.job_role || '';
    const matchesSearch = interviewRole.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = typeFilter === 'All' || item.interview?.interview_type === typeFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Retrieving Profile Settings...</span>
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
          <h1 className="text-3xl font-extrabold tracking-tight">My Profile & Workspace</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage target roles, credentials, and review past practice sheets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Form Details */}
        <div className="glass-panel p-8 rounded-3xl space-y-6 self-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold">{fullName}</h3>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </span>
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Preferred Job Role</label>
              <input 
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1.5">Target Company</label>
              <input 
                type="text" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-500 block">Skills Catalog</label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pb-2">
              {skills.map(sk => (
                <span key={sk} className="inline-flex items-center gap-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-full font-bold">
                  {sk}
                  <button onClick={() => handleRemoveSkill(sk)} className="text-zinc-400 hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="New skill"
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs flex-1 outline-none text-zinc-950 dark:text-zinc-100"
              />
              <button 
                onClick={handleAddSkill}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg px-3 py-1.5 text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {error && <div className="text-xs text-red-500">{error}</div>}
          {success && <div className="text-xs text-emerald-500">{success}</div>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Profile Details"}
          </button>
        </div>

        {/* Right Side: Badges & History List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Badges / Certificates Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" /> Unlocked Badges
            </h3>

            {certs.length === 0 ? (
              <p className="text-xs text-zinc-500">Complete mock interviews scoring over 80% to earn certificates & achievement badges.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {certs.map(c => (
                  <div key={c.id} className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center space-y-2 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-sm shadow">
                      IQ
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold leading-tight">{c.badge_name}</h4>
                      <span className="text-[8px] text-zinc-500 block mt-0.5">{c.issue_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past History with Search & Filter */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
              <div>
                <h3 className="text-base font-bold">Mock Practice History</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Explore feedback pages and metrics of past runs.</p>
              </div>

              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by job role..."
                    className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none text-zinc-950 dark:text-zinc-100 shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-400" />
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Coding">Coding</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs">
                No matching practice sessions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800">
                      <th className="p-4">Job Role</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Completed Date</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map(item => (
                      <tr key={item.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="p-4 font-bold">{item.interview?.job_role || 'N/A'}</td>
                        <td className="p-4">{item.interview?.interview_type || 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-extrabold ${item.score >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {item.score}%
                          </span>
                        </td>
                        <td className="p-4 text-zinc-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {new Date(item.completed_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => onNavigate('feedback', { interview_id: item.interview_id })}
                            className="text-blue-500 hover:underline font-bold cursor-pointer"
                          >
                            Review Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
