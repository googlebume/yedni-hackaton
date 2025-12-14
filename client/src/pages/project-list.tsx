import { useState } from 'react';
import { useProjects } from '@/context/project-context';
import { Project } from '@/lib/mock-data';
import { ProjectCard } from '@/components/project-card';
import { ProjectDetailsModal } from '@/components/project-details-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CATEGORIES, LOCATIONS } from '@/lib/mock-data';

export default function ProjectDiscoveryPage() {
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [fundingRange, setFundingRange] = useState([0, 2000000]);

  // Filter logic
  const filteredProjects = projects.filter(project => {
    // Search
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Category
    if (selectedCategories.length > 0 && !selectedCategories.some(c => project.categories.includes(c))) {
      return false;
    }
    // Location
    if (selectedLocations.length > 0 && !selectedLocations.includes(project.location)) {
      return false;
    }
    // Range (check goal amount)
    if (project.goalAmount < fundingRange[0] || project.goalAmount > fundingRange[1]) {
      return false;
    }
    // Only show active projects in discovery
    if (project.status === 'DRAFT') return false;
    
    return true;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar Filters */}
      <div className="w-64 flex-shrink-0 border-r pr-6 hidden md:block overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </h3>
            
            <div className="space-y-6">
              {/* Location Filter */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Community / Region</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {LOCATIONS.map(loc => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`loc-${loc}`} 
                        checked={selectedLocations.includes(loc)}
                        onCheckedChange={() => toggleLocation(loc)}
                      />
                      <label 
                        htmlFor={`loc-${loc}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {loc}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {CATEGORIES.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label 
                        htmlFor={`cat-${category}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Funding Range */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Funding Goal</Label>
                  <span className="text-xs text-muted-foreground">Max: 2M+</span>
                </div>
                <Slider 
                  defaultValue={[0, 2000000]} 
                  max={2000000} 
                  step={50000} 
                  value={fundingRange}
                  onValueChange={setFundingRange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₴{fundingRange[0].toLocaleString()}</span>
                  <span>₴{fundingRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {(selectedCategories.length > 0 || selectedLocations.length > 0 || fundingRange[0] > 0 || fundingRange[1] < 2000000) && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedCategories([]);
                setSelectedLocations([]);
                setFundingRange([0, 2000000]);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects by name, description..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
            <span>{filteredProjects.length} results</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredProjects.length > 0 ? (
            <div className="grid gap-4 pb-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">

              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => setSelectedProject(project)} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                  setSelectedLocations([]);
                  setFundingRange([0, 2000000]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>

      <ProjectDetailsModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
