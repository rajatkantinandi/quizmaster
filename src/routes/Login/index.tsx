import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import cookie from 'js-cookie';
import { nanoid } from 'nanoid';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../useAppStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  useLoginCheckAndPageTitle();
  const navigate = useNavigate();
  const { logIn, showErrorModal } = useAppStore();
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

      navigate(`/quizzes/${data.userName}`);
    } catch (errMessage: any) {
      showErrorModal({ message: errMessage });
    }
  }

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
