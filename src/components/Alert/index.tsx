import React, { useCallback, useEffect } from 'react';
import { Alert as ShadcnAlert, AlertTitle } from '@/components/ui/alert';
import { useStore } from '../../useStore';

function Alert() {
  const { showAlert, alert } = useStore();
  const { message, type = 'info', autoClose = true, callback } = alert || {};

  const handleClose = useCallback(() => {
    showAlert(null);
    if (callback) {
      callback();
    }
  }, [callback, showAlert]);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, handleClose]);

  function getAlertClass() {
    switch (type) {
      case 'success':
        return 'border-transparent bg-correct-color text-white';
      case 'error':
        return 'border-transparent bg-incorrect-color text-white';
      case 'warning':
        return 'border-transparent bg-warning text-white';
      default:
        return 'border-transparent bg-primary text-white';
    }
  }

  if (!message) return null;

  return (
    <div className="fixed top-0 z-[500] w-full px-[30%] py-2.5">
      <ShadcnAlert className={`shadow-lg ${getAlertClass()}`}>
        <AlertTitle className="pr-8 font-bold">{message}</AlertTitle>
        <button
          aria-label="Close alert"
          className="absolute right-3 top-3 text-2xl leading-none text-white/90 transition-opacity hover:text-white hover:opacity-100"
          onClick={handleClose}
          type="button">
          ×
        </button>
      </ShadcnAlert>
    </div>
  );
}

export default Alert;
