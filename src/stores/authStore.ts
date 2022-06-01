import { postRedirect } from '../helpers';

export const getAuthStore = (set: Function, get: Function) => ({
  userData: {},
  signUp: async (data) => {
    await postRedirect('user/signup', data);
  },
  logIn: async (data) => {
    await postRedirect('user/login', data);
  },
  logout: async () => {
    await postRedirect('user/logout', { userId: get().userData.userId });
  },
});

export interface AuthState extends Omit<ReturnType<typeof getAuthStore>, 'userData'> {
  userData: object;
}
