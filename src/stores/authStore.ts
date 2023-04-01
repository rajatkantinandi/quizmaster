import { postRedirect, post, isGuestUser } from '../helpers';
import Cookies from 'js-cookie';

export const getAuthStore = (set: Function, get: Function) => ({
  userData: {
    userName: '',
    userId: null,
    emailId: '',
    token: '',
    name: '',
  },
  signUp: async (data) => {
    await postRedirect('user/signup', data);
  },
  logIn: async (data) => {
    await postRedirect('user/login', data);
  },
  logout: async () => {
    if (isGuestUser()) {
      Cookies.remove('userToken');
      Cookies.remove('userName');

      window.location.href = '/';
    } else {
      await postRedirect('user/logout', { userId: get().userData.userId });
    }
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
    name: string;
  };
}
