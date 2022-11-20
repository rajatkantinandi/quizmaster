export const getAppStore = (set: Function, get: Function) => ({
  modal: null,
  alert: null,
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
  callback?: Function;
}

export interface AppState {
  modal: ModalState | null;
  alert: AlertState | null;
  showAlert: (data: AlertState | null) => void;
  showModal: Function;
}
