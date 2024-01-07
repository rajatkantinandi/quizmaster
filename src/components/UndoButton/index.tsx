import React from 'react';
import styles from './styles.module.css';
import { Button } from '@mantine/core';

export default function UndoButton({ onClick, time }) {
  return (
    <Button
      onClick={onClick}
      leftIcon={
        <>
          <div className="pl-sm pt-sm">{5 - time}</div>
          <svg className={styles.svg}>
            <circle r="18" cx="20" cy="20"></circle>
          </svg>
        </>
      }>
      Undo
    </Button>
  );
}
