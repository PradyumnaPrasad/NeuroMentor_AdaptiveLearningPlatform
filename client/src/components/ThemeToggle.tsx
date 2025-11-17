import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-white dark:bg-slate-800 border-2 border-primary/30 dark:border-primary/50 shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun className="w-6 h-6 text-secondary group-hover:rotate-180 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
