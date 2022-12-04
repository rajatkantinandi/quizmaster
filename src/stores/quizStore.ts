import { nanoid } from 'nanoid';
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
  fixQuizData,
} from '../helpers';
import { GameData, Quiz } from '../types';

export const getQuizStore = (set: Function, get: Function) => ({
  quizzes: [],
  searchResults: [],
  searchQuery: '',
  getQuizzes: async () => {
    if (isGuestUser()) {
      const response: any = await getQuizzes(-1);
      const sortedData = response.sort(
        (quiz1, quiz2) => new Date(quiz2.updateDate).getTime() - new Date(quiz1.updateDate).getTime(),
      );

      return sortedData;
    } else {
      const response = await getReq('quiz/userQuizzes');
      const data = formatQuizzesData(response);
      const sortedData = data.sort(
        (quiz1, quiz2) => new Date(quiz2.updateDate).getTime() - new Date(quiz1.updateDate).getTime(),
      );

      await saveQuizzes(sortedData);

      return sortedData;
    }
  },
  getQuiz: async (quizId: number) => {
    try {
      const response = await getReq('quiz/data', { quizId });
      const data = formatQuizzesData(response)[0];

      await saveQuiz(data);
      return fixQuizData(data);
    } catch (err) {
      const response = await getQuiz(quizId);

      return fixQuizData(response);
    }
  },
  createOrUpdateQuiz: async (data) => {
    if (isGuestUser()) {
      data.userId = -1;
      data.quizId = data.quizId || nanoid();
      data.updateDate = new Date().toISOString();

      const response: any = await saveQuiz(data);

      return response;
    } else {
      const response = await post('quiz/createOrUpdate', data);
      await saveQuiz(response);

      return response;
    }
  },
  updateQuizName: async (data) => {
    if (isGuestUser()) {
      data.userId = -1;
      const response = await saveQuiz(data);

      return response;
    } else {
      await post('quiz/edit', data);
      data.updateDate = new Date().toISOString();
      await saveQuiz(data);

      return data;
    }
  },
  sendBeaconPost: async (data) => {
    if (isGuestUser()) {
      data.userId = -1;

      return data;
    } else {
      if ('sendBeacon' in navigator) {
        await postBeaconReq('quiz/createOrUpdate', data);

        data.updateDate = new Date().toISOString();
        await saveQuiz(data);
      } else {
        const response = await post('quiz/createOrUpdate', data);
        await saveQuiz(response);

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

  setQuizzes: (data) => {
    set((state: QuizState) => {
      state.quizzes = data;
    });
  },
  searchQuiz: (queryString) => {
    set((state: QuizState) => {
      state.searchQuery = queryString;
      state.searchResults = queryString ? state.quizzes.filter((quiz) => quiz.name.startsWith(queryString)) : [];
    });
  },
});

export interface QuizState extends Omit<Omit<ReturnType<typeof getQuizStore>, 'quizzes'>, 'searchResults'> {
  quizzes: Quiz[];
  searchResults: Quiz[];
  searchQuery: string;
}
