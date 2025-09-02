import { BookOpen, Calendar, CheckSquare, Target, PenTool } from "lucide-react";

interface JournalHeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function JournalHeader({ activeSection, onSectionChange }: JournalHeaderProps) {
  const sections = [
    { id: 'habits', name: 'Habits', icon: CheckSquare },
    { id: 'reading', name: 'Reading', icon: BookOpen },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'events', name: 'Calendar', icon: Calendar },
    { id: 'journal', name: 'Journal', icon: PenTool },
  ];

  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-primary mb-2">My Digital Journal</h1>
            <p className="text-muted-foreground">A safe space for your thoughts, goals, and memories</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-2">
            {sections.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSectionChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeSection === id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:shadow-md'
                }`}
              >
                <Icon size={18} />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}