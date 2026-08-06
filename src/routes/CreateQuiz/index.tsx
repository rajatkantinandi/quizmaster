import React from 'react';
import { useStore } from '../../useStore';
import { FieldValues } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';
import { getEmptyCategory } from '../../helpers';

export default function ConfigureQuiz({ userName = 'guest' }) {
  const navigate = useNavigate();
  const { createOrUpdateQuiz } = useStore();

  async function handleAddQuizName(formData: FieldValues) {
    const data: any = {
      name: formData.name,
      categories: [getEmptyCategory()],
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
      <div className="grid grid-cols-12 items-center pt-xl">
        <div className="col-span-4 col-start-5 pt-xl mt-xl">
          <AddOrUpdateQuizName handleFormSubmit={handleAddQuizName} />
        </div>
      </div>
    </>
  );
}
