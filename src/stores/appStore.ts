import { TextInputProps } from '@mantine/core';

export const getAppStore = (set: Function, get: Function) => ({
  modal: null,
  prompt: null,
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
  enableOkButton: () => {
    set(
      (state: AppState) => {
        if (state.modal) {
          state.modal.disableOkButton = false;
        }
      },
      false,
      'showModal',
    );
  },
  disableOkButton: () => {
    set(
      (state: AppState) => {
        if (state.modal) {
          state.modal.disableOkButton = true;
        }
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
  showPrompt: (promptState: PromptState | null) => {
    set(
      (state: AppState) => {
        state.prompt = promptState;
      },
      false,
      'showPrompt',
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
  title?: string;
  body: React.ReactNode;
  okText?: string;
  okCallback?: Function;
  className?: string;
  cancelText?: string;
  cancelCallback?: Function;
  size?: 'mini' | 'tiny' | 'small' | 'large' | '70%' | '100%' | 'xl' | number;
  isAlert?: boolean;
  doNotShowAgainKey?: string;
  closeOnOkClick?: boolean;
  disableOkButton?: boolean;
}

export interface AlertState {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  autoClose?: boolean;
  callback?: Function;
}

export interface PromptState {
  title: string;
  initialValue?: string;
  textInputProps?: TextInputProps;
  okText?: string;
  okCallback?: (value: string) => Promise<void> | void;
  className?: string;
  cancelText?: string;
  cancelCallback?: Function;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
  closeOnOkClick?: boolean;
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
  prompt: PromptState | null;
  quizzesSelector: QuizzesSelectorState;
  showAlert: (data: AlertState | null) => void;
  showPrompt: (data: PromptState | null) => void;
  enableOkButton: () => void;
  disableOkButton: () => void;
  showModal: (modalState: ModalState | null) => void;
  setQuizzesSelectorState: (data: QuizzesSelectorState) => void;
  toggleSelectedQuizzes: (quizId: number) => void;
}
