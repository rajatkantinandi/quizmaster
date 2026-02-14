import React from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { Button } from '@/components/ui/button';
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
        label={<div className="mb-2 font-bold">Enter quiz name</div>}
      />
      <Button
        id="btnUpdateQuizNameForm"
        className={classNames({ hidden: hideSubmitButton }, 'mt-6 w-full rounded-full', 'lg')}
        size="lg"
        type="submit"
        variant="filled">
        Continue
      </Button>
    </form>
  );
}
