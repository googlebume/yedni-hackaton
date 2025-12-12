import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { KanbanBoard } from '@/components/kanban-board';
import { ProjectDetailsModal } from '@/components/project-details-modal';
import { CreateProjectWizard } from '@/components/create-project-wizard';
import { Project } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function ProjectBoardPage() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    // Add small delay to clear project to avoid flash of content
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects Board</h1>
          <p className="text-muted-foreground text-sm">Manage and track project progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          {user?.type === 'ORGANIZATION' && (
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[600px] sm:w-[540px] overflow-y-auto">
                <CreateProjectWizard onClose={() => setIsCreateOpen(false)} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <KanbanBoard onProjectClick={handleProjectClick} />
      </div>

      <ProjectDetailsModal 
        project={selectedProject} 
        isOpen={isDetailsOpen} 
        onClose={closeDetails} 
      />
    </div>
  );
}
