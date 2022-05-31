import { Navigate } from 'react-router-dom';
import { getCookie } from '../../helpers';

function NavigateToQuizzesIfLoggedIn({ children }: { children: JSX.Element }) {
  if (getCookie('userToken')) {
    return <Navigate to="/quizzes/:userName" replace />;
  }

  return children;
}

export default NavigateToQuizzesIfLoggedIn;
