import { Divider } from '@mantine/core';
import React from 'react';
import Icon from '../../components/Icon';
import styles from './styles.module.css';

export default function Footer() {
  return (
    <div className="fullWidth flex flexCol alignCenter">
      <Divider style={{ width: '80%', marginBottom: 30 }} />
      <footer className={styles.footer}>
        <div className="flex flexCol alignCenter">
          <div>© {new Date().getFullYear()} Quizmaster</div>
          <div className={styles.followUs}>
            Follow and star us on
            <a href="https://www.youtube.com/@Quizmasterapp_in" target="_blank" rel="noopener noreferrer">
              <Icon name="youtube" width={30} height={30} style={{ marginTop: 5 }} />
            </a>
            <a href="https://github.com/rajatkantinandi/quizmaster" target="_blank" rel="noopener noreferrer">
              <Icon name="github" width={28} height={28} style={{ marginTop: 5 }} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
