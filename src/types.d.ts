export interface Question {
  questionId: string;
  text: string;
  options: Option[];
  points: number;
  categoryId: string | number;
}

export interface Option {
  optionId: string | number;
  text: string;
  isCorrect: boolean;
}

export interface Category {
  categoryName: string;
  categoryId: string | number;
  questions: Question[];
}

export interface QuizInfo {
  quizId: string | number;
  name?: string;
  categoryIds: (string | number)[];
  numberOfQuestionsPerCategory?: number;
}

export interface User {
  userName: string;
  passwordHash: string;
  salt: string;
}

export interface Quiz {
  name: string;
  categories: Category[];
  isDraft: boolean;
  userName: string;
  quizId: string;
  numberOfQuestionsPerCategory: number;
}

export interface GameInfo {
  gameId?: number;
  winnerTeamId?: string;
  currentTeamId?: number;
  timeLimit: number;
  selectionTimeLimit: number;
  isComplete?: boolean;
  teams: Team[];
  isQuestionPointsHidden: boolean;
}

export interface Team {
  teamId?: number | string;
  name: string;
  score: number;
  selectedOptions: SelectedOptions[];
}

export interface SelectedOptions {
  selectedOptionId: number | null;
  questionId: string;
  isQuestionTimerUp?: boolean;
}
