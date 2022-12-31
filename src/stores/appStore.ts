import { Quiz } from '../types';

export const getAppStore = (set: Function, get: Function) => ({
  modal: null,
  alert: null,
  quizzesSelector: {
    show: false,
    action: '',
    message: '',
    selectedQuizzes: [],
  },
  showModal: (modalState: ModalState) => {
    set(
      (state: AppState) => {
        state.modal = modalState;
      },
      false,
      'showModal',
    );
  },
  showAlert: (alertState: AlertState | null) => {
    set(
      (state: AppState) => {
        state.alert = alertState;
      },
      false,
      'showAlert',
    );
  },
  setQuizzesSelectorState: (quizzesSelectorState: QuizzesSelectorState) => {
    set(
      (state: AppState) => {
        state.quizzesSelector = quizzesSelectorState;
      },
      false,
      'setQuizzesSelectorState',
    );
  },
  toggleSelectedQuizzes: (quizId: number) => {
    set(
      (state: AppState) => {
        const index = state.quizzesSelector.selectedQuizzes.indexOf(quizId);

        if (index >= 0) {
          state.quizzesSelector.selectedQuizzes.splice(index, 1);
        } else {
          state.quizzesSelector.selectedQuizzes.push(quizId);
        }
      },
      false,
      'toggleSelectedQuizzes',
    );
  },
});

export interface ModalState {
  title: string;
  body: React.ReactNode;
  okText?: string;
  okCallback?: Function;
  className?: string;
  cancelText?: string;
  cancelCallback?: Function;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
  isAlert?: boolean;
  doNotShowAgainKey?: string;
}

export interface AlertState {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  autoClose?: boolean;
  callback?: Function;
}

export interface QuizzesSelectorState {
  action: string;
  message: string;
  show: boolean;
  onNextClick?: Function;
  onCancelClick?: Function;
  selectedQuizzes: number[];
}

export interface AppState {
  modal: ModalState | null;
  alert: AlertState | null;
  quizzesSelector: QuizzesSelectorState;
  showAlert: (data: AlertState | null) => void;
  showModal: Function;
  setQuizzesSelectorState: (data: QuizzesSelectorState) => void;
  toggleSelectedQuizzes: (quizId: number) => void;
}
