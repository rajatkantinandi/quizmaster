import {
  postRedirect,
  getCookie,
} from '../helpers';

export const getAuthStore = (set: Function, get: Function) => ({
  userData: {},
  signUp: async (data: any) => {
    await postRedirect('user/signup', data);
  },
  logIn: async (data: any) => {
    await postRedirect('user/login', data);
  },
  logout: async () => {
    await postRedirect('user/logout', { userToken: getCookie('userToken'), userId: get().userData.userId });
  },
});