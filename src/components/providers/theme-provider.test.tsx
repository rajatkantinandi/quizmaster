import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './theme-provider';

function ThemeControl() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Use {theme === 'dark' ? 'light' : 'dark'} theme</button>;
}

function renderTheme() {
  return render(
    <ThemeProvider>
      <ThemeControl />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
});

test('uses the system dark preference without a saved choice', () => {
  renderTheme();
  expect(screen.getByRole('button', { name: 'Use light theme' })).toBeInTheDocument();
  expect(document.documentElement).toHaveClass('dark');
  expect(document.documentElement.style.colorScheme).toBe('dark');
});

test('keeps an explicit light choice when the system prefers dark', () => {
  localStorage.setItem('theme', 'light');
  renderTheme();
  expect(document.documentElement).toHaveClass('light');
  expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument();
});

test('ignores an invalid saved theme', () => {
  localStorage.setItem('theme', 'invalid');
  renderTheme();
  expect(document.documentElement).toHaveClass('dark');
});

test('remembers a theme change after the app is mounted again', async () => {
  const user = userEvent.setup();
  const { unmount } = renderTheme();
  await user.click(screen.getByRole('button', { name: 'Use light theme' }));
  expect(document.documentElement).toHaveClass('light');
  expect(localStorage.getItem('theme')).toBe('light');
  unmount();

  renderTheme();
  expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument();
  expect(document.documentElement).toHaveClass('light');
});
