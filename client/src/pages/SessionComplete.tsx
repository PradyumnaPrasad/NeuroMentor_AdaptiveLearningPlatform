import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Clock, Target } from 'lucide-react';
import Confetti from '@/components/Confetti';
import Mascot from '@/components/Mascot';
import { useCountUp } from '@/hooks/useCountUp';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';

const SessionComplete = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Mock session data - would come from context in real app
  const sessionData = {
    topicsCompleted: 3,
    starsEarned: 30,
    timeSpent: '25 minutes',
    accuracy: 87,
    badgeUnlocked: 'Super Learner',
  };

  const animatedTopics = useCountUp(sessionData.topicsCompleted, 1500);
  const animatedStars = useCountUp(sessionData.starsEarned, 1500);
  const animatedAccuracy = useCountUp(sessionData.accuracy, 1500);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <ThemeToggle />
      <Confetti trigger={showConfetti} />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 animate-pulse" />
      
      <Card className="max-w-4xl w-full p-12 space-y-8 relative z-10 bg-card/90 backdrop-blur-lg border-2 border-primary/30 shadow-2xl">
        {/* Trophy with pulse animation */}
        <div className="text-center space-y-4">
          <div className="inline-block animate-bounce-in">
            <Trophy className="w-32 h-32 mx-auto text-secondary glow-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground animate-fade-in">
            Amazing Learning Session! 🎉
          </h1>
          <p className="text-xl text-foreground/70">You're on fire today!</p>
        </div>

        {/* Session Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 scale-bounce" style={{ animationDelay: '0.1s' }}>
            <Star className="w-10 h-10 mx-auto mb-3 text-primary" />
            <div className="text-4xl font-bold text-foreground mb-2">{animatedTopics}</div>
            <p className="text-sm text-foreground/70">Topics Completed</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30 scale-bounce" style={{ animationDelay: '0.2s' }}>
            <Star className="w-10 h-10 mx-auto mb-3 text-secondary fill-secondary" />
            <div className="text-4xl font-bold text-foreground mb-2">{animatedStars}</div>
            <p className="text-sm text-foreground/70">Stars Earned</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 scale-bounce" style={{ animationDelay: '0.3s' }}>
            <Clock className="w-10 h-10 mx-auto mb-3 text-accent" />
            <div className="text-4xl font-bold text-foreground mb-2">{sessionData.timeSpent}</div>
            <p className="text-sm text-foreground/70">Time Spent</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-supporting-orange/20 to-supporting-orange/10 border-supporting-orange/30 scale-bounce" style={{ animationDelay: '0.4s' }}>
            <Target className="w-10 h-10 mx-auto mb-3 text-supporting-orange" />
            <div className="text-4xl font-bold text-foreground mb-2">{animatedAccuracy}%</div>
            <p className="text-sm text-foreground/70">Accuracy</p>
          </Card>
        </div>

        {/* Achievement Unlocked */}
        <Card className="p-8 bg-gradient-to-r from-accent/30 to-primary/30 border-2 border-accent animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
          {/* Sparkle particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-secondary rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-foreground">Achievement Unlocked!</h2>
            <div className="text-5xl font-bold text-accent">{sessionData.badgeUnlocked}</div>
            <p className="text-foreground/70">Keep up the amazing work!</p>
          </div>
        </Card>

        {/* Mascot Message */}
        <Card className="p-6 bg-card/60 backdrop-blur-sm border-2 border-primary/20">
          <div className="flex items-center gap-6">
            <div className="text-7xl">😊</div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                Wow! You're unstoppable! 🌟
              </p>
              <p className="text-foreground/70">
                I'm so proud of how much you've learned today. Ready for more adventures?
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="gradient-button text-white px-12 py-6 rounded-3xl text-xl hover:scale-110 transition-transform shadow-xl"
          >
            Keep Learning 🚀
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="px-12 py-6 rounded-3xl text-xl hover:scale-105 transition-transform border-2"
          >
            Take a Break 😌
          </Button>
        </div>
      </Card>

      <Mascot mood="celebrating" />
    </div>
  );
};

export default SessionComplete;
