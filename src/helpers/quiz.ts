import { Quiz, Category } from '../types';
import db from './db';
import { getEmptyQuestion, getEmptyCategory } from '../helpers/question';

const quizzesC = db.collection('quizzes');
const quizRun = db.collection('quizRun');

export const saveQuiz = async ({ name, categories, id, isDraft, userName }: Quiz) => {
  const existing = await quizzesC.findOne({ _id: id });

  if (existing) {
    await quizzesC.update({ _id: id }, { name, categories, isDraft, userName });
  } else {
    await quizzesC.insert({ name, categories, _id: id, isDraft, userName });
  }
};

export const getQuiz = async (_id: string) => {
  return quizzesC.findOne({ _id });
};

export const saveGame = async (
  _id: string,
  {
    attemptedQuestions,
    quizId,
    quizName,
    isComplete,
    currentTeamId,
    teams,
    questionTimer,
    questionSelectionTimer,
  }: {
    attemptedQuestions: {
      id: string;
      isCorrect: boolean;
    }[];
    quizId: string;
    quizName: string;
    isComplete: boolean;
    currentTeamId: string;
    teams: {
      name: string;
      id: string;
      score: number;
    }[];
    questionTimer: number;
    questionSelectionTimer: number;
  },
) => {
  const existing = await quizRun.findOne({ _id });

  if (existing) {
    await quizRun.update(
      { _id },
      {
        attemptedQuestions,
        quizId,
        quizName,
        isComplete,
        currentTeamId,
        teams,
        questionTimer,
        questionSelectionTimer,
      },
    );
  } else {
    await quizRun.insert({
      attemptedQuestions,
      quizId,
      quizName,
      isComplete,
      currentTeamId,
      teams,
      questionTimer,
      questionSelectionTimer,
      _id,
    });
  }
};

export const getQuizRun = async (quizId: string) => {
  return quizRun.findOne({
    quizId,
    isComplete: false,
  });
};

// const addMissingUserNameToQuizzes = async (userName: string, quizzes: Quiz[]) => {
//   return Promise.all(quizzes.map(async quiz => {
//     if (!quiz.userName) {
//       quiz = { ...quiz, userName };
//       await quizzesC.update({ _id: quiz.id }, quiz);
//     }

//     return quiz;
//   }));
// }

const quizDataSchema = {
  _meta: {
    dataKey: 'id',
    respKey: 'QuizId',
  },
  id: 'QuizId',
  name: 'Name',
  isDraft: 'IsDraft',
  numberOfQuestionsPerCategory: 'NumberOfQuestionsPerCategory',
  categories: {
    _meta: {
      dataKey: 'categoryId',
      respKey: 'CategoryId',
    },
    categoryId: 'CategoryId',
    name: 'CategoryName',
    questions: {
      _meta: {
        dataKey: 'id',
        respKey: 'QuestionId',
      },
      id: 'QuestionId',
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

  return formattedData.map((quiz: any) => {
    if (quiz.categories.length < 2) {
      quiz.categories = [0, 1].map(
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
  });
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
