import { GameInfo } from './types';

export enum FormInputTypes {
  TEXT_AREA = 'textArea',
  CHECK_BOX = 'checkBox',
  INPUT = 'input',
}

export const defaultGameInfo: GameInfo = {
  teams: [],
  timeLimit: 0,
  currentTeamId: 0,
  selectionTimeLimit: 0,
  isComplete: false,
  isQuestionPointsHidden: false,
};

export const tilesBGColors = [
  'var(--quiz-card-bg-1)',
  'var(--quiz-card-bg-2)',
  'var(--quiz-card-bg-3)',
  'var(--quiz-card-bg-4)',
  'var(--quiz-card-bg-5)',
];

export const appPaths = [
  '/quizzes/:userName',
  '/configure-quiz/:userName',
  '/configure-quiz/:userName/:quizId',
  '/configure-game/:userName/:quizId',
  '/play-game/:userName/:gameId',
];
