import React, { useEffect } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../FormInputs';
import { useNavigate } from 'react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function SignUpFormCard() {
  const { control, getValues, handleSubmit } = useForm();
  const { signUp, showAlert } = useStore();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shouldMatchWithPassword = (value: string) => value === getValues('password') || 'Should match with password';

  return (
    <Card className="rounded-lg border bg-[var(--primary-card-bg)] p-6 shadow-xs">
      <h4 className="text-center text-lg font-semibold mb-4">Sign up</h4>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <FormInput
          name="name"
          id="name"
          control={control}
          rules={{ required: 'Please enter your name' }}
          label="Name"
          autoFocus
        />
        <FormInput
          name="emailId"
          id="emailId"
          control={control}
          rules={{ required: 'Please enter your email' }}
          label="EmailId"
          type="email"
        />
        <FormInput
          name="userName"
          id="userName"
          control={control}
          rules={{
            required: 'Please enter your username',
            minLength: { value: 6, message: 'too small username' },
          }}
          label="Username (min 6 chars)"
        />
        <FormInput
          name="password"
          id="password"
          control={control}
          rules={{
            required: 'Please enter your password',
            minLength: { value: 8, message: 'too small password' },
          }}
          label="Password (min 8 chars)"
          type="password"
        />
        <FormInput
          name="repeatPassword"
          id="repeatPassword"
          control={control}
          rules={{
            required: 'Please re-enter your password',
            validate: shouldMatchWithPassword,
          }}
          label="Password (min 8 chars)"
          type="password"
        />
        <Button size="lg" className="mt-1 w-full" type="submit" variant="filled">
          Sign up
        </Button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </Card>
  );
}
