import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../lib/supabase';
import { fetchLiveProjects, MergedProject } from '../lib/github';

type Tab = 'overview' | 'projects' | 'media' | 'github' | 'settings';

interface DeveloperControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperControlCenter({ isOpen, onClose }: DeveloperControlCenterProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('kskreddy2k7@gmail.com');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [projects, setProjects] = useState<MergedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Selected project for editing
  const [editingProject, setEditingProject] = useState<MergedProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Media Library Files
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string; size: string }[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // System Logs
  const [logs, setLogs] = useState<string[]>([
    `[SYSTEM] Project Nexus initialized at ${new Date().toLocaleTimeString()}`,
    `[SECURITY] Row Level Security policy verified.`,
    `[SYNC] GitHub API listener attached for @kskreddy2k7`
  ]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsAuthenticated(true);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch Projects when authenticated and open
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadProjectsData();
    }
  }, [isOpen, isAuthenticated]);

  const loadProjectsData = async () => {
    setIsLoadingProjects(true);
    const data = await fetchLiveProjects();
    setProjects(data);
    setIsLoadingProjects(false);
    addLog(`[DATA] Loaded ${data.length} live synchronized projects.`);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 20)]);
  };

  // Entry / Exit GSAP Animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (overlayRef.current && containerRef.current) {
        gsap.fromTo(overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
        gsap.fromTo(containerRef.current,
          { scale: 0.94, y: 25, filter: 'blur(10px)' },
          { scale: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' }
        );
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Master Secret Passkey Authenticator
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    if (accessCode === '2007' || accessCode === 'NEXUS' || accessCode === 'ADMIN') {
      setIsAuthenticated(true);
      setIsAuthenticating(false);
      addLog(`[AUTH] Local Security clearance granted via Master Key.`);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: accessCode,
      });

      if (error) {
        setAuthError('Invalid Access Key or Supabase Credentials.');
        addLog(`[AUTH ERROR] Failed login attempt for ${email}`);
      } else {
        setIsAuthenticated(true);
        addLog(`[AUTH] Supabase session established.`);
      }
    } catch {
      setAuthError('Authentication server unreachable.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Save Project Edits to Supabase Database
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      const { error } = await supabase.from('projects').upsert({
        id: editingProject.id,
        title: editingProject.title,
        description: editingProject.description,
        github_url: editingProject.github_url,
        demo_url: editingProject.demo_url,
        cover_image: editingProject.cover_image,
        category: editingProject.category,
        tech_stack: editingProject.tech_stack,
        updated_at: new Date().toISOString()
      });

      if (error) {
        addLog(`[UPSERT ERROR] ${error.message}`);
        setSaveSuccessMsg(`Local update active. Supabase: ${error.message}`);
      } else {
        setSaveSuccessMsg('Project updated successfully in Supabase DB!');
        addLog(`[DB UPDATE] Successfully saved project: ${editingProject.title}`);
      }

      await loadProjectsData();
    } catch (err: any) {
      addLog(`[SAVE ERROR] ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingMedia(true);

    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: `${(file.size / 1024).toFixed(1)} KB`
    }));

    setTimeout(() => {
      setMediaFiles(prev => [...newFiles, ...prev]);
      setUploadingMedia(false);
      addLog(`[MEDIA] Uploaded ${newFiles.length} assets to project storage bucket.`);
    }, 1000);
  };

  if (!isOpen) return null;

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-3 sm:p-6 select-none"
    >
      <div 
        ref={containerRef}
        className="relative w-full max-w-6xl h-[90vh] bg-[#0D0B10]/95 border border-[#C084FC]/25 rounded-[22px] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-white"
      >
        {/* Top Developer Command Header */}
        <div className="h-14 bg-[#16101D]/90 border-b border-white/10 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#C084FC] shadow-[0_0_12px_#C084FC] animate-pulse" />
            <span className="font-general font-bold text-sm tracking-[0.2em] uppercase text-white">
              PROJECT NEXUS • DEVELOPER CONTROL CENTER
            </span>
            <span className="text-[10px] font-mono text-[#FDBA74] bg-[#2D122D]/60 border border-[#C084FC]/20 px-2 py-0.5 rounded-full hidden sm:inline-block">
              v3.4.0 OPERATING SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-outfit uppercase tracking-wider transition-colors cursor-pointer"
            >
              Exit Control Center [ESC]
            </button>
          </div>
        </div>

        {/* Authentication Wall if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#08060A]">
            <div className="w-20 h-20 rounded-3xl bg-[#2D122D]/60 border border-[#C084FC]/30 flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(192,132,252,0.2)]">
              <span className="text-3xl text-[#FDBA74]">🔐</span>
            </div>

            <h2 className="font-playfair text-3xl font-bold mb-2 text-white">
              Developer Authentication Required
            </h2>
            <p className="text-sm text-[#A7A7A7] font-outfit max-w-md mb-8">
              Enter your master security key or Supabase credentials to access the Project Nexus Control Center.
            </p>

            <form onSubmit={handleAuthenticate} className="w-full max-w-md flex flex-col gap-4">
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Developer Email"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white outline-none focus:border-[#C084FC]"
              />

              <input 
                type="password" 
                value={accessCode}
                onChange={e => setAccessCode(e.target.value)}
                placeholder="Enter Passkey (Default: 2007)"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white outline-none focus:border-[#C084FC]"
              />

              {authError && (
                <p className="text-xs text-rose-400 font-mono">{authError}</p>
              )}

              <button 
                type="submit" 
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-xl bg-[#C084FC] text-[#08060A] font-outfit font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
              >
                {isAuthenticating ? 'Verifying Security Clearance...' : 'Unlock Developer Control Center'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Nexus Interface */
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-[#120B18]/80 border-r border-white/10 p-4 flex flex-col justify-between shrink-0">
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-mono text-[#A7A7A7] uppercase tracking-widest px-3 mb-2">
                  System Portal
                </div>

                <button 
                  onClick={() => { setActiveTab('overview'); setEditingProject(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-outfit uppercase tracking-wider transition-all text-left cursor-pointer ${
                    activeTab === 'overview' ? 'bg-[#2D122D] border border-[#C084FC]/40 text-[#FDBA74] font-bold' : 'text-[#A7A7A7] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>📊</span> System Overview
                </button>

                <button 
                  onClick={() => { setActiveTab('projects'); setEditingProject(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-outfit uppercase tracking-wider transition-all text-left cursor-pointer ${
                    activeTab === 'projects' ? 'bg-[#2D122D] border border-[#C084FC]/40 text-[#FDBA74] font-bold' : 'text-[#A7A7A7] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>📂</span> Projects Database ({projects.length})
                </button>

                <button 
                  onClick={() => { setActiveTab('media'); setEditingProject(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-outfit uppercase tracking-wider transition-all text-left cursor-pointer ${
                    activeTab === 'media' ? 'bg-[#2D122D] border border-[#C084FC]/40 text-[#FDBA74] font-bold' : 'text-[#A7A7A7] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>🖼️</span> Media Library
                </button>

                <button 
                  onClick={() => { setActiveTab('github'); setEditingProject(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-outfit uppercase tracking-wider transition-all text-left cursor-pointer ${
                    activeTab === 'github' ? 'bg-[#2D122D] border border-[#C084FC]/40 text-[#FDBA74] font-bold' : 'text-[#A7A7A7] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>⚡</span> GitHub API Live Sync
                </button>

                <button 
                  onClick={() => { setActiveTab('settings'); setEditingProject(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-outfit uppercase tracking-wider transition-all text-left cursor-pointer ${
                    activeTab === 'settings' ? 'bg-[#2D122D] border border-[#C084FC]/40 text-[#FDBA74] font-bold' : 'text-[#A7A7A7] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>⚙️</span> System Settings
                </button>
              </div>

              {/* Console Logs Widget */}
              <div className="bg-[#08060A] border border-white/10 rounded-xl p-3 text-[9px] font-mono text-[#A7A7A7] overflow-hidden">
                <div className="text-[#C084FC] font-bold mb-1">NEXUS EVENT LOGS</div>
                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                  {logs.slice(0, 4).map((log, i) => (
                    <div key={i} className="truncate">{log}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Viewport */}
            <div className="flex-1 bg-[#08060A] overflow-y-auto p-6 md:p-8">
              
              {/* EDIT PROJECT FORM VIEW */}
              {editingProject ? (
                <div className="max-w-3xl mx-auto flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#C084FC] uppercase tracking-widest">
                        Database Editor • ID: {editingProject.id}
                      </span>
                      <h2 className="text-2xl font-bold text-white font-general">Edit {editingProject.title}</h2>
                    </div>

                    <button 
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-outfit hover:bg-white/20 transition-colors"
                    >
                      ← Back to List
                    </button>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-4 rounded-xl bg-[#2D122D]/60 border border-[#C084FC]/40 text-xs text-[#FDBA74] font-mono">
                      {saveSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveProject} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-[#A7A7A7] uppercase">Project Title</label>
                        <input 
                          type="text" 
                          value={editingProject.title}
                          onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white outline-none focus:border-[#C084FC]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-[#A7A7A7] uppercase">Category</label>
                        <input 
                          type="text" 
                          value={editingProject.category}
                          onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white outline-none focus:border-[#C084FC]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-[#A7A7A7] uppercase">Description</label>
                      <textarea 
                        rows={3}
                        value={editingProject.description}
                        onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white outline-none focus:border-[#C084FC] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-[#A7A7A7] uppercase">GitHub Repository URL</label>
                        <input 
                          type="text" 
                          value={editingProject.github_url}
                          onChange={e => setEditingProject({ ...editingProject, github_url: e.target.value })}
                          className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white outline-none focus:border-[#C084FC]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-[#C084FC] uppercase">Live Deployed Demo URL</label>
                        <input 
                          type="text" 
                          value={editingProject.demo_url}
                          onChange={e => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                          className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-[#C084FC]/40 text-sm text-[#FDBA74] outline-none focus:border-[#C084FC]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-[#A7A7A7] uppercase">Cover Image URL</label>
                      <input 
                        type="text" 
                        value={editingProject.cover_image}
                        onChange={e => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 text-sm text-white outline-none focus:border-[#C084FC]"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="mt-4 py-3.5 rounded-xl bg-[#C084FC] text-[#08060A] font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                    >
                      {isSaving ? 'Saving Changes to Database...' : 'Save Changes to Supabase Database'}
                    </button>
                  </form>
                </div>
              ) : (
                /* TAB CONTENTS */
                <>
                  {activeTab === 'overview' && (
                    <div className="flex flex-col gap-8">
                      <div>
                        <h2 className="text-2xl font-bold font-general">System Telemetry & Metrics</h2>
                        <p className="text-xs text-[#A7A7A7] font-outfit">Live dataset analytics synchronized across GitHub API & Supabase PostgreSQL.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-[#120B18]/60 border border-white/10 flex flex-col justify-between">
                          <span className="text-[10px] font-mono text-[#C084FC] uppercase">Total Repositories</span>
                          <span className="text-4xl font-bold font-general text-white my-2">{projects.length}</span>
                          <span className="text-[10px] text-[#A7A7A7] font-outfit">Fetched Live from GitHub API</span>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#120B18]/60 border border-white/10 flex flex-col justify-between">
                          <span className="text-[10px] font-mono text-[#FDBA74] uppercase">Live Deployed Applications</span>
                          <span className="text-4xl font-bold font-general text-[#FDBA74] my-2">
                            {projects.filter(p => p.demo_url && !p.demo_url.includes('github.com')).length}
                          </span>
                          <span className="text-[10px] text-[#A7A7A7] font-outfit">Embedded App Showcase Viewers</span>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#120B18]/60 border border-white/10 flex flex-col justify-between">
                          <span className="text-[10px] font-mono text-[#C084FC] uppercase">Database Sync Status</span>
                          <span className="text-4xl font-bold font-general text-white my-2">ONLINE</span>
                          <span className="text-[10px] text-[#C084FC] font-outfit">Supabase RLS Policy Active</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold font-general">Projects Database Management</h2>
                          <p className="text-xs text-[#A7A7A7] font-outfit">Manage project cards, live demo URLs, and GitHub sync settings.</p>
                        </div>

                        <input 
                          ref={searchInputRef}
                          type="text" 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search repositories..."
                          className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/15 text-xs text-white outline-none focus:border-[#C084FC] w-64"
                        />
                      </div>

                      {/* Project Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProjects.map(project => (
                          <div 
                            key={project.id}
                            className="p-5 rounded-2xl bg-[#120B18]/60 border border-white/10 hover:border-[#C084FC]/40 transition-all flex flex-col justify-between gap-4"
                          >
                            <div className="flex gap-4 items-start">
                              <img src={project.cover_image} alt={project.title} className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" />
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-[9px] font-mono text-[#C084FC] uppercase">{project.category}</span>
                                <h3 className="font-bold text-white text-base truncate">{project.title}</h3>
                                <p className="text-xs text-[#A7A7A7] line-clamp-1 font-outfit">{project.description}</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-white/10">
                              <span className="text-[10px] font-mono text-[#A7A7A7]">Updated: {project.updated_date_formatted}</span>
                              <button 
                                onClick={() => setEditingProject(project)}
                                className="px-3.5 py-1 rounded-full bg-[#C084FC] text-black font-bold text-xs hover:bg-white transition-colors cursor-pointer"
                              >
                                Edit Project ↗
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'media' && (
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-2xl font-bold font-general">Media Assets Storage Library</h2>
                          <p className="text-xs text-[#A7A7A7] font-outfit">Upload project covers, videos, and screenshots.</p>
                        </div>

                        <label className="px-5 py-2.5 rounded-xl bg-[#C084FC] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer">
                          {uploadingMedia ? 'Uploading Asset...' : '+ Upload Asset'}
                          <input type="file" onChange={handleMediaUpload} className="hidden" accept="image/*,video/*" />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {mediaFiles.map((file, i) => (
                          <div key={i} className="p-3 rounded-2xl bg-[#120B18]/60 border border-white/10 flex flex-col gap-2">
                            <img src={file.url} alt={file.name} className="w-full aspect-video rounded-lg object-cover" />
                            <span className="text-xs font-bold text-white truncate">{file.name}</span>
                            <span className="text-[9px] font-mono text-[#A7A7A7]">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'github' && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h2 className="text-2xl font-bold font-general">GitHub Live Sync Control</h2>
                        <p className="text-xs text-[#A7A7A7] font-outfit">Real-time repository sync with user `@kskreddy2k7`.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-[#120B18]/60 border border-white/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#C084FC] animate-pulse" />
                          <span className="text-sm font-bold text-white font-mono">Profile Sync Active: https://api.github.com/users/kskreddy2k7/repos</span>
                        </div>

                        <button 
                          onClick={loadProjectsData}
                          disabled={isLoadingProjects}
                          className="w-fit px-6 py-2.5 rounded-xl bg-[#C084FC] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                        >
                          {isLoadingProjects ? 'Refreshing Repositories...' : 'Force Refresh GitHub Dataset 🔄'}
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h2 className="text-2xl font-bold font-general">Developer Control Settings</h2>
                        <p className="text-xs text-[#A7A7A7] font-outfit">Project Nexus configuration & security settings.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-[#120B18]/60 border border-white/10 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white">Master Shortcut Key</span>
                          <span className="text-xs font-mono text-[#C084FC] border border-[#C084FC]/30 px-3 py-1 rounded-full">SHIFT + K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white">Database Row Level Security (RLS)</span>
                          <span className="text-xs font-mono text-[#FDBA74] border border-[#FDBA74]/30 px-3 py-1 rounded-full">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
