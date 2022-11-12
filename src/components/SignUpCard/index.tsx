import React, { useEffect } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { useNavigate } from 'react-router';
import { Card, Button, Title, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function SignUpCard() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signUp, showModal, showAlert } = useStore();
  const navigate = useNavigate();

  async function handleSignUp(data: FieldValues) {
    await signUp(data);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('error')) {
      showAlert({
        message: params.get('error') || '',
        type: 'error',
        callback: () => navigate('/login'),
      });
    }
  }, []);

  const shouldMatchWithPassword = (value: string) => value === getValues('password') || 'Should match with password';

  return (
    <Card shadow="xs" p="lg" radius="xs" withBorder className="primaryCard">
      <Title align="center" order={4}>
        Sign up
      </Title>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <FormInput
          name="name"
          id="name"
          register={register}
          rules={{ required: 'Please enter your name' }}
          errorMessage={errors.name?.message}
          label="Name"
          autoFocus
        />
        <FormInput
          name="emailId"
          id="emailId"
          register={register}
          rules={{ required: 'Please enter your email' }}
          errorMessage={errors.emailId?.message}
          label="EmailId"
          type="email"
        />
        <FormInput
          name="userName"
          id="userName"
          register={register}
          rules={{
            required: 'Please enter your username',
            minLength: { value: 6, message: 'too small username' },
          }}
          label="Username (min 6 chars)"
          errorMessage={errors.userName?.message}
        />
        <FormInput
          name="password"
          id="password"
          register={register}
          rules={{
            required: 'Please enter your password',
            minLength: { value: 8, message: 'too small password' },
          }}
          errorMessage={errors.password?.message}
          label="Password (min 8 chars)"
          type="password"
        />
        <FormInput
          name="repeatPassword"
          id="repeatPassword"
          register={register}
          rules={{
            required: 'Please re-enter your password',
            validate: shouldMatchWithPassword,
          }}
          errorMessage={errors.repeatPassword?.message}
          label="Password (min 8 chars)"
          type="password"
        />
        <Button mt="xs" size="md" radius="sm" type="submit" fullWidth variant="filled">
          Sign up
        </Button>
      </form>
      <Text size="sm" align="center" mt="sm">
        Already have an account? <Link to="/login">Log in</Link>
      </Text>
    </Card>
  );
}
