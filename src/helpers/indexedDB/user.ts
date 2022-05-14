import Cookies from 'js-cookie';
import { nanoid } from 'nanoid';
import { getHashedPassword } from '../crypto';
import db from './db';

const users = db.collection('users');

export const getSignedInUserName = () => {
  const sessionId = Cookies.get('sessionId');
  const encryptedUserName = Cookies.get('userName');

  if (sessionId && encryptedUserName) {
    return atob(encryptedUserName);
  } else {
    return null;
  }
};

export const signUpUser = async ({ userName, password }: { userName: string; password: string }): Promise<string> => {
  if (userName === 'guest') {
    return 'Can\'t use "guest" as username, to login as guest, go to homepage and click "continue as guest"';
  }

  const existingUser = await users.findOne({
    userName,
  });

  if (existingUser) {
    const isValid = await isValidCredentials({ userName, password });

    if (isValid) {
      return '';
    } else {
      return 'User already exists! Please use proper username & password to sign in.';
    }
  } else {
    const salt = nanoid(8);
    const passwordHash = salt && (await getHashedPassword(password, salt));

    await users.insert({
      userName,
      salt,
      passwordHash,
    });
    return '';
  }
};

export const isValidCredentials = async ({ userName, password }: { userName: string; password: string }) => {
  const value = await users.findOne({
    userName,
  });

  if (value) {
    const { salt, passwordHash } = value as any;
    const hashedPassword = salt && (await getHashedPassword(password, salt));

    if (passwordHash === hashedPassword) {
      return true;
    }
  }

  return false;
};
