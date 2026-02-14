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

  function getVariant(): 'default' | 'destructive' {
    return type === 'error' ? 'destructive' : 'default';
  }

  if (!message) return null;

  return (
    <div className="fixed top-0 z-[500] w-full px-[30%] py-2.5">
      <ShadcnAlert variant={getVariant()} className="shadow-lg">
        <AlertTitle className="font-bold">{message}</AlertTitle>
      </ShadcnAlert>
    </div>
  );
}

export default Alert;
