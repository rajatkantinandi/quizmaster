export interface Question {
  questionId: any;
  text: string;
  options: Option[];
  points: number;
  categoryId: string | number;
  questionNum?: number;
}

export interface Option {
  optionId: number;
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
  categories: Category[];
}

export interface User {
  userName: string;
  passwordHash: string;
  salt: string;
}

export interface Quiz {
  name: string;
  categories: Category[];
  isDraft?: boolean;
  isPublished?: boolean;
  userName: string;
  quizId: any;
  createDate: string;
  updateDate: string;
  isDeleted: boolean;
}

export interface GameInfo {
  gameId?: number;
  winnerTeamId?: string;
  currentTeamId: number;
  timeLimit: number;
  selectionTimeLimit: number;
  isComplete?: boolean;
  teams: Team[];
  isQuestionPointsHidden: boolean;
}

export interface Team {
  teamId: number | string;
  name: string;
  score: number;
  selectedOptions: SelectedOptions[];
  avatarColor: string;
  players: string;
}

export interface SelectedOptions {
  selectedOptionIds: number[] | null;
  questionId: string;
}

export interface GameData {
  gameId: number;
  isComplete: boolean;
  winnerTeamId: string | null;
  nextTeamId: number;
  currentTeam?: {
    score: number;
    selectedOptionIds: number[] | null;
    questionId: number;
    teamId: number;
  };
}
