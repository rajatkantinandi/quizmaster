import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useStore } from '../useStore';
import { defaultGameInfo } from '../constants';
import { GameInfo, QuizInfo } from '../types';
import ConfigureGame from './ConfigureGame';
import PlayQuiz from './PlayQuiz';

jest.setTimeout(30000);

jest.mock('../useStore', () => ({ useStore: jest.fn() }));
jest.mock('../helpers/track', () => ({ track: jest.fn() }));
jest.mock('react-confetti-boom', () => () => null);
jest.mock('nanoid', () => ({ nanoid: () => 'test-id' }));

const getQuiz = jest.fn();
const getGameData = jest.fn();
const addGame = jest.fn();
const updateGame = jest.fn();

function makeQuiz(questionCount: number): QuizInfo {
  return {
    quizId: 1,
    name: 'Test quiz',
    categories: [
      {
        categoryId: 1,
        categoryName: 'General',
        questions: Array.from({ length: questionCount }, (_, index) => ({
          questionId: `${index + 1}`,
          categoryId: 1,
          text: `Question text ${index + 1}`,
          points: 100,
          options: [
            { optionId: 1, text: 'Right choice', isCorrect: true },
            { optionId: 2, text: 'Wrong choice', isCorrect: false },
          ],
        })),
      },
    ],
  };
}

function makeGame(questionCount: number, overrides: Partial<GameInfo> = {}): GameInfo & { quiz: QuizInfo[] } {
  return {
    ...defaultGameInfo,
    currentTeamId: 1,
    teams: [1, 2, 3].map((teamId) => ({
      teamId,
      name: `Team ${teamId}`,
      score: 0,
      players: '',
      avatarColor: 'blue',
      selectedOptions: [],
    })),
    ...overrides,
    quiz: [makeQuiz(questionCount)],
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  (useStore as unknown as jest.Mock).mockReturnValue({
    getQuiz,
    getGameData,
    addGame,
    updateGame,
    showModal: jest.fn(),
    showAlert: jest.fn(),
    markGameCompleted: jest.fn(),
  });
  addGame.mockResolvedValue({ gameId: 1 });
  updateGame.mockResolvedValue(undefined);
});

function click(element: HTMLElement) {
  act(() => {
    userEvent.click(element);
  });
}

function renderConfiguration() {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ConfigureGame quizId="1" />} />
        <Route path="/play-game/guest/1" element={<div>Game opened</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderGame() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<PlayQuiz gameId="1" userName="guest" />} />
        <Route path="/configure-game/guest/1" element={<div>Game configuration</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function answerQuestion(questionNumber: number, correct = true, expectedResponses = questionNumber) {
  click(screen.getByText(`Question ${questionNumber}`).closest('button')!);
  click(screen.getByLabelText(correct ? 'Right choice' : 'Wrong choice'));
  click(screen.getByText('Submit', { selector: 'span' }).closest('button')!);
  await waitFor(() => expect(screen.getByLabelText(correct ? 'Right choice' : 'Wrong choice')).toBeChecked());
  await waitFor(() => expect(updateGame).toHaveBeenCalledTimes(expectedResponses));
}

test('blocks one question and three teams with an explanation, including form submission', async () => {
  getQuiz.mockResolvedValue(makeQuiz(1));
  renderConfiguration();
  await screen.findByText('Configure game for Test quiz');
  click(screen.getByRole('button', { name: /Add team/ }));
  screen.getAllByPlaceholderText('Enter team name').forEach((input, index) =>
    act(() => {
      userEvent.type(input, `Team ${index + 1}`);
    }),
  );
  expect(screen.getByRole('alert')).toHaveTextContent('fewer questions (1) than teams (3)');
  expect(screen.getByRole('button', { name: /Play Game/ })).toBeDisabled();
  await act(async () => {
    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);
  });
  expect(addGame).not.toHaveBeenCalled();
  expect(screen.queryByText('Game opened')).not.toBeInTheDocument();
});

test.each([3, 4])('starts a configuration with %i questions and three teams', async (questionCount) => {
  getQuiz.mockResolvedValue(makeQuiz(questionCount));
  renderConfiguration();
  expect(screen.getByRole('button', { name: /Play Game/ })).toBeDisabled();
  await screen.findByText('Configure game for Test quiz');
  click(screen.getByRole('button', { name: /Add team/ }));
  screen.getAllByPlaceholderText('Enter team name').forEach((input, index) =>
    act(() => {
      userEvent.type(input, `Team ${index + 1}`);
    }),
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  click(screen.getByRole('button', { name: /Play Game/ }));
  expect(await screen.findByText('Game opened')).toBeInTheDocument();
  expect(addGame).toHaveBeenCalledTimes(1);
});

test('lets the user fix a configuration by removing a team', async () => {
  getQuiz.mockResolvedValue(makeQuiz(2));
  renderConfiguration();
  await screen.findByText('Configure game for Test quiz');
  click(screen.getByRole('button', { name: /Add team/ }));
  expect(screen.getByRole('button', { name: /Play Game/ })).toBeDisabled();
  click(screen.getByRole('button', { name: 'Remove team 3' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Play Game/ })).toBeEnabled();
});

test('offers configuration instead of declaring a draw for an existing undersized game', async () => {
  getGameData.mockResolvedValue(makeGame(1));
  renderGame();
  expect(await screen.findByRole('alert')).toHaveTextContent('fewer questions (1) than teams (3)');
  expect(screen.queryByText(/It is a draw/)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Question 1/ })).not.toBeInTheDocument();
  expect(updateGame).not.toHaveBeenCalled();
  click(screen.getByRole('button', { name: 'Configure a new game' }));
  expect(await screen.findByText('Game configuration')).toBeInTheDocument();
});

test.each([3, 4, 6, 7])(
  'plays full rounds with %i questions, preserving scores and leaving extra questions',
  async (questionCount) => {
    getGameData.mockResolvedValue(makeGame(questionCount, { negativePointsMultiplier: -0.25 }));
    renderGame();
    await screen.findByText('Play game for Test quiz');
    const playableQuestionCount = Math.floor(questionCount / 3) * 3;
    for (let question = 1; question <= playableQuestionCount; question++) {
      await answerQuestion(question, question !== 2);
      if (question < playableQuestionCount) {
        expect(screen.queryByText(/has won|It is a draw/)).not.toBeInTheDocument();
        click(screen.getByText('Continue').closest('button')!);
      }
    }
    expect(screen.getByText(/Team 1 and Team 3 have won the game/)).toBeInTheDocument();
    expect(screen.getAllByText(`${questionCount >= 6 ? '200' : '100'}.00`)).toHaveLength(2);
    expect(screen.getByText(questionCount >= 6 ? '75.00' : '-25.00')).toBeInTheDocument();
    expect(updateGame).toHaveBeenLastCalledWith(expect.objectContaining({ isComplete: true, nextTeamId: 0 }));
    click(screen.getByRole('button', { name: 'Show question list' }));
    if (questionCount % 3) {
      click(screen.getByText(`Question ${questionCount}`).closest('button')!);
      expect(screen.getByText('Unanswered')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
      expect(updateGame).toHaveBeenCalledTimes(playableQuestionCount);
    }
  },
);

test('resumes the last answered question and completes the current round', async () => {
  const game = makeGame(4);
  game.currentTeamId = 2;
  game.teams[0].score = 100;
  game.teams[0].selectedOptions = [{ questionId: '1', selectedOptionIds: [1] }];
  getGameData.mockResolvedValue(game);
  renderGame();
  expect(await screen.findByText('Question text 1')).toBeInTheDocument();
  expect(screen.queryByText(/has won|It is a draw/)).not.toBeInTheDocument();
  click(screen.getByText('Continue').closest('button')!);
  await answerQuestion(2, true, 1);
  expect(screen.queryByText(/has won|It is a draw/)).not.toBeInTheDocument();
  click(screen.getByText('Continue').closest('button')!);
  await answerQuestion(3, true, 2);
  expect(screen.getByText(/It is a draw/)).toBeInTheDocument();
});

test.each([1, 4])('preserves the results of a completed game with %i questions', async (questionCount) => {
  const game = makeGame(questionCount, { isComplete: true, currentTeamId: 0 });
  game.teams[0].score = 100;
  getGameData.mockResolvedValue(game);
  renderGame();
  expect(await screen.findByText(/Team 1 has won the game with 100 points/)).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(updateGame).not.toHaveBeenCalled();
});

test('resumes before the last turn of a round without ending early', async () => {
  const game = makeGame(3);
  game.currentTeamId = 3;
  game.teams[0].score = 100;
  game.teams[0].selectedOptions = [{ questionId: '1', selectedOptionIds: [1] }];
  game.teams[1].selectedOptions = [{ questionId: '2', selectedOptionIds: [2] }];
  getGameData.mockResolvedValue(game);
  renderGame();
  expect(await screen.findByText('Question text 2')).toBeInTheDocument();
  expect(screen.queryByText(/has won|have won|It is a draw/)).not.toBeInTheDocument();
  click(screen.getByText('Continue').closest('button')!);
  await answerQuestion(3, false, 1);
  expect(screen.getByText(/Team 1 has won the game with 100 points/)).toBeInTheDocument();
});
