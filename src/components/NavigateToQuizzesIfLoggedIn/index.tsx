import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function NavigateToQuizzesIfLoggedIn({ children }: { children: JSX.Element }) {
  if (Cookies.get('userToken')) {
    return <Navigate to="/quizzes/:userName" replace />;
  }

  return children;
}

export default NavigateToQuizzesIfLoggedIn;
