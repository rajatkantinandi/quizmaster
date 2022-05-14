import { Quiz } from '../../types';
import db from './db';

const quizzesC = db.collection('quizzes');
const gamesC = db.collection('games');

export const saveQuiz = async ({
  name,
  categories,
  quizId,
  isDraft = false,
  numberOfQuestionsPerCategory,
  userId,
}: any) => {
  const existing = await quizzesC.findOne({ quizId });

  if (existing) {
    await quizzesC.update({ quizId }, { name, categories, isDraft, userId, numberOfQuestionsPerCategory });
  } else {
    await quizzesC.insert({ name, categories, quizId, isDraft, userId, numberOfQuestionsPerCategory });
  }
};

export const updateQuiz = async ({
  name,
  categories,
  quizId,
  isDraft = false,
  numberOfQuestionsPerCategory,
  userId,
}: any) => {
  await quizzesC.update({ quizId }, { name, categories, isDraft, userId, numberOfQuestionsPerCategory });
};

export const saveQuestion = async ({ QuestionId, Text, Points, TimeLimit, Options }: any, quizId: string | number) => {
  const quiz: any = await quizzesC.findOne({ quizId });
  const questionData = {
    questionId: QuestionId,
    text: Text,
    points: Points,
    timeLimit: TimeLimit,
    options: Options,
  };
  let questionIndex = -1;
  const categoryIndex: any = quiz.categories.findIndex((category: any) => {
    const index = category.questions.findIndex((question: any) => question.questionId === QuestionId);

    if (index >= 0) {
      questionIndex = index;
    }

    return category.questions[index];
  });

  if (questionIndex >= 0) {
    quiz.categories[categoryIndex].questions[questionIndex] = questionData;
  } else {
    quiz.categories[categoryIndex].questions.push(questionData);
  }

  await quizzesC.update({ quizId }, quiz);
};

export const getQuizzes = async (): Promise<Object[]> => {
  const quizzes = await quizzesC.find({}).toArray();

  if (quizzes.length > 0) {
    return quizzes;
  } else {
    throw new Error('no quizzes in local db');
  }
};

export const saveQuizzes = async (quizzes: any) => {
  await quizzesC.insert(quizzes);
};

export const getQuiz = async (quizId: any) => {
  const quiz = await quizzesC.findOne({ quizId: parseInt(quizId) });

  if (quiz) {
    return quiz;
  } else {
    throw new Error('no quiz in local db');
  }
};

export const addGame = async (data: {
  gameId: number;
  quizId: number;
  timeLimit?: number;
  selectionTimeLimit?: number;
  teams: {
    name: string;
    points?: number;
  };
}) => {
  await gamesC.insert(data);
};

export const getGame = async (gameId: any) => {
  const game: any = await gamesC.findOne({ gameId: parseInt(gameId) });

  if (game) {
    const quiz = await getQuiz(game.quizId);

    return {
      ...game,
      quiz: [quiz],
    };
  } else {
    throw new Error('game not exists');
  }
};

export const updateGame = async (gameData: any) => {
  const game: any = await gamesC.findOne({ gameId: parseInt(gameData.gameId) });
  game.isComplete = gameData.isComplete;
  game.winnerTeamId = gameData.winnerTeamId;
  game.currentTeamId = gameData.nextTeamId;
  const { currentTeam } = gameData;

  if (currentTeam) {
    const index = game.teams.findIndex((team: any) => team.teamId === currentTeam.teamId);
    game.teams[index].score = currentTeam.score;
    game.teams[index].selectedOptions.push({
      selectedOptionId: currentTeam.selectedOptionId,
      questionId: currentTeam.questionId,
    });
  }

  await gamesC.update({ gameId: game.gameId }, game);
};

export const saveGame = async (gameData: any) => {
  const { quiz = [], ...restData } = gameData;
  const existing = await gamesC.findOne({ gameId: gameData.gameId });

  if (quiz.length > 0) {
    await quizzesC.update({ quizId: quiz[0].quizId }, quiz[0]);

    restData.quizId = quiz[0].quizId;
  }

  if (existing) {
    await gamesC.update({ gameId: restData.gameId }, restData);
  } else {
    await gamesC.insert(restData);
  }
};

const addMissingUserNameToQuizzes = async (userId: number, quizzes: any[]) => {
  return Promise.all(
    quizzes.map(async (quiz) => {
      if (!quiz.userId) {
        quiz = { ...quiz, userId };
        await quizzesC.update({ quizId: quiz.quizId }, quiz);
      }

      return quiz;
    }),
  );
};
