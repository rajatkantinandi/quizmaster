import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import FormInput from './Input';
import { Button } from '../ui/button';

function QuizNameForm({ onSubmit }: { onSubmit: (data: { name: string }) => void }) {
  const { control, handleSubmit } = useForm({ defaultValues: { name: '' } });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput name="name" label="Quiz name" control={control} rules={{ required: 'Enter a quiz name' }} />
      <Button type="submit">Save quiz</Button>
      <Button>Preview quiz</Button>
    </form>
  );
}

test('focuses and describes the required input when the form is submitted empty', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<QuizNameForm onSubmit={onSubmit} />);

  await user.click(screen.getByRole('button', { name: 'Save quiz' }));

  const input = screen.getByRole('textbox', { name: 'Quiz name' });
  expect(input).toHaveFocus();
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('Enter a quiz name');
  expect(onSubmit).not.toHaveBeenCalled();
});

test('submits the entered quiz name and keeps other buttons from submitting', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<QuizNameForm onSubmit={onSubmit} />);

  await user.click(screen.getByText('Quiz name'));
  expect(screen.getByRole('textbox')).toHaveFocus();
  await user.type(screen.getByRole('textbox'), 'Friday quiz');
  await user.click(screen.getByRole('button', { name: 'Preview quiz' }));
  expect(onSubmit).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button', { name: 'Save quiz' }));
  expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Friday quiz' });
});
