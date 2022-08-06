import { nanoid } from 'nanoid';
import { DEFAULT_NEW_QUESTION_POINTS } from '../constants';
import { Category, Option } from '../types';

export const getEmptyQuestion = (categoryId: number | string) => ({
  questionId: nanoid(),
  text: '',
  options: [] as Option[],
  points: DEFAULT_NEW_QUESTION_POINTS,
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

export const getEmptyOptions = (count: number) =>
  Array(count)
    .fill(1)
    .map((val, idx) => ({
      optionId: nanoid(),
      text: '',
      isCorrect: false,
    }));
