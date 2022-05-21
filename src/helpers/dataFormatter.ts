import { getEmptyQuestion, getEmptyCategory } from './dataCreator';
import { Category } from '../types';

const quizDataSchema = {
  _meta: {
    dataKey: 'quizId',
    respKey: 'QuizId',
  },
  quizId: 'QuizId',
  name: 'Name',
  isDraft: 'IsDraft',
  numberOfQuestionsPerCategory: 'NumberOfQuestionsPerCategory',
  categories: {
    _meta: {
      dataKey: 'categoryId',
      respKey: 'CategoryId',
    },
    categoryId: 'CategoryId',
    categoryName: 'CategoryName',
    questions: {
      _meta: {
        dataKey: 'questionId',
        respKey: 'QuestionId',
      },
      questionId: 'QuestionId',
      points: 'Points',
      text: 'Text',
      options: {
        _meta: {
          dataKey: 'optionId',
          respKey: 'OptionId',
        },
        optionId: 'OptionId',
        text: 'OptionText',
        isCorrect: 'IsCorrect',
      },
    },
  },
};
const gameSchema = {
  _meta: {
    dataKey: 'gameId',
    respKey: 'GameId',
  },
  gameId: 'GameId',
  winnerTeamId: 'WinnerTeamId',
  currentTeamId: 'CurrentTeamId',
  timeLimit: 'TimeLimit',
  selectionTimeLimit: 'SelectionTimeLimit',
  isComplete: 'IsComplete',
  teams: {
    _meta: {
      dataKey: 'teamId',
      respKey: 'TeamId',
    },
    teamId: 'TeamId',
    name: 'TeamName',
    score: 'Score',
    selectedOptions: {
      _meta: {
        dataKey: 'teamQuestionMapId',
        respKey: 'TeamQuestionMapId',
      },
      teamQuestionMapId: 'TeamQuestionMapId',
      selectedOptionId: 'SelectedOptionId',
      questionId: 'QuestionId',
    },
  },
  quiz: quizDataSchema,
};

export const createQuizData = (acc: any, quiz: any, schema: any) => {
  const metaData = schema._meta;
  const index = acc.findIndex((x: any) => x[metaData.dataKey] === quiz[metaData.respKey]);
  const data: any = index < 0 ? {} : acc[index];

  for (const key in schema) {
    if (key !== '_meta') {
      if (typeof schema[key] === 'object') {
        data[key] = createQuizData(data[key] || [], quiz, schema[key]);
      } else {
        data[key] = quiz[schema[key]];
      }
    }
  }

  if (index < 0 && data[metaData.dataKey]) {
    acc.push(data);
  }

  return acc;
};

export const formatQuizzesData = (quizzes: any[]) => {
  const formattedData = quizzes.reduce((acc, quiz: any) => {
    createQuizData(acc, quiz, quizDataSchema);
    return acc;
  }, []);

  return formattedData.map(insertCategoryAndQuestionsData);
};

export const formatGameData = (gameData: any) => {
  const data = gameData.reduce((acc: any, game: any) => {
    createQuizData(acc, game, gameSchema);
    return acc;
  }, []);

  return data[0];
};

export const formatCategoryInfo = (categories: Category[], categoryIds: (string | number)[]) => {
  return categoryIds.reduce((acc, id) => {
    const category = categories.find((cat) => cat.categoryId === id);

    if (category) {
      acc[id] = category;
    }

    return acc;
  }, {} as { [key: string]: Category });
};

export const insertCategoryAndQuestionsData = (quiz: any) => {
  if (quiz.categories.length < 3) {
    quiz.categories = [0, 1, 2].map(
      (index) => quiz.categories[index] || getEmptyCategory(quiz.numberOfQuestionsPerCategory),
    );
  }
  quiz.categories.forEach((category: any) => {
    if (category.questions.length < quiz.numberOfQuestionsPerCategory) {
      category.questions = [...Array(quiz.numberOfQuestionsPerCategory).keys()].map(
        (index) => category.questions[index] || getEmptyQuestion(category.categoryId),
      );
    }
  });

  return quiz;
};
