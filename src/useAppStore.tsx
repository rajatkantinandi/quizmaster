import React from 'react';
import create from 'zustand';
\import config from './config';
import {
  saveQuiz,
  getQuizzes,
  getQuiz,
  addGame,
  getGame,
  saveQuestion,
  saveGame,
  signUpUser,
  saveQuizzes,
  updateGame,
  unDraftQuiz,
  post,
  get as getReq,
  postBeaconReq,
  setCookie,
  formatGameData,
  formatQuizzesData,
  insertCategoryAndQuestionsData
} from './helpers';

export const useAppStore = create((set: Function, get: Function) => ({
  confirmationModal: null,
  userData: {},
  setConfirmationModal: (confirmationModal: ConfirmationModalState | null) => {
    set((state: AppState) => ({ ...state, confirmationModal }));
  },
  showAlertModal: ({
    title,
    message,
    ...rest
  }: Omit<ConfirmationModalState, 'body'> & { title: string; message: React.ReactNode }) => {
    set((state: AppState) => ({
      ...state,
      confirmationModal: { title, body: message, cancelText: '', isAlert: true, ...rest },
    }));
  },
  showErrorModal: ({
    title = 'Error!',
    message,
    ...rest
  }: Omit<Omit<ConfirmationModalState, 'body'>, 'title'> & { title?: string; message: React.ReactNode }) => {
    set((state: AppState) => ({
      ...state,
      confirmationModal: { title, body: message, cancelText: '', isAlert: true, ...rest },
    }));
  },
  signUp: async (data: any) => {
    const response = await post('user/signup', data);
    await signUpUser({ userName: response.userName, password: data.password });
    setCookie(config.tokenKey, response.token);

    if (response.userId) {
      set((state: AppState) => ({
        ...state,
        userData: response,
      }));
    }

    return response;
  },
  logIn: async (data: any) => {
    const response = await post('user/login', data);
    setCookie(config.tokenKey, response.token);

    set((state: AppState) => ({
      ...state,
      userData: response,
    }));
  },
  logout: async () => {
    await post('user/logout');
    setCookie(config.tokenKey, '');

    set((state: AppState) => ({
      ...state,
      userData: {},
    }));
  },
  getQuizzes: async () => {
    try {
      const response = await getQuizzes();

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
  getUserData: async () => {
    const response = await getReq('user/data');

    set((state: AppState) => ({
      ...state,
      userData: response,
    }));
  },
  createOrUpdateQuiz: async (data: any) => {
    const response = await post('quiz/createOrUpdate', data);
    await saveQuiz(response);

    return response;
  },
  sendBeaconPost: async (data: any) => {
    if ('sendBeacon' in navigator) {
      await postBeaconReq('quiz/createOrUpdate', data);
      await saveQuiz(data);
    } else {
      const response = await post('quiz/createOrUpdate', data);

      return response;
    }
  },
  editQuestion: async (data: any, quizId: string | number) => {
    const response = await post('question/edit', data);

    await saveQuestion(response, quizId);
  },
  addGame: async (data: any) => {
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
  updateGame: async (data: any) => {
    const response = await post('game/edit', data);

    await updateGame(data);
    return response;
  },
  unDraftQuiz: async (quizId: string | number) => {
    await post('quiz/unDraft', { quizId });

    await unDraftQuiz(quizId);
  },
}));

interface AppState {
  confirmationModal: ConfirmationModalState | null;
}

export interface ConfirmationModalState {
  title: string;
  body: React.ReactNode;
  okText?: string;
  okCallback?: Function;
  className?: string;
  cancelText?: string;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
  isAlert?: boolean;
  doNotShowAgainKey?: string;
}
