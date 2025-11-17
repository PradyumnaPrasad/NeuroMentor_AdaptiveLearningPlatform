import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'mastery' | 'special';
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeDetailModalProps {
  badge: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeDetailModal = ({ badge, isOpen, onClose }: BadgeDetailModalProps) => {
  if (!badge) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'from-blue-500 to-cyan-500';
      case 'streak': return 'from-orange-500 to-red-500';
      case 'mastery': return 'from-purple-500 to-pink-500';
      case 'special': return 'from-yellow-500 to-amber-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Badge className="bg-gray-500">Common</Badge>;
      case 'rare': return <Badge className="bg-blue-500">Rare</Badge>;
      case 'epic': return <Badge className="bg-purple-500">Epic</Badge>;
      case 'legendary': return <Badge className="bg-yellow-500">Legendary</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'learning': return '📚 Learning';
      case 'streak': return '🔥 Streak';
      case 'mastery': return '🏆 Mastery';
      case 'special': return '⭐ Special';
      default: return 'Badge';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Achievement Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed information about this achievement
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          {/* Badge Icon */}
          <div className="relative">
            <motion.div
              className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getCategoryColor(badge.category)} flex items-center justify-center text-6xl shadow-2xl relative`}
              animate={badge.earned ? {
                boxShadow: [
                  '0 0 20px rgba(var(--primary), 0.5)',
                  '0 0 40px rgba(var(--primary), 0.8)',
                  '0 0 20px rgba(var(--primary), 0.5)',
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {badge.earned ? badge.icon : '🔒'}
            </motion.div>
            
            {badge.earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg"
              >
                ✓
              </motion.div>
            )}
          </div>

          {/* Badge Info */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold">{badge.name}</h2>
              {getRarityBadge(badge.rarity)}
            </div>
            
            <p className="text-muted-foreground">{badge.description}</p>
            
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="font-semibold">{getCategoryName(badge.category)}</span>
            </div>
          </div>

          {/* Progress Section */}
          {!badge.earned && badge.progress !== undefined && badge.maxProgress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Progress</span>
                <span className="text-muted-foreground">
                  {badge.progress}/{badge.maxProgress}
                </span>
              </div>
              <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-3" />
              <p className="text-xs text-center text-muted-foreground">
                {badge.maxProgress - badge.progress} more to unlock!
              </p>
            </div>
          )}

          {/* Earned Date */}
          {badge.earned && badge.earnedDate && (
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20">
              <p className="text-sm text-muted-foreground">Earned on</p>
              <p className="font-semibold">{badge.earnedDate}</p>
            </div>
          )}

          {/* Locked Message */}
          {!badge.earned && (
            <div className="text-center p-4 bg-muted/50 rounded-lg border-2 border-muted">
              <p className="text-sm font-semibold">🔒 Keep learning to unlock this badge!</p>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeDetailModal;
