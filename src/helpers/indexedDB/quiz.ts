import { Quiz, GameData, Question } from '../../types';
import db from './db';
import { isGuestUser } from '../common';
interface QuizParams extends Quiz {
  userId: number;
}

const quizzesC = db.collection('quizzes');
const gamesC = db.collection('games');

export const generateRandomNumber = () => parseInt(`${Math.random() * 10000}`);

export const saveQuiz = async (data: QuizParams) => {
  data.quizId = data.quizId || generateRandomNumber();
  const existing = (await quizzesC.findOne({ quizId: data.quizId })) as Quiz;

  if (existing) {
    await quizzesC.update({ quizId: data.quizId }, data);
  } else {
    data.createDate = new Date().toISOString();
    await quizzesC.insert(data);
  }

  return data;
};

export const deleteQuizzes = async (quizIds: number[]) => {
  await quizzesC.remove({ quizId: { $in: quizIds } });
};

export const publishQuizzes = async (quizIds: number[]) => {
  const existing = await quizzesC.find({ quizId: { $in: quizIds } });

  existing.forEach(async (quiz) => {
    quiz.isPublished = true;
    await quizzesC.update({ quizId: quiz.quizId }, quiz);
  });
};

export const unDraftQuiz = async (quizId: string | number) => {
  await quizzesC.update({ quizId }, { isDraft: false });
};

export const saveQuestion = async (questionData: Question, quizId: string | number) => {
  const quiz = (await quizzesC.findOne({ quizId })) as QuizParams;
  let questionIndex = -1;
  const categoryIndex = quiz.categories.findIndex((category) => {
    const index = category.questions.findIndex((question) => question.questionId === questionData.questionId);

    if (index >= 0) {
      questionIndex = index;
    }

    return category.questions[index];
  });
  questionData.options.forEach((option) => {
    option.optionId = option.optionId || generateRandomNumber();
  });

  if (questionIndex >= 0) {
    quiz.categories[categoryIndex].questions[questionIndex] = questionData;
  } else {
    quiz.categories[categoryIndex].questions.push(questionData);
  }

  await quizzesC.update({ quizId }, quiz);
};

export const updateQuestionCategory = async (data, quizId: string | number) => {
  const quiz = (await quizzesC.findOne({ quizId })) as QuizParams;
  quiz.categories.forEach((category) => {
    const index = category.questions.findIndex((question) => question.questionId === data.questionId);

    if (index >= 0) {
      if (!quiz.categories[data.categoryIndex].questions) {
        quiz.categories[data.categoryIndex].questions = [];
      }

      quiz.categories[data.categoryIndex].questions.push(category.questions[index]);
      category.questions.splice(index);
    }
  });

  await quizzesC.update({ quizId }, quiz);
};

export const getQuizzes = async (userId: number): Promise<Object[]> => {
  const quizzes = await quizzesC.find({ userId }).toArray();

  return quizzes;
};

export const saveQuizzes = async (quizzes: Quiz[]) => {
  if (quizzes.length > 0) {
    await quizzesC.remove({ quizId: { $in: quizzes.map((qz) => qz.quizId) } });
    await quizzesC.insert(quizzes);
  }
};

export const getQuiz = async (quizId: number) => {
  const quiz = await quizzesC.findOne({ quizId });

  if (quiz) {
    return quiz;
  } else if (isGuestUser()) {
    return {};
  } else {
    throw new Error('no quiz in local db');
  }
};

export const addGame = async (data: {
  gameId: number;
  quizId: number;
  timeLimit?: number;
  selectionTimeLimit?: number;
  isQuestionPointsHidden: boolean;
  negativePointsMultiplier: number;
  currentTeamId: number;
  teams: {
    name: string;
    points?: number;
    teamId?: number;
  }[];
}) => {
  const teams = data.teams.map((team) => ({
    ...team,
    teamId: team.teamId || generateRandomNumber(),
  }));

  const dataToInsert = {
    ...data,
    gameId: data.gameId || generateRandomNumber(),
    teams,
    currentTeamId: data.currentTeamId || teams[0].teamId,
  };

  await gamesC.insert(dataToInsert);

  return dataToInsert;
};

export const getGame = async (gameId: number) => {
  const game: any = await gamesC.findOne({ gameId });

  if (game) {
    const quiz = await getQuiz(game.quizId);

    return {
      ...game,
      quiz: [quiz],
    };
  } else if (isGuestUser()) {
    return {};
  } else {
    throw new Error('game not exists');
  }
};

export const updateGame = async (gameData: GameData) => {
  const game: any = await gamesC.findOne({ gameId: gameData.gameId });

  game.isComplete = gameData.isComplete;
  game.winnerTeamId = gameData.winnerTeamId;
  game.currentTeamId = gameData.nextTeamId;

  const { currentTeam } = gameData;

  if (currentTeam) {
    const index = game.teams.findIndex((team) => team.teamId === currentTeam.teamId);

    game.teams[index].score = currentTeam.score;
    game.teams[index].selectedOptions.push({
      selectedOptionIds: currentTeam.selectedOptionIds,
      questionId: currentTeam.questionId,
    });
  }

  delete game._id;
  await gamesC.update({ gameId: game.gameId }, game);

  return game;
};

export const saveGame = async (gameData) => {
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

export const getInCompletedGameByQuizId = async (quizId) => {
  const data: any = await gamesC.findOne({ quizId, isComplete: false });

  return data?.gameId || null;
};

export const markGameCompleted = async (gameId) => {
  const game: any = await gamesC.findOne({ gameId });

  game.isComplete = true;
  delete game._id;
  await gamesC.update({ gameId }, game);
};
