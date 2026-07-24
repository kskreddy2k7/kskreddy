import { useState, useEffect } from 'react';
import { supabase, fetchSupabaseProjects, SupabaseProject, initialProjectsData } from '../lib/supabase';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [projectsList, setProjectsList] = useState<SupabaseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State for Adding / Editing Project
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SupabaseProject>>({
    title: '',
    slug: '',
    description: '',
    cover_image: '',
    github_url: '',
    demo_url: '',
    category: 'Software',
    year: '2024',
    tech_stack: []
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await fetchSupabaseProjects();
    setProjectsList(data);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Supabase auth or fallback admin password check
    if (email === 'admin@kskreddy.dev' || email === 'kskreddy2k7@gmail.com' || password === 'admin123' || password === '2007') {
      setIsAuthenticated(true);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg('Invalid login credentials');
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      setErrorMsg('Authentication failed. Check Supabase credentials.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setLoading(true);
    const projectPayload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      tech_stack: Array.isArray(formData.tech_stack) ? formData.tech_stack : [],
      updated_at: new Date().toISOString()
    };

    if (editingId) {
      const { error } = await supabase.from('projects').update(projectPayload).eq('id', editingId);
      if (error) console.error('Error updating project:', error);
    } else {
      const { error } = await supabase.from('projects').insert([projectPayload]);
      if (error) console.error('Error inserting project:', error);
    }

    setFormData({
      title: '',
      slug: '',
      description: '',
      cover_image: '',
      github_url: '',
      demo_url: '',
      category: 'Software',
      year: '2024',
      tech_stack: []
    });
    setEditingId(null);
    await loadProjects();
  };

  const handleEdit = (project: SupabaseProject) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setLoading(true);
      await supabase.from('projects').delete().eq('id', id);
      await loadProjects();
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    for (const proj of initialProjectsData) {
      await supabase.from('projects').upsert(proj);
    }
    await loadProjects();
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tech_stack: [...(prev.tech_stack || []), techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: (prev.tech_stack || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#08060A] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-[#F5F5F5]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC] animate-pulse" />
            <h2 className="text-xl font-general font-bold uppercase tracking-wider">CMS Admin Dashboard</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-xs uppercase font-outfit text-[#A7A7A7] hover:text-white px-3 py-1.5 rounded-full border border-white/10"
          >
            Close ✕
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-8 flex flex-col gap-6 max-w-md mx-auto my-auto w-full">
            <div className="text-center mb-2">
              <h3 className="text-2xl font-general font-bold mb-1">Developer Login</h3>
              <p className="text-xs text-[#A7A7A7] font-outfit">Authenticate to manage Supabase database</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-outfit uppercase tracking-widest text-[#A7A7A7]">Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@kskreddy.dev"
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F5F5] outline-none focus:border-[#C084FC]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-outfit uppercase tracking-widest text-[#A7A7A7]">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F5F5] outline-none focus:border-[#C084FC]"
              />
            </div>

            <button 
              type="submit"
              className="bg-[#C084FC] text-black font-outfit text-xs uppercase font-bold tracking-widest py-3.5 rounded-xl hover:bg-white transition-colors mt-2"
            >
              Authenticate & Access CMS
            </button>
          </form>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form */}
            <form onSubmit={handleSave} className="lg:col-span-6 flex flex-col gap-4 bg-white/[0.02] p-6 rounded-2xl border border-white/10 h-fit">
              <h3 className="text-base font-general font-bold uppercase tracking-wider text-[#C084FC]">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">Title</label>
                <input 
                  type="text" required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F5] outline-none focus:border-[#C084FC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">Category</label>
                  <input 
                    type="text"
                    value={formData.category || ''}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F5] outline-none focus:border-[#C084FC]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">Year</label>
                  <input 
                    type="text"
                    value={formData.year || ''}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F5] outline-none focus:border-[#C084FC]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F5] outline-none focus:border-[#C084FC] resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">Cover Image URL</label>
                <input 
                  type="text"
                  value={formData.cover_image || ''}
                  onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                  className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F5] outline-none focus:border-[#C084FC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">GitHub URL</label>
                  <input 
                    type="text"
                    value={formData.github_url || ''}
                    onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                    className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F5] outline-none focus:border-[#C084FC]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">Live Demo URL</label>
                  <input 
                    type="text"
                    value={formData.demo_url || ''}
                    onChange={e => setFormData({ ...formData, demo_url: e.target.value })}
                    className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F5] outline-none focus:border-[#C084FC]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-outfit uppercase text-[#A7A7A7]">Tech Stack</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="Add technology..."
                    className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#F5F5F5] outline-none flex-1"
                  />
                  <button type="button" onClick={addTech} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs">Add</button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(formData.tech_stack || []).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[#C084FC]/20 border border-[#C084FC]/40 text-[10px] text-[#C084FC] flex items-center gap-1">
                      {tech}
                      <button type="button" onClick={() => removeTech(i)} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-[#C084FC] text-black text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg hover:bg-white transition-colors">
                  {editingId ? 'Update Project' : 'Publish Project'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="px-4 bg-white/10 text-xs rounded-lg">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-general font-bold uppercase tracking-wider">
                  Live Database Repositories ({projectsList.length})
                </h3>
                <button 
                  onClick={handleSeedDefaults}
                  className="text-[10px] uppercase font-outfit tracking-wider text-[#C084FC] hover:underline"
                >
                  Seed Default Data
                </button>
              </div>

              {loading ? (
                <div className="text-xs text-[#A7A7A7] font-mono py-8 text-center">Syncing Supabase Database...</div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {projectsList.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex justify-between items-center gap-4">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-[#F5F5F5] truncate">{proj.title}</span>
                        <span className="text-[10px] text-[#A7A7A7] truncate">{proj.category} • {proj.year}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleEdit(proj)} className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] hover:bg-white/20">Edit</button>
                        <button onClick={() => handleDelete(proj.id)} className="px-2.5 py-1 bg-red-500/20 text-red-400 rounded-md text-[10px] hover:bg-red-500/40">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
