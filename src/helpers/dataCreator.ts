import { nanoid } from 'nanoid';
import { Category } from '../types';

export const getEmptyQuestion = (categoryId: number | string) => ({
  questionId: nanoid(),
  text: '',
  options: [],
  points: 0,
  categoryId,
});

export const getEmptyCategory = (numberOfQuestionsPerCategory: number): Category => {
  const categoryId = nanoid();

  return {
    categoryId,
    categoryName: '',
    questions: Array(numberOfQuestionsPerCategory)
      .fill(1)
      .map((val, idx) => getEmptyQuestion(categoryId)),
  };
};

export const getEmptyTeam = () => ({
  name: '',
  teamId: nanoid(),
  score: 0,
  selectedOptions: [],
});
