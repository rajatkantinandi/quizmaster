import { nanoid } from 'nanoid';
import { Question } from '../types';

export const generateEmptyQuestions = (
  numOfQuestions: number,
  categoryId: number | string,
  startIndex = 0,
): Question[] => {
  return new Array(numOfQuestions).fill({}).map((q, idx) => ({
    id: nanoid(),
    text: '',
    options: [],
    points: 200 * (idx + 1 + startIndex),
    categoryId,
  }));
};
