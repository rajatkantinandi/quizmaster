import { Quiz, Option, GameData } from '../../types';
import db from './db';

interface QuizParams extends Quiz {
  userId: number;
}

interface QuestionParams {
  QuestionId: string;
  Text: string;
  Options: Option[];
  Points: number;
  TimeLimit: number;
  CategoryId: number;
}

const quizzesC = db.collection('quizzes');
const gamesC = db.collection('games');

export const saveQuiz = async ({
  name,
  categories,
  quizId,
  isDraft = false,
  numberOfQuestionsPerCategory,
  userId,
}: QuizParams) => {
  let existing = (await quizzesC.findOne({ quizId })) as Quiz;

  if (existing) {
    categories = categories.map((category) => {
      const existingCategory = existing.categories.find((x) => x.categoryId === category.categoryId);

      if (existingCategory) {
        category.questions = category.questions.map((q) => {
          const existingQuestion = existingCategory.questions.find((x) => x.questionId === q.questionId);

          return existingQuestion ? { ...existingQuestion, points: q.points } : q;
        });
      }

      return category;
    });
    await quizzesC.update({ quizId }, { name, categories, quizId, isDraft, userId, numberOfQuestionsPerCategory });
  } else {
    await quizzesC.insert({ name, categories, quizId, isDraft, userId, numberOfQuestionsPerCategory });
  }
};

export const unDraftQuiz = async (quizId: string | number) => {
  await quizzesC.update({ quizId }, { isDraft: false });
};

export const saveQuestion = async (
  { QuestionId, Text, Points, TimeLimit, Options }: QuestionParams,
  quizId: string | number,
) => {
  const quiz = (await quizzesC.findOne({ quizId })) as Quiz;
  const questionData = {
    questionId: QuestionId,
    text: Text,
    points: Points,
    timeLimit: TimeLimit,
    options: Options,
    categoryId: 0,
  };
  let questionIndex = -1;
  const categoryIndex = quiz.categories.findIndex((category) => {
    const index = category.questions.findIndex((question) => question.questionId === QuestionId);

    if (index >= 0) {
      questionIndex = index;
    }

    return category.questions[index];
  });

  const category = quiz.categories[categoryIndex];

  if (questionIndex >= 0) {
    questionData.categoryId = category.categoryId as number;
    category.questions[questionIndex] = questionData;
  } else {
    category.questions.push(questionData);
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

export const saveQuizzes = async (quizzes: Quiz[]) => {
  if (quizzes.length > 0) {
    await quizzesC.insert(quizzes);
  }
};

export const getQuiz = async (quizId: number) => {
  const quiz = await quizzesC.findOne({ quizId });

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
  isQuestionPointsHidden: boolean;
  currentTeamId: number;
  teams: {
    name: string;
    points?: number;
  };
}) => {
  await gamesC.insert(data);
};

export const getGame = async (gameId: number) => {
  const game: any = await gamesC.findOne({ gameId });

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
      selectedOptionId: currentTeam.selectedOptionId,
      questionId: currentTeam.questionId,
    });
  }

  await gamesC.update({ gameId: game.gameId }, game);
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
