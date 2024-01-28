import { create, StoreApi, UseBoundStore } from 'zustand';
import { AppState, getAppStore } from './stores/appStore';
import { AuthState, getAuthStore } from './stores/authStore';
import { getQuizStore, QuizState } from './stores/quizStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type CombinedState = AppState & AuthState & QuizState;

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

const useStoreBase: UseBoundStore<StoreApi<CombinedState>> = create<any>()(
  immer(
    devtools(
      (set: Function, get: Function) => ({
        ...getAppStore(set, get),
        ...getAuthStore(set, get),
        ...getQuizStore(set, get),
      }),
      { name: 'AppStore' },
    ),
  ),
);

export const useStore = createSelectors(useStoreBase);
