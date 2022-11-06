import React, { useEffect } from 'react';
import { AlertState } from '../../stores/appStore';
import { Alert as MTAlert, Text } from '@mantine/core';
import { useStore } from '../../useStore';
import styles from './styles.module.css';

function Alert({ message, type = 'info', autoClose = true }: AlertState) {
  const { showAlert } = useStore();

  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        showAlert(null);
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
