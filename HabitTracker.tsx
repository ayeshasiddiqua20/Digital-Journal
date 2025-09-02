import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning meditation', completed: true, streak: 7 },
    { id: '2', name: 'Drink 8 glasses of water', completed: false, streak: 3 },
    { id: '3', name: 'Read for 30 minutes', completed: true, streak: 12 },
    { id: '4', name: 'Exercise', completed: false, streak: 5 },
  ]);
  
  const [newHabit, setNewHabit] = useState('');

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 }
        : habit
    ));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, {
        id: Date.now().toString(),
        name: newHabit,
        completed: false,
        streak: 0
      }]);
      setNewHabit('');
    }
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 border-orange-200/50 shadow-lg shadow-orange-100/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daily Habits</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {habits.length} completed
            </span>
          </CardTitle>
          <Progress value={progressPercentage} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                habit.completed 
                  ? 'bg-green-50/50 border border-green-200/50' 
                  : 'bg-white/50 border border-border hover:bg-orange-50/30'
              }`}
            >
              <Checkbox
                checked={habit.completed}
                onCheckedChange={() => toggleHabit(habit.id)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <div className="flex-1">
                <span className={habit.completed ? 'line-through text-muted-foreground' : ''}>
                  {habit.name}
                </span>
                <div className="text-xs text-orange-600 mt-1">
                  🔥 {habit.streak} day streak
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteHabit(habit.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          
          <div className="flex space-x-2 pt-4 border-t border-border">
            <Input
              placeholder="Add a new habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              className="bg-white/70"
            />
            <Button onClick={addHabit} className="bg-primary hover:bg-primary/90">
              <Plus size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}