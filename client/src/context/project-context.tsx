import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectStatus, Donation, Comment, MOCK_PROJECTS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { useAuth } from './auth-context';

interface ProjectContextType {
  projects: Project[];
  donations: Donation[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'currentAmount' | 'creatorName' | 'likes' | 'comments' | 'location'>) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  deleteProject: (projectId: string) => void;
  donate: (projectId: string, amount: number, donorId: string) => void;
  addComment: (projectId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  toggleLike: (projectId: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [donations, setDonations] = useState<Donation[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'currentAmount' | 'creatorName' | 'likes' | 'comments' | 'location'>) => {
    if (!user) return;
    
    const newProject: Project = {
      ...projectData,
      id: `proj-${nanoid()}`,
      createdAt: new Date().toISOString(),
      currentAmount: 0,
      creatorName: user.name,
      creatorId: user.id,
      likes: 0,
      comments: [],
      location: 'Kyiv', // Default for now
    };
    
    setProjects(prev => [newProject, ...prev]);
    toast({
      title: "Project Created",
      description: `${newProject.title} has been saved as Draft.`
    });
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status } : p
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Project Deleted",
      description: "The project has been permanently removed."
    });
  };

  const donate = (projectId: string, amount: number, donorId: string) => {
    const newDonation: Donation = {
      id: `don-${nanoid()}`,
      amount,
      donorId,
      projectId,
      createdAt: new Date().toISOString()
    };

    setDonations(prev => [...prev, newDonation]);
    
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, currentAmount: p.currentAmount + amount } : p
    ));

    toast({
      title: "Donation Successful!",
      description: `Thank you for donating ₴${amount.toLocaleString()}`
    });
  };

  const addComment = (projectId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `c-${nanoid()}`,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, comments: [newComment, ...(p.comments || [])] } : p
    ));
    
    toast({
      title: "Comment Posted",
      description: "Your comment has been added to the discussion."
    });
  };

  const toggleLike = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, likes: p.likes + 1 } : p // Simple increment for MVP
    ));
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <ProjectContext.Provider value={{ projects, donations, addProject, updateProjectStatus, deleteProject, donate, addComment, toggleLike, getProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
