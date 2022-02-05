import { Category, Quiz } from "../types";
import db from "./db"

const quizzesC = db.collection('quizzes');
const quizRun = db.collection('quizRun');

export const saveQuiz = async ({ name, categories, id, isDraft, userName }: Quiz) => {
  const existing = await quizzesC.findOne({ _id: id });

  if (existing) {
    await quizzesC.update({ _id: id }, { name, categories, isDraft, userName });
  }
  else {
    await quizzesC.insert({ name, categories, _id: id, isDraft, userName });
  }
}

export const getQuizzes = async (userName: string): Promise<Quiz[]> => {
  const quizzes = (await quizzesC.find({}).toArray()).map(({ _id, ...q }: any) => ({ ...q, id: _id }));
  const updatedQuizzes = await addMissingUserNameToQuizzes(userName, quizzes);

  return updatedQuizzes.filter(q => q.userName === userName);
}

export const getQuiz = async (_id: string) => {
  return quizzesC.findOne({ _id });
}

export const saveGame = async (_id: string, {
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
}) => {
  const existing = await quizRun.findOne({ _id });

  if (existing) {
    await quizRun.update({ _id }, {
      attemptedQuestions,
      quizId,
      quizName,
      isComplete,
      currentTeamId,
      teams,
      questionTimer,
      questionSelectionTimer,
    });
  }
  else {
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
}

export const getQuizRun = async (quizId: string) => {
  return quizRun.findOne({
    quizId,
    isComplete: false,
  });
}

const addMissingUserNameToQuizzes = async (userName: string, quizzes: Quiz[]) => {
  return Promise.all(quizzes.map(async quiz => {
    if (!quiz.userName) {
      quiz = { ...quiz, userName };
      await quizzesC.update({ _id: quiz.id }, quiz);
    }

    return quiz;
  }));
}