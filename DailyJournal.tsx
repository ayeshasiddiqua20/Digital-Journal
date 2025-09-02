import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { PenTool, Plus, Heart, Star, Sun, Moon, Coffee, CheckSquare } from "lucide-react";

interface JournalEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'rough' | 'difficult';
  gratitude: string[];
  reflection: string;
  todos: { id: string; text: string; completed: boolean }[];
  highlights: string[];
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function DailyJournal() {
  const today = new Date().toISOString().split('T')[0];
  
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: today,
      mood: 'good',
      gratitude: ['Morning coffee', 'Sunny weather'],
      reflection: "Today was productive. I managed to complete most of my tasks and felt energized throughout the day. The meditation session this morning really helped set a positive tone.",
      todos: [
        { id: '1a', text: 'Review quarterly reports', completed: true },
        { id: '1b', text: 'Call dentist for appointment', completed: false },
        { id: '1c', text: 'Plan weekend trip', completed: false }
      ],
      highlights: ['Finished the big project', 'Had a great conversation with a friend']
    }
  ]);

  const [newGratitude, setNewGratitude] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const getCurrentEntry = () => {
    return entries.find(entry => entry.date === today) || {
      id: Date.now().toString(),
      date: today,
      mood: 'okay' as const,
      gratitude: [],
      reflection: '',
      todos: [],
      highlights: []
    };
  };

  const updateEntry = (updates: Partial<JournalEntry>) => {
    const currentEntry = getCurrentEntry();
    const updatedEntry = { ...currentEntry, ...updates };
    
    setEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(entry => entry.date === today);
      if (existingIndex >= 0) {
        const newEntries = [...prevEntries];
        newEntries[existingIndex] = updatedEntry;
        return newEntries;
      } else {
        return [...prevEntries, updatedEntry];
      }
    });
  };

  const addGratitude = () => {
    if (newGratitude.trim()) {
      const currentEntry = getCurrentEntry();
      updateEntry({
        gratitude: [...currentEntry.gratitude, newGratitude.trim()]
      });
      setNewGratitude('');
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const currentEntry = getCurrentEntry();
      updateEntry({
        todos: [...currentEntry.todos, {
          id: Date.now().toString(),
          text: newTodo.trim(),
          completed: false
        }]
      });
      setNewTodo('');
    }
  };

  const toggleTodo = (todoId: string) => {
    const currentEntry = getCurrentEntry();
    updateEntry({
      todos: currentEntry.todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      const currentEntry = getCurrentEntry();
      updateEntry({
        highlights: [...currentEntry.highlights, newHighlight.trim()]
      });
      setNewHighlight('');
    }
  };

  const currentEntry = getCurrentEntry();

  const getMoodEmoji = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'rough': return '😔';
      case 'difficult': return '😞';
    }
  };

  const getMoodColor = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'great': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'okay': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rough': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'difficult': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 border-amber-200/50 shadow-lg shadow-amber-100/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PenTool className="text-amber-600" size={24} />
            <span>Today's Journal</span>
            <Badge variant="outline" className="ml-auto">
              {new Date(today).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Mood Tracker */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <Sun className="text-orange-500" size={18} />
              <span>How are you feeling today?</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['great', 'good', 'okay', 'rough', 'difficult'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => updateEntry({ mood })}
                  className={`px-4 py-2 rounded-lg border transition-all flex items-center space-x-2 ${
                    currentEntry.mood === mood
                      ? getMoodColor(mood)
                      : 'bg-white/70 border-border hover:bg-gray-50'
                  }`}
                >
                  <span>{getMoodEmoji(mood)}</span>
                  <span className="capitalize">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gratitude Section */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <Heart className="text-pink-500" size={18} />
              <span>What are you grateful for today?</span>
            </h3>
            <div className="space-y-2">
              {currentEntry.gratitude.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-pink-50/50 rounded-lg border border-pink-200/50">
                  <Heart className="text-pink-500 flex-shrink-0" size={14} />
                  <span>{item}</span>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  placeholder="I'm grateful for..."
                  value={newGratitude}
                  onChange={(e) => setNewGratitude(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGratitude()}
                  className="bg-white/70"
                />
                <Button onClick={addGratitude} variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <CheckSquare className="text-blue-500" size={18} />
              <span>Today's Tasks</span>
            </h3>
            <div className="space-y-2">
              {currentEntry.todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center space-x-2 p-2 rounded-lg border transition-all ${
                    todo.completed
                      ? 'bg-green-50/50 border-green-200/50'
                      : 'bg-white/70 border-border'
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0"
                  >
                    <CheckSquare
                      size={16}
                      className={todo.completed ? 'text-green-600' : 'text-gray-400'}
                    />
                  </button>
                  <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                    {todo.text}
                  </span>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  className="bg-white/70"
                />
                <Button onClick={addTodo} variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Daily Highlights */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <Star className="text-yellow-500" size={18} />
              <span>Today's Highlights</span>
            </h3>
            <div className="space-y-2">
              {currentEntry.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50/50 rounded-lg border border-yellow-200/50">
                  <Star className="text-yellow-500 flex-shrink-0" size={14} />
                  <span>{highlight}</span>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  placeholder="What made today special?"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                  className="bg-white/70"
                />
                <Button onClick={addHighlight} variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Daily Reflection */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <Moon className="text-indigo-500" size={18} />
              <span>Daily Reflection</span>
            </h3>
            <Textarea
              placeholder="How was your day? What did you learn? What would you like to remember about today?"
              value={currentEntry.reflection}
              onChange={(e) => updateEntry({ reflection: e.target.value })}
              rows={6}
              className="bg-white/70 resize-none font-serif leading-relaxed"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}