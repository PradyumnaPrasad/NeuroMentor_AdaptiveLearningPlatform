export const subjects = [
  {
    id: 'math',
    name: 'Math Island',
    icon: '🧮',
    description: 'Explore the world of numbers!',
  },
  {
    id: 'science',
    name: 'Science Island',
    icon: '🔬',
    description: 'Discover amazing facts!',
  },
];

export const topics = {
  math: [
    { id: 'counting', name: 'Counting', icon: '🔢', locked: false, difficulty: 'easy' as const, description: 'Learn to count from 1 to 10!' },
    { id: 'addition', name: 'Addition', icon: '➕', locked: false, difficulty: 'easy' as const, description: 'Add numbers together!' },
    { id: 'subtraction', name: 'Subtraction', icon: '➖', locked: false, difficulty: 'medium' as const, description: 'Take away numbers!' },
    { id: 'shapes', name: 'Shapes', icon: '🔷', locked: false, difficulty: 'medium' as const, description: 'Explore circles, squares, and more!' },
  ],
  science: [
    { id: 'plants', name: 'Plants', icon: '🌱', locked: false, difficulty: 'easy' as const, description: 'Learn how plants grow!' },
    { id: 'animals', name: 'Animals', icon: '🐾', locked: false, difficulty: 'easy' as const, description: 'Discover different animals!' },
    { id: 'weather', name: 'Weather', icon: '⛅', locked: false, difficulty: 'medium' as const, description: 'Understand weather patterns!' },
    { id: 'human-body', name: 'Human Body', icon: '🫀', locked: false, difficulty: 'hard' as const, description: 'Explore how our bodies work!' },
  ],
};

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; emoji: string; correct: boolean }[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizData: Record<string, QuizQuestion[]> = {
  counting: [
    {
      id: 1,
      question: 'How many apples are there?',
      options: [
        { text: '2', emoji: '🍎🍎', correct: true },
        { text: '3', emoji: '🍎🍎🍎', correct: false },
        { text: '1', emoji: '🍎', correct: false },
        { text: '4', emoji: '🍎🍎🍎🍎', correct: false },
      ],
      difficulty: 'easy',
    },
    {
      id: 2,
      question: 'Count the stars!',
      options: [
        { text: '5', emoji: '⭐⭐⭐⭐⭐', correct: true },
        { text: '4', emoji: '⭐⭐⭐⭐', correct: false },
        { text: '6', emoji: '⭐⭐⭐⭐⭐⭐', correct: false },
        { text: '3', emoji: '⭐⭐⭐', correct: false },
      ],
      difficulty: 'easy',
    },
    {
      id: 3,
      question: 'How many flowers?',
      options: [
        { text: '7', emoji: '🌸🌸🌸🌸🌸🌸🌸', correct: true },
        { text: '6', emoji: '🌸🌸🌸🌸🌸🌸', correct: false },
        { text: '8', emoji: '🌸🌸🌸🌸🌸🌸🌸🌸', correct: false },
        { text: '5', emoji: '🌸🌸🌸🌸🌸', correct: false },
      ],
      difficulty: 'easy',
    },
  ],
  addition: [
    {
      id: 1,
      question: '2 + 3 = ?',
      options: [
        { text: '5', emoji: '🎈🎈🎈🎈🎈', correct: true },
        { text: '4', emoji: '🎈🎈🎈🎈', correct: false },
        { text: '6', emoji: '🎈🎈🎈🎈🎈🎈', correct: false },
        { text: '3', emoji: '🎈🎈🎈', correct: false },
      ],
      difficulty: 'easy',
    },
  ],
  plants: [
    {
      id: 1,
      question: 'What do plants need to grow?',
      options: [
        { text: 'Water & Sunlight', emoji: '💧☀️', correct: true },
        { text: 'Only toys', emoji: '🧸', correct: false },
        { text: 'Only darkness', emoji: '🌑', correct: false },
        { text: 'Only ice', emoji: '🧊', correct: false },
      ],
      difficulty: 'easy',
    },
  ],
};

export const badges = [
  { id: 'number-ninja', name: 'Number Ninja', icon: '🥷', description: 'Math - Addition complete!', category: 'learning' as const, rarity: 'common' as const },
  { id: 'plant-expert', name: 'Plant Expert', icon: '🌿', description: 'Science - Plants complete!', category: 'learning' as const, rarity: 'common' as const },
  { id: 'star-student', name: 'Star Student', icon: '⭐', description: '10 topics completed!', category: 'special' as const, rarity: 'rare' as const },
  { id: 'speed-learner', name: 'Speed Learner', icon: '⚡', description: 'Quiz completed under time!', category: 'mastery' as const, rarity: 'epic' as const },
  { id: 'math-master', name: 'Math Master', icon: '🎓', description: 'Completed all math topics!', category: 'mastery' as const, rarity: 'legendary' as const },
  { id: 'science-star', name: 'Science Star', icon: '🔬', description: 'Completed all science topics!', category: 'mastery' as const, rarity: 'legendary' as const },
  { id: 'perfect-score', name: 'Perfect Score', icon: '💯', description: 'Got 100% in a quiz!', category: 'mastery' as const, rarity: 'epic' as const },
  { id: 'daily-learner', name: 'Daily Learner', icon: '📅', description: '7 day learning streak!', category: 'streak' as const, rarity: 'rare' as const },
  { id: 'curious-mind', name: 'Curious Mind', icon: '🧠', description: 'Completed 5 different topics!', category: 'learning' as const, rarity: 'common' as const },
  { id: 'super-streak', name: 'Super Streak', icon: '🔥', description: '30 day learning streak!', category: 'streak' as const, rarity: 'legendary' as const },
  { id: 'quiz-champion', name: 'Quiz Champion', icon: '🏆', description: 'Perfect score on 10 quizzes!', category: 'mastery' as const, rarity: 'epic' as const },
  { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Completed quiz before 9 AM!', category: 'special' as const, rarity: 'rare' as const },
];

