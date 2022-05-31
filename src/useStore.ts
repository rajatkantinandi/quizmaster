import create, { StoreApi, UseBoundStore } from 'zustand';
import { AppState, getAppStore } from './stores/appStore';
import { AuthState, getAuthStore } from './stores/authStore';
import { getQuizStore, QuizState } from './stores/quizStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type CombinedState = AppState & AuthState & QuizState;

export const useStore: UseBoundStore<StoreApi<CombinedState>> = create<any>()(immer(devtools((set: Function, get: Function) => ({
  ...getAppStore(set, get),
  ...getAuthStore(set, get),
  ...getQuizStore(),
}), { name: 'AppStore' })));
