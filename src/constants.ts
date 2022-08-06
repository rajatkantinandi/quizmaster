import { GameInfo } from './types';

export enum FormInputTypes {
  TEXT_AREA = 'textArea',
  CHECK_BOX = 'checkBox',
}

export const defaultGameInfo: GameInfo = {
  teams: [],
  timeLimit: 0,
  currentTeamId: 0,
  selectionTimeLimit: 0,
  isComplete: false,
  isQuestionPointsHidden: false,
};

export const MIN_NUM_OF_CATEGORIES = 2;

export const DEFAULT_NEW_QUESTION_POINTS = 10;
