export interface Question {
  id: string;
  text: string;
  options: Option[];
  point: number;
  isAttempted?: boolean;
  correctOptionHash: string;
}

export interface Option {
  id: string;
  optionText: string;
}

export interface Category {
  name: string;
  id: string;
  questions: Question[];
}

export interface User {
  userName: string;
  passwordHash: string;
  salt: string;
}