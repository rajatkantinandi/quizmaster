import {
  getQuizzes,
  post,
  get as getReq,
  formatQuizzesData,
  saveQuizzes,
  getQuiz,
  saveQuiz,
  postBeaconReq,
  saveQuestion,
  addGame,
  getGame,
  formatGameData,
  saveGame,
  updateGame,
  unDraftQuiz,
  isGuestUser,
} from '../helpers';
import { GameData } from '../types';

export const getQuizStore = (set: Function, get: Function) => ({
  getQuizzes: async () => {
    if (isGuestUser()) {
      const response = await getQuizzes(-1);

      return response;
    } else {
      const response = await getReq('quiz/userQuizzes');
      const data = formatQuizzesData(response);
      await saveQuizzes(data);

      return data;
    }
  },
  getQuiz: async (quizId: number) => {
    try {
      const response = await getQuiz(quizId);

      return response;
    } catch (err) {
      const response = await getReq('quiz/data', { quizId });
      const data = formatQuizzesData(response)[0];
      await saveQuiz(data);

      return data;
    }
  },
  createOrUpdateQuiz: async (data) => {
    if (isGuestUser()) {
      data.userId = -1;
      const response = await saveQuiz(data);

      return response;
    } else {
      const response = await post('quiz/createOrUpdate', data);
      await saveQuiz(response);

      return response;
    }
  },
  sendBeaconPost: async (data) => {
    if (isGuestUser()) {
      data.userId = -1;
      const response = await saveQuiz(data);

      return response;
    } else {
      if ('sendBeacon' in navigator) {
        await postBeaconReq('quiz/createOrUpdate', data);
        await saveQuiz(data);
      } else {
        const response = await post('quiz/createOrUpdate', data);

        return response;
      }
    }
  },
  editQuestion: async (data, quizId: string | number) => {
    if (isGuestUser()) {
      await saveQuestion(data, quizId);
    } else {
      const response = await post('question/edit', data);

      await saveQuestion(
        {
          questionId: response.QuestionId,
          text: response.Text,
          points: response.Points,
          options: response.Options,
          categoryId: data.categoryId,
        },
        quizId,
      );
    }
  },
  addGame: async (data) => {
    if (isGuestUser()) {
      const response = await addGame(data);

      return response;
    } else {
      const response = await post('game/add', data);
      await addGame(response);

      return response;
    }
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
    if (isGuestUser()) {
      const response = await updateGame(data);

      return response;
    } else {
      const response = await post('game/edit', data);

      await updateGame(data);
      return response;
    }
  },
  unDraftQuiz: async (quizId: string | number) => {
    if (!isGuestUser()) {
      await post('quiz/unDraft', { quizId });
    }

    await unDraftQuiz(quizId);
  },
});

export type QuizState = ReturnType<typeof getQuizStore>;
