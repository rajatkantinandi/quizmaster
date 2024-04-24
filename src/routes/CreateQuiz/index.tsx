import React from 'react';
import { useStore } from '../../useStore';
import { FieldValues } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import { Grid } from '@mantine/core';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';
import styles from './styles.module.css';
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
      <Grid align="center" pt="xl" className={styles.formWrapper}>
        <Grid.Col span={4} offset={4} pt="xl" mt="xl">
          <AddOrUpdateQuizName handleFormSubmit={handleAddQuizName} />
        </Grid.Col>
      </Grid>
    </>
  );
}
