import React, { createContext, useContext, useState } from 'react';
import { Project, ProjectStatus, Donation, MOCK_PROJECTS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';

interface ProjectContextType {
  projects: Project[];
  donations: Donation[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'currentAmount' | 'creatorName'>) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  donate: (projectId: string, amount: number, donorId: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [donations, setDonations] = useState<Donation[]>([]);
  const { toast } = useToast();

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'currentAmount' | 'creatorName'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${nanoid()}`,
      createdAt: new Date().toISOString(),
      currentAmount: 0,
      creatorName: 'My Organization', // In real app, get from auth context
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

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <ProjectContext.Provider value={{ projects, donations, addProject, updateProjectStatus, donate, getProject }}>
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
