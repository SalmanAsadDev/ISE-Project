import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Activity, Target, TrendingUp, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Personalized workout plans, nutrition tracking, and progress monitoring—all in one place.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Custom Workouts</h3>
              <p className="text-muted-foreground">
                AI-powered workout plans tailored to your fitness level and goals.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Nutrition Tracking</h3>
              <p className="text-muted-foreground">
                Track your meals and calories with our comprehensive food database.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your progress with detailed analytics and visualizations.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Expert Community</h3>
              <p className="text-muted-foreground">
                Connect with trainers and nutritionists near you.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users achieving their fitness goals with FitLife.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
