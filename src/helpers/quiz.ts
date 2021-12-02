import { Category } from "../types";
import db from "./db"

const quizzesC = db.collection('quizzes');

export const saveQuizDraft = async ({ name, categories, id }: {
  name: string;
  categories: Category[];
  id: string;
}) => {
  const existing = await quizzesC.findOne({ _id: id });

  if (existing) {
    await quizzesC.update({ _id: id }, { name, categories, isDraft: true });
  }
  else {
    await quizzesC.insert({ name, categories, _id: id, isDraft: true });
  }
}

export const getQuizzes = async () => {
  return (await quizzesC.find({}).toArray()).map(({ _id, ...q }: any) => ({ ...q, id: _id }));
}

export const getQuiz = async (_id: string) => {
  return quizzesC.findOne({ _id });
}