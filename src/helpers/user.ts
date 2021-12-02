import Cookies from "js-cookie"
import { getHashedPassword } from "./crypto";
import db from "./db";

const users = db.collection('users');

export const getSignedInUserName = () => {
  const sessionId = Cookies.get('sessionId');
  const encryptedUserName = Cookies.get('userName');

  if (sessionId && encryptedUserName) {
    return atob(encryptedUserName);
  }
  else {
    return null;
  }
}

export const signUpUser = async ({ userName, salt, passwordHash }: {
  userName: string;
  salt: string;
  passwordHash: string;
}) => {
  await users.insert({
    userName,
    salt,
    passwordHash,
  });
}

export const isValidCredentials = async ({ userName, password }: { userName: string; password: string; }) => {
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
}