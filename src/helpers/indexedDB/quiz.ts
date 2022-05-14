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
  const existing = await quizzesC.findOne({ _id: quizId });

  if (existing) {
    await quizzesC.update({ _id: quizId }, { name, categories, isDraft, userId, numberOfQuestionsPerCategory });
  } else {
    await quizzesC.insert({ name, categories, _id: quizId, isDraft, userId, numberOfQuestionsPerCategory });
  }
};

export const getQuizzes = async (userId: number): Promise<Quiz[]> => {
  const quizzes = (await quizzesC.find({}).toArray()).map(({ _id, ...q }: any) => ({ ...q, id: _id }));

  if (quizzes.length > 0) {
    const updatedQuizzes = await addMissingUserNameToQuizzes(userId, quizzes);

    return updatedQuizzes.filter((q) => q.userId === userId);
  } else {
    throw new Error('no quizzes in local db');
  }
};

export const getQuiz = async (_id: number) => {
  return quizzesC.findOne({ _id });
};

export const addGame = async (data: {
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

export const getGame = async (_id: number) => {
  return gamesC.findOne({ _id });
};

const addMissingUserNameToQuizzes = async (userId: number, quizzes: any[]) => {
  return Promise.all(
    quizzes.map(async (quiz) => {
      if (!quiz.userId) {
        quiz = { ...quiz, userId };
        await quizzesC.update({ _id: quiz.id }, quiz);
      }

      return quiz;
    }),
  );
};
