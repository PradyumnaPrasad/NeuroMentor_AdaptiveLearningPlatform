import { useTheme } from '@/contexts/ThemeContext';

const FloatingShapes = () => {
  const { theme } = useTheme();
  
  const shapes = [
    { emoji: '⭐', size: 'text-4xl', delay: '0s', animation: 'drift-slow', top: '10%', left: '10%', opacity: 'opacity-30' },
    { emoji: '🔷', size: 'text-5xl', delay: '2s', animation: 'drift-medium', top: '20%', left: '80%', opacity: 'opacity-40' },
    { emoji: '🔵', size: 'text-6xl', delay: '4s', animation: 'drift-fast', top: '70%', left: '15%', opacity: 'opacity-50' },
    { emoji: '⭐', size: 'text-3xl', delay: '1s', animation: 'drift-slow', top: '50%', left: '70%', opacity: 'opacity-30' },
    { emoji: '🔺', size: 'text-5xl', delay: '3s', animation: 'drift-medium', top: '80%', left: '85%', opacity: 'opacity-40' },
    { emoji: '✨', size: 'text-4xl', delay: '5s', animation: 'drift-fast', top: '30%', left: '50%', opacity: 'opacity-50' },
  ];

  // Twinkling stars for dark mode
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: `${Math.random() * 3}s`,
  }));

  if (theme === 'dark') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Twinkling stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
        {/* Moon */}
        <div 
          className="absolute top-10 right-20 text-8xl opacity-40 drift-slow"
          style={{ animationDelay: '1s' }}
        >
          🌙
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute ${shape.size} ${shape.animation} ${shape.opacity}`}
          style={{
            top: shape.top,
            left: shape.left,
            animationDelay: shape.delay,
          }}
        >
          {shape.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingShapes;