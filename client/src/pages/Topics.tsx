import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getChaptersForClass } from '@/data/quizData';
import { useStudent } from '@/contexts/StudentContext';
import { ArrowLeft, Star, Lock, CheckCircle, Circle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Mascot from '@/components/Mascot';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import { useState } from 'react';

const Topics = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { student } = useStudent();
  const [viewMode, setViewMode] = useState<'path' | 'grid'>('path');
  
  // Get chapters based on student's class and subject
  const subjectKey = subject === 'math' ? 'math' : 'science';
  const chapters = getChaptersForClass(student.class, subjectKey);
  const subjectName = subject === 'math' ? 'Math Island' : 'Science Island';

  const getChapterCompletion = (chapterId: string) => {
    return student.completedTopics.includes(chapterId) ? 3 : 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢 Easy';
      case 'medium': return '🟡 Medium';
      case 'hard': return '🔴 Hard';
      default: return 'Unknown';
    }
  };

  const completedCount = chapters.filter(ch => student.completedTopics.includes(ch.id)).length;
  const totalCount = chapters.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-20 md:pb-6 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumb items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: subjectName, path: '' }
        ]} />

        {/* Header with View Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="rounded-2xl border-2 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {subject === 'math' ? '🧮' : '🔬'} {subjectName}
            </h1>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={viewMode === 'path' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('path')}
              className="rounded-md"
            >
              🛤️ Path View
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-md"
            >
              📋 Grid View
            </Button>
          </div>
        </div>

        {/* Progress Sidebar Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Your Progress</h3>
                <Badge className="text-lg px-4 py-1">
                  {completedCount}/{totalCount}
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedCount === totalCount 
                  ? '🎉 Amazing! You completed all topics!' 
                  : `Keep going! ${totalCount - completedCount} more to master this subject!`}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Path View */}
        {viewMode === 'path' && (
          <div className="relative">
            {/* Learning Path Container */}
            <div className="space-y-8">
              {chapters.map((chapter, index) => {
                const completionStars = getChapterCompletion(chapter.id);
                const isCompleted = completionStars > 0;
                const isLocked = false; // For now, all chapters unlocked
                const isNext = !isCompleted && !isLocked;
                
                return (
                  <div key={chapter.id} className="relative">
                    {/* Connection Line */}
                    {index < chapters.length - 1 && (
                      <div className="absolute left-1/2 top-full w-1 h-8 -translate-x-1/2 bg-gradient-to-b from-primary/50 to-transparent" />
                    )}
                    
                    {/* Chapter Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-6 transition-all duration-300 ${
                          isLocked 
                            ? 'opacity-50 cursor-not-allowed border-2 border-muted' 
                            : 'cursor-pointer hover:scale-102 hover:shadow-xl border-2'
                        } ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
                            : isNext
                            ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 glow-on-hover'
                            : 'border-muted'
                        }`}
                        onClick={() => !isLocked && navigate(`/chapter/${chapter.id}`)}
                      >
                        <div className="flex items-center gap-6">
                          {/* Status Icon */}
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white">
                                <CheckCircle className="w-10 h-10" />
                              </div>
                            ) : isLocked ? (
                              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Lock className="w-8 h-8 text-muted-foreground" />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                <BookOpen className="w-10 h-10 text-primary" />
                              </div>
                            )}
                          </div>

                          {/* Chapter Icon */}
                          <div className="text-6xl">{chapter.icon}</div>

                          {/* Chapter Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-2xl font-bold text-foreground">
                                {chapter.name}
                              </h3>
                              <Badge className={getDifficultyColor(chapter.difficulty || 'easy')}>
                                {getDifficultyLabel(chapter.difficulty || 'easy')}
                              </Badge>
                              {isNext && (
                                <Badge className="bg-blue-500 animate-pulse">
                                  ⭐ Start Here
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-muted-foreground">
                              {chapter.description}
                            </p>
                            
                            <p className="text-sm text-primary/70 flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              5 Quiz Sets • 25 Questions
                            </p>

                            {/* Completion Stars */}
                            {!isLocked && (
                              <div className="flex gap-1 items-center">
                                {[...Array(3)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < completionStars
                                        ? 'fill-secondary text-secondary'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {isCompleted ? 'Completed!' : 'Not started'}
                                </span>
                              </div>
                            )}

                            {isLocked && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Complete previous chapters to unlock
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          {!isLocked && (
                            <Button
                              className={`px-8 py-6 text-lg ${
                                isCompleted 
                                  ? 'gradient-button' 
                                  : 'bg-primary hover:bg-primary/90'
                              }`}
                            >
                              {isCompleted ? 'Practice Again' : 'Start Learning'}
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grid View (Original) */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => {
              const completionStars = getChapterCompletion(chapter.id);
              const isLocked = false; // All chapters unlocked for now
              
              return (
                <Card
                  key={chapter.id}
                  className={`p-8 transition-all duration-300 ${
                    isLocked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:scale-105 hover:shadow-2xl'
                  } gradient-card border-2 border-white/50 animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => !isLocked && navigate(`/chapter/${chapter.id}`)}
                >
                  <div className="space-y-4">
                    {/* Icon & Lock */}
                    <div className="relative">
                      <div className="text-6xl text-center">{chapter.icon}</div>
                      {isLocked && (
                        <div className="absolute top-0 right-0">
                          <Lock className="w-8 h-8 text-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Chapter Name */}
                    <h3 className="text-2xl font-bold text-center text-foreground">
                      {chapter.name}
                    </h3>

                    {/* Difficulty Badge */}
                    <div className="flex justify-center">
                      <Badge className={getDifficultyColor(chapter.difficulty || 'easy')}>
                        {getDifficultyLabel(chapter.difficulty || 'easy')}
                      </Badge>
                    </div>
                    
                    {/* Quiz Info */}
                    <p className="text-sm text-center text-muted-foreground">
                      5 Quiz Sets • 25 Questions
                    </p>

                    {/* Completion Stars */}
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= completionStars
                              ? 'text-secondary fill-secondary'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Button */}
                    {!isLocked && (
                      <Button 
                        className="w-full gradient-button text-white rounded-xl hover:scale-105 transition-transform"
                      >
                        {completionStars > 0 ? 'Play Again' : 'Start Learning'}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Mascot mood="idle" />
        </div>
      </div>
    </div>
  );
};

export default Topics;
