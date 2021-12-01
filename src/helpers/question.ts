import { nanoid } from 'nanoid';

export const generateEmptyQuestions = (numOfQuestions: number, startIndex = 0) => {
  return new Array(numOfQuestions).fill({}).map((q, idx) => ({
    id: nanoid(),
    text: '',
    options: [],
    point: 200 * (idx + 1 + startIndex),
    correctOptionHash: '',
  }));
};
