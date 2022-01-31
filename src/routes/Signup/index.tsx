import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { getHashedPassword } from '../../helpers/crypto';
import cookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import { Link } from 'react-router-dom';
import { signUpUser } from '../../helpers/user';
import { useAppStore } from '../../useAppStore';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  useLoginCheckAndPageTitle();
  const { showErrorModal } = useAppStore();

  async function handleSignUp(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    if (!userName || userName.length < 6) {
      showErrorModal({ message: 'Username must be min 6 chars' });
    } else if (!password || password.length < 8) {
      showErrorModal({ message: 'Password must be min 8 chars' });
    } else if (passwordRepeat !== password) {
      showErrorModal({ message: 'Passwords do not match' });
    } else {
      const salt = nanoid(8);
      const passwordHash = salt && (await getHashedPassword(password, salt));
      await signUpUser({ userName, salt, passwordHash });

      cookie.set('sessionId', nanoid(16), {
        domain: window.location.hostname,
        sameSite: 'Strict',
      });
      cookie.set('userName', btoa(userName), {
        domain: window.location.hostname,
        sameSite: 'Strict',
      });
      window.location.href = `/quizzes/${userName}`;
    }
  }

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    switch (ev.target.name) {
      case 'username':
        setUserName(ev.target.value);
        break;
      case 'password':
        setPassword(ev.target.value);
        break;
      case 'repeat-password':
        setPasswordRepeat(ev.target.value);
    }
  }

  return (
    <div className="flexCol flex">
      <Form className="flexCol flex container-md" onSubmit={handleSignUp}>
        <Input
          type="text"
          label="Username (min 6 chars)"
          labelPosition="left"
          name="username"
          value={userName}
          onChange={handleChange}
          autoFocus
        />
        <Input
          type="password"
          label="Password (min 8 chars)"
          labelPosition="left"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <Input
          type="password"
          label="Repeat Password"
          labelPosition="left"
          name="repeat-password"
          value={passwordRepeat}
          onChange={handleChange}
        />
        <Button color="blue" size="large" className="mt-lg">
          Sign up
        </Button>
      </Form>
      <div className="mt-xl">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
