import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { UserType } from '@/lib/mock-data';

export default function AuthPage() {
  const { login, register, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  if (user) {
    return null;
  }

  const handleLogin = (e: React.FormEvent, type: UserType) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    login(email, type);
  };

  const handleRegister = (e: React.FormEvent, type: UserType) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    register(name, email, type);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="text-primary-foreground h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">FundFlow</h1>
          <p className="text-muted-foreground">Professional project management for NGOs</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your email to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="org" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="org">Organization</TabsTrigger>
                    <TabsTrigger value="donor">Donor</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="org">
                    <form onSubmit={(e) => handleLogin(e, 'ORGANIZATION')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-org">Email</Label>
                        <Input id="email-org" name="email" type="email" placeholder="contact@ngo.org" required defaultValue="contact@comebackalive.ua" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-org">Password</Label>
                        <Input id="password-org" name="password" type="password" required defaultValue="password" />
                      </div>
                      <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign In as Organization'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="donor">
                    <form onSubmit={(e) => handleLogin(e, 'DONOR')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-donor">Email</Label>
                        <Input id="email-donor" name="email" type="email" placeholder="you@example.com" required defaultValue="donor@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-donor">Password</Label>
                        <Input id="password-donor" name="password" type="password" required defaultValue="password" />
                      </div>
                      <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign In as Donor'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Join the platform to support or manage projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="org" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="org">Organization</TabsTrigger>
                    <TabsTrigger value="donor">Donor</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="org">
                    <form onSubmit={(e) => handleRegister(e, 'ORGANIZATION')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-reg-org">Organization Name</Label>
                        <Input id="name-reg-org" name="name" placeholder="Charity Foundation..." required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-reg-org">Email</Label>
                        <Input id="email-reg-org" name="email" type="email" placeholder="contact@ngo.org" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-reg-org">Password</Label>
                        <Input id="password-reg-org" name="password" type="password" required />
                      </div>
                      <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Register Organization'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="donor">
                    <form onSubmit={(e) => handleRegister(e, 'DONOR')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-reg-donor">Full Name</Label>
                        <Input id="name-reg-donor" name="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-reg-donor">Email</Label>
                        <Input id="email-reg-donor" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-reg-donor">Password</Label>
                        <Input id="password-reg-donor" name="password" type="password" required />
                      </div>
                      <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Register as Donor'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
