// NCERT-based Quiz Data for Classes 1, 2, and 3
// Each subject has chapters, and each chapter has 5 quiz sets with 5 questions each

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; emoji?: string; correct: boolean }[];
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface QuizSet {
  id: string;
  name: string;
  questions: QuizQuestion[];
}

export interface Chapter {
  id: string;
  name: string;
  icon: string;
  description: string;
  quizSets: QuizSet[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SubjectData {
  [key: string]: Chapter[];
}

export interface ClassData {
  math: Chapter[];
  science: Chapter[];
}

// ========================
// CLASS 1 - MATHS CHAPTERS
// ========================
const class1MathsChapters: Chapter[] = [
  {
    id: 'class1-math-shapes-and-space',
    name: 'Shapes and Space',
    icon: '🔷',
    description: 'Learn about different shapes around us!',
    difficulty: 'easy',
    quizSets: [
      {
        id: 'shapes-quiz-1',
        name: 'Quiz 1: Basic Shapes',
        questions: [
          {
            id: 1,
            question: 'Which shape has 3 sides?',
            options: [
              { text: 'Triangle', emoji: '🔺', correct: true },
              { text: 'Circle', emoji: '⚪', correct: false },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Rectangle', emoji: '🟪', correct: false },
            ],
            difficulty: 'easy',
            explanation: 'A triangle has 3 sides and 3 corners!'
          },
          {
            id: 2,
            question: 'Which shape is round?',
            options: [
              { text: 'Circle', emoji: '⚪', correct: true },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'How many corners does a square have?',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '2', emoji: '②', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which shape looks like a ball?',
            options: [
              { text: 'Circle', emoji: '⚽', correct: true },
              { text: 'Square', emoji: '📦', correct: false },
              { text: 'Triangle', emoji: '⛺', correct: false },
              { text: 'Rectangle', emoji: '📱', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which shape has 4 equal sides?',
            options: [
              { text: 'Square', emoji: '🟦', correct: true },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Circle', emoji: '⚪', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'shapes-quiz-2',
        name: 'Quiz 2: Shape Recognition',
        questions: [
          {
            id: 1,
            question: 'A door looks like which shape?',
            options: [
              { text: 'Rectangle', emoji: '🚪', correct: true },
              { text: 'Circle', emoji: '⚪', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'A pizza slice is which shape?',
            options: [
              { text: 'Triangle', emoji: '🍕', correct: true },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Circle', emoji: '⚪', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which has no corners?',
            options: [
              { text: 'Circle', emoji: '⚪', correct: true },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Rectangle', emoji: '🟪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'A book looks like which shape?',
            options: [
              { text: 'Rectangle', emoji: '📖', correct: true },
              { text: 'Circle', emoji: '⚪', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'How many sides does a rectangle have?',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '0', emoji: '⓪', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'shapes-quiz-3',
        name: 'Quiz 3: Shapes in Nature',
        questions: [
          {
            id: 1,
            question: 'The sun looks like which shape?',
            options: [
              { text: 'Circle', emoji: '☀️', correct: true },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'A roof looks like which shape?',
            options: [
              { text: 'Triangle', emoji: '🏠', correct: true },
              { text: 'Circle', emoji: '⚪', correct: false },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Rectangle', emoji: '🟪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'A clock is which shape?',
            options: [
              { text: 'Circle', emoji: '🕐', correct: true },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'A window is usually which shape?',
            options: [
              { text: 'Rectangle or Square', emoji: '🪟', correct: true },
              { text: 'Circle', emoji: '⚪', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Heart', emoji: '❤️', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'An egg is which shape?',
            options: [
              { text: 'Oval', emoji: '🥚', correct: true },
              { text: 'Square', emoji: '🟦', correct: false },
              { text: 'Triangle', emoji: '🔺', correct: false },
              { text: 'Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'shapes-quiz-4',
        name: 'Quiz 4: Counting Shapes',
        questions: [
          {
            id: 1,
            question: 'How many circles are here? ⚪⚪⚪',
            options: [
              { text: '3', emoji: '③', correct: true },
              { text: '2', emoji: '②', correct: false },
              { text: '4', emoji: '④', correct: false },
              { text: '5', emoji: '⑤', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'How many triangles? 🔺🔺',
            options: [
              { text: '2', emoji: '②', correct: true },
              { text: '1', emoji: '①', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '4', emoji: '④', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'How many squares? 🟦🟦🟦🟦',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '2', emoji: '②', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Count the stars: ⭐⭐⭐⭐⭐',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
              { text: '3', emoji: '③', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'How many hearts? ❤️',
            options: [
              { text: '1', emoji: '①', correct: true },
              { text: '2', emoji: '②', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '0', emoji: '⓪', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'shapes-quiz-5',
        name: 'Quiz 5: Shape Colors',
        questions: [
          {
            id: 1,
            question: 'Which is a red circle?',
            options: [
              { text: 'Red Circle', emoji: '🔴', correct: true },
              { text: 'Blue Square', emoji: '🟦', correct: false },
              { text: 'Yellow Star', emoji: '⭐', correct: false },
              { text: 'Green Triangle', emoji: '🔺', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Which is a blue square?',
            options: [
              { text: 'Blue Square', emoji: '🟦', correct: true },
              { text: 'Red Circle', emoji: '🔴', correct: false },
              { text: 'Yellow Star', emoji: '⭐', correct: false },
              { text: 'Green Heart', emoji: '💚', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'What color is this circle? 🟢',
            options: [
              { text: 'Green', emoji: '🟢', correct: true },
              { text: 'Red', emoji: '🔴', correct: false },
              { text: 'Blue', emoji: '🔵', correct: false },
              { text: 'Yellow', emoji: '🟡', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which is a yellow star?',
            options: [
              { text: 'Yellow Star', emoji: '⭐', correct: true },
              { text: 'Red Circle', emoji: '🔴', correct: false },
              { text: 'Blue Square', emoji: '🟦', correct: false },
              { text: 'Green Triangle', emoji: '🔺', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'What shape is this? 🟣',
            options: [
              { text: 'Purple Circle', emoji: '🟣', correct: true },
              { text: 'Red Square', emoji: '🟥', correct: false },
              { text: 'Blue Triangle', emoji: '🔵', correct: false },
              { text: 'Yellow Star', emoji: '⭐', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
    ],
  },
  {
    id: 'class1-math-numbers-from-1-to-9',
    name: 'Numbers from 1 to 9',
    icon: '🔢',
    description: 'Learn to count and recognize numbers!',
    difficulty: 'easy',
    quizSets: [
      {
        id: 'numbers-quiz-1',
        name: 'Quiz 1: Counting Objects',
        questions: [
          {
            id: 1,
            question: 'How many apples? 🍎🍎🍎',
            options: [
              { text: '3', emoji: '③', correct: true },
              { text: '2', emoji: '②', correct: false },
              { text: '4', emoji: '④', correct: false },
              { text: '5', emoji: '⑤', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Count the balloons: 🎈🎈🎈🎈🎈',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
              { text: '3', emoji: '③', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'How many flowers? 🌸🌸',
            options: [
              { text: '2', emoji: '②', correct: true },
              { text: '1', emoji: '①', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '4', emoji: '④', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Count the stars: ⭐',
            options: [
              { text: '1', emoji: '①', correct: true },
              { text: '2', emoji: '②', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '0', emoji: '⓪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'How many cars? 🚗🚗🚗🚗',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '2', emoji: '②', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'numbers-quiz-2',
        name: 'Quiz 2: Number Recognition',
        questions: [
          {
            id: 1,
            question: 'Which number comes after 3?',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '2', emoji: '②', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Which number comes before 5?',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '6', emoji: '⑥', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'What number is this? 7',
            options: [
              { text: 'Seven', emoji: '⑦', correct: true },
              { text: 'Six', emoji: '⑥', correct: false },
              { text: 'Eight', emoji: '⑧', correct: false },
              { text: 'Nine', emoji: '⑨', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which is the biggest number? 2, 5, 3, 8',
            options: [
              { text: '8', emoji: '⑧', correct: true },
              { text: '5', emoji: '⑤', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '2', emoji: '②', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which is the smallest number? 4, 1, 6, 3',
            options: [
              { text: '1', emoji: '①', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'numbers-quiz-3',
        name: 'Quiz 3: Number Order',
        questions: [
          {
            id: 1,
            question: 'What comes between 4 and 6?',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
              { text: '7', emoji: '⑦', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'What comes after 8?',
            options: [
              { text: '9', emoji: '⑨', correct: true },
              { text: '7', emoji: '⑦', correct: false },
              { text: '8', emoji: '⑧', correct: false },
              { text: '10', emoji: '⑩', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'What comes before 2?',
            options: [
              { text: '1', emoji: '①', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '2', emoji: '②', correct: false },
              { text: '0', emoji: '⓪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Count: 1, 2, 3, __, 5',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '6', emoji: '⑥', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Count: 5, 6, __, 8, 9',
            options: [
              { text: '7', emoji: '⑦', correct: true },
              { text: '6', emoji: '⑥', correct: false },
              { text: '8', emoji: '⑧', correct: false },
              { text: '5', emoji: '⑤', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'numbers-quiz-4',
        name: 'Quiz 4: Simple Addition',
        questions: [
          {
            id: 1,
            question: '1 + 1 = ?',
            options: [
              { text: '2', emoji: '②', correct: true },
              { text: '1', emoji: '①', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '0', emoji: '⓪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: '2 + 1 = ?',
            options: [
              { text: '3', emoji: '③', correct: true },
              { text: '2', emoji: '②', correct: false },
              { text: '4', emoji: '④', correct: false },
              { text: '1', emoji: '①', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: '3 + 2 = ?',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
              { text: '3', emoji: '③', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: '4 + 1 = ?',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
              { text: '3', emoji: '③', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: '2 + 2 = ?',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '2', emoji: '②', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'numbers-quiz-5',
        name: 'Quiz 5: Number Fun',
        questions: [
          {
            id: 1,
            question: 'How many fingers on one hand? ✋',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
              { text: '3', emoji: '③', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'How many eyes do you have? 👀',
            options: [
              { text: '2', emoji: '②', correct: true },
              { text: '1', emoji: '①', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '4', emoji: '④', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'How many legs does a dog have? 🐕',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '2', emoji: '②', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '5', emoji: '⑤', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'How many wheels on a bicycle? 🚲',
            options: [
              { text: '2', emoji: '②', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '4', emoji: '④', correct: false },
              { text: '1', emoji: '①', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'How many sides on a triangle? 🔺',
            options: [
              { text: '3', emoji: '③', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '2', emoji: '②', correct: false },
              { text: '5', emoji: '⑤', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
    ],
  },
];

// ========================
// CLASS 1 - SCIENCE CHAPTERS
// ========================
const class1ScienceChapters: Chapter[] = [
  {
    id: 'class1-science-living-and-non-living',
    name: 'Living and Non-Living Things',
    icon: '🌱',
    description: 'Learn about things that are alive and not alive!',
    difficulty: 'easy',
    quizSets: [
      {
        id: 'living-quiz-1',
        name: 'Quiz 1: What is Living?',
        questions: [
          {
            id: 1,
            question: 'Which one is a living thing?',
            options: [
              { text: 'Tree', emoji: '🌳', correct: true },
              { text: 'Rock', emoji: '🪨', correct: false },
              { text: 'Chair', emoji: '🪑', correct: false },
              { text: 'Book', emoji: '📚', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Which one can grow?',
            options: [
              { text: 'Plant', emoji: '🌱', correct: true },
              { text: 'Stone', emoji: '🪨', correct: false },
              { text: 'Toy', emoji: '🧸', correct: false },
              { text: 'Table', emoji: '🪑', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which one needs food?',
            options: [
              { text: 'Dog', emoji: '🐕', correct: true },
              { text: 'Ball', emoji: '⚽', correct: false },
              { text: 'Car', emoji: '🚗', correct: false },
              { text: 'Pencil', emoji: '✏️', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which one can move on its own?',
            options: [
              { text: 'Cat', emoji: '🐱', correct: true },
              { text: 'Chair', emoji: '🪑', correct: false },
              { text: 'Book', emoji: '📖', correct: false },
              { text: 'Cup', emoji: '🥤', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which is NOT a living thing?',
            options: [
              { text: 'Rock', emoji: '🪨', correct: true },
              { text: 'Bird', emoji: '🐦', correct: false },
              { text: 'Fish', emoji: '🐟', correct: false },
              { text: 'Flower', emoji: '🌸', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'living-quiz-2',
        name: 'Quiz 2: Living Things Around Us',
        questions: [
          {
            id: 1,
            question: 'Which animal lives in water?',
            options: [
              { text: 'Fish', emoji: '🐟', correct: true },
              { text: 'Cat', emoji: '🐱', correct: false },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Bird', emoji: '🐦', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Which can fly?',
            options: [
              { text: 'Bird', emoji: '🐦', correct: true },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Fish', emoji: '🐟', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which gives us milk?',
            options: [
              { text: 'Cow', emoji: '🐄', correct: true },
              { text: 'Hen', emoji: '🐔', correct: false },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which has a tail?',
            options: [
              { text: 'Dog', emoji: '🐕', correct: true },
              { text: 'Tree', emoji: '🌳', correct: false },
              { text: 'Rock', emoji: '🪨', correct: false },
              { text: 'Book', emoji: '📚', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which gives us eggs?',
            options: [
              { text: 'Hen', emoji: '🐔', correct: true },
              { text: 'Cow', emoji: '🐄', correct: false },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'living-quiz-3',
        name: 'Quiz 3: Plants are Living',
        questions: [
          {
            id: 1,
            question: 'What do plants need to grow?',
            options: [
              { text: 'Water and Sunlight', emoji: '💧☀️', correct: true },
              { text: 'Toys', emoji: '🧸', correct: false },
              { text: 'Books', emoji: '📚', correct: false },
              { text: 'Stones', emoji: '🪨', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Which part of plant is in soil?',
            options: [
              { text: 'Root', emoji: '🌱', correct: true },
              { text: 'Leaf', emoji: '🍃', correct: false },
              { text: 'Flower', emoji: '🌸', correct: false },
              { text: 'Fruit', emoji: '🍎', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which gives us fruits?',
            options: [
              { text: 'Tree', emoji: '🌳', correct: true },
              { text: 'Rock', emoji: '🪨', correct: false },
              { text: 'Car', emoji: '🚗', correct: false },
              { text: 'Chair', emoji: '🪑', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'What color are most leaves?',
            options: [
              { text: 'Green', emoji: '🍃', correct: true },
              { text: 'Red', emoji: '🔴', correct: false },
              { text: 'Blue', emoji: '🔵', correct: false },
              { text: 'Yellow', emoji: '🟡', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which is a flower?',
            options: [
              { text: 'Rose', emoji: '🌹', correct: true },
              { text: 'Stone', emoji: '🪨', correct: false },
              { text: 'Ball', emoji: '⚽', correct: false },
              { text: 'Book', emoji: '📚', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'living-quiz-4',
        name: 'Quiz 4: Animals Around Us',
        questions: [
          {
            id: 1,
            question: 'Which animal barks?',
            options: [
              { text: 'Dog', emoji: '🐕', correct: true },
              { text: 'Cat', emoji: '🐱', correct: false },
              { text: 'Cow', emoji: '🐄', correct: false },
              { text: 'Bird', emoji: '🐦', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Which animal says "meow"?',
            options: [
              { text: 'Cat', emoji: '🐱', correct: true },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cow', emoji: '🐄', correct: false },
              { text: 'Hen', emoji: '🐔', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which animal has a long trunk?',
            options: [
              { text: 'Elephant', emoji: '🐘', correct: true },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
              { text: 'Bird', emoji: '🐦', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which has wings?',
            options: [
              { text: 'Bird', emoji: '🐦', correct: true },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Fish', emoji: '🐟', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which lives in a nest?',
            options: [
              { text: 'Bird', emoji: '🐦', correct: true },
              { text: 'Fish', emoji: '🐟', correct: false },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cow', emoji: '🐄', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'living-quiz-5',
        name: 'Quiz 5: Non-Living Things',
        questions: [
          {
            id: 1,
            question: 'Which CANNOT grow?',
            options: [
              { text: 'Toy', emoji: '🧸', correct: true },
              { text: 'Plant', emoji: '🌱', correct: false },
              { text: 'Animal', emoji: '🐕', correct: false },
              { text: 'Tree', emoji: '🌳', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Which does NOT need food?',
            options: [
              { text: 'Chair', emoji: '🪑', correct: true },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
              { text: 'Plant', emoji: '🌱', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which is made by humans?',
            options: [
              { text: 'Car', emoji: '🚗', correct: true },
              { text: 'Tree', emoji: '🌳', correct: false },
              { text: 'Bird', emoji: '🐦', correct: false },
              { text: 'Flower', emoji: '🌸', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which cannot move by itself?',
            options: [
              { text: 'Ball', emoji: '⚽', correct: true },
              { text: 'Cat', emoji: '🐱', correct: false },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Bird', emoji: '🐦', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which is non-living?',
            options: [
              { text: 'Book', emoji: '📚', correct: true },
              { text: 'Fish', emoji: '🐟', correct: false },
              { text: 'Plant', emoji: '🌱', correct: false },
              { text: 'Butterfly', emoji: '🦋', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
    ],
  },
  {
    id: 'class1-science-my-body',
    name: 'My Body',
    icon: '👤',
    description: 'Learn about different parts of your body!',
    difficulty: 'easy',
    quizSets: [
      {
        id: 'body-quiz-1',
        name: 'Quiz 1: Body Parts',
        questions: [
          {
            id: 1,
            question: 'What do we see with?',
            options: [
              { text: 'Eyes', emoji: '👀', correct: true },
              { text: 'Ears', emoji: '👂', correct: false },
              { text: 'Nose', emoji: '👃', correct: false },
              { text: 'Mouth', emoji: '👄', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'What do we hear with?',
            options: [
              { text: 'Ears', emoji: '👂', correct: true },
              { text: 'Eyes', emoji: '👀', correct: false },
              { text: 'Nose', emoji: '👃', correct: false },
              { text: 'Mouth', emoji: '👄', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'What do we smell with?',
            options: [
              { text: 'Nose', emoji: '👃', correct: true },
              { text: 'Eyes', emoji: '👀', correct: false },
              { text: 'Ears', emoji: '👂', correct: false },
              { text: 'Hands', emoji: '✋', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'What do we eat with?',
            options: [
              { text: 'Mouth', emoji: '👄', correct: true },
              { text: 'Nose', emoji: '👃', correct: false },
              { text: 'Eyes', emoji: '👀', correct: false },
              { text: 'Ears', emoji: '👂', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'What do we walk with?',
            options: [
              { text: 'Legs', emoji: '🦵', correct: true },
              { text: 'Arms', emoji: '💪', correct: false },
              { text: 'Head', emoji: '🧠', correct: false },
              { text: 'Hands', emoji: '✋', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'body-quiz-2',
        name: 'Quiz 2: Five Senses',
        questions: [
          {
            id: 1,
            question: 'How many eyes do you have?',
            options: [
              { text: '2', emoji: '②', correct: true },
              { text: '1', emoji: '①', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '4', emoji: '④', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'How many ears do you have?',
            options: [
              { text: '2', emoji: '②', correct: true },
              { text: '1', emoji: '①', correct: false },
              { text: '3', emoji: '③', correct: false },
              { text: '4', emoji: '④', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which sense helps you see colors?',
            options: [
              { text: 'Sight', emoji: '👁️', correct: true },
              { text: 'Hearing', emoji: '👂', correct: false },
              { text: 'Smell', emoji: '👃', correct: false },
              { text: 'Taste', emoji: '👅', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which helps you taste food?',
            options: [
              { text: 'Tongue', emoji: '👅', correct: true },
              { text: 'Nose', emoji: '👃', correct: false },
              { text: 'Eyes', emoji: '👀', correct: false },
              { text: 'Ears', emoji: '👂', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which helps you feel things?',
            options: [
              { text: 'Skin/Hands', emoji: '✋', correct: true },
              { text: 'Eyes', emoji: '👀', correct: false },
              { text: 'Ears', emoji: '👂', correct: false },
              { text: 'Nose', emoji: '👃', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'body-quiz-3',
        name: 'Quiz 3: Taking Care of Body',
        questions: [
          {
            id: 1,
            question: 'What should you do every day?',
            options: [
              { text: 'Take a bath', emoji: '🛁', correct: true },
              { text: 'Skip meals', emoji: '🚫', correct: false },
              { text: 'Stay dirty', emoji: '😷', correct: false },
              { text: 'Not sleep', emoji: '😴', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'How many times should you brush teeth?',
            options: [
              { text: 'Twice a day', emoji: '🪥', correct: true },
              { text: 'Once a week', emoji: '📅', correct: false },
              { text: 'Never', emoji: '🚫', correct: false },
              { text: 'Once a month', emoji: '📆', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'What helps you stay strong?',
            options: [
              { text: 'Healthy food', emoji: '🥗', correct: true },
              { text: 'Junk food only', emoji: '🍔', correct: false },
              { text: 'No food', emoji: '🚫', correct: false },
              { text: 'Only sweets', emoji: '🍭', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'When should you wash hands?',
            options: [
              { text: 'Before eating', emoji: '🍽️', correct: true },
              { text: 'Never', emoji: '🚫', correct: false },
              { text: 'Once a week', emoji: '📅', correct: false },
              { text: 'After playing in mud only', emoji: '🤷', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Why should you sleep?',
            options: [
              { text: 'To rest and grow', emoji: '😴', correct: true },
              { text: 'To waste time', emoji: '⏰', correct: false },
              { text: 'Because we are lazy', emoji: '😪', correct: false },
              { text: 'No reason', emoji: '🤷', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'body-quiz-4',
        name: 'Quiz 4: Body Functions',
        questions: [
          {
            id: 1,
            question: 'What helps you breathe?',
            options: [
              { text: 'Nose', emoji: '👃', correct: true },
              { text: 'Eyes', emoji: '👀', correct: false },
              { text: 'Ears', emoji: '👂', correct: false },
              { text: 'Hands', emoji: '✋', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'What helps you think?',
            options: [
              { text: 'Brain', emoji: '🧠', correct: true },
              { text: 'Stomach', emoji: '🫃', correct: false },
              { text: 'Legs', emoji: '🦵', correct: false },
              { text: 'Arms', emoji: '💪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which pumps blood in body?',
            options: [
              { text: 'Heart', emoji: '❤️', correct: true },
              { text: 'Brain', emoji: '🧠', correct: false },
              { text: 'Stomach', emoji: '🫃', correct: false },
              { text: 'Lungs', emoji: '🫁', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'What do you use to hold things?',
            options: [
              { text: 'Hands', emoji: '✋', correct: true },
              { text: 'Legs', emoji: '🦵', correct: false },
              { text: 'Head', emoji: '🧠', correct: false },
              { text: 'Stomach', emoji: '🫃', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'How many fingers on one hand?',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '6', emoji: '⑥', correct: false },
              { text: '3', emoji: '③', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
      {
        id: 'body-quiz-5',
        name: 'Quiz 5: Healthy Habits',
        questions: [
          {
            id: 1,
            question: 'What should you drink daily?',
            options: [
              { text: 'Water', emoji: '💧', correct: true },
              { text: 'Only juice', emoji: '🧃', correct: false },
              { text: 'Only soda', emoji: '🥤', correct: false },
              { text: 'Nothing', emoji: '🚫', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'What is good exercise?',
            options: [
              { text: 'Playing outside', emoji: '⚽', correct: true },
              { text: 'Watching TV all day', emoji: '📺', correct: false },
              { text: 'Sleeping all day', emoji: '😴', correct: false },
              { text: 'Sitting only', emoji: '🪑', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'What should you eat for strong bones?',
            options: [
              { text: 'Milk', emoji: '🥛', correct: true },
              { text: 'Only chips', emoji: '🍟', correct: false },
              { text: 'Only candy', emoji: '🍬', correct: false },
              { text: 'Only ice cream', emoji: '🍦', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Why should you eat fruits?',
            options: [
              { text: 'They are healthy', emoji: '🍎', correct: true },
              { text: 'They are colorful only', emoji: '🎨', correct: false },
              { text: 'No reason', emoji: '🤷', correct: false },
              { text: 'To waste money', emoji: '💰', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'What keeps you clean?',
            options: [
              { text: 'Taking a bath', emoji: '🛁', correct: true },
              { text: 'Playing in mud', emoji: '🏞️', correct: false },
              { text: 'Not washing', emoji: '🚫', correct: false },
              { text: 'Wearing dirty clothes', emoji: '👕', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
    ],
  },
];

// ========================
// CLASS 2 - MATHS CHAPTERS
// ========================
const class2MathsChapters: Chapter[] = [
  {
    id: 'class2-math-numbers-up-to-100',
    name: 'Numbers up to 100',
    icon: '💯',
    description: 'Learn numbers from 1 to 100!',
    difficulty: 'easy',
    quizSets: [
      // Quiz sets would be similar structure with 5 quizzes, 5 questions each
      // Simplified for brevity - you can expand later
      {
        id: 'num100-quiz-1',
        name: 'Quiz 1: Counting to 100',
        questions: [
          {
            id: 1,
            question: 'What comes after 49?',
            options: [
              { text: '50', emoji: '⑤⓪', correct: true },
              { text: '48', emoji: '④⑧', correct: false },
              { text: '51', emoji: '⑤①', correct: false },
              { text: '40', emoji: '④⓪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: '10 + 10 = ?',
            options: [
              { text: '20', emoji: '②⓪', correct: true },
              { text: '10', emoji: '①⓪', correct: false },
              { text: '30', emoji: '③⓪', correct: false },
              { text: '15', emoji: '①⑤', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'What is 5 + 7?',
            options: [
              { text: '12', emoji: '①②', correct: true },
              { text: '11', emoji: '①①', correct: false },
              { text: '13', emoji: '①③', correct: false },
              { text: '10', emoji: '①⓪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Count: 10, 20, 30, __?',
            options: [
              { text: '40', emoji: '④⓪', correct: true },
              { text: '50', emoji: '⑤⓪', correct: false },
              { text: '35', emoji: '③⑤', correct: false },
              { text: '30', emoji: '③⓪', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'What is 15 - 5?',
            options: [
              { text: '10', emoji: '①⓪', correct: true },
              { text: '20', emoji: '②⓪', correct: false },
              { text: '5', emoji: '⑤', correct: false },
              { text: '15', emoji: '①⑤', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
    ],
  },
  {
    id: 'class2-math-addition-subtraction',
    name: 'Addition and Subtraction',
    icon: '➕➖',
    description: 'Master adding and subtracting numbers!',
    difficulty: 'medium',
    quizSets: [
      {
        id: 'addsub-quiz-1',
        name: 'Quiz 1: Simple Addition',
        questions: [
          {
            id: 1,
            question: '25 + 15 = ?',
            options: [
              { text: '40', emoji: '④⓪', correct: true },
              { text: '30', emoji: '③⓪', correct: false },
              { text: '50', emoji: '⑤⓪', correct: false },
              { text: '35', emoji: '③⑤', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 2,
            question: '12 + 18 = ?',
            options: [
              { text: '30', emoji: '③⓪', correct: true },
              { text: '20', emoji: '②⓪', correct: false },
              { text: '28', emoji: '②⑧', correct: false },
              { text: '25', emoji: '②⑤', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 3,
            question: '40 - 15 = ?',
            options: [
              { text: '25', emoji: '②⑤', correct: true },
              { text: '20', emoji: '②⓪', correct: false },
              { text: '30', emoji: '③⓪', correct: false },
              { text: '35', emoji: '③⑤', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 4,
            question: '50 - 20 = ?',
            options: [
              { text: '30', emoji: '③⓪', correct: true },
              { text: '40', emoji: '④⓪', correct: false },
              { text: '20', emoji: '②⓪', correct: false },
              { text: '25', emoji: '②⑤', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 5,
            question: '23 + 7 = ?',
            options: [
              { text: '30', emoji: '③⓪', correct: true },
              { text: '25', emoji: '②⑤', correct: false },
              { text: '27', emoji: '②⑦', correct: false },
              { text: '35', emoji: '③⑤', correct: false },
            ],
            difficulty: 'medium',
          },
        ],
      },
    ],
  },
];

// ========================
// CLASS 2 - SCIENCE CHAPTERS
// ========================
const class2ScienceChapters: Chapter[] = [
  {
    id: 'class2-science-plants-around-us',
    name: 'Plants Around Us',
    icon: '🌿',
    description: 'Discover different types of plants!',
    difficulty: 'easy',
    quizSets: [
      {
        id: 'plants2-quiz-1',
        name: 'Quiz 1: Types of Plants',
        questions: [
          {
            id: 1,
            question: 'Which is a tree?',
            options: [
              { text: 'Mango', emoji: '🥭', correct: true },
              { text: 'Rose', emoji: '🌹', correct: false },
              { text: 'Grass', emoji: '🌾', correct: false },
              { text: 'Tomato', emoji: '🍅', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'What do plants give us?',
            options: [
              { text: 'Oxygen', emoji: '💨', correct: true },
              { text: 'Plastic', emoji: '🥤', correct: false },
              { text: 'Metal', emoji: '⚙️', correct: false },
              { text: 'Glass', emoji: '🪟', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which plant gives us potatoes?',
            options: [
              { text: 'Potato plant', emoji: '🥔', correct: true },
              { text: 'Mango tree', emoji: '🥭', correct: false },
              { text: 'Rose plant', emoji: '🌹', correct: false },
              { text: 'Grass', emoji: '🌾', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Where do plants make food?',
            options: [
              { text: 'Leaves', emoji: '🍃', correct: true },
              { text: 'Roots', emoji: '🌱', correct: false },
              { text: 'Flowers', emoji: '🌸', correct: false },
              { text: 'Stem', emoji: '🌿', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'What color is chlorophyll?',
            options: [
              { text: 'Green', emoji: '🟢', correct: true },
              { text: 'Red', emoji: '🔴', correct: false },
              { text: 'Blue', emoji: '🔵', correct: false },
              { text: 'Yellow', emoji: '🟡', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
    ],
  },
  {
    id: 'class2-science-animals',
    name: 'Animals and Their Homes',
    icon: '🐾',
    description: 'Learn about animals and where they live!',
    difficulty: 'easy',
    quizSets: [
      {
        id: 'animals2-quiz-1',
        name: 'Quiz 1: Animal Homes',
        questions: [
          {
            id: 1,
            question: 'Where does a lion live?',
            options: [
              { text: 'Den', emoji: '🦁', correct: true },
              { text: 'Nest', emoji: '🪹', correct: false },
              { text: 'Pond', emoji: '🏞️', correct: false },
              { text: 'Stable', emoji: '🐴', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 2,
            question: 'Where does a bird live?',
            options: [
              { text: 'Nest', emoji: '🪹', correct: true },
              { text: 'Den', emoji: '🦁', correct: false },
              { text: 'Pond', emoji: '🏞️', correct: false },
              { text: 'Burrow', emoji: '🕳️', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 3,
            question: 'Which animal lives in water?',
            options: [
              { text: 'Fish', emoji: '🐟', correct: true },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
              { text: 'Cow', emoji: '🐄', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 4,
            question: 'Which is a pet animal?',
            options: [
              { text: 'Dog', emoji: '🐕', correct: true },
              { text: 'Lion', emoji: '🦁', correct: false },
              { text: 'Tiger', emoji: '🐅', correct: false },
              { text: 'Elephant', emoji: '🐘', correct: false },
            ],
            difficulty: 'easy',
          },
          {
            id: 5,
            question: 'Which animal gives us wool?',
            options: [
              { text: 'Sheep', emoji: '🐑', correct: true },
              { text: 'Cow', emoji: '🐄', correct: false },
              { text: 'Dog', emoji: '🐕', correct: false },
              { text: 'Cat', emoji: '🐱', correct: false },
            ],
            difficulty: 'easy',
          },
        ],
      },
    ],
  },
];

// ========================
// CLASS 3 - MATHS CHAPTERS
// ========================
const class3MathsChapters: Chapter[] = [
  {
    id: 'class3-math-multiplication',
    name: 'Multiplication',
    icon: '✖️',
    description: 'Learn multiplication tables!',
    difficulty: 'medium',
    quizSets: [
      {
        id: 'mult-quiz-1',
        name: 'Quiz 1: Tables 2 to 5',
        questions: [
          {
            id: 1,
            question: '2 × 5 = ?',
            options: [
              { text: '10', emoji: '①⓪', correct: true },
              { text: '7', emoji: '⑦', correct: false },
              { text: '12', emoji: '①②', correct: false },
              { text: '8', emoji: '⑧', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 2,
            question: '3 × 4 = ?',
            options: [
              { text: '12', emoji: '①②', correct: true },
              { text: '7', emoji: '⑦', correct: false },
              { text: '10', emoji: '①⓪', correct: false },
              { text: '15', emoji: '①⑤', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 3,
            question: '5 × 3 = ?',
            options: [
              { text: '15', emoji: '①⑤', correct: true },
              { text: '12', emoji: '①②', correct: false },
              { text: '10', emoji: '①⓪', correct: false },
              { text: '20', emoji: '②⓪', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 4,
            question: '4 × 4 = ?',
            options: [
              { text: '16', emoji: '①⑥', correct: true },
              { text: '12', emoji: '①②', correct: false },
              { text: '20', emoji: '②⓪', correct: false },
              { text: '14', emoji: '①④', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 5,
            question: '5 × 5 = ?',
            options: [
              { text: '25', emoji: '②⑤', correct: true },
              { text: '20', emoji: '②⓪', correct: false },
              { text: '30', emoji: '③⓪', correct: false },
              { text: '15', emoji: '①⑤', correct: false },
            ],
            difficulty: 'medium',
          },
        ],
      },
    ],
  },
  {
    id: 'class3-math-division',
    name: 'Division',
    icon: '➗',
    description: 'Learn to divide numbers!',
    difficulty: 'medium',
    quizSets: [
      {
        id: 'div-quiz-1',
        name: 'Quiz 1: Simple Division',
        questions: [
          {
            id: 1,
            question: '10 ÷ 2 = ?',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '2', emoji: '②', correct: false },
              { text: '8', emoji: '⑧', correct: false },
              { text: '12', emoji: '①②', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 2,
            question: '15 ÷ 3 = ?',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '12', emoji: '①②', correct: false },
              { text: '18', emoji: '①⑧', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 3,
            question: '20 ÷ 4 = ?',
            options: [
              { text: '5', emoji: '⑤', correct: true },
              { text: '4', emoji: '④', correct: false },
              { text: '16', emoji: '①⑥', correct: false },
              { text: '24', emoji: '②④', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 4,
            question: '12 ÷ 3 = ?',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '3', emoji: '③', correct: false },
              { text: '9', emoji: '⑨', correct: false },
              { text: '15', emoji: '①⑤', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 5,
            question: '16 ÷ 4 = ?',
            options: [
              { text: '4', emoji: '④', correct: true },
              { text: '12', emoji: '①②', correct: false },
              { text: '20', emoji: '②⓪', correct: false },
              { text: '8', emoji: '⑧', correct: false },
            ],
            difficulty: 'medium',
          },
        ],
      },
    ],
  },
];

// ========================
// CLASS 3 - SCIENCE CHAPTERS
// ========================
const class3ScienceChapters: Chapter[] = [
  {
    id: 'class3-science-water',
    name: 'Water',
    icon: '💧',
    description: 'Learn about water and its importance!',
    difficulty: 'medium',
    quizSets: [
      {
        id: 'water-quiz-1',
        name: 'Quiz 1: States of Water',
        questions: [
          {
            id: 1,
            question: 'What happens when water freezes?',
            options: [
              { text: 'Becomes ice', emoji: '🧊', correct: true },
              { text: 'Becomes steam', emoji: '💨', correct: false },
              { text: 'Disappears', emoji: '🚫', correct: false },
              { text: 'Becomes hot', emoji: '🔥', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 2,
            question: 'What happens when water boils?',
            options: [
              { text: 'Becomes steam', emoji: '💨', correct: true },
              { text: 'Becomes ice', emoji: '🧊', correct: false },
              { text: 'Becomes cold', emoji: '❄️', correct: false },
              { text: 'Nothing', emoji: '🚫', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 3,
            question: 'Which is a source of water?',
            options: [
              { text: 'River', emoji: '🏞️', correct: true },
              { text: 'Rock', emoji: '🪨', correct: false },
              { text: 'Tree', emoji: '🌳', correct: false },
              { text: 'Fire', emoji: '🔥', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 4,
            question: 'What is rainwater?',
            options: [
              { text: 'Fresh water', emoji: '💧', correct: true },
              { text: 'Salt water', emoji: '🧂', correct: false },
              { text: 'Dirty water', emoji: '🚫', correct: false },
              { text: 'Hot water', emoji: '🔥', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 5,
            question: 'Why should we save water?',
            options: [
              { text: 'It is precious', emoji: '💎', correct: true },
              { text: 'It is cheap', emoji: '💰', correct: false },
              { text: 'For fun', emoji: '😄', correct: false },
              { text: 'No reason', emoji: '🤷', correct: false },
            ],
            difficulty: 'medium',
          },
        ],
      },
    ],
  },
  {
    id: 'class3-science-air',
    name: 'Air Around Us',
    icon: '🌬️',
    description: 'Discover the air we breathe!',
    difficulty: 'medium',
    quizSets: [
      {
        id: 'air-quiz-1',
        name: 'Quiz 1: Properties of Air',
        questions: [
          {
            id: 1,
            question: 'Can we see air?',
            options: [
              { text: 'No', emoji: '🚫', correct: true },
              { text: 'Yes', emoji: '✅', correct: false },
              { text: 'Sometimes', emoji: '🤔', correct: false },
              { text: 'Only at night', emoji: '🌙', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 2,
            question: 'What do we breathe?',
            options: [
              { text: 'Air', emoji: '💨', correct: true },
              { text: 'Water', emoji: '💧', correct: false },
              { text: 'Food', emoji: '🍎', correct: false },
              { text: 'Light', emoji: '💡', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 3,
            question: 'Which gas do plants give us?',
            options: [
              { text: 'Oxygen', emoji: '💨', correct: true },
              { text: 'Water', emoji: '💧', correct: false },
              { text: 'Food', emoji: '🍎', correct: false },
              { text: 'Soil', emoji: '🌱', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 4,
            question: 'Moving air is called?',
            options: [
              { text: 'Wind', emoji: '🌬️', correct: true },
              { text: 'Water', emoji: '💧', correct: false },
              { text: 'Rain', emoji: '🌧️', correct: false },
              { text: 'Storm', emoji: '⛈️', correct: false },
            ],
            difficulty: 'medium',
          },
          {
            id: 5,
            question: 'What makes things fly like kites?',
            options: [
              { text: 'Wind', emoji: '🪁', correct: true },
              { text: 'Water', emoji: '💧', correct: false },
              { text: 'Fire', emoji: '🔥', correct: false },
              { text: 'Rocks', emoji: '🪨', correct: false },
            ],
            difficulty: 'medium',
          },
        ],
      },
    ],
  },
];

// Export class-wise data
export const quizDataByClass: Record<number, ClassData> = {
  1: {
    math: class1MathsChapters,
    science: class1ScienceChapters,
  },
  2: {
    math: class2MathsChapters,
    science: class2ScienceChapters,
  },
  3: {
    math: class3MathsChapters,
    science: class3ScienceChapters,
  },
};

// Helper function to get chapters for a specific class and subject
export const getChaptersForClass = (classNum: number, subject: 'math' | 'science'): Chapter[] => {
  return quizDataByClass[classNum]?.[subject] || [];
};

// Helper function to get a specific chapter
export const getChapter = (chapterId: string, classNum: number): Chapter | undefined => {
  const mathChapters = quizDataByClass[classNum]?.math || [];
  const scienceChapters = quizDataByClass[classNum]?.science || [];
  return [...mathChapters, ...scienceChapters].find(ch => ch.id === chapterId);
};

// Helper function to get a specific quiz set
export const getQuizSet = (chapterId: string, quizSetId: string, classNum: number): QuizSet | undefined => {
  const chapter = getChapter(chapterId, classNum);
  return chapter?.quizSets.find(qs => qs.id === quizSetId);
};
