export interface Question {
  id: string;
  text: string;
  options: Option[];
  points: number;
  categoryId: any;
}

export interface Option {
  optionId: string;
  text: string;
  isCorrect: boolean;
}

export interface Category {
  name: string;
  categoryId: string | number;
  questions: Question[];
}

export interface QuizInfo {
  quizId: string | number;
  name: string;
  categoryIds: (string | number)[];
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
  id: string;
}

export interface GameInfo {
  gameId?: number;
  winnerTeamId?: string;
  currentTeamId: number;
  timeLimit: number;
  selectionTimeLimit: number;
  questionTimer: number;
  isComplete: boolean;
  teams: Team[];
}

export interface Team {
  teamId?: number;
  name: string;
  score: number;
  selectedOptions: { [key: string]: number };
}
