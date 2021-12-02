import React, { useState } from 'react';
import { Button, Container, Form, Input } from 'semantic-ui-react';
import cookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useLoginCheck } from '../../hooks/useLoginCheck';
import { Link } from 'react-router-dom';
import { isValidCredentials } from '../../helpers/user';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  useLoginCheck();

  async function handleLogin(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const isValid = await isValidCredentials({ userName, password });

    if (isValid) {
      cookie.set('sessionId', nanoid(16), {
        domain: window.location.hostname,
        sameSite: 'Strict',
      });
      cookie.set('userName', btoa(userName), {
        domain: window.location.hostname,
        sameSite: 'Strict',
      });
      window.location.href = `/quizzes/${userName}`;
      return;
    }

    alert('Invalid username or password');
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
      <div className="flex flexCol">
        <Form className="flex flexCol" onSubmit={handleLogin}>
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
          <Button color="blue" className="alignCenter" size="large">
            Login
          </Button>
        </Form>
        <div className="mt-lg">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </Container>
  );
}
