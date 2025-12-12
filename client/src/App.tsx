import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { ProjectProvider } from "@/context/project-context";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import ProjectBoardPage from "@/pages/project-board";
import ProjectDiscoveryPage from "@/pages/project-list";
import LandingPage from "@/pages/landing";
import GrantsPage from "@/pages/grants";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes Wrapper */}
      <Route path="/:rest*">
        <Layout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/projects" component={ProjectBoardPage} />
            <Route path="/discovery" component={ProjectDiscoveryPage} />
            <Route path="/grants" component={GrantsPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProjectProvider>
            <Toaster />
            <Router />
          </ProjectProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
