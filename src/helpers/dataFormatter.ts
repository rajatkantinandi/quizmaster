import { getEmptyCategory, getEmptyOptions } from './dataCreator';
import { Category } from '../types';

const quizDataSchema = {
  _meta: {
    dataKey: 'quizId',
    respKey: 'QuizId',
  },
  quizId: 'QuizId',
  name: 'Name',
  isDraft: 'IsDraft',
  createDate: 'CreateDate',
  updateDate: 'UpdateDate',
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

export const createQuizData = (acc, quiz, schema) => {
  const metaData = schema._meta;
  const index = acc.findIndex((x) => x[metaData.dataKey] === quiz[metaData.respKey]);
  const data = index < 0 ? {} : acc[index];

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

/* This function is converting quiz data, which we are getting in array of object
 * format from API response, into nested object format
 * API Response Data Format = [
 *   {
 *     QuizId: 1,
 *     Name: 'quiz 1',
 *     IsDraft: true,
 *     NumberOfQuestionsPerCategory: 5,
 *     CategoryId: 1,
 *     CategoryName: 'cat 1',
 *     QuestionId: 1,
 *     Points: 1,
 *     Text: 'question text',
 *     OptionId: 1,
 *     OptionText: 'option text',
 *     IsCorrect: true,
 *   },
 * ]
 *
 * Converted data format = {
 *   quizId: 1,
 *   name: 'quiz 1',
 *   isDraft: true,
 *   numberOfQuestionsPerCategory: 5,
 *   categories: [{
 *     categoryId: 1,
 *     categoryName: 'cat 1',
 *     questions: [{
 *       questionId: 1,
 *       points: 1,
 *       text: 'question text',
 *       options: [{
 *         optionId: 1,
 *         optionText: 'option text',
 *         isCorrect: true,
 *       }]
 *     }]
 *   }]
 * }
 *
 * if there are multiple catagories/questions/options,
 * they will keep adding in the respective array
 */
export const formatQuizzesData = (quizzes) => {
  const formattedData = quizzes.reduce((acc, quiz) => {
    createQuizData(acc, quiz, quizDataSchema);
    return acc;
  }, []);

  return formattedData;
};

export const formatGameData = (gameData) => {
  const data = gameData.reduce((acc, game) => {
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

export const fixQuizData = (data) => {
  // Need atleast 2 categories to show when user refreshes the page after adding less than 2 category
  if (data.categories.length === 0) {
    data.categories = [getEmptyCategory()];
  }

  data.categories.forEach((category) => {
    if (category.questions.length > 0) {
      category.questions.forEach((question) => {
        const { options } = question;

        if (options.length === 0) {
          question.options = getEmptyOptions(2);
        } else if (!(options.length === 1 && options[0].isCorrect)) {
          question.options.concat(getEmptyOptions(1));
        }
      });
    }
  });

  return data;
};
