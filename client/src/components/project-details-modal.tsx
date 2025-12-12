import { Project, Donation } from '@/lib/mock-data';
import { useProjects } from '@/context/project-context';
import { useAuth } from '@/context/auth-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, CheckCircle2, DollarSign, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useState } from 'react';

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  const { donate } = useProjects();
  const { user } = useAuth();
  const [donationAmount, setDonationAmount] = useState<string>('500');
  const [isConfirming, setIsConfirming] = useState(false);

  if (!project) return null;

  const percent = Math.round((project.currentAmount / project.goalAmount) * 100);
  
  const handleDonate = () => {
    if (!user) return;
    setIsConfirming(true);
    setTimeout(() => {
      donate(project.id, Number(donationAmount), user.id);
      setIsConfirming(false);
      // onClose(); // Optionally close or keep open
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <div className="flex h-full max-h-full">
          {/* Main Content - Left Side */}
          <div className="flex-1 flex flex-col overflow-hidden border-r">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={
                  project.status === 'COMPLETED' ? 'default' :
                  project.status === 'FUNDING' ? 'secondary' : 'outline'
                } className="rounded-md px-2.5 py-0.5">
                  {project.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-muted-foreground mx-1">•</span>
                <span className="text-sm text-muted-foreground">{project.categories.join(', ')}</span>
              </div>
              
              <DialogTitle className="text-2xl font-bold mb-2">{project.title}</DialogTitle>
              
              <div className="flex items-center gap-3 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>OR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{project.creatorName}</p>
                  <p className="text-xs text-muted-foreground">Project Creator</p>
                </div>
                {/* Mock Verification Badge */}
                <div className="ml-auto flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                </div>
              </div>
            </div>
            
            <Separator />
            
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Budget Breakdown</h3>
                  {project.budget.length > 0 ? (
                    <div className="border rounded-md">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/30">
                          <tr className="border-b">
                            <th className="text-left py-2 px-4 font-medium">Category</th>
                            <th className="text-right py-2 px-4 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.budget.map((item) => (
                            <tr key={item.id} className="border-b last:border-0">
                              <td className="py-2 px-4">{item.category}</td>
                              <td className="py-2 px-4 text-right">₴{item.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                          <tr className="bg-secondary/10 font-medium">
                            <td className="py-2 px-4">Total Goal</td>
                            <td className="py-2 px-4 text-right">₴{project.goalAmount.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No budget details available.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Timeline</h3>
                   {project.timeline.length > 0 ? (
                    <div className="relative border-l-2 border-muted ml-3 pl-6 space-y-6 my-4">
                      {project.timeline.map((item) => (
                        <div key={item.id} className="relative">
                          <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                          <time className="block text-sm font-medium text-muted-foreground mb-1">{item.date}</time>
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                   ) : (
                     <p className="text-sm text-muted-foreground italic">No timeline milestones yet.</p>
                   )}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Sidebar - Right Side */}
          <div className="w-80 bg-secondary/10 p-6 flex flex-col gap-6 border-l">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-2xl font-bold text-primary">₴{project.currentAmount.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">of ₴{project.goalAmount.toLocaleString()}</span>
              </div>
              <Progress value={percent} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{percent}% funded</span>
                <span>{Math.max(0, project.goalAmount - project.currentAmount).toLocaleString()} to go</span>
              </div>
            </div>

            {user?.type === 'DONOR' ? (
              <Card className="border-primary/20 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Make a Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {['100', '500', '1000'].map(amt => (
                      <Button 
                        key={amt} 
                        variant={donationAmount === amt ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDonationAmount(amt)}
                        className="text-xs"
                      >
                        ₴{amt}
                      </Button>
                    ))}
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      value={donationAmount} 
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="pl-8" 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleDonate} disabled={isConfirming || !donationAmount}>
                    {isConfirming ? 'Processing...' : 'Donate Now'}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
               <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm flex gap-2">
                 <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                 <p>Log in as a Donor to contribute to this project.</p>
               </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Recent Activity</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">AN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Anonymous Donor</p>
                      <p className="text-muted-foreground text-xs">Donated ₴{(Math.random() * 1000).toFixed(0)} • 2h ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
