import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useStore } from '../../useStore';

function NavigateToQuizzesIfLoggedIn({ children }: { children: JSX.Element }) {
  const userData = useStore((state) => state.userData);

  if (Cookies.get('userToken')) {
    return <Navigate to={`/quizzes/${userData.userName}`} replace />;
  }

  return children;
}

export default NavigateToQuizzesIfLoggedIn;
