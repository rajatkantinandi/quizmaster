export interface Question {
  id: string;
  text: string;
  options: Option[];
  point: number;
  correctOptionHash: string;
  isWithoutOptions?: boolean;
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

export interface Quiz {
  name: string;
  categories: Category[];
  isDraft: boolean;
  userName: string;
  id: string;
}

export interface Team {
  name: string;
  id: string;
  score: number;
}