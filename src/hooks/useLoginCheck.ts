import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getSignedInUserName } from "../helpers/user";

export function useLoginCheck(userName?: string) {
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
}