import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

const PathNameTitleMap: Record<string, string> = {
  quizzes: 'Quizzes',
  'play-quiz': 'Play quiz',
  'edit-quiz': 'Edit quiz',
  'create-quiz': 'Create quiz',
  login: 'Sign in',
  signup: 'Sign up',
};

function setPageTitle(customTitle: string) {
  const pathKey = window.location.pathname.split('/')[1];
  document.title =
    PathNameTitleMap[pathKey] || customTitle
      ? (customTitle || PathNameTitleMap[pathKey]) + ' - Quizmaster'
      : 'Quizmaster';
}
