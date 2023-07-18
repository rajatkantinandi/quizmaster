import React from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, Button, Title } from '@mantine/core';

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
    <Card shadow="xs" p="lg" radius="xs" withBorder className="primaryCard">
      <Helmet>
        <title>Forgot password</title>
      </Helmet>
      <Title align="center" order={4}>
        Forgot Password?
      </Title>
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
        <Button mt="xl" size="md" radius="md" type="submit" fullWidth variant="filled">
          Email me a reset link
        </Button>
      </form>
      <div className="mt-lg textAlignCenter">
        Remember your password? <Link to="/login">Log in</Link>
      </div>
    </Card>
  );
}
