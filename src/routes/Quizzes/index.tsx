import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Card } from 'semantic-ui-react';
import { useAppStore } from '../../useAppStore';

export default function Quizzes() {
  const { userName } = useParams();
  const [quizzes, setQuizzes] = useState<any>([]);
  const { getQuizzes } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes().then((quizzes) => {
      setQuizzes(quizzes);
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
            key={quiz.quizId}
            className="flex alignCenter"
            onClick={() => {
              if (quiz.isDraft) {
                navigate(`/configure-quiz/${userName}/${quiz.quizId}`);
              } else {
                navigate(`/configure-game/${userName}/${quiz.quizId}`);
              }
            }}>
            <div className="title">{quiz.name}</div>
            <div className="details">
              {quiz.categories.length} Categories
              <br />
              {quiz.numberOfQuestionsPerCategory} Questions per category.
              {quiz.isDraft && <div className="badge">Draft</div>}
            </div>
            <div className="action">{quiz.isDraft ? 'Edit' : 'Play'}</div>
          </Card>
        ))}
      </section>
      <Button onClick={() => navigate(`/configure-quiz/${userName}`)} size="large" color="green">
        + Create Quiz
      </Button>
    </>
  );
}
