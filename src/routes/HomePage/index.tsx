import React from 'react';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useLoginCheck } from '../../hooks/useLoginCheck';

export default function HomePage() {
  const navigate = useNavigate();
  useLoginCheck();

  return (
    <section>
      <h1>Welcome to quizmaster</h1>
      <nav>
        <Button onClick={() => navigate('/login')}>Login</Button>
        <Button onClick={() => navigate('/signup')}>Signup</Button>
      </nav>
    </section>
  );
}
