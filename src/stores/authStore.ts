import { post } from '../helpers';

export const getAuthStore = (set: Function, get: Function) => ({
  userData: {
    userName: '',
    userId: null,
    emailId: '',
    token: '',
  },
  signUp: async (data) => {
    await post('user/signup', data);
  },
  logIn: async (data) => {
    await post('user/login', data);
  },
  logout: async () => {
    await post('user/logout', { userId: get().userData.userId });
  },
  sendForgotPasswordLink: async (data) => {
    await post('user/forgotpassword', data);
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
