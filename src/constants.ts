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
