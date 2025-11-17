import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, User, Book, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/contexts/StudentContext';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = useStudent();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Trophy, label: 'Rewards', path: '/rewards' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/topics');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NeuroMentor
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Learning made fun!</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  variant={active ? 'default' : 'ghost'}
                  className={cn(
                    'gap-2 transition-all duration-300',
                    active
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'hover:bg-primary/10 hover:scale-105'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* User Info & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Stars (Hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full border border-yellow-500/30">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-foreground">{student.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="font-bold text-foreground">{student.badges.length}</span>
              </div>
            </div>

            {/* User Avatar (Desktop) */}
            <button
              onClick={() => navigate('/profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-all hover:scale-105 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:shadow-lg">
                <span className="text-sm">👦</span>
              </div>
              <span className="hidden lg:block font-semibold text-foreground">{student.name}</span>
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-2xl pb-safe">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-300',
                    active
                      ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg scale-105'
                      : 'hover:bg-primary/10'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{item.label}</span>
                  {active && (
                    <div className="w-1 h-1 rounded-full bg-white mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
