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
  negativePointsMultiplier: 0,
};

export const tilesBGColors = [
  'var(--quiz-card-bg-1)',
  'var(--quiz-card-bg-2)',
  'var(--quiz-card-bg-3)',
  'var(--quiz-card-bg-4)',
  'var(--quiz-card-bg-5)',
];

export const appPaths = [
  '/my-quizzes/:userName',
  '/configure-quiz/:userName',
  '/configure-quiz/:userName/:quizId',
  '/configure-game/:userName/:quizId',
  '/play-game/:userName/:gameId',
];

export const MIN_NUM_OF_CATEGORIES = 2;

export const DEFAULT_NEW_QUESTION_POINTS = 100;

export enum TrackingEvent {
  APP_LAUNCHED = 'appLaunched',
  CATALOG_QUIZ_PREVIEWED = 'catalogQuizPreviewed',
  CATALOG_QUIZ_NOT_SAVED = 'catalogQuizNotSaved',
  QUIZ_CREATED = 'quizCreated',
  DOWNLOAD_QUIZ = 'downloadQuiz',
  PLAY_QUIZ = 'playQuiz',
  START_GAME = 'startGame',
  OPENED_RANDOM_TEAM_GENERATOR = 'openedRandomTeamGenerator',
  USED_RANDOM_TEAM_GENERATOR = 'usedRandomTeamGenerator',
  COMPLETED_GAME = 'completedGame',
  SEARCH = 'search',
}
