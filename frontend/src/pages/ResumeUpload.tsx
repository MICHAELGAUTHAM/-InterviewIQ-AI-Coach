import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, FileText, AlertCircle, RefreshCw, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { resumeService, profileService } from '../services/api';

interface ResumeUploadProps {
  onNavigate: (page: string) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable card states
  const [skills, setSkills] = useState<string[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  // New entry helper inputs
  const [newSkill, setNewSkill] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      validateAndSetFile(dropped);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError("Only PDF and DOCX file types are supported.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await resumeService.upload(file);
      setParsedResume(data);
      
      // Load editable card arrays
      setSkills(data.skills || []);
      setEducation(data.education || []);
      setExperience(data.experience || []);
      setProjects(data.projects || []);
    } catch (e: any) {
      setError(e.response?.data?.detail || "Failed to scan and upload resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await profileService.update({
        education,
        skills,
        preferred_role: parsedResume?.preferred_role || "Software Engineer",
      });
      setSuccessMsg("Profile skills and credentials synchronized successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      setError("Failed to update profile values.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Resume ATS & Parser Scan</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Review resume compliance metrics and check matches for your target roles.</p>
        </div>
      </div>

      {!parsedResume ? (
        // UPLOADER VIEW
        <div className="max-w-[700px] mx-auto space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-500 rounded-3xl p-16 text-center bg-white dark:bg-[#0c0c0f] hover:bg-blue-50/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 relative overflow-hidden"
          >
            <div className="bg-blue-500/10 p-5 rounded-2xl text-blue-500">
              <UploadCloud className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Drag and drop your resume file</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Supports PDF or DOCX formats (Max 10MB)</p>
            </div>
            
            <input 
              type="file" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept=".pdf,.docx"
            />
            
            {file && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl text-xs font-bold">
                <FileText className="w-4 h-4" /> {file.name}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 rounded-xl p-4 flex gap-3 text-sm items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Scanning and Reviewing ATS Compliance...
              </>
            ) : (
              "Upload & Parse Resume"
            )}
          </button>
        </div>
      ) : (
        // PARSED DETAILS VIEW
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: ATS & Suggestions */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border-blue-500/20">
              <h3 className="text-base font-bold mb-4">ATS Scanning Scores</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">ATS Compliance</span>
                  <span className="text-3xl font-extrabold text-blue-500 block mt-1">{parsedResume.ats_score}%</span>
                </div>
                <div className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Grammar Score</span>
                  <span className="text-3xl font-extrabold text-purple-500 block mt-1">{parsedResume.grammar_score}%</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold">Keyword Optimization</h3>
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Matched Keywords ({parsedResume.keyword_match?.length})</span>
                <div className="flex flex-wrap gap-2">
                  {parsedResume.keyword_match?.map((kw: string, i: number) => (
                    <span key={i} className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Missing Skills ({parsedResume.missing_skills?.length})</span>
                <div className="flex flex-wrap gap-2">
                  {parsedResume.missing_skills?.map((kw: string, i: number) => (
                    <span key={i} className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-semibold">
                      ✗ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold">Formatting Suggestions</h3>
              <div className="space-y-3">
                {parsedResume.formatting_suggestions?.map((sg: string, i: number) => (
                  <div key={i} className="flex gap-2.5 text-xs text-zinc-500">
                    <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{sg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Editable Extracted Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skills Edit Card */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-base font-bold mb-4">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 pl-3 pr-2 py-1 rounded-full font-bold">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="text-zinc-400 hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill (e.g. AWS)"
                  className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100 flex-1 shadow-sm"
                />
                <button 
                  onClick={handleAddSkill}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>

            {/* Education Edit Cards */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold">Parsed Education</h3>
              {education.map((edu, idx) => (
                <div key={idx} className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl space-y-2 border border-zinc-200 dark:border-zinc-800">
                  <input 
                    type="text" 
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].degree = e.target.value;
                      setEducation(updated);
                    }}
                    className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].institution = e.target.value;
                        setEducation(updated);
                      }}
                      className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs"
                    />
                    <input 
                      type="text" 
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].year = e.target.value;
                        setEducation(updated);
                      }}
                      className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Edit Cards */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold">Parsed Experience</h3>
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl space-y-3 border border-zinc-200 dark:border-zinc-800">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].role = e.target.value;
                        setExperience(updated);
                      }}
                      className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].company = e.target.value;
                        setExperience(updated);
                      }}
                      className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <textarea 
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[idx].description = e.target.value;
                      setExperience(updated);
                    }}
                    rows={2}
                    className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Save Buttons & Notifications */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 rounded-xl p-4 flex gap-3 text-sm items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300 rounded-xl p-4 flex gap-3 text-sm items-start">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setParsedResume(null)}
                className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl px-6 py-4 font-bold text-sm transition-all"
              >
                Scan Another Resume
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-bold text-sm shadow-md transition-all flex-1"
              >
                {saving ? "Updating Profile..." : "Sync Credentials to Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
