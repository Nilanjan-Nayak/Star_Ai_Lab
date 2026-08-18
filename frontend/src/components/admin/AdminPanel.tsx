import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FileText, Video, Settings, LogOut, FolderOpen,
  Save, RefreshCw, ChevronRight, Edit3, Trash2, Loader2, Camera, ShieldCheck,
  Plus, X, Star, Upload, Globe, Github as GithubIcon, Tag, Image as ImageIcon
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AdminPanelProps {
  token: string;
  user: any;
  onLogout: () => void;
}

interface ContentItem {
  key: string;
  value: any;
  label: string;
  fieldType: string;
  updatedAt?: string;
}

interface ProjectFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  status: string;
  technologies: string;
  tags: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  image: File | null;
}

const EMPTY_PROJECT_FORM: ProjectFormData = {
  title: '',
  shortDescription: '',
  description: '',
  category: 'AI/ML',
  status: 'In Progress',
  technologies: '',
  tags: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
  image: null,
};

const CATEGORIES = ['AI/ML', 'Web Development', 'Mobile App', 'Data Science', 'IoT', 'Blockchain', 'storage', 'Other'];
const STATUSES = ['In Progress', 'Completed', 'On Hold', 'Planning'];

type Tab = 'overview' | 'content' | 'projects' | 'videos' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = ({ token, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [contentSchema, setContentSchema] = useState<Record<string, ContentItem[]>>({});
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  // Project editor state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormData>(EMPTY_PROJECT_FORM);
  const [projectSaving, setProjectSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch content schema
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content/admin/schema`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContentSchema(data.schema || {});
      }
    } catch (err) {
      console.error('Failed to fetch content schema:', err);
    }
  }, [token]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchContent(), fetchProjects()]);
      setLoading(false);
    };
    load();
  }, [fetchContent, fetchProjects]);

  // Save content changes
  const saveContent = async (section: string, key: string, value: any) => {
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/content/${section}/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });

      if (res.ok) {
        setSaveMessage(`✅ Saved ${section}.${key}`);
        await fetchContent();
      } else {
        const data = await res.json();
        setSaveMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setSaveMessage('❌ Connection error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Delete project
  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchProjects();
        setSaveMessage('✅ Project deleted');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Open the form for adding a new project
  const openAddProject = () => {
    setEditingProjectId(null);
    setProjectForm(EMPTY_PROJECT_FORM);
    setImagePreview(null);
    setShowProjectForm(true);
  };

  // Open the form for editing an existing project
  const openEditProject = (project: any) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      description: project.description || '',
      category: project.category || 'AI/ML',
      status: project.status || 'In Progress',
      technologies: (project.technologies || []).join(', '),
      tags: (project.tags || []).join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured || false,
      image: null,
    });
    setImagePreview(project.imageUrl ? `${API_BASE}${project.imageUrl}` : null);
    setShowProjectForm(true);
  };

  // Close form
  const closeProjectForm = () => {
    setShowProjectForm(false);
    setEditingProjectId(null);
    setProjectForm(EMPTY_PROJECT_FORM);
    setImagePreview(null);
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Save project (create or update)
  const saveProject = async () => {
    if (!projectForm.title.trim() || !projectForm.description.trim() || !projectForm.shortDescription.trim()) {
      setSaveMessage('❌ Title, description, and short description are required');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setProjectSaving(true);
    setSaveMessage('');
    try {
      const formData = new FormData();
      formData.append('title', projectForm.title);
      formData.append('shortDescription', projectForm.shortDescription);
      formData.append('description', projectForm.description);
      formData.append('category', projectForm.category);
      formData.append('status', projectForm.status);
      formData.append('technologies', JSON.stringify(
        projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
      ));
      formData.append('tags', JSON.stringify(
        projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      ));
      formData.append('githubUrl', projectForm.githubUrl);
      formData.append('liveUrl', projectForm.liveUrl);
      formData.append('featured', String(projectForm.featured));
      if (projectForm.image) {
        formData.append('image', projectForm.image);
      }

      const url = editingProjectId
        ? `${API_BASE}/api/projects/${editingProjectId}`
        : `${API_BASE}/api/projects`;
      const method = editingProjectId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setSaveMessage(editingProjectId ? '✅ Project updated' : '✅ Project created');
        closeProjectForm();
        await fetchProjects();
      } else {
        const data = await res.json();
        const errorMsg = data.errors
          ? data.errors.map((e: any) => e.msg).join(', ')
          : data.message || 'Unknown error';
        setSaveMessage(`❌ ${errorMsg}`);
      }
    } catch (err) {
      setSaveMessage('❌ Connection error');
    } finally {
      setProjectSaving(false);
      setTimeout(() => setSaveMessage(''), 4000);
    }
  };

  const handleEditChange = (editKey: string, value: any) => {
    setEditValues(prev => ({ ...prev, [editKey]: value }));
  };

  // Render content field editor
  const renderFieldEditor = (section: string, item: ContentItem) => {
    const editKey = `${section}.${item.key}`;
    const currentValue = editValues[editKey] !== undefined ? editValues[editKey] : item.value;
    const isModified = editValues[editKey] !== undefined && JSON.stringify(editValues[editKey]) !== JSON.stringify(item.value);

    if (item.fieldType === 'textarea' || item.fieldType === 'richtext') {
      return (
        <div className="space-y-2">
          <label className="text-sm text-white/60 font-medium">{item.label || item.key}</label>
          <textarea
            value={typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue, null, 2)}
            onChange={e => handleEditChange(editKey, e.target.value)}
            className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm resize-none focus:border-cyan-400/50 focus:outline-none transition-all"
          />
          {isModified && (
            <button
              onClick={() => saveContent(section, item.key, editValues[editKey])}
              disabled={saving}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 text-xs rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center gap-2"
            >
              <Save className="w-3 h-3" />
              Save Changes
            </button>
          )}
        </div>
      );
    }

    if (item.fieldType === 'array' || item.fieldType === 'object' || typeof item.value === 'object') {
      return (
        <div className="space-y-2">
          <label className="text-sm text-white/60 font-medium">{item.label || item.key}</label>
          <textarea
            value={typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue, null, 2)}
            onChange={e => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleEditChange(editKey, parsed);
              } catch {
                handleEditChange(editKey, e.target.value);
              }
            }}
            className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-xs font-mono resize-none focus:border-cyan-400/50 focus:outline-none transition-all"
          />
          {isModified && (
            <button
              onClick={() => saveContent(section, item.key, editValues[editKey])}
              disabled={saving}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 text-xs rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center gap-2"
            >
              <Save className="w-3 h-3" />
              Save Changes
            </button>
          )}
        </div>
      );
    }

    // Default: text/email/url/number
    return (
      <div className="space-y-2">
        <label className="text-sm text-white/60 font-medium">{item.label || item.key}</label>
        <div className="flex gap-2">
          <input
            type={item.fieldType === 'email' ? 'email' : item.fieldType === 'url' ? 'url' : 'text'}
            value={typeof currentValue === 'string' ? currentValue : String(currentValue)}
            onChange={e => handleEditChange(editKey, e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm focus:border-cyan-400/50 focus:outline-none transition-all"
          />
          {isModified && (
            <button
              onClick={() => saveContent(section, item.key, editValues[editKey])}
              disabled={saving}
              className="px-4 py-3 bg-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const sectionLabels: Record<string, string> = {
    hero: '🏠 Hero Section',
    about: '📋 About Section',
    demo: '🎬 Demo Section',
    videos: '📹 Videos',
    demoCards: '🃏 Demo Cards',
    contact: '📧 Contact',
    footer: '🦶 Footer',
    general: '⚙️ General',
    navigation: '🧭 Navigation'
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-5 h-5" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Admin Panel</h2>
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Star AI Lab</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500/15 text-cyan-300 border border-blue-500/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm font-medium truncate">{user?.username || 'Admin'}</p>
              <p className="text-white/30 text-[10px] truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <span className={`text-sm font-medium ${saveMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                {saveMessage}
              </span>
            )}
            <button
              onClick={() => { fetchContent(); fetchProjects(); }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Projects', value: projects.length, icon: <FolderOpen className="w-5 h-5" />, color: 'from-blue-500/20 to-blue-600/10' },
                  { label: 'Content Sections', value: Object.keys(contentSchema).length, icon: <FileText className="w-5 h-5" />, color: 'from-cyan-500/20 to-cyan-600/10' },
                  { label: 'Content Fields', value: Object.values(contentSchema).flat().length, icon: <Edit3 className="w-5 h-5" />, color: 'from-purple-500/20 to-purple-600/10' },
                  { label: 'Auth Status', value: 'Active', icon: <ShieldCheck className="w-5 h-5" />, color: 'from-green-500/20 to-green-600/10' }
                ].map(stat => (
                  <div key={stat.label} className={`bg-gradient-to-br ${stat.color} border border-white/5 rounded-2xl p-6`}>
                    <div className="flex items-center gap-3 mb-3 text-white/40">{stat.icon}<span className="text-xs uppercase tracking-wider">{stat.label}</span></div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Edit Content', tab: 'content' as Tab, icon: <Edit3 className="w-4 h-4" /> },
                    { label: 'Manage Projects', tab: 'projects' as Tab, icon: <FolderOpen className="w-4 h-4" /> },
                    { label: 'Manage Videos', tab: 'videos' as Tab, icon: <Video className="w-4 h-4" /> },
                    { label: 'Settings', tab: 'settings' as Tab, icon: <Settings className="w-4 h-4" /> },
                  ].map(action => (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.tab)}
                      className="flex items-center gap-3 px-4 py-4 bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 rounded-xl text-white/60 hover:text-cyan-300 transition-all text-sm"
                    >
                      {action.icon}
                      {action.label}
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CONTENT EDITOR TAB ── */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              {Object.entries(contentSchema).map(([section, items]) => (
                <div key={section} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="text-white font-semibold">{sectionLabels[section] || section}</h3>
                    <p className="text-white/30 text-xs mt-1">{items.length} editable fields</p>
                  </div>
                  <div className="p-6 space-y-6">
                    {items.map(item => (
                      <div key={item.key}>
                        {renderFieldEditor(section, item)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(contentSchema).length === 0 && (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 mb-2">No content found in database</p>
                  <p className="text-white/15 text-sm">Run the seed script to populate initial content</p>
                  <code className="block mt-4 px-4 py-2 bg-white/5 rounded-lg text-cyan-400/60 text-xs">
                    cd backend && node scripts/seedContent.js
                  </code>
                </div>
              )}
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <p className="text-white/40 text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                <button
                  onClick={openAddProject}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-500/25 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add New Project
                </button>
              </div>

              {/* ── Project Form (Add / Edit) ── */}
              {showProjectForm && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      {editingProjectId ? <Edit3 className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4 text-cyan-400" />}
                      {editingProjectId ? 'Edit Project' : 'Add New Project'}
                    </h3>
                    <button onClick={closeProjectForm} className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Row 1: Title */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-white/50 font-medium">Title *</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Star AI Assistant"
                        maxLength={100}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Row 2: Short Description */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-white/50 font-medium">Short Description *</label>
                      <input
                        type="text"
                        value={projectForm.shortDescription}
                        onChange={e => setProjectForm(p => ({ ...p, shortDescription: e.target.value }))}
                        placeholder="Brief one-liner for the project card"
                        maxLength={200}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Row 3: Full Description */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-white/50 font-medium">Full Description *</label>
                      <textarea
                        value={projectForm.description}
                        onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Detailed description of the project..."
                        maxLength={1000}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all resize-none"
                      />
                      <p className="text-white/20 text-xs text-right">{projectForm.description.length}/1000</p>
                    </div>

                    {/* Row 4: Category + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium">Category</label>
                        <select
                          value={projectForm.category}
                          onChange={e => setProjectForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm focus:border-cyan-400/50 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium">Status</label>
                        <select
                          value={projectForm.status}
                          onChange={e => setProjectForm(p => ({ ...p, status: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm focus:border-cyan-400/50 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 5: Technologies + Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Technologies
                        </label>
                        <input
                          type="text"
                          value={projectForm.technologies}
                          onChange={e => setProjectForm(p => ({ ...p, technologies: e.target.value }))}
                          placeholder="React, Node.js, Python (comma-separated)"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Tags
                        </label>
                        <input
                          type="text"
                          value={projectForm.tags}
                          onChange={e => setProjectForm(p => ({ ...p, tags: e.target.value }))}
                          placeholder="ai, machine-learning, web (comma-separated)"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 6: GitHub + Live URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <GithubIcon className="w-3.5 h-3.5" /> GitHub URL
                        </label>
                        <input
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={e => setProjectForm(p => ({ ...p, githubUrl: e.target.value }))}
                          placeholder="https://github.com/..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" /> Live URL
                        </label>
                        <input
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={e => setProjectForm(p => ({ ...p, liveUrl: e.target.value }))}
                          placeholder="https://..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 7: Image Upload + Featured */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" /> Project Image
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 border-dashed rounded-xl text-white/40 text-sm cursor-pointer hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all">
                            <Upload className="w-4 h-4" />
                            <span>{projectForm.image ? projectForm.image.name : 'Choose image...'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5" /> Featured
                        </label>
                        <button
                          type="button"
                          onClick={() => setProjectForm(p => ({ ...p, featured: !p.featured }))}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                            projectForm.featured
                              ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/[0.08]'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${projectForm.featured ? 'fill-purple-400' : ''}`} />
                          {projectForm.featured ? 'Featured — will be pinned at top' : 'Not featured'}
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={saveProject}
                        disabled={projectSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-500/25 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all text-sm font-semibold disabled:opacity-50"
                      >
                        {projectSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {editingProjectId ? 'Update Project' : 'Create Project'}
                      </button>
                      <button
                        onClick={closeProjectForm}
                        className="px-6 py-3 bg-white/5 text-white/40 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white/60 transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Project List ── */}
              {projects.length === 0 && !showProjectForm ? (
                <div className="text-center py-16">
                  <FolderOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 mb-2">No projects yet</p>
                  <p className="text-white/15 text-sm mb-6">Click "Add New Project" to create your first project card</p>
                  <button
                    onClick={openAddProject}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/15 text-cyan-300 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/25 transition-all text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map(project => (
                    <div key={project._id} className="flex items-center gap-4 px-6 py-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all group">
                      {project.imageUrl ? (
                        <img src={`${API_BASE}${project.imageUrl}`} alt="" className="w-14 h-14 rounded-lg object-cover border border-white/5" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                          <FolderOpen className="w-6 h-6 text-white/10" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{project.title}</h4>
                        <p className="text-white/30 text-xs truncate mt-0.5">{project.shortDescription || project.description}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-white/25">{project.category}</span>
                          {(project.technologies || []).slice(0, 3).map((tech: string) => (
                            <span key={tech} className="px-1.5 py-0.5 text-[9px] bg-white/5 border border-white/5 rounded text-white/30">{tech}</span>
                          ))}
                          {(project.technologies || []).length > 3 && (
                            <span className="text-[9px] text-white/20">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-[10px] rounded-full flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-purple-400" /> Featured
                          </span>
                        )}
                        <span className={`px-2.5 py-1 text-[10px] rounded-full font-medium ${
                          project.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                          project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                          project.status === 'On Hold' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>{project.status}</span>
                        <button
                          onClick={() => openEditProject(project)}
                          className="p-2 rounded-lg hover:bg-blue-500/10 text-white/20 hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100"
                          title="Edit project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(project._id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── VIDEOS TAB ── */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <p className="text-white/40 text-sm mb-4">
                Manage demo videos. Edit the video source URL, title, and description from the Content tab under "Videos" section.
              </p>

              {contentSchema.videos ? (
                <div className="space-y-6">
                  {contentSchema.videos.map(item => (
                    <div key={item.key} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Video className="w-4 h-4 text-cyan-400" />
                        {item.label}
                      </h4>
                      {renderFieldEditor('videos', item)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Video className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30">No video content found</p>
                  <p className="text-white/15 text-sm mt-2">Run the seed script first</p>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Account info */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl">
                    <span className="text-white/40 text-sm">Username</span>
                    <span className="text-white/80 text-sm font-medium">{user?.username}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl">
                    <span className="text-white/40 text-sm">Email</span>
                    <span className="text-white/80 text-sm font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl">
                    <span className="text-white/40 text-sm">Role</span>
                    <span className="text-cyan-300 text-sm font-medium uppercase">{user?.role} • Super Admin</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl">
                    <span className="text-white/40 text-sm">Face Registered</span>
                    <span className={`text-sm font-medium ${user?.hasFaceRegistered ? 'text-green-400' : 'text-yellow-400'}`}>
                      {user?.hasFaceRegistered ? '✅ Yes' : '⚠️ Not yet'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Re-register face */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  Re-register Face
                </h3>
                <p className="text-white/30 text-sm mb-4">
                  Update your face biometric data if needed. This will overwrite your current face registration.
                </p>
                <button
                  onClick={() => {
                    // This would trigger a face re-registration flow
                    alert('Face re-registration: use the login flow to update your face automatically.');
                  }}
                  className="px-6 py-3 bg-blue-500/15 text-blue-300 rounded-xl border border-blue-500/20 hover:bg-blue-500/25 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Re-register Face
                </button>
              </div>

              {/* Danger zone */}
              <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-6">
                <h3 className="text-red-400/80 font-semibold mb-2">Danger Zone</h3>
                <p className="text-white/30 text-sm mb-4">
                  Logging out will end your admin session. You'll need face verification + OTP to log back in.
                </p>
                <button
                  onClick={onLogout}
                  className="px-6 py-3 bg-red-500/15 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/25 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  End Admin Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
