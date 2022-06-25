import React from 'react';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import Cookies from 'js-cookie';
import { useStore } from '../../useStore';
import { Helmet } from 'react-helmet';

export default function HomePage() {
  const navigate = useNavigate();
  const { setConfirmationModal } = useStore();

  function loginAsGuest() {
    if (!localStorage.getItem('DoNotShowGuestAccountWarning')) {
      showGuestLoginWarning(guestAccountLogin);
    } else {
      guestAccountLogin();
    }
  }

  function guestAccountLogin() {
    Cookies.set('userName', 'guest');
    navigate('/quizzes/guest');
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
      <Helmet>
        <title>Homepage</title>
      </Helmet>
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
