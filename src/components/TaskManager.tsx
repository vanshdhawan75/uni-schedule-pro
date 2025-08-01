import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, BookOpen, Clock, AlertTriangle, CheckCircle2, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  description?: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: 'assignment' | 'exam' | 'project' | 'reading';
}

export const TaskManager = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete Math Assignment #5", description: "Solve problems 1-20 from Chapter 8", subject: "Calculus II", dueDate: "2024-01-15", priority: "high", completed: false, category: "assignment" },
    { id: 2, title: "Read Chapter 5 - Cognitive Psychology", description: "Focus on memory and learning sections", subject: "Psychology 101", dueDate: "2024-01-14", priority: "medium", completed: true, category: "reading" },
    { id: 3, title: "Chemistry Lab Report", description: "Organic compound analysis experiment", subject: "Organic Chemistry", dueDate: "2024-01-16", priority: "high", completed: false, category: "assignment" },
    { id: 4, title: "Midterm Exam Preparation", description: "Review all chapters 1-6", subject: "Statistics", dueDate: "2024-01-18", priority: "high", completed: false, category: "exam" },
    { id: 5, title: "Final Project Proposal", description: "Submit research proposal for capstone", subject: "Senior Seminar", dueDate: "2024-01-20", priority: "medium", completed: false, category: "project" },
  ]);
  
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    priority: "medium" as const,
    category: "assignment" as const,
  });

  const filteredTasks = tasks.filter(task => {
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (filterCategory !== "all" && task.category !== filterCategory) return false;
    if (filterStatus === "completed" && !task.completed) return false;
    if (filterStatus === "pending" && task.completed) return false;
    return true;
  });

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed! 🎉",
        description: task.title,
      });
    }
  };

  const addTask = () => {
    if (!newTask.title || !newTask.subject || !newTask.dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now(),
      ...newTask,
      completed: false,
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: "",
      description: "",
      subject: "",
      dueDate: "",
      priority: "medium",
      category: "assignment",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Task added successfully! ✅",
      description: `"${task.title}" has been added to your tasks`,
    });
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      case 'exam': return <AlertTriangle className="h-4 w-4" />;
      case 'project': return <Clock className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-muted-foreground">Organize and track your assignments & deadlines</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Enter task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject *</label>
                <Input
                  placeholder="e.g., Mathematics, Chemistry..."
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Additional details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
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
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newTask.category} onValueChange={(value: any) => setNewTask({...newTask, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Due Date *</label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addTask} className="flex-1">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="exam">Exams</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No tasks found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new task</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={`bg-gradient-card border-0 shadow-soft transition-all duration-200 hover:shadow-glow ${task.completed ? 'opacity-70' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <CheckCircle2 className={`h-6 w-6 ${task.completed ? 'text-success' : 'text-muted-foreground'}`} />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCategoryIcon(task.category)}
                        <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{task.subject}</p>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant={getPriorityColor(task.priority) as any}>
                          {task.priority} priority
                        </Badge>
                        <Badge variant="outline">{task.category}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};