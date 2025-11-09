import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-xl">
            <Activity className="h-6 w-6 text-primary" />
            <span>FitLife</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Link to="/diet">
                <Button variant="ghost">Diet</Button>
              </Link>
              <Link to="/workouts">
                <Button variant="ghost">Workouts</Button>
              </Link>
              <Link to="/progress">
                <Button variant="ghost">Progress</Button>
              </Link>
              <Link to="/search">
                <Button variant="ghost">Search</Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
