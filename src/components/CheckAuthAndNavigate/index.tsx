import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useStore } from '../../useStore';
import React from 'react';
import { isValidUser } from '../../helpers/authHelper';

function CheckAuthAndNavigate() {
  const userData = useStore((state) => state.userData);
  const isGuestUser = Cookies.get('userName') === 'guest';
  const userName = isGuestUser ? 'guest' : userData.userName;

  if (isValidUser) {
    return <Navigate to={`/my-quizzes/${userName}`} replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default CheckAuthAndNavigate;
