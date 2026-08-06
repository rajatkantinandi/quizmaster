import React from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Login() {
  const { sendForgotPasswordLink, showAlert } = useStore();
  const { control, handleSubmit } = useForm();

  async function handleForgotPassword(data: FieldValues) {
    try {
      await sendForgotPasswordLink(data);
      showAlert({ message: 'Please check your email' });
    } catch (errMessage: any) {
      showAlert({ message: errMessage.message, type: 'error' });
    }
  }

  return (
    <Card className="rounded-lg border bg-[var(--primary-card-bg)] p-6 shadow-xs">
      <Helmet>
        <title>Forgot password</title>
      </Helmet>
      <h4 className="text-center text-lg font-semibold mb-4">Forgot Password?</h4>
      <form onSubmit={handleSubmit(handleForgotPassword)}>
        <FormInput
          name="emailId"
          id="emailId"
          control={control}
          rules={{ required: 'Please enter email' }}
          label="EmailId"
          type="email"
          autoFocus
        />
        <Button size="lg" className="mt-6 w-full" type="submit" variant="filled">
          Email me a reset link
        </Button>
      </form>
      <div className="mt-4 text-center">
        Remember your password? <Link to="/login">Log in</Link>
      </div>
    </Card>
  );
}
