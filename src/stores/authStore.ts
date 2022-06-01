import { postRedirect } from '../helpers';

export const getAuthStore = (set: Function, get: Function) => ({
  userData: {
    userName: '',
    userId: null,
    emailId: '',
    token: '',
  },
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
  userData: {
    userName: string;
    userId: number;
    emailId: string;
    token: string;
  };
}
