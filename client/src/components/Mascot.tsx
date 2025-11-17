import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface MascotProps {
  mood?: 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  showMessage?: boolean;
  customMessage?: string;
}

const Mascot = ({ mood = 'idle', showMessage = false, customMessage }: MascotProps) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const moodEmojis = {
    idle: '🦉',
    happy: '😊',
    thinking: '🤔',
    celebrating: '🎉',
    encouraging: '💪'
  };

  const learningTips = [
    "Take your time to think!",
    "It's okay to make mistakes!",
    "You're doing great!",
    "Remember to take breaks!",
    "Learning is an adventure!",
    "Believe in yourself!",
    "Every question helps you grow!",
    "You're getting smarter every day!"
  ];

  useEffect(() => {
    if (showMessage) {
      setMessage(customMessage || learningTips[Math.floor(Math.random() * learningTips.length)]);
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage, customMessage]);

  const handleClick = () => {
    if (cooldown) return;
    
    setMessage(learningTips[Math.floor(Math.random() * learningTips.length)]);
    setIsVisible(true);
    setCooldown(true);
    
    setTimeout(() => setIsVisible(false), 4000);
    setTimeout(() => setCooldown(false), 10000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <div className="relative">
          {isVisible && (
            <Card className="absolute bottom-full right-0 mb-4 p-4 bg-white dark:bg-slate-800 shadow-2xl border-2 border-primary/30 animate-fade-in max-w-xs rounded-2xl">
              <p className="text-sm font-semibold text-foreground">{message}</p>
            </Card>
          )}
          <button
            onClick={handleClick}
            disabled={cooldown}
            className={`w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-full shadow-2xl border-2 border-white/50 flex items-center justify-center text-5xl hover:scale-110 transition-all duration-300 breathe ${cooldown ? 'opacity-50' : 'cursor-pointer'}`}
          >
            {moodEmojis[mood]}
          </button>
        </div>
      </div>
    </>
  );
};

export default Mascot;
