import { Category } from '../types';

export const getPointsColor = (points, minQuestionPoint, maxQuestionPoint) => {
  const questionPointsRange = maxQuestionPoint - minQuestionPoint;
  const colorNumber = Math.ceil(((points - minQuestionPoint) * 4) / questionPointsRange) + 1;

  return {
    color: `var(--points-color-${colorNumber})`,
    bgColor: `var(--points-bg-color-${colorNumber})`,
  };
};

export const getQuestionsCount = (categories: Category[]) => {
  return categories.reduce((count, category) => {
    count += category.questions.length;

    return count;
  }, 0);
};
