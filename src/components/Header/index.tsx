import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header as SemanticHeader, Icon } from 'semantic-ui-react';
import logo from '../../img/logo.svg';
import { useStore } from '../../useStore';
import { useNavigate } from 'react-router';

export default function Header() {
  const { logout, showErrorModal } = useStore();
  const userData = useStore<{ userName?: string }>((state) => state.userData);
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await logout();
    } catch (err) {
      showErrorModal({ message: 'Something went wrong while logout' });
    }
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
