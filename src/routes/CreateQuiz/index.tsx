import React from 'react';
import { useStore } from '../../useStore';
import { FieldValues } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';

export default function ConfigureQuiz() {
  const { userName = 'guest' } = useParams();
  const navigate = useNavigate();
  const { createOrUpdateQuiz } = useStore();

  async function handleAddQuizName(formData: FieldValues) {
    const data: any = {
      name: formData.name,
      categories: [],
      isDraft: true,
    };
    const resp = await createOrUpdateQuiz(data);

    navigate(`/configure-quiz/${userName}/${resp.quizId}`);
  }

  return (
    <>
      <Helmet>
        <title>Create Quiz</title>
      </Helmet>
      <div style={{ paddingTop: '150px' }}>
        <AddOrUpdateQuizName handleFormSubmit={handleAddQuizName} />
      </div>
    </>
  );
}
