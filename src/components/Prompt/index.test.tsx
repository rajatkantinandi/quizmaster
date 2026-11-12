import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Prompt from './index';

const mockSave = jest.fn();
const mockHidePrompt = jest.fn();

jest.mock('../../useStore', () => ({
  useStore: {
    use: {
      showPrompt: () => mockHidePrompt,
      prompt: () => ({
        title: 'Edit link',
        initialValue: 'https://example.com',
        okCallback: mockSave,
        textInputProps: { required: true, 'aria-label': 'Link URL' },
      }),
    },
  },
}));

beforeEach(() => jest.clearAllMocks());

test('submits an existing required value without editing it', async () => {
  const user = userEvent.setup();
  render(<Prompt />);

  expect(screen.getByRole('textbox', { name: 'Link URL' })).toHaveValue('https://example.com');
  await user.click(screen.getByRole('button', { name: 'OK' }));
  expect(mockSave).toHaveBeenCalledWith('https://example.com');
  expect(mockHidePrompt).toHaveBeenCalledWith(null);
});

test('keeps a prompt submission from submitting its parent form', async () => {
  const user = userEvent.setup();
  const submitParent = jest.fn((event) => event.preventDefault());
  render(
    <form onSubmit={submitParent}>
      <Prompt />
    </form>,
  );

  await user.click(screen.getByRole('button', { name: 'OK' }));
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(submitParent).not.toHaveBeenCalled();
});
