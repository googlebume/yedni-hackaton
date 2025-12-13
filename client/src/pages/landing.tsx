import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_PROJECTS, MOCK_USERS } from '@/lib/mock-data';
import { ArrowRight, TrendingUp, Users, Heart, MapPin, MessageSquare, ThumbsUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function LandingPage() {
  const featuredProjects = MOCK_PROJECTS.filter(p => p.isRecommended || p.status === 'FUNDING').slice(0, 6);
  const investors = MOCK_USERS.filter(u => u.type === 'ORGANIZATION' || u.type === 'INVESTOR');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://scontent.fiev7-4.fna.fbcdn.net/v/t39.30808-6/482246739_1146264880629702_5503806174509962294_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GM-IXqpzx4AQ7kNvwHCQwjg&_nc_oc=Adn_bnbsqY2M-vUaGcKbGh-bZOWYYcCvfvEiczQvhWdoWWzI9JEReq5Omy_brUrnT30&_nc_zt=23&_nc_ht=scontent.fiev7-4.fna&_nc_gid=7LEvWndKW9RuSC0r7l9sbw&oh=00_AfkAtfClkek1oQe1NQuY1d87F3GeeXck3i-mrO4OinZAzw&oe=6942E0A3')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Rebuilding Ukraine Together
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              The unified platform for NGOs, donors, and investors. Transparent project management, verified reporting, and direct impact.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/discovery">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2">
                  Explore Projects <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                  Join as Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/30 border-y">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold">₴450M+</h3>
              <p className="text-muted-foreground">Funds Raised</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full">
                <img src="/src/assets/logos/logo.svg" alt="Verified" className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold">100%</h3>
              <p className="text-muted-foreground">Verified Reports</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold">1,200+</h3>
              <p className="text-muted-foreground">Active NGOs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
              <p className="text-muted-foreground mt-2">Urgent initiatives needing your support</p>
            </div>
            <Link href="/discovery">
              <Button variant="ghost" className="gap-2">View all <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="font-normal">
                      {project.categories[0]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">₴{project.currentAmount.toLocaleString()}</span>
                        <span className="text-muted-foreground">of ₴{project.goalAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={(project.currentAmount / project.goalAmount) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>OR</AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[120px]">{project.creatorName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-secondary/10 px-6 py-3 flex justify-between items-center text-muted-foreground text-sm">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{project.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      <span>{project.comments.length}</span>
                    </div>
                  </div>
                  <Link href="/discovery">
                    <Button size="sm" variant="ghost" className="h-8 px-2">Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Investors Slider */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Trusted Partners</h2>
            <p className="text-muted-foreground mt-2">NGOs and international donors working with us</p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {investors.map(org => (
                <CarouselItem key={org.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="border-none shadow-none bg-transparent">
                      <CardContent className="flex flex-col items-center text-center p-6">
                        <Avatar className="h-20 w-20 mb-4 ring-4 ring-background shadow-lg">
                          <AvatarImage src={org.avatar} />
                          <AvatarFallback>{org.name[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg mb-1">{org.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                          {org.description || "Dedicated to rebuilding Ukraine and supporting those in need."}
                        </p>
                        {org.type === 'INVESTOR' && (
                          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                            Grant Provider
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Grants Teaser */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative rounded-3xl bg-slate-900 overflow-hidden px-6 py-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Looking for funding? <br />
                Apply for grants.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                International donors and foundations offer grants for reconstruction, education, and humanitarian aid. Verified NGOs can apply directly.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link href="/grants">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
                    Browse Grants
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="link" className="text-white">
                    Register Organization <span aria-hidden="true">→</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              {/* Mock UI for grants */}
              <div className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10 p-4">
                <div className="flex gap-4 mb-4">
                  <div className="h-8 w-8 rounded-full bg-red-500" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/20 rounded" />
                    <div className="h-3 w-48 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-20 w-full bg-white/5 rounded border border-white/10 p-3" />
                  <div className="h-20 w-full bg-white/5 rounded border border-white/10 p-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-slate-400 text-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md flex items-center justify-center">
              <img src="/src/assets/logos/logo.svg" alt="Yedno" className="h-5 w-5" />
            </div>
            <span className="font-bold text-white text-lg">Yedno</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Projects</a>
            <a href="#" className="hover:text-white transition-colors">Partners</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p>© 2025 Yedno. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
