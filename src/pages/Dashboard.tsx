import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Apple, TrendingUp, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    workouts: 0,
    dietEntries: 0,
    progressRecords: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setProfile(data);
  };

  const fetchStats = async () => {
    if (!user) return;
    
    const [workouts, dietEntries, progressRecords] = await Promise.all([
      supabase.from('workout_plans').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('diet_entries').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('progress_tracking').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);

    setStats({
      workouts: workouts.count || 0,
      dietEntries: dietEntries.count || 0,
      progressRecords: progressRecords.count || 0,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.full_name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's your fitness overview</p>
        </div>

        {!profile?.age && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Add your health information to get personalized workout and diet plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/profile">
                <Button>Set Up Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workout Plans</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.workouts}</div>
              <p className="text-xs text-muted-foreground">Custom plans created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diet Entries</CardTitle>
              <Apple className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dietEntries}</div>
              <p className="text-xs text-muted-foreground">Meals tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress Records</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.progressRecords}</div>
              <p className="text-xs text-muted-foreground">Checkpoints logged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goal</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{profile?.fitness_goal || 'Not set'}</div>
              <p className="text-xs text-muted-foreground">Your fitness goal</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/diet" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Apple className="mr-2 h-4 w-4" />
                  Log Meal
                </Button>
              </Link>
              <Link to="/workouts" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  View Workouts
                </Button>
              </Link>
              <Link to="/progress" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Track Progress
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Weight</p>
                  <p className="text-2xl font-bold">{profile?.weight_kg ? `${profile.weight_kg} kg` : 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Activity Level</p>
                  <p className="text-lg font-medium capitalize">{profile?.activity_level || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
