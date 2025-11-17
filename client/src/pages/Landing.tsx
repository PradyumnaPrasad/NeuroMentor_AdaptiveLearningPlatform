import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Rocket, Sparkles } from 'lucide-react';
import FloatingShapes from '@/components/FloatingShapes';
import ThemeToggle from '@/components/ThemeToggle';

const Landing = () => {
  const navigate = useNavigate();
  const classes = [1, 2, 3];



  const handleStartAdventure = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <ThemeToggle />
      <FloatingShapes />
      
      <div className="max-w-4xl w-full space-y-12 text-center relative z-10">
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <Sparkles className="w-16 h-16 text-secondary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Hey there, little genius! 🌟
            <br />
            Ready to learn with fun?
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80">
            Choose your class and start your learning adventure!
          </p>
        </div>

        {/* Class Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {classes.map((classNum, index) => (
            <Card
              key={classNum}
              className="p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl gradient-card border-2 border-white/50"
              onClick={() => navigate('/dashboard', { state: { selectedClass: classNum } })}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-3xl font-bold text-foreground">Class {classNum}</h3>
                <p className="text-foreground/70">Click to explore!</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button
            size="lg"
            onClick={handleStartAdventure}
            className="gradient-button text-white text-xl px-12 py-8 rounded-3xl pulse-glow hover:scale-110 transition-transform duration-300 shadow-xl"
          >
            <Rocket className="w-6 h-6 mr-2" />
            Start Adventure
          </Button>
        </div>

        {/* Mascot hint */}
        <p className="text-sm text-foreground/60 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          🦉 Let's make learning magical together!
        </p>
      </div>
    </div>
  );
};

export default Landing;
