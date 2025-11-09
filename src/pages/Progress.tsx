import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Progress = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    weight_kg: '',
    body_fat_percentage: '',
    notes: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    setRecords(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('progress_tracking').insert({
      user_id: user!.id,
      weight_kg: parseFloat(newRecord.weight_kg),
      body_fat_percentage: newRecord.body_fat_percentage ? parseFloat(newRecord.body_fat_percentage) : null,
      notes: newRecord.notes || null,
    });

    if (error) {
      toast.error('Failed to add record');
    } else {
      toast.success('Progress recorded!');
      setNewRecord({
        weight_kg: '',
        body_fat_percentage: '',
        notes: '',
      });
      setShowForm(false);
      fetchRecords();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor your fitness journey</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Progress
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>New Progress Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newRecord.weight_kg}
                      onChange={(e) => setNewRecord({ ...newRecord, weight_kg: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Body Fat % (optional)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newRecord.body_fat_percentage}
                      onChange={(e) => setNewRecord({ ...newRecord, body_fat_percentage: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    placeholder="How are you feeling? Any observations?"
                  />
                </div>
                <Button type="submit">Save Progress</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {records.length === 0 ? (
          <Card className="text-center p-12">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Start Tracking Your Progress</h3>
            <p className="text-muted-foreground">
              Log your weight and body measurements to see your progress over time
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(new Date(record.date), 'MMMM dd, yyyy')}
                      </p>
                      <div className="flex gap-6 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="text-2xl font-bold">{record.weight_kg} kg</p>
                        </div>
                        {record.body_fat_percentage && (
                          <div>
                            <p className="text-sm text-muted-foreground">Body Fat</p>
                            <p className="text-2xl font-bold">{record.body_fat_percentage}%</p>
                          </div>
                        )}
                      </div>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
