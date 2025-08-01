import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Square, Clock, Plus, TrendingUp, BookOpen, Target, Calendar } from "lucide-react";

interface TimeSession {
  id: number;
  subject: string;
  activity: string;
  duration: number; // in minutes
  date: string;
  completed: boolean;
}

interface ActiveTimer {
  subject: string;
  activity: string;
  startTime: Date;
  isRunning: boolean;
}

export const TimeTracker = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<TimeSession[]>([
    { id: 1, subject: "Calculus II", activity: "Problem solving", duration: 90, date: "2024-01-15", completed: true },
    { id: 2, subject: "Chemistry", activity: "Lab report writing", duration: 120, date: "2024-01-15", completed: true },
    { id: 3, subject: "Psychology", activity: "Reading Chapter 5", duration: 60, date: "2024-01-14", completed: true },
    { id: 4, subject: "Statistics", activity: "Exam preparation", duration: 150, date: "2024-01-14", completed: true },
  ]);
  
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  
  const [newSession, setNewSession] = useState({
    subject: "",
    activity: "",
    duration: 0,
    date: new Date().toISOString().split('T')[0],
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer?.isRunning) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - activeTimer.startTime.getTime()) / 1000);
        setCurrentTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const startTimer = (subject: string, activity: string) => {
    if (activeTimer?.isRunning) {
      toast({
        title: "Timer already running",
        description: "Please stop the current timer first",
        variant: "destructive",
      });
      return;
    }

    setActiveTimer({
      subject,
      activity,
      startTime: new Date(),
      isRunning: true,
    });
    setCurrentTime(0);
    
    toast({
      title: "Timer started! ⏰",
      description: `Tracking time for ${subject} - ${activity}`,
    });
  };

  const pauseTimer = () => {
    if (activeTimer) {
      setActiveTimer({ ...activeTimer, isRunning: false });
      toast({
        title: "Timer paused",
        description: "Click resume to continue tracking",
      });
    }
  };

  const resumeTimer = () => {
    if (activeTimer) {
      const pausedDuration = currentTime;
      setActiveTimer({
        ...activeTimer,
        startTime: new Date(Date.now() - pausedDuration * 1000),
        isRunning: true,
      });
      toast({
        title: "Timer resumed",
        description: "Continuing time tracking",
      });
    }
  };

  const stopTimer = () => {
    if (activeTimer && currentTime > 0) {
      const duration = Math.floor(currentTime / 60); // Convert to minutes
      
      const session: TimeSession = {
        id: Date.now(),
        subject: activeTimer.subject,
        activity: activeTimer.activity,
        duration,
        date: new Date().toISOString().split('T')[0],
        completed: true,
      };
      
      setSessions([session, ...sessions]);
      setActiveTimer(null);
      setCurrentTime(0);
      
      toast({
        title: "Session completed! 🎉",
        description: `Recorded ${duration} minutes for ${activeTimer.subject}`,
      });
    }
  };

  const addManualSession = () => {
    if (!newSession.subject || !newSession.activity || newSession.duration <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const session: TimeSession = {
      id: Date.now(),
      ...newSession,
      completed: true,
    };

    setSessions([session, ...sessions]);
    setNewSession({
      subject: "",
      activity: "",
      duration: 0,
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Session added successfully! ✅",
      description: `Added ${session.duration} minutes for ${session.subject}`,
    });
  };

  const deleteSession = (sessionId: number) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
    toast({
      title: "Session deleted",
      description: "The session has been removed from your history",
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const filteredSessions = sessions.filter(session => {
    if (filterSubject !== "all" && session.subject !== filterSubject) return false;
    if (filterDate && session.date !== filterDate) return false;
    return true;
  });

  const totalTimeToday = sessions
    .filter(session => session.date === new Date().toISOString().split('T')[0])
    .reduce((total, session) => total + session.duration, 0);

  const totalTimeWeek = sessions
    .filter(session => {
      const sessionDate = new Date(session.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sessionDate >= weekAgo && sessionDate <= today;
    })
    .reduce((total, session) => total + session.duration, 0);

  const uniqueSubjects = [...new Set(sessions.map(session => session.subject))];

  const quickStartOptions = [
    { subject: "Mathematics", activity: "Problem solving" },
    { subject: "Chemistry", activity: "Lab work" },
    { subject: "Psychology", activity: "Reading" },
    { subject: "Statistics", activity: "Data analysis" },
    { subject: "Physics", activity: "Theory study" },
    { subject: "English", activity: "Essay writing" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Time Tracker</h1>
          <p className="text-muted-foreground">Track your study time and boost productivity</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Manual Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Manual Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject *</label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={newSession.subject}
                  onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Activity *</label>
                <Input
                  placeholder="e.g., Problem solving"
                  value={newSession.activity}
                  onChange={(e) => setNewSession({...newSession, activity: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration (minutes) *</label>
                  <Input
                    type="number"
                    placeholder="90"
                    value={newSession.duration || ""}
                    onChange={(e) => setNewSession({...newSession, duration: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Date *</label>
                  <Input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addManualSession} className="flex-1">
                  Add Session
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Timer */}
      <Card className="bg-gradient-primary text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Active Timer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTimer ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-1">{activeTimer.subject}</h3>
                <p className="text-white/80">{activeTimer.activity}</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-mono font-bold mb-4">
                  {formatTime(currentTime)}
                </div>
                
                <div className="flex justify-center space-x-3">
                  {activeTimer.isRunning ? (
                    <Button variant="secondary" onClick={pauseTimer}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={resumeTimer}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  <Button variant="destructive" onClick={stopTimer}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop & Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No active timer</h3>
              <p className="text-white/80 mb-4">Start tracking your study time below</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Start Options */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle>Quick Start Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickStartOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => startTimer(option.subject, option.activity)}
                disabled={activeTimer?.isRunning}
              >
                <div className="text-left">
                  <div className="font-medium">{option.subject}</div>
                  <div className="text-sm text-muted-foreground">{option.activity}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Today's Study Time</p>
                <p className="text-3xl font-bold text-primary">{formatDuration(totalTimeToday)}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">This Week</p>
                <p className="text-3xl font-bold text-success">{formatDuration(totalTimeWeek)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-warning">{sessions.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No sessions found</h3>
              <p className="text-sm text-muted-foreground">Start your first timer or adjust filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{session.subject}</h4>
                        <p className="text-sm text-muted-foreground">{session.activity}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">{formatDuration(session.duration)}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSession(session.id)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};