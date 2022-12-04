import React from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { Button, Text } from '@mantine/core';
import Icon from '../Icon';

export default function AddOrUpdateQuizName({ name = '', hideSubmitButton = false, handleFormSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name } });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormInput
        name="name"
        id="name"
        register={register}
        rules={{ required: 'Please enter a name for the quiz' }}
        errorMessage={errors.name?.message || ''}
        type="text"
        placeholder="Please enter a name for the quiz"
        variant="filled"
        label={
          <Text mb="xs" weight="bold">
            Enter quiz name
          </Text>
        }
        radius="md"
        size="md"
      />
      <Button
        id="btnUpdateQuizNameForm"
        className={hideSubmitButton ? 'displayNone' : ''}
        mt="xl"
        radius="xl"
        size="md"
        fullWidth
        type="submit"
        variant="filled">
        Continue
      </Button>
    </form>
  );
}
