import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  fromPosition?: { x: number; y: number };
}

const Confetti = ({ trigger, fromPosition }: ConfettiProps) => {
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    left: string; 
    top?: string;
    color: string; 
    delay: string;
    duration: string;
  }>>([]);

  useEffect(() => {
    if (trigger) {
      const colors = ['#60A5FA', '#FCD34D', '#86EFAC', '#FDBA74', '#C4B5FD', '#F87171', '#34D399'];
      const particleCount = fromPosition ? 20 : 15;
      
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: fromPosition ? `${fromPosition.x}%` : `${Math.random() * 100}%`,
        top: fromPosition ? `${fromPosition.y}%` : undefined,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 0.2}s`,
        duration: `${1.5 + Math.random() * 1}s`,
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, fromPosition]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full confetti"
          style={{
            left: particle.left,
            top: particle.top || '0',
            backgroundColor: particle.color,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;