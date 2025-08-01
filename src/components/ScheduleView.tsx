import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, BookOpen, Beaker, Calculator, Globe } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface ScheduleEvent {
  id: number;
  title: string;
  type: 'class' | 'study' | 'exam' | 'lab' | 'meeting';
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  location?: string;
  description?: string;
}

export const ScheduleView = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [events, setEvents] = useState<ScheduleEvent[]>([
    { id: 1, title: "Calculus II", type: "class", subject: "Mathematics", startTime: "09:00", endTime: "10:30", date: "2024-01-15", location: "Room 201" },
    { id: 2, title: "Study Session", type: "study", subject: "Chemistry", startTime: "14:00", endTime: "16:00", date: "2024-01-15", location: "Library" },
    { id: 3, title: "Psychology Lecture", type: "class", subject: "Psychology", startTime: "11:00", endTime: "12:30", date: "2024-01-16", location: "Room 305" },
    { id: 4, title: "Chemistry Lab", type: "lab", subject: "Chemistry", startTime: "16:30", endTime: "18:00", date: "2024-01-16", location: "Lab B" },
    { id: 5, title: "Statistics Exam", type: "exam", subject: "Statistics", startTime: "10:00", endTime: "12:00", date: "2024-01-18", location: "Room 101" },
    { id: 6, title: "Study Group", type: "study", subject: "Physics", startTime: "19:00", endTime: "21:00", date: "2024-01-17", location: "Study Room 3" },
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "class" as const,
    subject: "",
    startTime: "",
    endTime: "",
    date: "",
    location: "",
    description: "",
  });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-primary/10 border-primary text-primary';
      case 'study': return 'bg-success/10 border-success text-success';
      case 'exam': return 'bg-destructive/10 border-destructive text-destructive';
      case 'lab': return 'bg-warning/10 border-warning text-warning';
      case 'meeting': return 'bg-accent/30 border-accent text-accent-foreground';
      default: return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  const getSubjectIcon = (subject: string) => {
    if (subject.toLowerCase().includes('math') || subject.toLowerCase().includes('calculus') || subject.toLowerCase().includes('statistics')) {
      return <Calculator className="h-4 w-4" />;
    }
    if (subject.toLowerCase().includes('chemistry') || subject.toLowerCase().includes('physics')) {
      return <Beaker className="h-4 w-4" />;
    }
    if (subject.toLowerCase().includes('language') || subject.toLowerCase().includes('english') || subject.toLowerCase().includes('spanish')) {
      return <Globe className="h-4 w-4" />;
    }
    return <BookOpen className="h-4 w-4" />;
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.subject || !newEvent.startTime || !newEvent.endTime || !newEvent.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const event: ScheduleEvent = {
      id: Date.now(),
      ...newEvent,
    };

    setEvents([...events, event]);
    setNewEvent({
      title: "",
      type: "class",
      subject: "",
      startTime: "",
      endTime: "",
      date: "",
      location: "",
      description: "",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Event added successfully! 📅",
      description: `"${event.title}" has been added to your schedule`,
    });
  };

  const deleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: "Event deleted",
      description: "The event has been removed from your schedule",
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(addDays(currentDate, direction === 'next' ? 7 : -7));
  };

  const renderWeekView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Card key={index} className={`bg-gradient-card border-0 shadow-soft ${isToday ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-center text-sm ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  {format(day, 'EEE')}
                  <div className={`text-lg ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {dayEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No events</p>
                ) : (
                  dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 rounded-lg border-l-2 text-xs ${getEventColor(event.type)} cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => deleteEvent(event.id)}
                      title="Click to delete"
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        {getSubjectIcon(event.subject)}
                        <span className="font-medium truncate">{event.title}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.location && (
                        <div className="text-xs opacity-75 truncate">{event.location}</div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-center">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events scheduled for this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => deleteEvent(event.id)}
                  title="Click to delete"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getSubjectIcon(event.subject)}
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                  </div>
                  <p className="text-sm opacity-75">{event.subject}</p>
                  {event.location && (
                    <p className="text-sm opacity-75">📍 {event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm opacity-75 mt-2">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage your classes and study sessions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={(value: 'week' | 'day') => setView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Enter event title..."
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class">Class</SelectItem>
                        <SelectItem value="study">Study Session</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Subject *</label>
                    <Input
                      placeholder="e.g., Mathematics"
                      value={newEvent.subject}
                      onChange={(e) => setNewEvent({...newEvent, subject: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Date *</label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Time *</label>
                    <Input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">End Time *</label>
                    <Input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="Room, building, or online"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={addEvent} className="flex-1">
                    Add Event
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
              Previous {view === 'week' ? 'Week' : 'Day'}
            </Button>
            
            <h2 className="text-lg font-semibold">
              {view === 'week' 
                ? `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM d, yyyy')
              }
            </h2>
            
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              Next {view === 'week' ? 'Week' : 'Day'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      {view === 'week' ? renderWeekView() : renderDayView()}
    </div>
  );
};