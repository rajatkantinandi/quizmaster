import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function Login() {
  const navigate = useNavigate();
  const { logIn, showErrorModal } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleLogin(data: FieldValues) {
    try {
      await logIn(data);

      navigate(`/quizzes/${data.userName}`);
    } catch (errMessage: any) {
      showErrorModal({ message: errMessage.message });
    }
  }

  return (
    <div className="flex flexCol">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Form className="flex flexCol container-md" onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          name="userName"
          id="userName"
          control={control}
          rules={{ required: 'Please enter username' }}
          errorMessage={errors.username?.message}
          label="Username"
          inputProps={{
            type: 'text',
            labelPosition: 'left',
            autoFocus: true,
          }}
        />
        <FormInput
          name="password"
          id="password"
          control={control}
          rules={{ required: 'Please enter password' }}
          errorMessage={errors.password?.message}
          label="Password"
          inputProps={{
            type: 'password',
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
