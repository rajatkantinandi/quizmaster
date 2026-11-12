import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamGenerator from './index';

jest.mock('../../useStore', () => ({
  useStore: () => ({
    showAlert: jest.fn(),
    enableOkButton: jest.fn(),
    disableOkButton: jest.fn(),
  }),
}));

function renderTeamGenerator() {
  const createTeams = jest.fn();
  render(
    <>
      <TeamGenerator players="" teams={[]} teamCount={2} createTeams={createTeams} />
      <button onClick={() => document.getElementById('teamNameFormSubmit')?.click()}>Continue</button>
    </>,
  );
  return createTeams;
}

test('creates the requested number of teams after the count is edited', async () => {
  const user = userEvent.setup();
  const createTeams = renderTeamGenerator();
  await user.type(screen.getByPlaceholderText('Enter player names'), 'Ada\nBen\nChen\nDara\nEve\nFinn');
  const count = screen.getByRole('spinbutton', { name: 'Number of teams' });
  await user.clear(count);
  await user.type(count, '3');
  await user.click(screen.getByRole('button', { name: 'Generate team' }));

  expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(3);
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(createTeams).toHaveBeenCalledTimes(1);
  const generatedTeams = createTeams.mock.calls[0][0].teams;
  expect(generatedTeams).toHaveLength(3);
  expect(generatedTeams.flatMap((team) => team.players.split(',')).sort()).toEqual([
    'Ada',
    'Ben',
    'Chen',
    'Dara',
    'Eve',
    'Finn',
  ]);
});

test('hides generated teams when the player names change', async () => {
  const user = userEvent.setup();
  renderTeamGenerator();
  const names = screen.getByPlaceholderText('Enter player names');
  await user.type(names, 'Ada\nBen\nChen\nDara');
  await user.click(screen.getByRole('button', { name: 'Generate team' }));
  expect(screen.getByRole('list')).toBeInTheDocument();

  await user.type(names, '\nEve');
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
  expect(screen.queryByPlaceholderText('Enter team names')).not.toBeInTheDocument();
});

test('rejects a fractional team count', async () => {
  const user = userEvent.setup();
  renderTeamGenerator();
  await user.type(screen.getByPlaceholderText('Enter player names'), 'Ada\nBen\nChen\nDara');
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2.5' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Generate team' }).closest('form')!);

  expect(await screen.findByText('Enter a whole number of at least 2')).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
