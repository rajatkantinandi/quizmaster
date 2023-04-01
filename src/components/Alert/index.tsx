import React, { useEffect } from 'react';
import { Alert as MTAlert, Text } from '@mantine/core';
import { useStore } from '../../useStore';
import styles from './styles.module.css';

function Alert() {
  const { showAlert, alert } = useStore();
  const { message, type = 'info', autoClose = true, callback } = alert || {};

  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        showAlert(null);

        if (callback) {
          callback();
        }
      }, 4000);
    }
  });

  function getColor(): string {
    switch (type) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      case 'warning':
        return 'yellow';
      default:
        return '';
    }
  }

  return (
    <div className={styles.alertWrapper}>
      <MTAlert withCloseButton closeButtonLabel="Close" variant="filled" color={getColor()}>
        <Text weight="bold" size="md">
          {message}
        </Text>
      </MTAlert>
    </div>
  );
}

export default Alert;
