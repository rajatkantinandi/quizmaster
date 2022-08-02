import React, { useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { Helmet } from 'react-helmet';
import styles from './styles.module.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

export default function Login() {
  const { logIn, showErrorModal } = useStore();
  const navigate = useNavigate();
  const {
    control,
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
      showErrorModal({
        message: params.get('error'),
        okCallback: () => navigate('/login'),
      });
    }
  }, []);

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
        <div className={styles.forgotLinkWrapper}>
          <Button type="submit" color="blue" className="alignCenter" size="large">
            Login
          </Button>
          <Link to="/forgotpassword">Forgot password ?</Link>
        </div>
      </Form>
      <div className="mt-lg">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
