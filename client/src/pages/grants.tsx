import { useState } from 'react';
import { MOCK_GRANTS, MOCK_USERS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Building2, Calendar, DollarSign, Filter, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

export default function GrantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleApply = (grantTitle: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for grants.",
        variant: "destructive"
      });
      return;
    }
    if (user.type !== 'ORGANIZATION') {
      toast({
        title: "Access Denied",
        description: "Only registered Organizations can apply for grants.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Application Started",
      description: `You are applying for: ${grantTitle}`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grants Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Funding opportunities from international donors and foundations.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search grants..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Grants List */}
        <div className="lg:col-span-2 space-y-4">
          {MOCK_GRANTS.map(grant => {
            const provider = MOCK_USERS.find(u => u.id === grant.providerId);
            return (
              <Card key={grant.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12 rounded-lg border">
                        <AvatarImage src={provider?.avatar} />
                        <AvatarFallback>{grant.providerName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{grant.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Building2 className="h-3 w-3" />
                          {grant.providerName}
                          <span className="mx-1">•</span>
                          <Calendar className="h-3 w-3" />
                          Deadline: {new Date(grant.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      Up to ₴{grant.amount.toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{grant.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {grant.categories.map(cat => (
                      <Badge key={cat} variant="outline" className="bg-secondary/50">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <div className="bg-secondary/20 p-3 rounded-md text-sm">
                    <span className="font-semibold block mb-1">Requirements:</span>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {grant.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 bg-secondary/5 py-3">
                  <Button variant="outline" onClick={() => handleApply(grant.title)}>
                    View Details
                  </Button>
                  <Button onClick={() => handleApply(grant.title)}>
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                For Investors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/90 mb-4">
                Want to support reliable NGOs? Publish your grant program on FundFlow and get access to verified applicants.
              </p>
              <Button variant="secondary" className="w-full text-primary font-semibold">
                Post a Grant
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3 text-muted-foreground">
              <p>1. Ensure your organization profile is 100% complete and Diia verified.</p>
              <p>2. Clearly define your project budget and impact metrics.</p>
              <p>3. Review the donor's specific requirements before applying.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
