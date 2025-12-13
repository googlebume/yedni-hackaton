import { Project, Donation, Comment } from '@/lib/mock-data';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Calendar, CheckCircle2, DollarSign, User, AlertCircle, 
  MapPin, ThumbsUp, MessageSquare, Send, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  const { donate, addComment, deleteProject, toggleLike } = useProjects();
  const { user, likedProjects, toggleLikeProject } = useAuth();
  const [donationAmount, setDonationAmount] = useState<string>('500');
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [commentText, setCommentText] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  if (!project) return null;

  const percent = Math.round((project.currentAmount / project.goalAmount) * 100);
  const isOwner = user?.id === project.creatorId;
  const isLiked = likedProjects.includes(project.id);
  const hasImages = project.images && project.images.length > 0;
  const currentImage = hasImages ? project.images[currentImageIndex] : null;
  
  const handleDonate = () => {
    if (!user) return;
    setIsConfirming(true);
    setTimeout(() => {
      donate(project.id, Number(donationAmount), user.id);
      setIsConfirming(false);
    }, 1000);
  };

  const handleLike = () => {
    if (!user) {
      toast({ title: "Please login to like projects" });
      return;
    }
    toggleLikeProject(project.id);
    toggleLike(project.id); // Update global count
  };

  const handlePostComment = () => {
    if (!commentText.trim() || !user) return;
    
    addComment(project.id, {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: commentText,
    });
    
    setCommentText('');
  };

  const handleDelete = () => {
    deleteProject(project.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Image Gallery */}
        {hasImages && (
          <div className="relative h-96 sm:h-[500px] md:h-[600px] lg:h-[700px] bg-black/10 overflow-hidden">
            <img 
              src={currentImage} 
              alt={`${project.title}-${currentImageIndex}`}
              className="w-full h-full object-cover"
            />
            {project.images!.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-10 w-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setCurrentImageIndex(prev => (prev - 1 + project.images!.length) % project.images!.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm text-white bg-black/50 px-3 py-1 rounded-full">
                  {currentImageIndex + 1}/{project.images!.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-10 w-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setCurrentImageIndex(prev => (prev + 1) % project.images!.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
            {/* Thumbnail strip */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-2 bg-gradient-to-t from-black/50 to-transparent">
              {project.images!.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-12 w-12 rounded overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex h-full max-h-full">
          {/* Main Content - Left Side */}
          <div className="flex-1 flex flex-col overflow-hidden border-r">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    project.status === 'COMPLETED' ? 'default' :
                    project.status === 'FUNDING' ? 'secondary' : 'outline'
                  } className="rounded-md px-2.5 py-0.5">
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-muted-foreground mx-1">•</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {project.location || 'Ukraine'}
                  </span>
                </div>
                
                {isOwner && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your project
                          and remove all data associated with it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                          Delete Project
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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
                <div className="ml-auto flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                </div>
              </div>
            </div>
            
            <Separator />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <div className="px-6 pt-2">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-2">Details</TabsTrigger>
                  <TabsTrigger value="updates" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-2">Updates</TabsTrigger>
                  <TabsTrigger value="discussion" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-2">Discussion ({project.comments?.length || 0})</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  <TabsContent value="details" className="mt-0 space-y-6">
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
                  </TabsContent>

                  <TabsContent value="updates" className="mt-0 space-y-6">
                     <div className="relative border-l-2 border-muted ml-3 pl-6 space-y-8">
                      {project.timeline.length > 0 ? project.timeline.map((item) => (
                        <div key={item.id} className="relative">
                          <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                          <time className="block text-sm font-medium text-muted-foreground mb-1">{item.date}</time>
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground italic">No updates available yet.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="discussion" className="mt-0 space-y-6">
                    {/* Add Comment */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user?.name?.[0] || 'G'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea 
                          placeholder={user ? "Ask a question or share support..." : "Login to comment"}
                          className="min-h-[80px]"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          disabled={!user}
                        />
                        <div className="flex justify-end">
                          <Button size="sm" onClick={handlePostComment} disabled={!commentText.trim() || !user}>
                            <Send className="h-3 w-3 mr-2" /> Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Comments List */}
                    <div className="space-y-6">
                      {project.comments?.length > 0 ? project.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.text}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> {comment.likes}
                              </button>
                              <button className="text-xs text-muted-foreground hover:text-primary">Reply</button>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No comments yet. Be the first to start the discussion!</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
              
              {/* Interaction Bar */}
              <div className="border-t p-4 flex items-center justify-between bg-background">
                <Button 
                  variant={isLiked ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`gap-2 ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'} ({project.likes + (isLiked ? 1 : 0)})
                </Button>
                <div className="text-xs text-muted-foreground">
                  {project.comments?.length || 0} comments
                </div>
              </div>
            </Tabs>
          </div>

          {/* Sidebar - Right Side */}
          <div className="w-80 bg-secondary/10 p-6 flex flex-col gap-6 border-l overflow-y-auto">
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

            {user?.type === 'DONOR' || user?.type === 'INVESTOR' ? (
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
