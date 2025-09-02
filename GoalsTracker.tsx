import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Target, Plus, CheckCircle, Clock, Star } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'career' | 'health' | 'creative';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  milestones: Milestone[];
  completed: boolean;
}

export function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Learn Spanish',
      description: 'Become conversational in Spanish for my trip to Spain',
      category: 'personal',
      priority: 'high',
      deadline: '2024-06-30',
      completed: false,
      milestones: [
        { id: '1a', title: 'Complete Duolingo Spanish course', completed: true },
        { id: '1b', title: 'Watch 10 Spanish movies with subtitles', completed: true },
        { id: '1c', title: 'Have 5 conversations with native speakers', completed: false },
        { id: '1d', title: 'Read a Spanish novel', completed: false },
      ]
    },
    {
      id: '2',
      title: 'Run a Half Marathon',
      description: 'Train for and complete a 21K run',
      category: 'health',
      priority: 'medium',
      deadline: '2024-04-15',
      completed: false,
      milestones: [
        { id: '2a', title: 'Run 5K without stopping', completed: true },
        { id: '2b', title: 'Run 10K consistently', completed: true },
        { id: '2c', title: 'Complete 15K training run', completed: false },
        { id: '2d', title: 'Register for half marathon', completed: false },
      ]
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    deadline: ''
  });

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            milestones: goal.milestones.map(milestone =>
              milestone.id === milestoneId
                ? { ...milestone, completed: !milestone.completed }
                : milestone
            )
          }
        : goal
    ));
  };

  const getGoalProgress = (goal: Goal) => {
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    return goal.milestones.length > 0 ? (completedMilestones / goal.milestones.length) * 100 : 0;
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'personal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'career': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'health': return 'bg-green-100 text-green-800 border-green-200';
      case 'creative': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return <Star className="w-4 h-4 text-red-500 fill-current" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Target className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-indigo-200/50 shadow-lg shadow-indigo-100/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Goals</span>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus size={16} className="mr-1" />
              New Goal
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAddForm && (
            <div className="p-4 bg-white/70 rounded-lg border border-indigo-200/50 space-y-4">
              <Input
                placeholder="Goal title..."
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
              <Textarea
                placeholder="Describe your goal..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select 
                  className="px-3 py-2 border border-border rounded-md bg-background"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value as Goal['category']})}
                >
                  <option value="personal">Personal</option>
                  <option value="career">Career</option>
                  <option value="health">Health</option>
                  <option value="creative">Creative</option>
                </select>
                <select 
                  className="px-3 py-2 border border-border rounded-md bg-background"
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as Goal['priority']})}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => {
                  if (newGoal.title) {
                    setGoals([...goals, {
                      ...newGoal,
                      id: Date.now().toString(),
                      milestones: [],
                      completed: false
                    }]);
                    setNewGoal({ title: '', description: '', category: 'personal', priority: 'medium', deadline: '' });
                    setShowAddForm(false);
                  }
                }}>
                  Add Goal
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="ghost">Cancel</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal);
              return (
                <Card key={goal.id} className="bg-white/70 border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{goal.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getCategoryColor(goal.category)}>
                            {goal.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getPriorityIcon(goal.priority)}
                            <span className="text-xs text-muted-foreground capitalize">{goal.priority}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm mb-2">Milestones:</h5>
                      {goal.milestones.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No milestones added yet</p>
                      ) : (
                        goal.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                              milestone.completed 
                                ? 'bg-green-50/50 text-green-800' 
                                : 'bg-gray-50/50 hover:bg-gray-100/50'
                            }`}
                          >
                            <button
                              onClick={() => toggleMilestone(goal.id, milestone.id)}
                              className="flex-shrink-0"
                            >
                              <CheckCircle 
                                size={16} 
                                className={milestone.completed ? 'text-green-600' : 'text-gray-400'} 
                              />
                            </button>
                            <span className={`text-sm ${milestone.completed ? 'line-through' : ''}`}>
                              {milestone.title}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}