
import { DEFAULT_NEW_QUESTION_POINTS, MIN_NUM_OF_CATEGORIES } from '../constants';
import { Category, Option } from '../types';
import { getRandomColor } from './common';

export const getEmptyQuestion = (categoryId: number | string) => ({
  questionId: parseInt(`${Math.random() * 10000}`),
  text: '',
  points: DEFAULT_NEW_QUESTION_POINTS,
  options: getEmptyOptions(MIN_NUM_OF_CATEGORIES) as Option[],
  categoryId,
});

export const getEmptyCategory = (): Category => ({
  categoryId: parseInt(`${Math.random() * 10000}`),
  categoryName: '',
  questions: [],
});

export const getEmptyTeam = () => ({
  name: '',
  teamId: parseInt(`${Math.random() * 10000}`),
  score: 0,
  selectedOptions: [],
  players: '',
  avatarColor: getRandomColor(),
});

export const getEmptyOptions = (count: number) =>
  Array(count)
    .fill(1)
    .map((val, idx) => getEmptyOption());

export const getEmptyOption = () => ({
  optionId: parseInt(`${Math.random() * 10000}`),
  text: '',
  isCorrect: false,
});
