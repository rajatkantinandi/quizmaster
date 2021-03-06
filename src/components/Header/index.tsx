import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header as SemanticHeader, Icon } from 'semantic-ui-react';
import { getSignedInUserName, signOut } from '../../helpers/user';
import logo from '../../img/logo.svg';

export default function Header() {
  const userName = getSignedInUserName();

  return (
    <SemanticHeader className="App-header flex spaceBetween">
      <div className="flex alignCenter">
        <Link to="/">
          <img src={logo} className="App-logo" alt="logo" />
        </Link>
        {userName ? (
          <>
            <div className="mx-lg">{userName}</div>
            <Button color="brown" onClick={signOut}>
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
