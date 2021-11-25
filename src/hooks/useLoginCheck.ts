import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getSignedInUserName } from "../helpers/user";

export function useLoginCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const userName = getSignedInUserName();

    if (userName) {
      navigate(`/quizzes/${userName}`, { replace: true });
    }
    else if (!window.location.href.match(/\/login|\/signup/)) {
      navigate('/login');
    }
  }, []);
}