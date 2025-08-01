import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen, Target, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import { TaskManager } from "./TaskManager";
import { ScheduleView } from "./ScheduleView";
import { GoalTracker } from "./GoalTracker";
import { TimeTracker } from "./TimeTracker";

type View = 'dashboard' | 'tasks' | 'schedule' | 'goals' | 'time';

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const mockTasks = [
    { id: 1, title: "Complete Math Assignment", subject: "Calculus II", dueDate: "2024-01-15", priority: "high", completed: false },
    { id: 2, title: "Read Chapter 5", subject: "Psychology", dueDate: "2024-01-14", priority: "medium", completed: true },
    { id: 3, title: "Lab Report", subject: "Chemistry", dueDate: "2024-01-16", priority: "high", completed: false },
  ];

  const mockEvents = [
    { id: 1, title: "Calculus II Lecture", time: "09:00 - 10:30", type: "class" },
    { id: 2, title: "Study Session", time: "14:00 - 16:00", type: "study" },
    { id: 3, title: "Chemistry Lab", time: "16:30 - 18:00", type: "lab" },
  ];

  const mockGoals = [
    { id: 1, title: "Maintain 3.8 GPA", progress: 85, target: 100 },
    { id: 2, title: "Read 2 books this month", progress: 1, target: 2 },
    { id: 3, title: "Exercise 4x per week", progress: 3, target: 4 },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 📚</h1>
        <p className="text-white/90">You have 2 assignments due this week. Let's stay on track!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due This Week</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Hours Today</p>
                <p className="text-2xl font-bold">4.5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goals Progress</p>
                <p className="text-2xl font-bold">73%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Upcoming Tasks</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('tasks')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">{task.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Today's Schedule</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('schedule')}>
              View Calendar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'class' ? 'bg-primary' : 
                    event.type === 'study' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="bg-gradient-card border-0 shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Goal Progress</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('goals')}>
              Manage Goals
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockGoals.map((goal) => (
                <div key={goal.id} className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-medium mb-2">{goal.title}</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{goal.progress}/{goal.target}</span>
                    <span className="text-sm font-medium">{Math.round((goal.progress / goal.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            StudyFlow
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant={currentView === 'dashboard' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={currentView === 'tasks' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('tasks')}
            >
              Tasks
            </Button>
            <Button 
              variant={currentView === 'schedule' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('schedule')}
            >
              Schedule
            </Button>
            <Button 
              variant={currentView === 'goals' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('goals')}
            >
              Goals
            </Button>
            <Button 
              variant={currentView === 'time' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('time')}
            >
              Time Tracker
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'tasks' && <TaskManager />}
        {currentView === 'schedule' && <ScheduleView />}
        {currentView === 'goals' && <GoalTracker />}
        {currentView === 'time' && <TimeTracker />}
      </main>
    </div>
  );
};