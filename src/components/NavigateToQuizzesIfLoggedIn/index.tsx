import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useStore } from '../../useStore';

function NavigateToQuizzesIfLoggedIn({ children }: { children: JSX.Element }) {
  const userData = useStore((state) => state.userData);
  const isGuestUser = Cookies.get('userName') === 'guest';
  const userName = isGuestUser ? 'guest' : userData.userName;

  if (Cookies.get('userToken') || isGuestUser) {
    return <Navigate to={`/quizzes/${userName}`} replace />;
  }

  return children;
}

export default NavigateToQuizzesIfLoggedIn;
