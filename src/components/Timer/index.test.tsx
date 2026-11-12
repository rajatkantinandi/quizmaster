import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Timer from './index';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('counts down and reports when time is up', () => {
  const handleTimeUp = jest.fn();
  const setIsTimerRunning = jest.fn();
  render(
    <Timer
      duration={2}
      isTimerRunning
      handleTimeUp={handleTimeUp}
      setIsTimerRunning={setIsTimerRunning}
      selectedQuestionId="first"
    />,
  );
  expect(screen.getByText('0:02')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.getByText('0:01')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.getByText('0:00')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(handleTimeUp).toHaveBeenCalledTimes(1);
  expect(setIsTimerRunning).toHaveBeenCalledWith(false);
});

test('offers a start control while paused and resets for a new question', () => {
  const props = { duration: 30, handleTimeUp: jest.fn(), setIsTimerRunning: jest.fn() };
  const { rerender } = render(<Timer {...props} isTimerRunning={false} selectedQuestionId="first" />);
  fireEvent.click(screen.getByRole('button', { name: 'Start timer' }));
  expect(props.setIsTimerRunning).toHaveBeenCalledWith(true);
  rerender(<Timer {...props} isTimerRunning selectedQuestionId="first" />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(screen.getByText('0:29')).toBeInTheDocument();
  rerender(<Timer {...props} isTimerRunning selectedQuestionId="second" />);
  expect(screen.getByText('0:30')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument();
});
