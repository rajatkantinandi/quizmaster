import React from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { Button, Grid } from '@mantine/core';

export default function AddOrUpdateQuizName({ name = '', hideSubmitButton = false, handleFormSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name } });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ paddingTop: '150px' }}>
      <Grid align="center" pt="xl" mt="xl">
        <Grid.Col span={4} offset={4} pt="xl" mt="xl">
          <FormInput
            name="name"
            id="name"
            register={register}
            rules={{ required: 'Please enter a name for the quiz' }}
            errorMessage={errors.name?.message || ''}
            type="text"
            placeholder="Please enter a name for the quiz"
            variant="filled"
            label="Quiz name"
            radius="md"
            size="md"
          />
          <Button
            id="btnUpdateQuizNameForm"
            className={hideSubmitButton ? 'displayNone' : ''}
            mt="xl"
            radius="sm"
            size="md"
            fullWidth
            type="submit"
            variant="filled">
            + Create new quiz
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
}
