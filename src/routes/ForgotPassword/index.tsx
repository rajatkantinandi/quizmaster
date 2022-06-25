import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { Helmet } from 'react-helmet';

export default function Login() {
  const { sendForgotPasswordLink, showErrorModal } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleLogin(data: FieldValues) {
    try {
      await sendForgotPasswordLink(data);
      showErrorModal({ message: 'Please check your email' });
    } catch (errMessage: any) {
      showErrorModal({ message: errMessage.message });
    }
  }

  return (
    <div className="flex flexCol">
      <Helmet>
        <title>Forgot password</title>
      </Helmet>
      <Form className="flex flexCol container-md" onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          name="emailId"
          id="emailId"
          control={control}
          rules={{ required: 'Please enter email' }}
          errorMessage={errors.emailId?.message}
          label="EmailId"
          inputProps={{ type: 'email', autoFocus: true }}
        />
        <Button type="submit" color="blue" className="alignCenter" size="large">
          Email me a reset link
        </Button>
      </Form>
      <div className="mt-lg">
        Remember your password? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
