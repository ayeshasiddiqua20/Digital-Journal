import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Calendar, Clock, AlertCircle, Plus, Check } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'event' | 'task' | 'reminder';
  completed?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function EventsAndTasks() {
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Doctor appointment', date: '2024-09-05', time: '10:00', type: 'event', priority: 'high' },
    { id: '2', title: 'Finish quarterly report', date: '2024-09-04', time: '17:00', type: 'task', completed: false, priority: 'high' },
    { id: '3', title: 'Call mom', date: '2024-09-03', time: '19:00', type: 'reminder', completed: true, priority: 'medium' },
    { id: '4', title: 'Team meeting', date: '2024-09-03', time: '14:00', type: 'event', priority: 'medium' },
    { id: '5', title: 'Buy groceries', date: '2024-09-03', time: '', type: 'task', completed: false, priority: 'low' },
  ]);

  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'task' as Event['type'], priority: 'medium' as Event['priority'] });
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTask = (id: string) => {
    setEvents(events.map(event => 
      event.id === id && (event.type === 'task' || event.type === 'reminder')
        ? { ...event, completed: !event.completed }
        : event
    ));
  };

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, {
        ...newEvent,
        id: Date.now().toString(),
        completed: newEvent.type !== 'event' ? false : undefined
      }]);
      setNewEvent({ title: '', date: '', time: '', type: 'task', priority: 'medium' });
      setShowAddForm(false);
    }
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'task': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reminder': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  const isOverdue = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date < today;
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
    const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  const todayEvents = sortedEvents.filter(event => isToday(event.date));
  const upcomingEvents = sortedEvents.filter(event => !isToday(event.date) && !isOverdue(event.date));
  const overdueEvents = sortedEvents.filter(event => isOverdue(event.date) && !event.completed);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 border-emerald-200/50">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto text-emerald-600 mb-2" size={24} />
            <div className="text-2xl font-semibold text-emerald-700">{todayEvents.length}</div>
            <div className="text-sm text-muted-foreground">Today's Items</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-200/50">
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto text-blue-600 mb-2" size={24} />
            <div className="text-2xl font-semibold text-blue-700">{upcomingEvents.length}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50/50 to-pink-50/50 border-red-200/50">
          <CardContent className="p-4 text-center">
            <AlertCircle className="mx-auto text-red-600 mb-2" size={24} />
            <div className="text-2xl font-semibold text-red-700">{overdueEvents.length}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-slate-200/50 shadow-lg shadow-slate-100/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Events & Tasks</span>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus size={16} className="mr-1" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAddForm && (
            <div className="p-4 bg-white/70 rounded-lg border border-slate-200/50 space-y-4">
              <Input
                placeholder="Title..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
                <select 
                  className="px-3 py-2 border border-border rounded-md bg-background"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value as Event['type']})}
                >
                  <option value="task">Task</option>
                  <option value="event">Event</option>
                  <option value="reminder">Reminder</option>
                </select>
                <select 
                  className="px-3 py-2 border border-border rounded-md bg-background"
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({...newEvent, priority: e.target.value as Event['priority']})}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={addEvent}>Add Item</Button>
                <Button onClick={() => setShowAddForm(false)} variant="ghost">Cancel</Button>
              </div>
            </div>
          )}

          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-700 flex items-center space-x-2">
                <Calendar size={18} />
                <span>Today</span>
              </h3>
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} onToggle={toggleTask} />
              ))}
            </div>
          )}

          {/* Overdue Events */}
          {overdueEvents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-red-700 flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>Overdue</span>
              </h3>
              {overdueEvents.map((event) => (
                <EventCard key={event.id} event={event} onToggle={toggleTask} isOverdue />
              ))}
            </div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-700 flex items-center space-x-2">
                <Clock size={18} />
                <span>Upcoming</span>
              </h3>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} onToggle={toggleTask} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  onToggle: (id: string) => void;
  isOverdue?: boolean;
}

function EventCard({ event, onToggle, isOverdue }: EventCardProps) {
  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'task': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reminder': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className={`p-3 rounded-lg border transition-all ${
      event.completed 
        ? 'bg-green-50/50 border-green-200/50 opacity-75' 
        : isOverdue
        ? 'bg-red-50/50 border-red-200/50'
        : 'bg-white/70 border-border hover:shadow-sm'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {(event.type === 'task' || event.type === 'reminder') && (
            <button
              onClick={() => onToggle(event.id)}
              className="flex-shrink-0"
            >
              <Check 
                size={18} 
                className={`p-0.5 rounded border-2 transition-colors ${
                  event.completed 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'text-transparent border-gray-300 hover:border-primary'
                }`} 
              />
            </button>
          )}
          <div className="flex-1">
            <h4 className={`font-medium ${event.completed ? 'line-through text-muted-foreground' : ''}`}>
              {event.title}
            </h4>
            <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
              <span>{new Date(event.date).toLocaleDateString()}</span>
              {event.time && <span>{event.time}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getTypeColor(event.type)} variant="outline">
            {event.type}
          </Badge>
          <Badge className={getPriorityColor(event.priority)} variant="outline">
            {event.priority}
          </Badge>
        </div>
      </div>
    </div>
  );
}