import { getEmptyQuestion, getEmptyCategory } from './dataCreator';
import { Category } from '../types';
import { MIN_NUM_OF_CATEGORIES } from '../constants';
import { getParamsInCamelCase } from './objectHelpers';

const quizDataSchema = {
  primaryKey: 'quizId',
  dataKeys: [
    'quizId',
    'name',
    'isDraft',
    'userId',
    'numberOfQuestionsPerCategory',
    {
      categories: {
        primaryKey: 'categoryId',
        dataKeys: [
          'categoryId',
          'categoryName',
          {
            questions: {
              primaryKey: 'questionId',
              dataKeys: [
                'questionId',
                'points',
                'text',
                {
                  options: {
                    primaryKey: 'optionId',
                    dataKeys: ['optionId', { text: 'optionText' }, 'isCorrect'],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
const gameSchema = {
  primaryKey: 'gameId',
  dataKeys: [
    'gameId',
    'winnerTeamId',
    'currentTeamId',
    'timeLimit',
    'selectionTimeLimit',
    'isComplete',
    {
      teams: {
        primaryKey: 'teamId',
        dataKeys: [
          'teamId',
          { name: 'teamName' },
          'score',
          {
            selectedOptions: {
              primaryKey: 'teamQuestionMapId',
              dataKeys: ['teamQuestionMapId', 'selectedOptionId', 'questionId'],
            },
          },
        ],
      },
    },
    {
      quiz: quizDataSchema,
    },
  ],
};

export const createQuizData = (acc, quiz, schema) => {
  const primaryKey = schema.primaryKey;
  const index = acc.findIndex((x) => x[primaryKey] === quiz[primaryKey]);
  const data = index < 0 ? {} : acc[index];
  const dataKeys = schema.dataKeys;

  dataKeys.forEach((key) => {
    if (typeof key === 'string') {
      data[key] = quiz[key];
    } else {
      const keyVal: any = Object.values(key)[0];

      if (typeof keyVal === 'string') {
        data[Object.keys(key)[0]] = quiz[keyVal];
      } else {
        data[Object.keys(key)[0]] = createQuizData(data[Object.keys(key)[0]] || [], quiz, keyVal);
      }
    }
  });

  if (index < 0 && data[primaryKey]) {
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
  const quizzesDataInCamelCase = getParamsInCamelCase(quizzes);

  const formattedData = quizzesDataInCamelCase.reduce((acc, quiz) => {
    createQuizData(acc, quiz, quizDataSchema);
    return acc;
  }, []);

  return formattedData;
};

export const formatGameData = (gameData) => {
  const gamesDataInCamelCase = getParamsInCamelCase(gameData);
  const data = gamesDataInCamelCase.reduce((acc, game) => {
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

export const insertCategoryAndQuestionsData = (quiz) => {
  // Need atleast 2 categories to show when user refreshes the page after adding less than 2 category
  if (quiz.categories.length < MIN_NUM_OF_CATEGORIES) {
    quiz.categories = [0, 1].map(
      (index) => quiz.categories[index] || getEmptyCategory(quiz.numberOfQuestionsPerCategory),
    );
  }

  quiz.categories.forEach((category) => {
    if (category.questions.length < quiz.numberOfQuestionsPerCategory) {
      category.questions = [...Array(quiz.numberOfQuestionsPerCategory).keys()].map(
        (index) => category.questions[index] || getEmptyQuestion(category.categoryId),
      );
    }
  });

  return quiz;
};
