import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType, MOCK_USERS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, type: UserType) => void;
  logout: () => void;
  register: (name: string, email: string, type: UserType) => void;
  verifyDiia: () => void;
  isLoading: boolean;
  likedProjects: string[];
  toggleLikeProject: (projectId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const { toast } = useToast();

  // Simulate session check
  useEffect(() => {
    const storedUser = localStorage.getItem('fundflow_user');
    const storedLikes = localStorage.getItem('fundflow_likes');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedLikes) {
      setLikedProjects(JSON.parse(storedLikes));
    }
    
    setIsLoading(false);
  }, []);

  const login = (email: string, type: UserType) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const existingUser = MOCK_USERS.find(u => u.email === email && u.type === type);
      const userToLogin = existingUser || {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        type,
        isDiiaVerified: false,
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${email}&background=random`
      };

      setUser(userToLogin);
      localStorage.setItem('fundflow_user', JSON.stringify(userToLogin));
      setIsLoading(false);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userToLogin.name}`,
      });
    }, 800);
  };

  const register = (name: string, email: string, type: UserType) => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        type,
        isDiiaVerified: false,
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
      };
      
      setUser(newUser);
      localStorage.setItem('fundflow_user', JSON.stringify(newUser));
      setIsLoading(false);

      toast({
        title: "Account created",
        description: "Welcome to FundFlow!",
      });
    }, 800);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fundflow_user');
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  const verifyDiia = () => {
    if (!user) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = { ...user, isDiiaVerified: true };
      setUser(updatedUser);
      localStorage.setItem('fundflow_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      
      toast({
        title: "Verified with Diia",
        description: "Your identity has been confirmed.",
        variant: "default",
      });
    }, 1500);
  };

  const toggleLikeProject = (projectId: string) => {
    setLikedProjects(prev => {
      const newLikes = prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      
      localStorage.setItem('fundflow_likes', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, verifyDiia, isLoading, likedProjects, toggleLikeProject }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
