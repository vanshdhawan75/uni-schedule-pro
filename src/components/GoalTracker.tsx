import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus, TrendingUp, Calendar, Trophy, BookOpen, Clock, Zap } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description?: string;
  category: 'academic' | 'personal' | 'health' | 'career';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export const GoalTracker = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: 1, 
      title: "Maintain 3.8 GPA", 
      description: "Keep GPA above 3.8 for scholarship eligibility",
      category: "academic", 
      target: 3.8, 
      current: 3.75, 
      unit: "GPA", 
      deadline: "2024-05-15", 
      priority: "high", 
      completed: false 
    },
    { 
      id: 2, 
      title: "Read Academic Books", 
      description: "Read books related to my major to expand knowledge",
      category: "academic", 
      target: 12, 
      current: 4, 
      unit: "books", 
      deadline: "2024-06-01", 
      priority: "medium", 
      completed: false 
    },
    { 
      id: 3, 
      title: "Complete Internship Applications", 
      description: "Apply to summer internships in my field",
      category: "career", 
      target: 10, 
      current: 7, 
      unit: "applications", 
      deadline: "2024-02-29", 
      priority: "high", 
      completed: false 
    },
    { 
      id: 4, 
      title: "Exercise Weekly", 
      description: "Maintain physical health during semester",
      category: "health", 
      target: 16, 
      current: 12, 
      unit: "sessions", 
      deadline: "2024-04-30", 
      priority: "medium", 
      completed: false 
    },
    { 
      id: 5, 
      title: "Learn Programming Language", 
      description: "Master Python for data analysis projects",
      category: "personal", 
      target: 40, 
      current: 40, 
      unit: "hours", 
      deadline: "2024-03-31", 
      priority: "medium", 
      completed: true 
    },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "academic" as const,
    target: 0,
    current: 0,
    unit: "",
    deadline: "",
    priority: "medium" as const,
  });

  const filteredGoals = goals.filter(goal => {
    if (filterCategory !== "all" && goal.category !== filterCategory) return false;
    if (filterStatus === "completed" && !goal.completed) return false;
    if (filterStatus === "active" && goal.completed) return false;
    return true;
  });

  const updateGoalProgress = (goalId: number, newCurrent: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updated = { ...goal, current: newCurrent };
        updated.completed = newCurrent >= goal.target;
        
        if (updated.completed && !goal.completed) {
          toast({
            title: "Goal completed! 🎉",
            description: `Congratulations on completing "${goal.title}"!`,
          });
        }
        
        return updated;
      }
      return goal;
    }));
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.unit || !newGoal.deadline || newGoal.target <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      ...newGoal,
      completed: newGoal.current >= newGoal.target,
    };

    setGoals([goal, ...goals]);
    setNewGoal({
      title: "",
      description: "",
      category: "academic",
      target: 0,
      current: 0,
      unit: "",
      deadline: "",
      priority: "medium",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Goal added successfully! 🎯",
      description: `"${goal.title}" has been added to your goals`,
    });
  };

  const deleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal deleted",
      description: "The goal has been removed from your list",
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <BookOpen className="h-4 w-4" />;
      case 'personal': return <Zap className="h-4 w-4" />;
      case 'health': return <Target className="h-4 w-4" />;
      case 'career': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-primary/10 text-primary';
      case 'personal': return 'bg-warning/10 text-warning';
      case 'health': return 'bg-success/10 text-success';
      case 'career': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Goal Tracker</h1>
          <p className="text-muted-foreground">Set, track, and achieve your academic and personal goals</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Enter goal title..."
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your goal..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newGoal.category} onValueChange={(value: any) => setNewGoal({...newGoal, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal({...newGoal, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target *</label>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    value={newGoal.target || ""}
                    onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Unit *</label>
                  <Input
                    placeholder="e.g., books, hours, GPA"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Current Progress</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newGoal.current || ""}
                    onChange={(e) => setNewGoal({...newGoal, current: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Deadline *</label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addGoal} className="flex-1">
                  Add Goal
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-primary text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Overall Progress</p>
                <p className="text-3xl font-bold">{Math.round(overallProgress)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed Goals</p>
                <p className="text-3xl font-bold text-success">{completedGoals}</p>
              </div>
              <Trophy className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Goals</p>
                <p className="text-3xl font-bold text-primary">{totalGoals - completedGoals}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No goals found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new goal</p>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => (
            <Card key={goal.id} className={`bg-gradient-card border-0 shadow-soft transition-all duration-200 hover:shadow-glow ${goal.completed ? 'ring-2 ring-success' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
                        {getCategoryIcon(goal.category)}
                      </div>
                      <h3 className="text-xl font-semibold">{goal.title}</h3>
                      {goal.completed && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success">
                          ✅ Completed
                        </Badge>
                      )}
                    </div>
                    
                    {goal.description && (
                      <p className="text-muted-foreground mb-3">{goal.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant={getCategoryColor(goal.category).includes('primary') ? 'default' : 'secondary'}>
                        {goal.category}
                      </Badge>
                      <Badge variant={getPriorityColor(goal.priority) as any}>
                        {goal.priority} priority
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {goal.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    Delete
                  </Button>
                </div>
                
                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  
                  <Progress 
                    value={getProgressPercentage(goal.current, goal.target)} 
                    className="h-3"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {Math.round(getProgressPercentage(goal.current, goal.target))}%
                    </span>
                    
                    {!goal.completed && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Update progress"
                          className="w-32"
                          min="0"
                          max={goal.target}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = Number((e.target as HTMLInputElement).value);
                              if (value >= 0 && value <= goal.target) {
                                updateGoalProgress(goal.id, value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.querySelector(`input[placeholder="Update progress"]`) as HTMLInputElement;
                            if (input) {
                              const value = Number(input.value);
                              if (value >= 0 && value <= goal.target) {
                                updateGoalProgress(goal.id, value);
                                input.value = "";
                              }
                            }
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};