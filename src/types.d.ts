export interface Question {
  id: string;
  text: string;
  options: Option[];
  point: number;
  isAttempted?: boolean;
}

export interface Option {
  id: number;
  optionText: string;
  correctOptionHash: string;
}

export interface Category {
  name: string;
  id: string;
  questions: Question[];
}