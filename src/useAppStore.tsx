import React from 'react';
import create from 'zustand';
import { post, get as getReq, postBeaconReq } from './helpers/request';
import { setCookie } from './helpers/cookieHelper';
import config from './config';
import { formatGameData, formatQuizzesData } from './helpers/dataFormatter';
import { saveQuiz, getQuizzes, getQuiz, addGame, getGame } from './helpers/indexedDB';

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

    if (response.userId) {
      set((state: AppState) => ({
        ...state,
        userData: response,
      }));
    }
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
      const response = await getQuizzes(get().userData.userId);

      return response;
    } catch (err) {
      const response = await getReq('quiz/userQuizzes');

      return formatQuizzesData(response);
    }
  },
  getQuiz: async (quizId: number) => {
    try {
      const response = await getQuiz(quizId);

      return response;
    } catch (err) {
      const response = await getReq('quiz/data', { quizId });

      return formatQuizzesData(response)[0];
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
    const { userId } = get().userData;

    await saveQuiz({ ...data, userId });
    return response;
  },
  sendBeaconPost: async (data: any) => {
    if ('sendBeacon' in navigator) {
      const response = await postBeaconReq('quiz/createOrUpdate', data);
      const { userId } = get().userData;

      await saveQuiz({ ...data, userId });
      return response;
    } else {
      const response = await post('quiz/createOrUpdate', data);
      return response;
    }
  },
  editQuestion: async (data: any) => {
    const response = await post('question/edit', data);
    return response;
  },
  addGame: async (data: any) => {
    const response = await post('game/add', data);
    await addGame(data);

    return response;
  },
  getGameData: async (gameId: number) => {
    let response;

    try {
      response = await getGame(gameId);
    } catch (err) {
      response = await getReq('game/data', { gameId });
    }

    return formatGameData(response);
  },
  updateGame: async (data: any) => {
    const response = await post('game/edit', data);
    return response;
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
