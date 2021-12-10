import React from 'react';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';

export default function HomePage() {
  const navigate = useNavigate();
  useLoginCheckAndPageTitle();

  return (
    <section>
      <h1>Welcome to quizmaster</h1>
      <nav>
        <Button onClick={() => navigate('/login')} color="green">
          Login
        </Button>
        <Button className="ml-lg" onClick={() => navigate('/signup')} color="blue">
          Signup
        </Button>
      </nav>
    </section>
  );
}
