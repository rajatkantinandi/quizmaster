import React, { useEffect } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

export default function LoginFormCard() {
  const { logIn, showModal, showAlert } = useStore();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    window.location.href = '/my-quizzes/guest';
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
    <Card className="rounded-lg border bg-[var(--primary-card-bg)] p-6 shadow-xs">
      <h4 className="text-center text-lg font-semibold mb-4">Log in</h4>
      <form onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          name="userName"
          id="userName"
          control={control}
          rules={{ required: 'Please enter your username' }}
          label="Username"
          type="text"
          autoFocus
        />
        <FormInput
          name="password"
          id="password"
          control={control}
          rules={{ required: 'Please enter your password' }}
          label="Password"
          type="password"
        />
        <p className="text-sm text-right mt-2">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <Button size="lg" className="mt-1 w-full" type="submit" variant="filled">
          Login
        </Button>
        <div className="flex items-center my-4">
          <Separator className="flex-1" />
          <span className="px-4 text-sm font-bold">OR</span>
          <Separator className="flex-1" />
        </div>
        <Button size="lg" className="mt-1 w-full" variant="default" onClick={loginAsGuest}>
          Login as a guest
        </Button>
      </form>
      <p className="text-sm text-center mt-4">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </Card>
  );
}
