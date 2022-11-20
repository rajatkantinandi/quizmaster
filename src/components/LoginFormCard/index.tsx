import React, { useEffect } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { Card, Button, Title, Text, Divider } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function LoginFormCard() {
  const { logIn, showModal, showAlert } = useStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleLogin(data: FieldValues) {
    Cookies.remove('userName');
    await logIn(data);
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

  function loginAsGuest() {
    if (!localStorage.getItem('DoNotShowGuestAccountWarning')) {
      showGuestLoginWarning(guestAccountLogin);
    } else {
      guestAccountLogin();
    }
  }

  function guestAccountLogin() {
    Cookies.set('userName', 'guest');
    window.location.href = '/quizzes/guest';
  }

  function showGuestLoginWarning(okCallback: Function) {
    showModal({
      title: 'Logging in as a guest',
      body: 'Anyone will be able to access the quizzes created in a guest account.',
      doNotShowAgainKey: 'GuestAccountWarning',
      okText: 'Continue',
      okCallback,
    });
  }

  return (
    <Card shadow="xs" p="lg" radius="xs" withBorder className="primaryCard">
      <Title align="center" order={4}>
        Log in
      </Title>
      <form onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          name="userName"
          id="userName"
          register={register}
          rules={{ required: 'Please enter your username' }}
          errorMessage={errors.userName?.message}
          label="Username"
          type="text"
          autoFocus
        />
        <FormInput
          name="password"
          id="password"
          register={register}
          rules={{ required: 'Please enter your password' }}
          errorMessage={errors.password?.message}
          label="Password"
          type="password"
        />
        <Text size="sm" align="right" mt="sm">
          <Link to="/forgot-password">Forgot password?</Link>
        </Text>
        <Button mt="xs" size="md" radius="sm" type="submit" fullWidth variant="filled">
          Login
        </Button>
        <Divider my="sm" labelProps={{ weight: 'bold', size: 'md' }} label="OR" labelPosition="center" color="black" />
        <Button mt="xs" size="md" radius="sm" fullWidth variant="default" onClick={loginAsGuest}>
          Login as a guest
        </Button>
      </form>
      <Text size="sm" align="center" mt="sm">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </Text>
    </Card>
  );
}
