import { useAuth } from '@/context/auth-context';
import { useProjects } from '@/context/project-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ProjectCard } from '@/components/project-card';
import { ProjectDetailsModal } from '@/components/project-details-modal';
import { useState } from 'react';
import { Project } from '@/lib/mock-data';
import { ShieldCheck, Mail, Calendar, MapPin, Heart } from 'lucide-react';

export default function ProfilePage() {
  const { user, likedProjects } = useAuth();
  const { projects, donations } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!user) return null;

  const likedProjectsList = projects.filter(p => likedProjects.includes(p.id));
  const supportedProjects = projects.filter(p => donations.some(d => d.donorId === user.id && d.projectId === p.id));
  // Unique supported projects
  const uniqueSupportedProjects = Array.from(new Set(supportedProjects.map(p => p.id))).map(id => supportedProjects.find(p => p.id === id)!);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Profile Header */}
      <Card className="border-none shadow-md bg-gradient-to-r from-primary/10 via-background to-background">
        <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-muted-foreground">
                <Badge variant="secondary" className="text-sm">{user.type}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Mail className="h-4 w-4" /> {user.email}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <p className="max-w-2xl text-muted-foreground">
              {user.description || "Passionate about supporting Ukraine's recovery and development."}
            </p>

            {user.isDiiaVerified && (
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                <ShieldCheck className="h-4 w-4" /> Verified via Diia
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10">Sign Out</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs / Sections */}
      <div className="grid gap-8">
        {/* Liked Projects Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            <h2 className="text-2xl font-bold">Saved Projects</h2>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            {likedProjectsList.length > 0 ? (
              <div className="flex gap-4">
                {likedProjectsList.map(project => (
                  <div key={project.id} className="w-[300px] shrink-0">
                    <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                <p>No saved projects yet.</p>
              </div>
            )}
          </ScrollArea>
        </section>

        {/* Supported Projects Section (for Donors) */}
        {user.type === 'DONOR' && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Supported Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueSupportedProjects.length > 0 ? (
                uniqueSupportedProjects.map(project => (
                   <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                  <p>You haven't supported any projects yet.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <ProjectDetailsModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
