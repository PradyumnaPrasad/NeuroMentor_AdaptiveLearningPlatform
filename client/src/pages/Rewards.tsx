import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudent } from '@/contexts/StudentContext';
import { badges } from '@/data/mockData';
import { ArrowLeft, Star, Trophy } from 'lucide-react';
import Mascot from '@/components/Mascot';
import Confetti from '@/components/Confetti';
import BadgeDetailModal from '@/components/BadgeDetailModal';
import Navbar from '@/components/Navbar';
import { useCountUp } from '@/hooks/useCountUp';
import { useState, useEffect } from 'react';

const Rewards = () => {
  const navigate = useNavigate();
  const { student } = useStudent();
  const [showConfetti, setShowConfetti] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert badges to achievement format
  const allAchievements = badges.map(badge => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    category: badge.category || 'learning',
    earned: student.badges.includes(badge.id),
    earnedDate: student.badges.includes(badge.id) ? 'November 2025' : undefined,
    progress: !student.badges.includes(badge.id) ? Math.floor(Math.random() * 5) : undefined,
    maxProgress: !student.badges.includes(badge.id) ? 10 : undefined,
    rarity: badge.rarity || 'common'
  }));

  const earnedBadges = allAchievements.filter(b => b.earned);
  const lockedBadges = allAchievements.filter(b => !b.earned);

  const learningBadges = allAchievements.filter(b => b.category === 'learning');
  const streakBadges = allAchievements.filter(b => b.category === 'streak');
  const masteryBadges = allAchievements.filter(b => b.category === 'mastery');
  const specialBadges = allAchievements.filter(b => b.category === 'special');

  const animatedStars = useCountUp(student.stars);
  const animatedBadges = useCountUp(earnedBadges.length);
  const animatedTopics = useCountUp(student.completedTopics.length);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleBadgeClick = (badge: any) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <Confetti trigger={showConfetti} />
      <div className="pt-20 sm:pt-24 pb-20 md:pb-6 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Amazing Work, {student.name}! 🎉
          </h1>
          <p className="text-xl text-foreground/70">Look at all you've achieved!</p>
        </div>

        {/* Stats Card */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-primary/20 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 scale-bounce" style={{ animationDelay: '0.1s' }}>
              <Star className="w-16 h-16 mx-auto text-secondary fill-secondary" />
              <div className="text-5xl font-bold text-foreground">{animatedStars}</div>
              <p className="text-lg font-semibold text-foreground/70">Total Stars Earned ⭐</p>
            </div>
            <div className="space-y-3 scale-bounce" style={{ animationDelay: '0.2s' }}>
              <Trophy className="w-16 h-16 mx-auto text-supporting-orange" />
              <div className="text-5xl font-bold text-foreground">{animatedBadges}</div>
              <p className="text-lg font-semibold text-foreground/70">Badges Unlocked 🏅</p>
            </div>
            <div className="space-y-3 scale-bounce" style={{ animationDelay: '0.3s' }}>
              <div className="text-6xl mx-auto">📚</div>
              <div className="text-5xl font-bold text-foreground">{animatedTopics}</div>
              <p className="text-lg font-semibold text-foreground/70">Topics Completed 📚</p>
            </div>
          </div>
        </Card>

        {/* Mascot Message */}
        <Card className="p-8 bg-white/60 backdrop-blur-sm border-2 border-accent/30 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-8xl">🦉</div>
            <div className="space-y-2 text-center md:text-left">
              <p className="text-3xl font-bold text-foreground">
                You're doing great! Keep learning! 🌟
              </p>
              <p className="text-lg text-foreground/70">
                Wow, {student.name}! I'm so proud of you! Collect more badges by completing topics.
              </p>
            </div>
          </div>
        </Card>

        {/* Badge Categories with Tabs */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">🏆 Your Achievements</h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">All ({allAchievements.length})</TabsTrigger>
              <TabsTrigger value="learning">📚 Learning ({learningBadges.length})</TabsTrigger>
              <TabsTrigger value="streak">🔥 Streak ({streakBadges.length})</TabsTrigger>
              <TabsTrigger value="mastery">🏆 Mastery ({masteryBadges.length})</TabsTrigger>
              <TabsTrigger value="special">⭐ Special ({specialBadges.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allAchievements.map((badge, index) => (
                  <Card
                    key={badge.id}
                    onClick={() => handleBadgeClick(badge)}
                    className={`p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 bounce-in ${
                      badge.earned
                        ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/50 shadow-lg glow-on-hover'
                        : 'opacity-60 bg-muted/50 border-2 border-muted hover:opacity-80'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="space-y-3 relative">
                      <div className={`text-6xl ${!badge.earned ? 'grayscale' : ''}`}>
                        {badge.earned ? badge.icon : '🔒'}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{badge.name}</h3>
                      <p className="text-xs text-foreground/70 line-clamp-2">{badge.description}</p>
                      {badge.earned ? (
                        <p className="text-xs text-green-500 font-semibold">✓ Unlocked!</p>
                      ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
                        <div className="space-y-1">
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {badge.progress}/{badge.maxProgress}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Locked</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {[
              { value: 'learning', badges: learningBadges },
              { value: 'streak', badges: streakBadges },
              { value: 'mastery', badges: masteryBadges },
              { value: 'special', badges: specialBadges }
            ].map(({ value, badges: categoryBadges }) => (
              <TabsContent key={value} value={value}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryBadges.map((badge, index) => (
                    <Card
                      key={badge.id}
                      onClick={() => handleBadgeClick(badge)}
                      className={`p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                        badge.earned
                          ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/50 shadow-lg glow-on-hover'
                          : 'opacity-60 bg-muted/50 border-2 border-muted hover:opacity-80'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className={`text-6xl ${!badge.earned ? 'grayscale' : ''}`}>
                          {badge.earned ? badge.icon : '🔒'}
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{badge.name}</h3>
                        <p className="text-xs text-foreground/70 line-clamp-2">{badge.description}</p>
                        {badge.earned ? (
                          <p className="text-xs text-green-500 font-semibold">✓ Unlocked!</p>
                        ) : badge.progress !== undefined ? (
                          <div className="space-y-1">
                            <div className="h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all"
                                style={{ width: `${(badge.progress! / badge.maxProgress!) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {badge.progress}/{badge.maxProgress}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Badge Detail Modal */}
        <BadgeDetailModal
          badge={selectedBadge}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Continue Button */}
        <div className="text-center pt-8">
          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="gradient-button text-white px-12 py-6 rounded-3xl text-xl hover:scale-110 transition-transform shadow-xl"
          >
            Continue Learning 🚀
          </Button>
        </div>

        <Mascot mood="celebrating" />
        </div>
      </div>
    </div>
  );
};

export default Rewards;
