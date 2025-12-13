import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useProjects } from '@/context/project-context';
import { CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, ArrowRight, ArrowLeft, CheckCircle2, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateProjectWizardProps {
  onClose: () => void;
}

type Step = 'BASICS' | 'BUDGET' | 'REVIEW';

export function CreateProjectWizard({ onClose }: CreateProjectWizardProps) {
  const { addProject } = useProjects();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('BASICS');
  
  // Local state for simplicity in MVP, could use FormProvider
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    images: [] as string[],
    budget: [{ id: '1', category: 'General', amount: 0 }],
  });

  const handleNext = () => {
    if (step === 'BASICS') {
      if (!formData.title || !formData.description || !formData.category) {
        toast({ title: "Please fill in all fields", variant: "destructive" });
        return;
      }
      setStep('BUDGET');
    } else if (step === 'BUDGET') {
      if (formData.budget.some(b => b.amount <= 0)) {
        toast({ title: "Budget amounts must be positive", variant: "destructive" });
        return;
      }
      setStep('REVIEW');
    }
  };

  const handleSubmit = () => {
    const totalGoal = formData.budget.reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    addProject({
      title: formData.title,
      description: formData.description,
      categories: [formData.category],
      goalAmount: totalGoal,
      status: 'DRAFT',
      creatorId: 'current-user-id', // Handled in context
      images: formData.images.length > 0 ? formData.images : undefined,
      timeline: [], // Empty for MVP
      budget: formData.budget.map(b => ({ ...b, amount: Number(b.amount) })),
    });
    
    onClose();
  };

  const addBudgetRow = () => {
    setFormData(prev => ({
      ...prev,
      budget: [...prev.budget, { id: Date.now().toString(), category: '', amount: 0 }]
    }));
  };

  const removeBudgetRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      budget: prev.budget.filter((_, i) => i !== index)
    }));
  };

  const updateBudgetRow = (index: number, field: 'category' | 'amount', value: any) => {
    const newBudget = [...formData.budget];
    newBudget[index] = { ...newBudget[index], [field]: value };
    setFormData(prev => ({ ...prev, budget: newBudget }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, base64]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const totalBudget = formData.budget.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Create New Project</h2>
        <p className="text-sm text-muted-foreground">Launch a new fundraising campaign in 3 steps.</p>
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm">
        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${step === 'BASICS' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>1</div>
        <div className="h-0.5 w-8 bg-border" />
        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${step === 'BUDGET' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>2</div>
        <div className="h-0.5 w-8 bg-border" />
        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${step === 'REVIEW' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>3</div>
      </div>

      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-6 pb-6">
          {step === 'BASICS' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Winter Supplies for Battalion" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Primary Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={val => setFormData({...formData, category: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the project goals and impact..." 
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Project Images</Label>
                <div className="border-2 border-dashed rounded-lg p-4 hover:bg-secondary/10 transition-colors cursor-pointer">
                  <input 
                    id="images"
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2">
                    <Image className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to add project images</span>
                    <span className="text-xs text-muted-foreground">or drag and drop</span>
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`preview-${idx}`} className="w-full h-20 object-cover rounded" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'BUDGET' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <Label>Budget Breakdown</Label>
                <Button variant="outline" size="sm" onClick={addBudgetRow} className="gap-1">
                  <Plus className="h-3 w-3" /> Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.budget.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="Item name" 
                        value={item.category}
                        onChange={e => updateBudgetRow(index, 'category', e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <Input 
                        type="number" 
                        placeholder="Amount" 
                        value={item.amount}
                        onChange={e => updateBudgetRow(index, 'amount', e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeBudgetRow(index)}
                      disabled={formData.budget.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg border">
                <span className="font-semibold">Total Goal</span>
                <span className="text-xl font-bold text-primary">₴{totalBudget.toLocaleString()}</span>
              </div>
            </div>
          )}

          {step === 'REVIEW' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-secondary/10 p-4 rounded-lg space-y-4 border">
                <div>
                  <h3 className="font-semibold text-lg">{formData.title}</h3>
                  <Badge variant="outline" className="mt-1">{formData.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{formData.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Budget Summary</h4>
                <div className="space-y-1 text-sm">
                  {formData.budget.map((item, i) => (
                    <div key={i} className="flex justify-between py-1 border-b last:border-0">
                      <span>{item.category || 'Unspecified'}</span>
                      <span className="font-medium">₴{Number(item.amount).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-base">
                    <span>Total</span>
                    <span>₴{totalBudget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs text-blue-700 dark:text-blue-300 flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p>By publishing this project, you agree to provide regular reports on fund usage and project progress as per our platform transparency guidelines.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-between mt-auto pt-4 border-t">
        {step !== 'BASICS' ? (
          <Button variant="outline" onClick={() => setStep(step === 'REVIEW' ? 'BUDGET' : 'BASICS')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        ) : (
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        )}
        
        {step !== 'REVIEW' ? (
          <Button onClick={handleNext}>
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Publish Project
          </Button>
        )}
      </div>
    </div>
  );
}
