import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: project.id,
    data: {
      type: 'Project',
      project,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const percent = Math.round((project.currentAmount / project.goalAmount) * 100);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow group border-l-4 border-l-transparent hover:border-l-primary"
        onClick={() => onClick(project)}
      >
        <CardHeader className="p-3 pb-0 space-y-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-secondary/50 border-transparent">
              {project.categories[0]}
            </Badge>
            {/* <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-3 w-3" />
            </Button> */}
          </div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {project.title}
          </h3>
        </CardHeader>
        <CardContent className="p-3 pt-2 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{percent}%</span>
            </div>
            <Progress value={percent} className="h-1.5" />
          </div>
          
          <div className="flex justify-between items-center text-xs">
             <div className="flex items-center gap-1.5 text-muted-foreground">
               <Avatar className="h-4 w-4">
                 <AvatarFallback className="text-[8px]">OR</AvatarFallback>
               </Avatar>
               <span className="truncate max-w-[80px]">{project.creatorName}</span>
             </div>
             <div className="flex items-center gap-1 text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded">
                <Calendar className="h-3 w-3" />
                <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
