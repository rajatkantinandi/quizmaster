import React, { useState } from 'react';
import styles from './styles.module.css';
import { Helmet } from 'react-helmet';
import { Grid, AppShell } from '@mantine/core';
import LoginCard from '../../components/LoginCard';
import SignUpCard from '../../components/SignUpCard';
import ForgotPassword from '../../components/ForgotPassword';

export default function HomePage() {
  const [viewType, setViewType] = useState('logIn');

  function getViewType() {
    switch (viewType) {
      case 'logIn':
        return <LoginCard setViewType={setViewType} />;
      case 'signUp':
        return <SignUpCard setViewType={setViewType} />;
      case 'forgotPassword':
        return <ForgotPassword setViewType={setViewType} />;
    }
  }

  return (
    <section>
      <Helmet>
        <title>Homepage</title>
      </Helmet>
      <AppShell
        className={styles.homePage}
        styles={(theme) => ({
          main: { backgroundColor: theme.colors['qm-primary'] },
        })}>
        <Grid align="center" className={styles.loginCardWrapper}>
          <Grid.Col span={4} offset={4}>
            {getViewType()}
          </Grid.Col>
        </Grid>
      </AppShell>
    </section>
  );
}
