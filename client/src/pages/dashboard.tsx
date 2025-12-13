import { useAuth } from '@/context/auth-context';
import { useProjects } from '@/context/project-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Wallet, 
  ShieldCheck, 
  Clock,
  CheckCircle2,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';
import { ProjectCard } from '@/components/project-card';
import { useState } from 'react';
import { ProjectDetailsModal } from '@/components/project-details-modal';
import { Project } from '@/lib/mock-data';

export default function Dashboard() {
  const { user, verifyDiia, likedProjects } = useAuth();
  const { projects, donations } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!user) return null;

  const isOrg = user.type === 'ORGANIZATION';

  // Stats calculation
  let myProjects = isOrg 
    ? projects.filter(p => p.creatorId === user.id)
    : projects.filter(p => donations.some(d => d.donorId === user.id && d.projectId === p.id));
  
  // Dedup supported projects
  if (!isOrg) {
    myProjects = Array.from(new Set(myProjects.map(p => p.id))).map(id => myProjects.find(p => p.id === id)!);
  }

  const likedProjectsList = projects.filter(p => likedProjects.includes(p.id));

  const totalRaised = myProjects.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const totalDonated = donations.filter(d => d.donorId === user.id).reduce((acc, curr) => acc + curr.amount, 0);
  const activeProjects = myProjects.filter(p => p.status === 'FUNDING' || p.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isOrg 
              ? "Overview of your organization's impact and projects." 
              : "Track your contributions and discovered projects."}
          </p>
        </div>
        <div className="flex gap-3">
          {!user.isDiiaVerified && (
            <Button 
              variant="outline" 
              className="border-primary/20 text-primary hover:bg-primary/5 gap-2"
              onClick={verifyDiia}
            >
              <ShieldCheck className="h-4 w-4" />
              Verify with Diia
            </Button>
          )}
          {isOrg && (
            <Link href="/projects">
              <Button>Create Project</Button>
            </Link>
          )}
        </div>
      </div>

      {!user.isDiiaVerified && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Verification Required</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              To launch fundraising campaigns, your organization must be verified via Diia. 
              This builds trust with donors and unlocks full platform features.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isOrg ? "Total Raised" : "Total Donated"}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₴{isOrg ? totalRaised.toLocaleString() : totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {isOrg ? "Manage active campaigns" : "Projects you supported"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Top 5%</div>
            <p className="text-xs text-muted-foreground">
              Based on contributions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liked Projects</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{likedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Saved to your profile
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Projects List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{isOrg ? "Recent Activity" : "Supported Projects"}</CardTitle>
            <CardDescription>
              {isOrg ? "Latest updates from your projects" : "Projects you have donated to"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-6">
                {myProjects.length > 0 ? myProjects.slice(0, 5).map(project => (
                  <div key={project.id} className="flex items-start gap-4 p-2 hover:bg-secondary/20 rounded-lg cursor-pointer transition-colors" onClick={() => setSelectedProject(project)}>
                    <div className={`mt-1 h-2 w-2 rounded-full ${
                      project.status === 'COMPLETED' ? 'bg-green-500' :
                      project.status === 'FUNDING' ? 'bg-blue-500' :
                      project.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-slate-300'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium leading-none">{project.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={(project.currentAmount / project.goalAmount) * 100} className="h-1.5 w-24" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round((project.currentAmount / project.goalAmount) * 100)}%
                        </span>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No projects found yet.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Liked Projects / Quick Actions */}
        <div className="col-span-3 space-y-4">
           {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex items-center gap-4 rounded-md border p-3 hover:bg-secondary/10 cursor-pointer transition-colors">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Complete Profile</p>
                  <p className="text-xs text-muted-foreground">Add more details to attract grants</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-md border p-3 hover:bg-secondary/10 cursor-pointer transition-colors">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">New Grant Matches</p>
                  <p className="text-xs text-muted-foreground">3 new grants match your criteria</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liked Projects Mini-List */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" /> Saved Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {likedProjectsList.length > 0 ? (
                  <div className="space-y-4">
                    {likedProjectsList.map(p => (
                      <div key={p.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0" onClick={() => setSelectedProject(p)}>
                        <span className="font-medium truncate max-w-[180px] cursor-pointer hover:underline">{p.title}</span>
                        <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Heart projects to save them here.
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProjectDetailsModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
