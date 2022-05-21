import React from 'react';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import styles from './styles.module.css';
import cookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useAppStore } from '../../useAppStore';

export default function HomePage() {
  const navigate = useNavigate();
  useLoginCheckAndPageTitle();
  const { setConfirmationModal } = useAppStore();

  function loginAsGuest() {
    if (!localStorage.getItem('DoNotShowGuestAccountWarning')) {
      showGuestLoginWarning(guestAccountLogin);
    } else {
      guestAccountLogin();
    }
  }

  function guestAccountLogin() {
    const userName = 'guest';

    cookie.set('sessionId', nanoid(16), {
      domain: window.location.hostname,
      sameSite: 'Strict',
    });
    cookie.set('userName', btoa(userName), {
      domain: window.location.hostname,
      sameSite: 'Strict',
    });
    navigate(`/quizzes/${userName}`);
  }

  function showGuestLoginWarning(okCallback: Function) {
    setConfirmationModal({
      title: 'Logging in as a guest',
      body: 'Anyone will be able to access the quizzes created in a guest account.',
      doNotShowAgainKey: 'GuestAccountWarning',
      okText: 'Continue',
      okCallback,
    });
  }

  return (
    <section>
      <h1>Welcome to quizmaster</h1>
      <nav className={styles.nav}>
        <div className="flex">
          <Button onClick={() => navigate('/login')} color="green" size="large">
            Login
          </Button>
          <Button className="ml-lg" onClick={() => navigate('/signup')} color="blue" size="large">
            Signup
          </Button>
        </div>
        <div className={styles.or}>OR</div>
        <Button onClick={loginAsGuest} color="grey" size="big">
          Continue as a guest
        </Button>
      </nav>
    </section>
  );
}
