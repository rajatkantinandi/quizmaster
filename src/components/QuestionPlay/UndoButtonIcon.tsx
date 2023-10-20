import React from 'react';
import styles from './undoButtonIcon.module.css';

export default function UndoTimer({ children }) {
  return (
    <>
      <div className="pl-sm pt-sm">{children}</div>
      <svg className={styles.svg}>
        <circle r="18" cx="20" cy="20"></circle>
      </svg>
    </>
  );
}
