import Cookies from "js-cookie"

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