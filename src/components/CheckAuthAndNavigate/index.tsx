import { Navigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
import { useStore } from '../../useStore';
import React from 'react';
import { isValidUser } from '../../helpers/authHelper';

function CheckAuthAndNavigate() {
  const userData = useStore((state) => state.userData);
  /**
   * Original code
  ```js
    const isGuestUser = Cookies.get('userName') === 'guest';
    const userName = isGuestUser ? 'guest' : userData.userName;
  ```
   */
  // Temporarily every not logged in user is guest
  // TODO: revert this when we have a backend & login functionality
  const userName = userData.userName || 'guest';

  if (isValidUser) {
    return <Navigate to={`/my-quizzes/${userName}`} replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default CheckAuthAndNavigate;
