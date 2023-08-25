import React from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { Button, Text } from '@mantine/core';
import classNames from 'classnames';

export default function AddOrUpdateQuizName({ name = '', hideSubmitButton = false, handleFormSubmit }) {
  const { control, handleSubmit } = useForm({ defaultValues: { name } });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormInput
        name="name"
        control={control}
        rules={{ required: 'Please enter a name for the quiz' }}
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
        className={classNames({ displayNone: hideSubmitButton })}
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
