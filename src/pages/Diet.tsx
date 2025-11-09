import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Diet = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    meal_type: '',
    food_name: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('diet_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    setEntries(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('diet_entries').insert({
      user_id: user!.id,
      meal_type: newEntry.meal_type,
      food_name: newEntry.food_name,
      calories: parseInt(newEntry.calories),
      protein_g: parseFloat(newEntry.protein_g),
      carbs_g: parseFloat(newEntry.carbs_g),
      fat_g: parseFloat(newEntry.fat_g),
    });

    if (error) {
      toast.error('Failed to add entry');
    } else {
      toast.success('Diet entry added!');
      setNewEntry({
        meal_type: '',
        food_name: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
      });
      setShowForm(false);
      fetchEntries();
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('diet_entries').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete entry');
    } else {
      toast.success('Entry deleted');
      fetchEntries();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Diet Tracking</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Log Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meal Type</Label>
                    <Select value={newEntry.meal_type} onValueChange={(value) => setNewEntry({ ...newEntry, meal_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Food Name</Label>
                    <Input
                      value={newEntry.food_name}
                      onChange={(e) => setNewEntry({ ...newEntry, food_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Calories</Label>
                    <Input
                      type="number"
                      value={newEntry.calories}
                      onChange={(e) => setNewEntry({ ...newEntry, calories: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newEntry.protein_g}
                      onChange={(e) => setNewEntry({ ...newEntry, protein_g: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newEntry.carbs_g}
                      onChange={(e) => setNewEntry({ ...newEntry, carbs_g: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newEntry.fat_g}
                      onChange={(e) => setNewEntry({ ...newEntry, fat_g: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit">Add Entry</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex justify-between items-center p-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-semibold capitalize">{entry.meal_type}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-lg mb-2">{entry.food_name}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{entry.calories} cal</span>
                    {entry.protein_g && <span>{entry.protein_g}g protein</span>}
                    {entry.carbs_g && <span>{entry.carbs_g}g carbs</span>}
                    {entry.fat_g && <span>{entry.fat_g}g fat</span>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Diet;
