import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WithOptions from './WithOptions';

const options = [
  { optionId: 1, text: '<p>Four</p>', isCorrect: true },
  { optionId: 2, text: '<p>Five</p>', isCorrect: false },
];

function QuestionChoices() {
  const [choices, setChoices] = useState<number[]>([]);
  return (
    <WithOptions
      options={options}
      selectedChoices={choices}
      setSelectedChoices={setChoices}
      selectedOptionIds={null}
      isAttempted={false}
      isTimerRunning
    />
  );
}

test('selects and clears choices through their labels', async () => {
  const user = userEvent.setup();
  render(<QuestionChoices />);
  await user.click(screen.getByText('Four'));
  expect(screen.getByRole('checkbox', { name: 'Four' })).toBeChecked();
  await user.click(screen.getByText('Five'));
  expect(screen.getByRole('checkbox', { name: 'Five' })).toBeChecked();
  await user.click(screen.getByText('Four'));
  expect(screen.getByRole('checkbox', { name: 'Four' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Five' })).toBeChecked();
});

test('shows the correct answer and prevents changes after submission', () => {
  render(
    <WithOptions
      options={options}
      selectedChoices={[2]}
      setSelectedChoices={jest.fn()}
      selectedOptionIds={[2]}
      isAttempted
      isTimerRunning={false}
    />,
  );
  expect(screen.getByRole('checkbox', { name: 'Correct answer 1' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Four' })).toBeDisabled();
  expect(screen.getByRole('checkbox', { name: 'Five' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Five' })).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
});
