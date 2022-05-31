import create from 'zustand';
import { getAppStore } from './stores/appStore';
import { getAuthStore } from './stores/authStore';
import { getQuizStore } from './stores/quizStore';
import { devtools } from 'zustand/middleware';

export const useStore = create(devtools((set: Function, get: Function) => ({
  ...getAppStore(set, get),
  ...getAuthStore(set, get),
  ...getQuizStore(),
}), { name: 'AppStore' }));
