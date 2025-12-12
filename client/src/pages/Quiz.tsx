import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuizSet } from '@/data/quizData';
import { useStudent } from '@/contexts/StudentContext';
import { Timer, Trophy } from 'lucide-react';
import Mascot from '@/components/Mascot';
import Confetti from '@/components/Confetti';
import Breadcrumb from '@/components/Breadcrumb';
import { Progress } from '@/components/ui/progress';
import { learningApi, type AIExplanation } from '@/services/learningApi';
import ExplanationModal from '@/components/ExplanationModal';
import { getConceptTags } from '@/data/conceptTags';
import HintDropdown from '@/components/HintDropdown';

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to shuffle question options
const shuffleQuestionOptions = (question: any) => {
  if (!question || !question.options) return question;
  const shuffledOptions = shuffleArray(question.options);
  return {
    ...question,
    options: shuffledOptions
  };
};

const Quiz = () => {
  const { chapterId, quizSetId } = useParams<{ chapterId: string; quizSetId: string }>();
  const navigate = useNavigate();
  const { student, completeTopicHandler, addStars } = useStudent();
  
  // Generate AI questions for quiz instead of using static ones
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Generate AI questions for quiz when component mounts
  useEffect(() => {
    const generateQuizQuestions = async () => {
      try {
        setLoadingQuestions(true);
        const conceptTags = getConceptTags(chapterId || '');
        
        // Determine subject type from chapterId
        const subjectType = chapterId?.includes('math') ? 'math' : 'science';
        
        console.log('🚀 Generating all 5 quiz questions in batch (FAST!)...');
        const startTime = Date.now();
        
        // Generate all 5 questions in a single batch call - MUCH FASTER!
        const quizQuestions = await learningApi.generateQuizBatch(
          conceptTags,
          student.class,
          subjectType
        );
        
        const endTime = Date.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`✅ Generated ${quizQuestions.length} questions in ${timeTaken}s!`);
        
        if (quizQuestions.length > 0) {
          const shuffledQuestions = quizQuestions.map(shuffleQuestionOptions);
          setQuestions(shuffledQuestions);
          console.log('Progressive difficulty:', shuffledQuestions.map(q => q.difficulty));
        } else {
          console.error('Failed to generate any quiz questions');
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error generating quiz questions:', error);
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    if (chapterId && student.id) {
      generateQuizQuestions();
    }
  }, [chapterId, student.id, student.class, quizSetId]);

  
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [encouragingMsg, setEncouragingMsg] = useState('');
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging'>('thinking');
  
  // AI Learning State
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [correctAnswerText, setCorrectAnswerText] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  
  // Practice Mode State
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<any[] | null>(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceProgress, setPracticeProgress] = useState(1);
  const [practiceState, setPracticeState] = useState<any>(null);
  const [showPracticeMastery, setShowPracticeMastery] = useState(false);
  const [loadingPractice, setLoadingPractice] = useState(false);

  useEffect(() => {
    // Only start timer when questions are loaded and not in practice mode, or when practice questions are ready
    const shouldStartTimer = (!loadingQuestions && questions.length > 0 && !isPracticeMode) ||
                            (isPracticeMode && practiceQuestion && selectedAnswer === null);

    if (shouldStartTimer && timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleTimeout();
    }
  }, [timeLeft, selectedAnswer, loadingQuestions, questions.length, isPracticeMode, practiceQuestion]);

  const handleTimeout = () => {
    setIsCorrect(false);
    setTimeout(() => handleNext(), 2000);
  };

  const handleAnswerClick = async (index: number) => {
    // Allow clicking different answer if previous was wrong
    if (selectedAnswer !== null && isCorrect === true) return;
    
    setSelectedAnswer(index);
    const currentQ = isPracticeMode && practiceQuestion ? practiceQuestion : questions[currentQuestion];
    const correct = currentQ.options[index].correct;
    setIsCorrect(correct);
    
    if (correct) {
      // Handle correct answer in practice mode
      if (isPracticeMode && practiceState) {
        setShowConfetti(true);
        setMascotMood('happy');
        setTimeout(() => setShowConfetti(false), 1500);

          // Process practice answer
        try {
          const response = await learningApi.processAnswer({
            studentId: student.id || 1,
            questionId: currentQ.id,
            selectedAnswer: index,
            isCorrect: true,
            currentState: practiceState,
            questionData: currentQ
          });

          console.log('Practice response:', response);

          // Check if mastered
          if (response.action === 'concept_mastered') {
            setEncouragingMsg('🎉 AMAZING! You\'ve MASTERED this concept! 🏆');
            addStars(50);
            setShowConfetti(true);
            setShowPracticeMastery(true);
            setMascotMood('celebrating');
            // Don't auto-exit, let user click "Back to Quiz"
          } else {
            // If backend provided a direct next question (new difficulty), use it
            if ((response.action === 'generate_medium' || response.action === 'generate_hard') && response.data?.question) {
              const nextDifficulty = response.data.difficulty || 'medium';
              const levelMsg = nextDifficulty === 'medium' ? '⬆️ Level Up! Now trying Medium difficulty!' : '⬆️ Great! Now for the Hard challenge!';
              setEncouragingMsg(levelMsg);
              addStars(response.reward || 15);

              const questionWithId = {
                ...shuffleQuestionOptions(response.data.question),
                id: response.data.question.id || `practice_${currentQuestion}_${nextDifficulty}`
              };

              setTimeout(() => {
                setPracticeQuestion(questionWithId);
                setPracticeState(response.nextState);
                setPracticeProgress(response.data.progress?.current || (nextDifficulty === 'medium' ? 2 : 3));
                setSelectedAnswer(null);
                setIsCorrect(null);
                setEncouragingMsg('');
              }, 2000);
            } else if (practiceQuestions && practiceIndex < practiceQuestions.length - 1) {
              // Otherwise, if we have a pre-generated list from the backend, advance locally
              const nextIdx = practiceIndex + 1;
              const nextQ = shuffleQuestionOptions(practiceQuestions[nextIdx]);

              setTimeout(() => {
                setPracticeQuestion(nextQ);
                setPracticeState(response.nextState || practiceState);
                setPracticeIndex(nextIdx);
                setPracticeProgress(nextIdx + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setEncouragingMsg('');
              }, 800);
            } else {
              // Last practice question completed - show mastery celebration
              if (practiceIndex === practiceQuestions.length - 1) {
                setEncouragingMsg('🎉 Practice Complete! You\'re getting better! 🏆');
                addStars(30);
                setShowConfetti(true);
                setShowPracticeMastery(true);
                setMascotMood('celebrating');
              } else {
                setEncouragingMsg('Great!');
              }
            }
          }
        } catch (error) {
          console.error('Error processing practice answer:', error);
          setEncouragingMsg('Error processing answer. Please try again.');
        }
      } else {
        // Normal mode
        setScore(score + 1);
        addStars(10);
        setShowConfetti(true);
        setMascotMood('happy');
        setEncouragingMsg('');
        setTimeout(() => setShowConfetti(false), 1500);
      }
    } else {
      setMascotMood('encouraging');
      setEncouragingMsg("Let me help you understand! 🦉");
      
      // Get AI Explanation (both modes)
      setIsLoadingExplanation(true);
      setShowExplanation(true); // Show modal immediately with loading state
      try {
        const questionData = {
          id: currentQ.id,
          question: currentQ.question,
          options: currentQ.options,
          conceptTags: getConceptTags(chapterId || ''),
          difficulty: currentQ.difficulty || 'easy',
          explanation: currentQ.explanation
        };

        const response = await learningApi.processAnswer({
          studentId: student.id || 1,
          questionId: currentQ.id,
          selectedAnswer: index,
          isCorrect: false,
          currentState: isPracticeMode && practiceState ? practiceState : {
            classLevel: student.class,
            consecutiveCorrect: 0,
            consecutiveWrong: 1,
            currentDifficulty: 'easy' as 'easy' | 'medium' | 'hard',
            isInAdaptiveMode: false,
            recentPerformance: []
          },
          questionData
        });

        console.log('API Response:', response);
        console.log('Action:', response.action);
        console.log('Has explanation data:', !!response.data?.explanation);

        // Check if action is show_explanation or if explanation data exists
        if (response.action === 'show_explanation' || (response.data && response.data.explanation)) {
          setAiExplanation(response.data.explanation);
          setCorrectAnswerText(response.data.correctAnswer || '');
          
          // Exit practice mode on wrong answer
          if (isPracticeMode) {
            setTimeout(() => {
              setIsPracticeMode(false);
              setPracticeQuestion(null);
              setPracticeState(null);
              setPracticeProgress(0);
            }, 500);
          }
        }
      } catch (error: any) {
        console.error('Error getting AI explanation:', error);
        setEncouragingMsg("Almost there! Try again 🦉");
      } finally {
        setIsLoadingExplanation(false);
      }
    }
  };

  const handleStartPractice = async () => {
    try {
      console.log('Starting practice mode...');
      setShowExplanation(false); // Close explanation modal
      setLoadingPractice(true); // Show loading spinner
      
      const currentQ = questions[currentQuestion];
      const subjectType = chapterId?.includes('math') ? 'math' : 'science';
      const questionData = {
        id: currentQ.id,
        question: currentQ.question,
        options: currentQ.options,
        conceptTags: getConceptTags(chapterId || ''),
        difficulty: currentQ.difficulty || 'easy'
      };
      
      const response = await learningApi.startAdaptiveMode(
        student.id || 1,
        questionData,
        student.class,
        subjectType
      );
      
      console.log('Practice mode response:', response);
      
      // Backend returns: { action: 'generate_easy', data: { question, difficulty, message, progress }, nextState }
      console.log('Checking practice data:', {
        hasData: !!response.data,
        hasQuestion: !!response.data?.question,
        question: response.data?.question,
        progress: response.data?.progress,
        nextState: response.nextState
      });
      
      if (response.data?.questions && Array.isArray(response.data.questions) && response.data.questions.length >= 1) {
        console.log('Setting practice mode state with pre-generated questions...');
        setIsPracticeMode(true);
        // Store full list and set first question
        setPracticeQuestions(response.data.questions.map((q: any) => shuffleQuestionOptions(q)));
        setPracticeIndex(0);
        setPracticeQuestion(shuffleQuestionOptions(response.data.questions[0]));
        setPracticeProgress(response.data.progress?.current || 1);
        setPracticeState(response.nextState);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(30);
        console.log('Practice mode activated with questions count:', response.data.questions.length);
      } else if (response.data?.question) {
        // Backwards compatibility if only single question provided
        console.log('Setting practice mode state...');
        setIsPracticeMode(true);
        setPracticeQuestion(shuffleQuestionOptions(response.data.question));
        setPracticeProgress(response.data.progress?.current || 1);
        setPracticeState(response.nextState);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(30);
        console.log('Practice mode activated!', {
          isPracticeMode: true,
          practiceQuestion: response.data.question,
          practiceProgress: response.data.progress?.current || 1
        });
      } else {
        console.error('No question in response!', response);
      }
    } catch (error) {
      console.error('Error starting practice mode:', error);
    } finally {
      setLoadingPractice(false); // Hide loading spinner
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(30);
      setMascotMood('thinking');
      setEncouragingMsg('');
    } else {
      setShowResult(true);
      setMascotMood('celebrating');
      setShowConfetti(true);
      if (chapterId) {
        completeTopicHandler(chapterId);
      }
    }
  };

  const handleBackToQuiz = () => {
    setShowPracticeMastery(false);
    setIsPracticeMode(false);
    setPracticeQuestion(null);
    setPracticeQuestions(null);
    setPracticeIndex(0);
    setPracticeState(null);
    setPracticeProgress(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setEncouragingMsg('');
    setShowConfetti(false);
    setMascotMood('thinking');
    setTimeLeft(30); // Reset timer for next question
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-12 max-w-2xl w-full text-center space-y-8 gradient-card border-2 border-white/50 animate-bounce-in">
          <Trophy className="w-24 h-24 mx-auto text-secondary" />
          <h1 className="text-5xl font-bold text-foreground">Amazing Job! 🎉</h1>
          <div className="text-6xl">{score === questions.length ? '🏆' : '⭐'}</div>
          <p className="text-3xl text-foreground">
            You scored {score} out of {questions.length}!
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/rewards')}
              className="gradient-button text-white px-8 py-6 rounded-2xl text-lg hover:scale-105 transition-transform"
            >
              View Rewards
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-6 rounded-2xl text-lg hover:scale-105 transition-transform"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (questions.length === 0 && !loadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl">Quiz not found!</p>
      </div>
    );
  }

  const question = isPracticeMode && practiceQuestion ? practiceQuestion : questions[currentQuestion];
  const subject = chapterId?.includes('math') ? 'math' : 'science';
  const subjectName = subject === 'math' ? 'Math Island' : 'Science Island';
  const quizName = `${chapterId?.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Quiz'} - AI Generated`;

  // Difficulty badge styling
  const getDisplayConcept = (chapterId: string): string => {
    const tags = getConceptTags(chapterId);
    
    // Priority order for displaying concepts
    const conceptPriority = [
      'addition', 'subtraction', 'multiplication', 'division',
      'shapes', 'geometry', 'counting', 'numbers',
      'plants', 'animals', 'water', 'air'
    ];
    
    for (const priority of conceptPriority) {
      if (tags.includes(priority)) {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
      }
    }
    
    // Fallback to first tag or general
    return tags[0]?.charAt(0).toUpperCase() + tags[0]?.slice(1) || 'General Knowledge';
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      easy: 'bg-gradient-to-r from-green-400 to-green-500 text-white',
      medium: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
      hard: 'bg-gradient-to-r from-red-400 to-red-500 text-white'
    };
    return styles[difficulty as keyof typeof styles] || styles.easy;
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-[#C8E4F9] to-[#E0F2FF]">
      <Confetti trigger={showConfetti} />
      <div className="max-w-4xl mx-auto space-y-6">
        <Breadcrumb items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: subjectName, path: `/topics/${subject}` },
          { label: quizName, path: '' }
        ]} />

        {/* Header with Back Button and Star Progress */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold text-gray-700">Back</span>
          </button>
          
          <div className="flex items-center gap-2 px-5 py-2 bg-white rounded-xl shadow-md">
            <span className="text-yellow-500 text-xl">⭐</span>
            <span className="text-xl font-bold text-gray-700">{score}/{questions.length}</span>
          </div>
        </div>

        {/* Practice Mode Header */}
        {isPracticeMode && practiceQuestion && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Practice Mode</h2>
                <p className="text-white/90 text-sm">
                  Practicing: <span className="font-semibold text-yellow-300">{getDisplayConcept(chapterId || '')}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full font-bold text-sm uppercase ${getDifficultyBadge(practiceQuestion?.difficulty || 'easy')}`}>
                {practiceQuestion?.difficulty === 'easy' ? '🟢 Easy' : practiceQuestion?.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
              </span>
              <span className="text-white font-bold text-lg">
                {practiceProgress}/3
              </span>
            </div>
          </div>
        )}

        {/* Subject Title and Progress */}
        {!isPracticeMode && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                {quizName}
              </h1>
              <div className="flex items-center gap-3">
                {!loadingQuestions && questions.length > 0 && (
                  <span className={`px-4 py-2 rounded-full font-bold text-sm uppercase shadow-md ${getDifficultyBadge(question?.difficulty || 'easy')}`}>
                    {question?.difficulty === 'easy' ? '🟢 Easy' : question?.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                  </span>
                )}
                <span className="text-lg font-semibold text-[#5B9FD8]">
                  Question {currentQuestion + 1}/{questions.length}
                </span>
              </div>
            </div>
            <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5B9FD8] to-[#4A8BC2] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Timer */}
        {!isPracticeMode && !loadingQuestions && questions.length > 0 && (
          <div className="flex items-center justify-center">
            <div className={`flex items-center gap-3 px-8 py-4 bg-white rounded-2xl shadow-lg transition-all duration-300 ${
              timeLeft < 5 ? 'animate-pulse ring-4 ring-red-300' : timeLeft < 10 ? 'ring-2 ring-orange-300' : ''
            }`}>
              <Timer className={`w-7 h-7 ${
                timeLeft < 5 ? 'text-red-500' : timeLeft < 10 ? 'text-orange-500' : 'text-[#5B9FD8]'
              }`} />
              <span className={`text-4xl font-bold ${
                timeLeft < 5 ? 'text-red-500' : timeLeft < 10 ? 'text-orange-500' : 'text-[#5B9FD8]'
              }`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}

        {/* Loading State for Question Generation */}
        {loadingQuestions && (
          <Card className="p-12 md:p-16 bg-gradient-to-br from-blue-500 to-cyan-500 border-0 shadow-xl rounded-3xl">
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Simple elegant spinner with icon */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
              
              {/* Clean title */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-white">
                  Generating Your Quiz
                </h3>
                <p className="text-white/90 text-base">
                  Creating 5 personalized questions...
                </p>
              </div>
              
              {/* Simple progress indicator */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State for Practice Mode */}
        {loadingPractice && (
          <Card className="p-12 md:p-16 bg-gradient-to-br from-purple-500 to-pink-500 border-0 shadow-xl rounded-3xl">
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Simple elegant spinner with icon */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
              
              {/* Clean title */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-white">
                  Preparing Practice Mode
                </h3>
                <p className="text-white/90 text-base">
                  Generating 3 levels of practice...
                </p>
              </div>
              
              {/* Simple progress indicator */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </Card>
        )}

        {/* Question Card */}
        {!loadingQuestions && !loadingPractice && questions.length > 0 && (
        <Card className="p-8 md:p-12 bg-white border-0 shadow-2xl rounded-3xl">
          <div className="flex items-start gap-4 mb-8">
            <div className="text-5xl flex-shrink-0">🤖</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight pt-2">
              {question.question}
            </h2>
          </div>

          {/* Hint Dropdown - Only in Practice Mode */}
          {isPracticeMode && practiceQuestion && practiceQuestion.hint && (
            <HintDropdown hint={practiceQuestion.hint} />
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = option.correct;
              const showAsCorrect = selectedAnswer !== null && isCorrectOption && !isCorrect;
              
              let buttonStyles = 'bg-[#E8EDF5] hover:bg-[#DDE5F0] border-2 border-transparent';
              
              if (isSelected) {
                if (isCorrect) {
                  buttonStyles = 'bg-[#8DD4B8] border-2 border-[#8DD4B8] quiz-correct-answer';
                } else {
                  buttonStyles = 'bg-[#FFB3C1] border-2 border-[#FF8FA0] quiz-wrong-answer';
                }
              } else if (showAsCorrect) {
                buttonStyles = 'bg-[#8DD4B8]/50 border-2 border-[#8DD4B8]';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedAnswer !== null && isCorrect === true}
                  className={`p-6 md:p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 ${buttonStyles}`}
                >
                  <div className="text-center space-y-2">
                    {option.emoji && <div className="text-4xl md:text-5xl mb-2">{option.emoji}</div>}
                    <div className="text-xl md:text-2xl font-bold text-gray-800">{option.text}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Encouraging Message */}
          {!isCorrect && selectedAnswer !== null && (
            <div className="mt-8 animate-fade-in">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-2xl shadow-lg">
                <p className="text-center text-xl font-bold text-purple-800">{encouragingMsg}</p>
                <p className="text-center text-sm text-purple-600 mt-2">Click another answer to try again!</p>
              </div>
            </div>
          )}
        </Card>
        )}

        {/* Practice Mastery Celebration */}
        {showPracticeMastery && (
          <div className="text-center animate-fade-in">
            <Card className="p-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 border-4 border-white shadow-2xl">
              <div className="space-y-6">
                <div className="text-8xl animate-bounce">🏆</div>
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                  {encouragingMsg}
                </h2>
                <p className="text-2xl text-white/90 font-semibold">
                  Practice session complete! Ready to continue?
                </p>
                <div className="flex items-center justify-center gap-3 text-white text-xl">
                  <span className="text-3xl">⭐</span>
                  <span className="font-bold">Stars Earned!</span>
                </div>
                <Button
                  size="lg"
                  onClick={handleBackToQuiz}
                  className="bg-white text-purple-600 px-12 py-6 rounded-2xl text-xl font-bold hover:scale-110 transition-transform shadow-xl hover:shadow-2xl mt-6"
                >
                  Continue Quiz →
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Next Button */}
        {selectedAnswer !== null && isCorrect && !showPracticeMastery && !isPracticeMode && (
          <div className="text-center animate-fade-in">
            <Button
              size="lg"
              onClick={handleNext}
              className="bg-gradient-to-r from-[#5B9FD8] to-[#4A8BC2] text-white px-12 py-6 rounded-2xl text-xl font-bold hover:scale-110 transition-transform shadow-xl hover:shadow-2xl"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
            </Button>
          </div>
        )}

        <Mascot mood={mascotMood} showMessage={!isCorrect && selectedAnswer !== null} customMessage={encouragingMsg} />
        
        {/* AI Explanation Modal - Only render when needed */}
        {showExplanation && (
          <ExplanationModal
            isOpen={showExplanation}
            onClose={() => {
              setShowExplanation(false);
              setAiExplanation(null);
              setIsLoadingExplanation(false);
            }}
            explanation={aiExplanation}
            correctAnswer={correctAnswerText}
            offerPractice={true}  // Enable practice button
            onStartPractice={handleStartPractice}  // Practice handler
            onContinue={() => {
              setShowExplanation(false);
              setAiExplanation(null);
            }}
            isLoading={isLoadingExplanation}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;