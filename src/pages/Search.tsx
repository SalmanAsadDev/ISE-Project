import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, Activity, Apple, Users, Stethoscope } from 'lucide-react';

const Search = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Search & Discover</h1>

          <div className="relative mb-8">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for workouts, meals, trainers, or professionals..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="workouts">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
              <TabsTrigger value="meals">Meals</TabsTrigger>
              <TabsTrigger value="trainers">Trainers</TabsTrigger>
              <TabsTrigger value="professionals">Professionals</TabsTrigger>
            </TabsList>

            <TabsContent value="workouts" className="space-y-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Full Body Strength</h3>
                    <p className="text-sm text-muted-foreground">45 min • Intermediate</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">HIIT Cardio Blast</h3>
                    <p className="text-sm text-muted-foreground">30 min • Advanced</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Yoga Flow for Beginners</h3>
                    <p className="text-sm text-muted-foreground">20 min • Beginner</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meals" className="space-y-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Apple className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">High-Protein Breakfast Bowl</h3>
                    <p className="text-sm text-muted-foreground">450 cal • 35g protein</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Apple className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Grilled Chicken Salad</h3>
                    <p className="text-sm text-muted-foreground">380 cal • 40g protein</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Apple className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Salmon & Quinoa Bowl</h3>
                    <p className="text-sm text-muted-foreground">520 cal • 38g protein</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trainers" className="space-y-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">Certified Personal Trainer • 8 years exp</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mike Chen</h3>
                    <p className="text-sm text-muted-foreground">Strength & Conditioning Coach • 10 years exp</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professionals" className="space-y-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dr. Emily Roberts</h3>
                    <p className="text-sm text-muted-foreground">Sports Medicine Specialist</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Lisa Martinez, RD</h3>
                    <p className="text-sm text-muted-foreground">Registered Dietitian Nutritionist</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Search;
