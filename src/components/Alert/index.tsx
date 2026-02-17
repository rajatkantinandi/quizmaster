import React, { useEffect } from 'react';
import { Alert as ShadcnAlert, AlertTitle } from '@/components/ui/alert';
import { useStore } from '../../useStore';

function Alert() {
  const { showAlert, alert } = useStore();
  const { message, type = 'info', autoClose = true, callback } = alert || {};

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        showAlert(null);

        if (callback) {
          callback();
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, callback, showAlert]);

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
        <AlertTitle className="font-bold">{message}</AlertTitle>
      </ShadcnAlert>
    </div>
  );
}

export default Alert;
