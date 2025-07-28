// Shared Project interface for the application
export interface Project {
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

// Project context interface
export interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: FormData) => Promise<void>;
  updateProject: (id: string, projectData: FormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}