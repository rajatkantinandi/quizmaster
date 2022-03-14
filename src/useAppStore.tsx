import React from 'react';
import create from 'zustand';
import { post } from './helpers/request';

export const useAppStore = create((set: Function) => ({
  confirmationModal: null,
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

    if (response.userId) {
      set((state: AppState) => ({
        ...state,
        userData: response,
      }));
    }
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
