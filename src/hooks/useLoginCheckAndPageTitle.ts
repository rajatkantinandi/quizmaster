import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getSignedInUserName } from "../helpers/user";

export function useLoginCheckAndPageTitle(customTitle = '') {
  const { userName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const signedInUserName = getSignedInUserName();
    const isSignedInButIncorrectUserUrl = (userName && userName !== signedInUserName);
    const shouldRedirectQuizzesPage = window.location.pathname.match(/\/login|\/signup/) || window.location.pathname.trim() === '/';

    if (signedInUserName) {
      if (shouldRedirectQuizzesPage || isSignedInButIncorrectUserUrl) {
        navigate(`/quizzes/${signedInUserName}`, { replace: true });
      }
    }
    else if (!shouldRedirectQuizzesPage) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPageTitle(customTitle);
  }, [customTitle]);
}

const PathNameTitleMap: Record<string, string> = {
  quizzes: 'Quizzes',
  'play-quiz': 'Play quiz',
  'edit-quiz': 'Edit quiz',
  'create-quiz': 'Create quiz',
  'login': 'Sign in',
  'signup': 'Sign up',
}

function setPageTitle(customTitle: string) {
  const pathKey = window.location.pathname.split('/')[1];
  document.title = PathNameTitleMap[pathKey] || customTitle ? (customTitle || PathNameTitleMap[pathKey]) + ' - Quizmaster' : 'Quizmaster';
}