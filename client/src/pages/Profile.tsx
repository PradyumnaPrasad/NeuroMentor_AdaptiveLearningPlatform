import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useStudent } from '@/contexts/StudentContext';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import FloatingShapes from '@/components/FloatingShapes';
import Mascot from '@/components/Mascot';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const { student } = useStudent();
  const navigate = useNavigate();
  
  // Profile Settings
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  
  // Learning Preferences
  const [showTimer, setShowTimer] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  // Accessibility Settings
  const [reduceMotion, setReduceMotion] = useState(false);
  const [textSize, setTextSize] = useState([100]);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  const avatars = ['🦁', '🐯', '🐼', '🦊', '🐨', '🦉', '🐸', '🦄', '🐳', '🦖', '🚀', '⭐'];

  const handleSave = () => {
    toast({
      title: "Settings Saved! ✅",
      description: "Your preferences have been updated successfully.",
      duration: 3000,
    });
  };

  const handleReset = () => {
    setShowTimer(true);
    setDifficulty('medium');
    setSoundEffects(true);
    setAutoAdvance(false);
    setReduceMotion(false);
    setTextSize([100]);
    setHighContrast(false);
    setScreenReader(false);
    
    toast({
      title: "Settings Reset! 🔄",
      description: "All settings have been restored to defaults.",
      duration: 3000,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({
      title: "Logged Out! 👋",
      description: "See you soon!",
      duration: 2000,
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <Navbar />
      <FloatingShapes />
      <Mascot mood="idle" />

      <div className="container mx-auto px-4 pt-24 sm:pt-28 relative z-10">
        <Breadcrumb items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Profile', path: '/profile' }
        ]} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            👤 My Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            View your account and customize your learning experience
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-gradient border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👤 Account Information
                </CardTitle>
                <CardDescription>
                  Your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Choose Your Avatar
                  </Label>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`
                          w-12 h-12 text-3xl rounded-xl transition-all duration-300
                          hover:scale-110 hover:shadow-lg
                          ${selectedAvatar === avatar 
                            ? 'bg-gradient-to-br from-primary to-accent shadow-xl scale-110 ring-4 ring-primary/30' 
                            : 'bg-muted/50 hover:bg-muted'
                          }
                        `}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedAvatar}
                  </p>
                </div>

                {/* User Info Display */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Name</Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold">{student.name}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Class</Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold">Class {student.class}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Email</Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold">{student.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg border-2 border-yellow-500/30">
                      <p className="text-sm text-muted-foreground">⭐ Stars Earned</p>
                      <p className="text-2xl font-bold">{student.stars}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border-2 border-purple-500/30">
                      <p className="text-sm text-muted-foreground">🏆 Badges</p>
                      <p className="text-2xl font-bold">{student.badges.length}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground text-center pt-2">
                    Ask your parent/teacher to update your account details
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Preferences Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-gradient border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚 Learning Preferences
                </CardTitle>
                <CardDescription>
                  Adjust how you learn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Show Timer Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="show-timer" className="text-base font-semibold cursor-pointer">
                      ⏱️ Show Timer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Display time elapsed during quizzes
                    </p>
                  </div>
                  <Switch
                    id="show-timer"
                    checked={showTimer}
                    onCheckedChange={setShowTimer}
                  />
                </div>

                {/* Difficulty Level */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <Label htmlFor="difficulty" className="text-base font-semibold mb-3 block">
                    🎯 Difficulty Level
                  </Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy - Perfect for beginners</SelectItem>
                      <SelectItem value="medium">🟡 Medium - Balanced challenge</SelectItem>
                      <SelectItem value="hard">🔴 Hard - For experts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sound Effects Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="sound-effects" className="text-base font-semibold cursor-pointer">
                      🔊 Sound Effects
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for correct/incorrect answers
                    </p>
                  </div>
                  <Switch
                    id="sound-effects"
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                  />
                </div>

                {/* Auto Advance Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="auto-advance" className="text-base font-semibold cursor-pointer">
                      ⏭️ Auto-Advance
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Move to next question automatically after answering
                    </p>
                  </div>
                  <Switch
                    id="auto-advance"
                    checked={autoAdvance}
                    onCheckedChange={setAutoAdvance}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accessibility Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-gradient border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ♿ Accessibility
                </CardTitle>
                <CardDescription>
                  Make learning comfortable for everyone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reduce Motion Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="reduce-motion" className="text-base font-semibold cursor-pointer">
                      🎬 Reduce Motion
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    id="reduce-motion"
                    checked={reduceMotion}
                    onCheckedChange={setReduceMotion}
                  />
                </div>

                {/* Text Size Slider */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <Label htmlFor="text-size" className="text-base font-semibold">
                      🔤 Text Size
                    </Label>
                    <span className="text-sm font-semibold text-primary">
                      {textSize[0]}%
                    </span>
                  </div>
                  <Slider
                    id="text-size"
                    min={80}
                    max={150}
                    step={10}
                    value={textSize}
                    onValueChange={setTextSize}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Small</span>
                    <span>Default</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="high-contrast" className="text-base font-semibold cursor-pointer">
                      🌗 High Contrast
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                  />
                </div>

                {/* Screen Reader Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="screen-reader" className="text-base font-semibold cursor-pointer">
                      🔊 Screen Reader Support
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enhanced descriptions for screen readers
                    </p>
                  </div>
                  <Switch
                    id="screen-reader"
                    checked={screenReader}
                    onCheckedChange={setScreenReader}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card-gradient border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ℹ️ App Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="text-lg font-semibold">3.0.0</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Theme</p>
                    <p className="text-lg font-semibold capitalize">{theme}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Platform</p>
                    <p className="text-lg font-semibold">NeuroMentor Jr</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Build</p>
                    <p className="text-lg font-semibold">Phase 3</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20">
                  <p className="text-sm text-center">
                    Made with ❤️ for young learners everywhere
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pb-8"
          >
            <Button
              onClick={handleSave}
              className="gradient-button px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              💾 Save Settings
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              🔄 Reset to Defaults
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              🚪 Logout
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
