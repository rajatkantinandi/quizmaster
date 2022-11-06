import React from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../../components/FormInputs';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import { Button, Grid } from '@mantine/core';

export default function ConfigureQuiz() {
  const { userName = 'guest' } = useParams();
  const navigate = useNavigate();
  const { createOrUpdateQuiz } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      <form onSubmit={handleSubmit(handleAddQuizName)} style={{ paddingTop: '150px' }}>
        <Grid align="center" pt="xl" mt="xl">
          <Grid.Col span={4} offset={4} pt="xl" mt="xl">
            <FormInput
              name="name"
              id="name"
              register={register}
              rules={{ required: 'Please enter quiz name' }}
              errorMessage={errors.name?.message || ''}
              type="text"
              placeholder="Please enter quiz name"
              variant="filled"
              radius="md"
              size="md"
            />
            <Button mt="xl" radius="sm" size="md" fullWidth type="submit" variant="filled">
              Create Quiz
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
