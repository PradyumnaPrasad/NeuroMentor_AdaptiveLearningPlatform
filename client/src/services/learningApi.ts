/**
 * Learning API Service
 * Handles all adaptive learning API calls
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ==================== Type Definitions ====================

export interface ProcessAnswerRequest {
  studentId: number;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  currentState: LearningState;
  questionData: QuestionData;
}

export interface ProcessAnswerResponse {
  action: string;
  data: {
    message?: string;
    explanation?: AIExplanation;
    correctAnswer?: string;
    offerPractice?: boolean;
    nextDifficulty?: 'easy' | 'medium' | 'hard';
    showCelebration?: boolean;
    badge?: string;
    stars?: number;
    conceptsMastered?: string[];
    moveToNext?: boolean;
    conceptsForReview?: string[];
    hint?: string;
    question?: QuestionData;  // For practice mode progression
    questions?: QuestionData[];  // For practice mode batch questions
    difficulty?: string;
    progress?: { current: number; total: number };
  };
  reward: number;
  nextState: LearningState;
}

export interface LearningState {
  classLevel: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  isInAdaptiveMode: boolean;
  recentPerformance: boolean[];
  conceptTags?: string[];
  questionType?: string;
  timeSpent?: number;
  hintsUsed?: number;
}

export interface QuestionData {
  id: number | string;
  question: string;
  options: {
    text: string;
    emoji?: string;
    correct: boolean;
  }[];
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
  hint?: string;
  conceptTags?: string[];
}

export interface AIExplanation {
  encouragement: string;
  explanation: string;
  example: string;
  tip: string;
}

export interface GenerateQuestionRequest {
  originalQuestion: string;
  correctAnswer: string;
  conceptTags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  classLevel: number;
  questionId?: number;
}

export interface MasteryStatus {
  studentId: number;
  masteryRecords: {
    concept_tag: string;
    mastery_level: number;
    total_attempts: number;
    successful_attempts: number;
  }[];
  totalConcepts: number;
  masteredConcepts: number;
}

// ==================== API Functions ====================

export const learningApi = {
  /**
   * Process student's answer and get next action
   */
  async processAnswer(request: ProcessAnswerRequest): Promise<ProcessAnswerResponse> {
    try {
      console.log('Sending request:', JSON.stringify(request, null, 2));
      const response = await axios.post(`${API_URL}/api/learning/process-answer`, request);
      return response.data;
    } catch (error: any) {
      console.error('Error processing answer:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Generate similar question at specified difficulty
   */
  async generateQuestion(request: GenerateQuestionRequest): Promise<QuestionData> {
    try {
      const response = await axios.post(`${API_URL}/api/learning/generate-question`, request);
      return response.data;
    } catch (error) {
      console.error('Error generating question:', error);
      throw error;
    }
  },

  /**
   * Start adaptive practice mode
   */
  async startAdaptiveMode(
    studentId: number,
    questionData: QuestionData,
    classLevel: number,
    subjectType: 'math' | 'science' = 'math',
    currentState?: LearningState
  ): Promise<ProcessAnswerResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/learning/start-adaptive-mode`, {
        studentId,
        questionData,
        classLevel,
        subjectType,
        currentState
      });
      // Debug: log full response payload for practice mode to help frontend debugging
      try {
        console.debug('startAdaptiveMode response:', response.data);
      } catch (e) {
        // ignore
      }
      return response.data;
    } catch (error) {
      console.error('Error starting adaptive mode:', error);
      throw error;
    }
  },

  /**
   * Get student's mastery status
   */
  async getMasteryStatus(studentId: number): Promise<MasteryStatus> {
    try {
      const response = await axios.get(`${API_URL}/api/learning/mastery/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting mastery status:', error);
      throw error;
    }
  },

  /**
   * Get concepts that need review
   */
  async getReviewConcepts(studentId: number): Promise<{
    studentId: number;
    reviewConcepts: any[];
    totalToReview: number;
  }> {
    try {
      const response = await axios.get(`${API_URL}/api/learning/review-concepts/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting review concepts:', error);
      throw error;
    }
  },

  /**
   * Generate all 5 quiz questions in a single batch call (MUCH FASTER!)
   */
  async generateQuizBatch(conceptTags: string[], classLevel: number, subjectType: 'math' | 'science' = 'math'): Promise<QuestionData[]> {
    try {
      console.log('🚀 Generating quiz batch in single API call...');
      const response = await axios.post(`${API_URL}/api/learning/generate-quiz-batch`, {
        conceptTags,
        classLevel,
        subjectType
      });
      console.log(`✅ Received ${response.data.questions.length} questions in batch!`);
      return response.data.questions;
    } catch (error) {
      console.error('Error generating quiz batch:', error);
      throw error;
    }
  }
};
