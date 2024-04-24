import { DEFAULT_NEW_QUESTION_POINTS, MIN_NUM_OF_OPTIONS } from '../constants';
import { Category, Option } from '../types';
import { getRandomColor } from './common';

export const getEmptyQuestion = (categoryId: number | string) => ({
  questionId: getRandomId(),
  text: '',
  points: DEFAULT_NEW_QUESTION_POINTS,
  options: getEmptyOptions(MIN_NUM_OF_OPTIONS) as Option[],
  categoryId,
});

export const getEmptyCategory = (): Category => ({
  categoryId: getRandomId(),
  categoryName: '',
  questions: [],
});

export const getEmptyTeam = () => ({
  name: '',
  teamId: getRandomId(),
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
  optionId: getRandomId(),
  text: '',
  isCorrect: false,
});

export const getRandomId = () => parseInt(`${Math.random() * 10000}`);
