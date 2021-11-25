import React, { useState } from 'react';
import { Button, Container, Form, Input } from 'semantic-ui-react';
import { getHashedPassword } from '../../helpers/crypto';
import cookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useLoginCheck } from '../../hooks/useLoginCheck';
import { Link } from 'react-router-dom';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  useLoginCheck();

  async function handleSignUp(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    if (!userName || userName.length < 6) {
      alert('Username must be min 6 chars');
    } else if (!password || password.length < 8) {
      alert('Password must be min 8 chars');
    } else if (passwordRepeat !== password) {
      alert('Passwords do not match');
    } else {
      const salt = nanoid(8);
      const hashedPassword = salt && (await getHashedPassword(password, salt));
      localStorage.setItem('salt:' + userName, salt);
      localStorage.setItem('passwordHash:' + userName, hashedPassword);

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
    <Container>
      <div className="flexCol flex">
        <Form className="flexCol flex" onSubmit={handleSignUp}>
          <Input
            type="text"
            label="Username (min 6 chars)"
            labelPosition="left"
            name="username"
            value={userName}
            onChange={handleChange}
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
          <Button color="blue">Sign up</Button>
        </Form>
        <div>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </Container>
  );
}
