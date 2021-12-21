import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Card } from 'semantic-ui-react';
import { getQuizzes } from '../../helpers/quiz';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';

export default function Login() {
  const { userName } = useParams();
  const [quizzes, setQuizzes] = useState<any>([]);
  const navigate = useNavigate();
  useLoginCheckAndPageTitle();

  useEffect(() => {
    getQuizzes().then((quizzes) => {
      if (quizzes) {
        setQuizzes(quizzes);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>Welcome: {userName}</h1>
      <h2>Quizzes</h2>
      <section className="mb-xl flex flexWrap">
        {quizzes.map((quiz: any) => (
          <Card
            key={quiz.id}
            className="flex alignCenter"
            onClick={() => {
              if (quiz.isDraft) {
                navigate(`/edit-quiz/${userName}/${quiz.id}`);
              } else {
                navigate(`/play-quiz/${userName}/${quiz.id}`);
              }
            }}>
            <div className="title">{quiz.name}</div>
            <div className="details">
              {quiz.categories.length} Categories
              <br />
              {quiz.categories[0].questions.length} Questions per category.
              {quiz.isDraft && <div className="badge">Draft</div>}
            </div>
            <div className="action">{quiz.isDraft ? 'Edit' : 'Play'}</div>
          </Card>
        ))}
      </section>
      <Button onClick={() => navigate(`/create-quiz/${userName}`)} size="large" color="green">
        + Create Quiz
      </Button>
    </>
  );
}
