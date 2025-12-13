import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  showImage?: boolean; // When false (e.g., in Kanban), image preview is hidden
}

export function ProjectCard({ project, onClick, showImage = true }: ProjectCardProps) {
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const percent = Math.round((project.currentAmount / project.goalAmount) * 100);
  const hasImages = project.images && project.images.length > 0;

  // Auto-rotate images on hover
  useEffect(() => {
    if (!isHovering || !hasImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % project.images!.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isHovering, hasImages, project.images?.length]);

  const currentImage = hasImages ? project.images[currentImageIndex] : null;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow group border-l-4 border-l-transparent hover:border-l-primary overflow-hidden"
        onClick={() => onClick(project)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setCurrentImageIndex(0);
        }}
      >
        {/* Image Preview Section */}
        {showImage !== false && hasImages && currentImage && (
          <div className="relative h-24 sm:h-32 overflow-hidden bg-secondary/10">
            <img 
              src={currentImage} 
              alt={`${project.title}-${currentImageIndex}`}
              className="w-full h-full object-cover transition-transform duration-300"
            />
            {isHovering && project.images!.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => (prev - 1 + project.images!.length) % project.images!.length);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                  {currentImageIndex + 1}/{project.images!.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => (prev + 1) % project.images!.length);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
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
