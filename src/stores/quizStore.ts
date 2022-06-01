import {
  getQuizzes,
  post,
  get as getReq,
  formatQuizzesData,
  saveQuizzes,
  getQuiz,
  insertCategoryAndQuestionsData,
  saveQuiz,
  postBeaconReq,
  saveQuestion,
  addGame,
  getGame,
  formatGameData,
  saveGame,
  updateGame,
  unDraftQuiz,
} from '../helpers';
import { GameData } from '../types';

export const getQuizStore = (set: Function, get: Function) => ({
  getQuizzes: async () => {
    try {
      const response = await getQuizzes(get().userData.userId);

      return response;
    } catch (err) {
      const response = await getReq('quiz/userQuizzes');
      const data = formatQuizzesData(response);
      await saveQuizzes(data);

      return data;
    }
  },
  getQuiz: async (quizId: number) => {
    try {
      const response = await getQuiz(quizId);

      insertCategoryAndQuestionsData(response);
      return response;
    } catch (err) {
      const response = await getReq('quiz/data', { quizId });
      const data = formatQuizzesData(response)[0];
      await saveQuiz(data);

      return data;
    }
  },
  createOrUpdateQuiz: async (data) => {
    const response = await post('quiz/createOrUpdate', data);
    await saveQuiz(response);

    return response;
  },
  sendBeaconPost: async (data) => {
    if ('sendBeacon' in navigator) {
      await postBeaconReq('quiz/createOrUpdate', data);
      await saveQuiz(data);
    } else {
      const response = await post('quiz/createOrUpdate', data);

      return response;
    }
  },
  editQuestion: async (data, quizId: string | number) => {
    const response = await post('question/edit', data);

    await saveQuestion(response, quizId);
  },
  addGame: async (data) => {
    const response = await post('game/add', data);
    await addGame(response);

    return response;
  },
  getGameData: async (gameId: number) => {
    try {
      const response = await getGame(gameId);

      return response;
    } catch (err) {
      const response = await getReq('game/data', { gameId });
      const data = formatGameData(response);
      await saveGame(data);

      return data;
    }
  },
  updateGame: async (data: GameData) => {
    const response = await post('game/edit', data);

    await updateGame(data);
    return response;
  },
  unDraftQuiz: async (quizId: string | number) => {
    await post('quiz/unDraft', { quizId });

    await unDraftQuiz(quizId);
  },
});

export type QuizState = ReturnType<typeof getQuizStore>;
