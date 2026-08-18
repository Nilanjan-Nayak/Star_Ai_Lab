import React, { createContext, useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  category: string;
  status: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  startDate: string;
  tags: string[];
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: FormData) => Promise<void>;
  updateProject: (id: string, projectData: FormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        console.log('API not available, using fallback data');
        setProjects([]);
      }
    } catch (err) {
      console.log('API connection failed, using fallback data');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: projectData
      });

      if (response.ok) {
        await fetchProjects(); // Refresh the list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create project');
      }
    } catch (error) {
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: projectData
      });

      if (response.ok) {
        await fetchProjects(); // Refresh the list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update project');
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchProjects(); // Refresh the list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      error,
      fetchProjects,
      createProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};