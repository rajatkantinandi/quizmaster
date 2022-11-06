export const getAppStore = (set: Function, get: Function) => ({
  modal: null,
  alert: null,
  showCreateQuizButton: false,
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
  setShowCreateQuizButton: (value: boolean) => {
    set((state: AppState) => {
      state.showCreateQuizButton = value;
    });
  },
});

export interface ModalState {
  title: string;
  body: React.ReactNode;
  okText?: string;
  okCallback?: Function;
  className?: string;
  cancelText?: string;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
  isAlert?: boolean;
  doNotShowAgainKey?: string;
}

export interface AlertState {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  autoClose?: boolean;
}

export interface AppState {
  modal: ModalState | null;
  alert: AlertState | null;
  showCreateQuizButton: boolean;
  showAlert: (data: AlertState | null) => void;
  showModal: Function;
  setShowCreateQuizButton: Function;
}
