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
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const { user, verifyDiia } = useAuth();
  const { projects, donations } = useProjects();

  if (!user) return null;

  const isOrg = user.type === 'ORGANIZATION';

  // Stats calculation
  const myProjects = isOrg 
    ? projects.filter(p => p.creatorId === user.id)
    : projects; // Donors see all projects they donated to? Or generic stats

  const totalRaised = myProjects.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const totalGoal = myProjects.reduce((acc, curr) => acc + curr.goalAmount, 0);
  const activeProjects = myProjects.filter(p => p.status === 'FUNDING' || p.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isOrg 
              ? "Overview of your organization's impact and projects." 
              : "Track your contributions and discover new causes."}
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
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₴{totalRaised.toLocaleString()}</div>
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
              {projects.filter(p => p.status === 'COMPLETED').length} completed total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +180 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Rating</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9/5</div>
            <p className="text-xs text-muted-foreground">
              Trusted by community
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Projects List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-6">
                {myProjects.slice(0, 5).map(project => (
                  <div key={project.id} className="flex items-start gap-4">
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
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions / Notifications */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Report Due</p>
                <p className="text-xs text-muted-foreground">Monthly report for "Winter Uniforms"</p>
              </div>
              <Button size="sm" variant="ghost">View</Button>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Project Completed</p>
                <p className="text-xs text-muted-foreground">Archive "Shelter Reconstruction"</p>
              </div>
              <Button size="sm" variant="ghost">View</Button>
            </div>
             <div className="flex items-center gap-4 rounded-md border p-4">
              <Wallet className="h-5 w-5 text-blue-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Withdrawal Ready</p>
                <p className="text-xs text-muted-foreground">₴450,000 available for withdrawal</p>
              </div>
              <Button size="sm" variant="ghost">Claim</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
