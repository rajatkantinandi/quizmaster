import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import cookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import { Link } from 'react-router-dom';
import { isValidCredentials } from '../../helpers/user';
import { useAppStore } from '../../useAppStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';

export default function Login() {
  // const [userName, setUserName] = useState('');
  // const [password, setPassword] = useState('');
  useLoginCheckAndPageTitle();
  const { logIn } = useAppStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleLogin(data: FieldValues) {
    try {
      await logIn(data);

      cookie.set('sessionId', nanoid(16), {
        domain: window.location.hostname,
        sameSite: 'Strict',
      });
      cookie.set('userName', btoa(data.userName), {
        domain: window.location.hostname,
        sameSite: 'Strict',
      });
      window.location.href = `/quizzes/${data.userName}`;
    } catch (err) {}

    // ev.preventDefault();

    // const isValid = await isValidCredentials({ userName, password });

    // if (isValid) {
    //   cookie.set('sessionId', nanoid(16), {
    //     domain: window.location.hostname,
    //     sameSite: 'Strict',
    //   });
    //   cookie.set('userName', btoa(userName), {
    //     domain: window.location.hostname,
    //     sameSite: 'Strict',
    //   });
    //   window.location.href = `/quizzes/${userName}`;
    //   return;
    // }

    // showErrorModal({ message: 'Invalid username or password! Please try again.' });
  }

  // function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
  //   switch (ev.target.name) {
  //     case 'username':
  //       setUserName(ev.target.value);
  //       break;
  //     case 'password':
  //       setPassword(ev.target.value);
  //   }
  // }

  return (
    <div className="flex flexCol">
      <Form className="flex flexCol container-md" onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          name="userName"
          control={control}
          rules={{ required: 'Please enter username' }}
          errorMessage={errors.username?.message}
          inputProps={{
            type: 'text',
            label: 'Username',
            labelPosition: 'left',
            autoFocus: true,
          }}
        />
        <FormInput
          name="password"
          control={control}
          rules={{ required: 'Please enter password' }}
          errorMessage={errors.password?.message}
          inputProps={{
            type: 'password',
            label: 'Password',
            labelPosition: 'left',
          }}
        />
        <Button type="submit" color="blue" className="alignCenter" size="large">
          Login
        </Button>
      </Form>
      <div className="mt-lg">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
