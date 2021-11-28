import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Card } from 'semantic-ui-react';
import { useLoginCheck } from '../../hooks/useLoginCheck';

export default function Login() {
  const { userName } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  useLoginCheck();

  useEffect(() => {
    const quizzes = localStorage.getItem(`quizzes:${userName}`);

    if (quizzes) {
      setQuizzes(JSON.parse(quizzes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>Welcome: {userName}</h1>
      <section>
        {quizzes.map((quiz: any) => (
          <Card key={quiz.id} onClick={() => navigate(`/quiz/${quiz.id}`)}>
            {quiz.title}
          </Card>
        ))}
      </section>
      <Button onClick={() => navigate(`/create-quiz/${userName}`)} color="green">
        Create Quiz
      </Button>
    </>
  );
}
