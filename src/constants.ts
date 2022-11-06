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
  '#f5866c',
  '#e756cc',
  '#4b8ef6',
  '#bea798',
  '#00bfe1',
  '#a5db00',
  '#fbd103',
  '#7ecfcf',
  '#95a5b5',
  '#47ff76',
  '#fb8065',
  '#5151fa',
  '#9c4afb',
];

export const MIN_NUM_OF_CATEGORIES = 2;

export const appPaths = [
  '/quizzes/:userName',
  '/configure-quiz/:userName',
  '/configure-quiz/:userName/:quizId',
  '/configure-game/:userName/:quizId',
  '/play-game/:userName/:gameId',
];
