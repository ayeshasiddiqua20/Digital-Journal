import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { BookOpen, Plus, Star, Calendar } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'planned';
  progress: number;
  rating?: number;
  dateCompleted?: string;
}

export function ReadingTracker() {
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'The Midnight Library', author: 'Matt Haig', status: 'completed', progress: 100, rating: 5, dateCompleted: '2024-01-15' },
    { id: '2', title: 'Atomic Habits', author: 'James Clear', status: 'reading', progress: 65 },
    { id: '3', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', status: 'planned', progress: 0 },
  ]);

  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const addBook = () => {
    if (newBook.title && newBook.author) {
      setBooks([...books, {
        id: Date.now().toString(),
        title: newBook.title,
        author: newBook.author,
        status: 'planned',
        progress: 0
      }]);
      setNewBook({ title: '', author: '' });
      setShowAddForm(false);
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { 
            ...book, 
            progress,
            status: progress === 100 ? 'completed' : progress > 0 ? 'reading' : 'planned',
            dateCompleted: progress === 100 ? new Date().toISOString().split('T')[0] : undefined
          }
        : book
    ));
  };

  const completedBooks = books.filter(b => b.status === 'completed').length;
  const readingBooks = books.filter(b => b.status === 'reading').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-200/50">
          <CardContent className="p-4 text-center">
            <BookOpen className="mx-auto text-blue-600 mb-2" size={24} />
            <div className="text-2xl font-semibold text-blue-700">{completedBooks}</div>
            <div className="text-sm text-muted-foreground">Books Completed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-200/50">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto text-amber-600 mb-2" size={24} />
            <div className="text-2xl font-semibold text-amber-700">{readingBooks}</div>
            <div className="text-sm text-muted-foreground">Currently Reading</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200/50">
          <CardContent className="p-4 text-center">
            <Star className="mx-auto text-green-600 mb-2" size={24} />
            <div className="text-2xl font-semibold text-green-700">2024</div>
            <div className="text-sm text-muted-foreground">Reading Goal</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-purple-200/50 shadow-lg shadow-purple-100/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Reading List</span>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              variant="outline"
              size="sm"
              className="bg-white/70"
            >
              <Plus size={16} className="mr-1" />
              Add Book
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <div className="p-4 bg-white/70 rounded-lg border border-purple-200/50 space-y-3">
              <Input
                placeholder="Book title..."
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              />
              <Input
                placeholder="Author..."
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              />
              <div className="flex space-x-2">
                <Button onClick={addBook} size="sm">Add Book</Button>
                <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </div>
          )}

          {books.map((book) => (
            <div key={book.id} className="p-4 bg-white/70 rounded-lg border border-purple-200/50 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900">{book.title}</h4>
                  <p className="text-sm text-purple-700">by {book.author}</p>
                </div>
                <Badge variant={
                  book.status === 'completed' ? 'default' : 
                  book.status === 'reading' ? 'secondary' : 'outline'
                } className={
                  book.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                  book.status === 'reading' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }>
                  {book.status === 'completed' ? 'Completed' : 
                   book.status === 'reading' ? 'Reading' : 'Planned'}
                </Badge>
              </div>
              
              {book.status !== 'planned' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <Progress value={book.progress} className="h-2" />
                  {book.status === 'reading' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateProgress(book.id, Math.min(100, book.progress + 10))}
                        size="sm"
                        variant="outline"
                      >
                        +10%
                      </Button>
                      <Button
                        onClick={() => updateProgress(book.id, 100)}
                        size="sm"
                        variant="outline"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {book.status === 'completed' && book.rating && (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < book.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    Completed {book.dateCompleted}
                  </span>
                </div>
              )}
              
              {book.status === 'planned' && (
                <Button
                  onClick={() => updateProgress(book.id, 5)}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  Start Reading
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}