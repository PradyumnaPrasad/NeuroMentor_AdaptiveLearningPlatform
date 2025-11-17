import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getChapter } from '@/data/quizData';
import { useStudent } from '@/contexts/StudentContext';
import { ArrowLeft, Trophy, Star, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Mascot from '@/components/Mascot';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';

const ChapterQuizzes = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { student } = useStudent();
  
  const chapter = getChapter(chapterId || '', student.class);
  
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl">Chapter not found!</p>
      </div>
    );
  }

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

  const subject = chapterId?.includes('math') ? 'math' : 'science';
  const subjectName = subject === 'math' ? 'Math Island' : 'Science Island';

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-20 md:pb-6 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <Breadcrumb items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: subjectName, path: `/topics/${subject}` },
            { label: chapter.name, path: '' }
          ]} />

          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(`/topics/${subject}`)}
              className="rounded-2xl border-2 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center gap-3">
                <span className="text-5xl">{chapter.icon}</span>
                {chapter.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">{chapter.description}</p>
            </div>
            <Badge className={getDifficultyColor(chapter.difficulty)}>
              {getDifficultyLabel(chapter.difficulty)}
            </Badge>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{chapter.quizSets.length}</p>
                    <p className="text-sm text-muted-foreground">Quiz Sets</p>
                  </div>
                  <div className="h-12 w-px bg-border"></div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{chapter.quizSets.length * 5}</p>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                  </div>
                  <div className="h-12 w-px bg-border"></div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-secondary">⭐</p>
                    <p className="text-sm text-muted-foreground">Earn Stars!</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  💡 Complete all quiz sets to master this chapter!
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quiz Sets Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-6 h-6 text-secondary" />
              Choose a Quiz Set
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapter.quizSets.map((quizSet, index) => (
                <motion.div
                  key={quizSet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl gradient-card border-2 border-white/50"
                    onClick={() => navigate(`/quiz/${chapterId}/${quizSet.id}`)}
                  >
                    <div className="space-y-4">
                      {/* Quiz Set Number */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">{index + 1}</span>
                        </div>
                        <Play className="w-8 h-8 text-primary/50" />
                      </div>

                      {/* Quiz Set Name */}
                      <h3 className="text-xl font-bold text-foreground">
                        {quizSet.name}
                      </h3>

                      {/* Questions Count */}
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        📝 {quizSet.questions.length} Questions
                      </p>

                      {/* Stars to Earn */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-secondary fill-secondary/30"
                          />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">Earn up to 50 stars!</span>
                      </div>

                      {/* Start Button */}
                      <Button 
                        className="w-full gradient-button text-white rounded-xl hover:scale-105 transition-transform"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Quiz
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Mascot mood="idle" />
        </div>
      </div>
    </div>
  );
};

export default ChapterQuizzes;
