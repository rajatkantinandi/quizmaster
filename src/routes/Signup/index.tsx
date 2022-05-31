import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';

export default function Login() {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signUp, showErrorModal } = useStore();

  async function handleSignUp(data: FieldValues) {
    try {
      await signUp(data);
    } catch (errMessage: any) {
      showErrorModal({ message: errMessage });
    }
  }

  const shouldMatchWithPassword = (value: string) => value === getValues('password') || 'Should match with password';

  return (
    <div className="flexCol flex">
      <Form className="flexCol flex container-md" onSubmit={handleSubmit(handleSignUp)}>
        <FormInput
          name="name"
          control={control}
          rules={{ required: 'Please enter name' }}
          errorMessage={errors.name?.message}
          inputProps={{
            type: 'text',
            label: 'Name',
            labelPosition: 'left',
            autoFocus: true,
          }}
        />
        <FormInput
          name="emailId"
          control={control}
          rules={{ required: 'Please enter email' }}
          errorMessage={errors.emailId?.message}
          inputProps={{
            type: 'email',
            label: 'EmailId',
            labelPosition: 'left',
          }}
        />
        <FormInput
          name="userName"
          control={control}
          rules={{
            required: 'Please enter username',
            minLength: { value: 6, message: 'too small username' },
          }}
          errorMessage={errors.userName?.message}
          inputProps={{
            type: 'text',
            label: 'Username (min 6 chars)',
            labelPosition: 'left',
          }}
        />
        <FormInput
          name="password"
          control={control}
          rules={{
            required: 'Please enter password',
            minLength: { value: 8, message: 'too small password' },
          }}
          errorMessage={errors.password?.message}
          inputProps={{
            type: 'password',
            label: 'Password (min 8 chars)',
            labelPosition: 'left',
          }}
        />
        <FormInput
          name="repeatPassword"
          control={control}
          rules={{
            required: 'Please re-enter password',
            validate: shouldMatchWithPassword,
          }}
          errorMessage={errors.repeatPassword?.message}
          inputProps={{
            type: 'password',
            label: 'Password (min 8 chars)',
            labelPosition: 'left',
          }}
        />
        <Button type="submit" color="blue" size="large" className="mt-lg">
          Sign up
        </Button>
      </Form>
      <div className="mt-xl">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
