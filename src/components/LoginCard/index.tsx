import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { Card, Button, Title, Text, Divider } from '@mantine/core';

export default function LoginCard({ setViewType }) {
  const { logIn, showModal } = useStore();
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
      showModal({
        body: params.get('error'),
        title: '',
        okCallback: () => navigate('/login'),
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
    navigate('/quizzes/guest');
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
        Log in on Quizmaster
      </Title>
      <form onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          name="userName"
          id="userName"
          register={register}
          rules={{ required: 'Please enter username' }}
          errorMessage={errors.userName?.message}
          label="Username"
          type="text"
          autoFocus
        />
        <FormInput
          name="password"
          id="password"
          register={register}
          rules={{ required: 'Please enter password' }}
          errorMessage={errors.password?.message}
          label="Password"
          type="password"
        />
        <Text size="sm" align="right" mt="sm">
          <Button compact color="transparent" variant="subtle" onClick={() => setViewType('forgotPassword')}>
            Forgot password ?
          </Button>
        </Text>
        <Button mt="xs" size="md" radius="sm" type="submit" fullWidth variant="filled">
          Login
        </Button>
        <Divider my="sm" labelProps={{ weight: 'bold', size: 'md' }} label="OR" labelPosition="center" color="black" />
        <Button mt="xs" size="md" radius="sm" fullWidth variant="default" onClick={loginAsGuest}>
          Login as guest
        </Button>
      </form>
      <Text size="sm" align="center" mt="sm">
        Don't have an account?
        <Button compact color="transparent" variant="subtle" onClick={() => setViewType('signUp')}>
          Sign up
        </Button>
      </Text>
    </Card>
  );
}
