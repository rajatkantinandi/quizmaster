import React from 'react';
import { useStore } from '../../useStore';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInputs';

export default function UpdateQuizName({ name, quizId, callback }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name } });
  const { updateQuizName } = useStore();

  async function handleQuizName(data) {
    await updateQuizName({ ...data, quizId });
    callback(data.name);
  }

  return (
    <form onSubmit={handleSubmit(handleQuizName)}>
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
      />
      <button id="btnUpdateQuizNameForm" type="submit" className="displayNone">
        submit
      </button>
    </form>
  );
}
