import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header as SemanticHeader, Icon } from 'semantic-ui-react';
import logo from '../../img/logo.svg';
import { useAppStore } from '../../useAppStore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

export default function Header() {
  const { logout, showErrorModal } = useAppStore();
  const userData = useAppStore<{ userName?: string }>((state) => state.userData);
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await logout();
    } catch (err) {
      showErrorModal({ message: 'Something went wrong while logout' });
    }

    Cookies.set('sessionId', '', {
      domain: window.location.hostname,
      sameSite: 'Strict',
    });
    Cookies.set('userName', '', {
      domain: window.location.hostname,
      sameSite: 'Strict',
    });
    window.location.href = '/';
  }

  return (
    <SemanticHeader className="App-header flex spaceBetween">
      <div className="flex alignCenter">
        <Link to="/">
          <img src={logo} className="App-logo" alt="logo" />
        </Link>
        {userData.userName ? (
          <>
            <div className="mx-lg">{userData.userName}</div>
            <Button color="brown" onClick={onLogout}>
              Sign out
            </Button>
            {!window.location.pathname.includes('quizzes') && (
              <Button onClick={() => navigate(`/quizzes/${userData.userName}`)}>View all quizzes</Button>
            )}
          </>
        ) : (
          <div className="mx-lg">Quizmaster</div>
        )}
      </div>
      <div className="flex">
        <Button
          as="a"
          size="small"
          className="mt-lg ml-lg"
          color="grey"
          href="https://github.com/rajatkantinandi/quizmaster/"
          target="_blank"
          rel="noopener">
          <Icon name="github" /> Github
        </Button>
        <Button
          as="a"
          size="small"
          className="mt-lg ml-lg"
          color="linkedin"
          href="https://github.com/rajatkantinandi/quizmaster/issues/new"
          target="_blank"
          rel="noopener">
          <Icon name="github" /> Report an issue
        </Button>
      </div>
    </SemanticHeader>
  );
}
