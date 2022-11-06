import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { Helmet } from 'react-helmet';

export default function Login({ setViewType }) {
  const { sendForgotPasswordLink, showAlert } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleLogin(data: FieldValues) {
    try {
      await sendForgotPasswordLink(data);
      showAlert({ message: 'Please check your email' });
    } catch (errMessage: any) {
      showAlert({ message: errMessage.message, type: 'error' });
    }
  }

  return (
    <div className="flex flexCol">
      <Helmet>
        <title>Forgot password</title>
      </Helmet>
      <Form className="flex flexCol container-md" onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          name="emailId"
          id="emailId"
          rules={{ required: 'Please enter email' }}
          errorMessage={errors.emailId?.message}
          label="EmailId"
          type="email"
          autoFocus
          register={register}
        />
        <Button type="submit" color="blue" className="textAlignCenter" size="large">
          Email me a reset link
        </Button>
      </Form>
      <div className="mt-lg">
        Remember your password? <button onClick={() => setViewType('logIn')}>Log in</button>
      </div>
    </div>
  );
}
