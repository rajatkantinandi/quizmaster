import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Container, Form, Input } from 'semantic-ui-react';
import { getHashedPassword } from '../../helpers/crypto';
import cookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useLoginCheck } from '../../hooks/useLoginCheck';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  useLoginCheck();

  async function handleLogin(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    if (password && userName) {
      const salt = localStorage.getItem('salt:' + userName);
      const hash = localStorage.getItem('passwordHash:' + userName);
      const hashedPassword = salt && (await getHashedPassword(password, salt));

      if (hashedPassword === hash) {
        cookie.set('sessionId', nanoid(16), {
          domain: window.location.hostname,
          sameSite: 'Strict',
        });
        cookie.set('userName', btoa(userName), {
          domain: window.location.hostname,
          sameSite: 'Strict',
        });
        navigate(`/quizzes/${userName}`);
        return;
      }
    }

    alert('Invalid username & password');
  }

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    switch (ev.target.name) {
      case 'username':
        setUserName(ev.target.value);
        break;
      case 'password':
        setPassword(ev.target.value);
    }
  }

  return (
    <Container>
      <Form className="flexCol flex" onSubmit={handleLogin}>
        <Input
          type="text"
          label="Username"
          labelPosition="left"
          name="username"
          value={userName}
          onChange={handleChange}
        />
        <Input
          type="password"
          label="Password"
          labelPosition="left"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <Button color="blue" className="alignCenter">
          Login
        </Button>
      </Form>
    </Container>
  );
}
