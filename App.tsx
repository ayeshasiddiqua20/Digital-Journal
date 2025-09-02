import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JournalHeader } from "./components/JournalHeader";
import { HabitTracker } from "./components/HabitTracker";
import { ReadingTracker } from "./components/ReadingTracker";
import { GoalsTracker } from "./components/GoalsTracker";
import { EventsAndTasks } from "./components/EventsAndTasks";
import { DailyJournal } from "./components/DailyJournal";

export default function App() {
  const [activeSection, setActiveSection] = useState('journal');

  const renderSection = () => {
    switch (activeSection) {
      case 'habits':
        return <HabitTracker />;
      case 'reading':
        return <ReadingTracker />;
      case 'goals':
        return <GoalsTracker />;
      case 'events':
        return <EventsAndTasks />;
      case 'journal':
        return <DailyJournal />;
      default:
        return <DailyJournal />;
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'habits': return 'Daily Habits';
      case 'reading': return 'Reading Journey';
      case 'goals': return 'Life Goals';
      case 'events': return 'Events & Tasks';
      case 'journal': return 'Daily Journal';
      default: return 'Daily Journal';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(139 90 60 / 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Header */}
      <JournalHeader 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            {/* Section Title */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-2xl font-serif text-primary mb-2">{getSectionTitle(activeSection)}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary/50 to-primary mx-auto rounded-full"></div>
            </motion.div>

            {/* Section Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative mt-16 py-8 text-center text-muted-foreground border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto px-6"
        >
          <p className="text-sm">
            ✨ Your personal space for growth, reflection, and mindfulness ✨
          </p>
          <p className="text-xs mt-2 opacity-75">
            Made with care for your daily journey
          </p>
        </motion.div>
      </footer>
    </div>
  );
}