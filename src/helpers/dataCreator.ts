import { nanoid } from 'nanoid';
import { Category, Option } from '../types';
import { getRandomColor } from './common';

export const getEmptyQuestion = (categoryId: number | string) => ({
  questionId: nanoid(),
  text: '',
  options: getEmptyOptions(2) as Option[],
  points: 0,
  categoryId,
});

export const getEmptyCategory = (): Category => ({
  categoryId: nanoid(),
  categoryName: '',
  questions: [],
});

export const getEmptyTeam = () => ({
  name: '',
  teamId: nanoid(),
  score: 0,
  selectedOptions: [],
  players: '',
  avatarColor: getRandomColor(),
});

export const getEmptyOptions = (count: number) =>
  Array(count)
    .fill(1)
    .map((val, idx) => ({
      optionId: nanoid(),
      text: '',
      isCorrect: false,
    }));
