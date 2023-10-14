import { Category } from '../types';

export const getBadgeColor = (points, minQuestionPoint, maxQuestionPoint) => {
  const questionPointsRange = maxQuestionPoint - minQuestionPoint;

  if (parseInt(points, 10) > minQuestionPoint + questionPointsRange * 0.8) {
    return 'red';
  } else if (parseInt(points, 10) > minQuestionPoint + questionPointsRange * 0.6) {
    return 'orange';
  } else if (parseInt(points, 10) > minQuestionPoint + questionPointsRange * 0.4) {
    return 'yellow';
  } else if (parseInt(points, 10) > minQuestionPoint + questionPointsRange * 0.2) {
    return 'lime';
  } else {
    return 'green';
  }
};

export const getQuestionsCount = (categories: Category[]) => {
  return categories.reduce((count, category) => {
    count += category.questions.length;

    return count;
  }, 0);
};
