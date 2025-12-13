import { useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Project, ProjectStatus } from '@/lib/mock-data';
import { ProjectCard } from './project-card';
import { useProjects } from '@/context/project-context';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanBoardProps {
  onProjectClick: (project: Project) => void;
}

const COLUMNS: { id: ProjectStatus; title: string; color: string }[] = [
  { id: 'DRAFT', title: 'Draft', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'FUNDING', title: 'Funding', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
];

export function KanbanBoard({ onProjectClick }: KanbanBoardProps) {
  const { projects, updateProjectStatus } = useProjects();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Group projects by status
  const columns = useMemo(() => {
    const cols: Record<ProjectStatus, Project[]> = {
      DRAFT: [],
      FUNDING: [],
      IN_PROGRESS: [],
      COMPLETED: [],
    };
    
    projects.forEach(p => {
      if (cols[p.status]) {
        cols[p.status].push(p);
      }
    });
    return cols;
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Avoid accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeProject = projects.find(p => p.id === active.id);
    // Find which column we dropped into
    // The over.id could be a container ID (ProjectStatus) or another item ID
    
    let newStatus: ProjectStatus | null = null;
    
    if (Object.keys(columns).includes(over.id as string)) {
      newStatus = over.id as ProjectStatus;
    } else {
      // Dropped over another item, find that item's status
      const overProject = projects.find(p => p.id === over.id);
      if (overProject) {
        newStatus = overProject.status;
      }
    }

    if (activeProject && newStatus && activeProject.status !== newStatus) {
      updateProjectStatus(activeProject.id, newStatus);
    }

    setActiveId(null);
  };

  const activeProject = activeId ? projects.find(p => p.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-secondary/30 rounded-lg border border-border/50 h-full max-h-full">
            <div className="p-3 flex items-center justify-between sticky top-0 bg-secondary/30 backdrop-blur-sm z-10 rounded-t-lg">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm uppercase tracking-tight text-foreground/70">{col.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.color}`}>
                  {columns[col.id].length}
                </span>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-2">
              <SortableContext 
                id={col.id}
                items={columns[col.id].map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[100px]">
                  {columns[col.id].map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={onProjectClick}                      showImage={false}                    />
                  ))}
                  {/* Placeholder for empty columns to make them droppable easily */}
                  {columns[col.id].length === 0 && (
                    <div className="h-full w-full flex items-center justify-center py-8 text-muted-foreground/40 border-2 border-dashed border-muted rounded-md text-xs">
                      Drag projects here
                    </div>
                  )}
                </div>
              </SortableContext>
            </ScrollArea>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeProject ? (
          <div className="w-80 rotate-2 cursor-grabbing">
            <ProjectCard project={activeProject} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
