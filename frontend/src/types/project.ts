// Shared Project interface for the application
export interface ProjectTeamMember {
  name: string;
  role: string;
  avatar?: string;
  contribution?: string;
}

export interface ProjectTimelinePhase {
  phase: string;
  title: string;
  description: string;
  completed?: boolean;
}

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
  endDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;

  // Detailed presentation attributes
  howCompleted?: string;
  toolsUsed?: string[];
  futureScope?: string[];
  teamMembers?: ProjectTeamMember[];
  projectType?: 'Solo Project' | 'Team Project' | 'Group Collaboration';
  timelinePhases?: ProjectTimelinePhase[];
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
