import React from 'react';
import styles from './styles.module.css';
import { Helmet } from 'react-helmet';
import { Grid, AppShell, Header } from '@mantine/core';
import LoginFormCard from '../../components/LoginFormCard';
import SignUpFormCard from '../../components/SignUpFormCard';
import ForgotPassword from '../../components/ForgotPassword';
import { useParams } from 'react-router';
import CheckAuthAndNavigate from '../../components/CheckAuthAndNavigate';
import { isValidUser } from '../../helpers/authHelper';
import Icon from '../../components/Icon';

export default function HomePage() {
  const { viewType } = useParams();

  function getViewType() {
    switch (viewType) {
      case 'login':
        return <LoginFormCard />;
      case 'signup':
        return <SignUpFormCard />;
      case 'forgot-password':
        return <ForgotPassword />;
      default:
        return <CheckAuthAndNavigate />;
    }
  }

  return isValidUser ? (
    <CheckAuthAndNavigate />
  ) : (
    <section>
      <Helmet>
        <title>Homepage - Quizmaster</title>
      </Helmet>
      <AppShell
        styles={(theme) => ({
          main: { backgroundColor: 'var(--qm-primary)', padding: 0 },
        })}>
        <Grid align="center" className={styles.loginCardWrapper}>
          <Grid.Col span={4} offset={4}>
            <div className="textAlignCenter">
              <Icon color="#ffffff" name="logo" className="mb-xl" width={200} height={60} />
            </div>
            {getViewType()}
          </Grid.Col>
        </Grid>
      </AppShell>
    </section>
  );
}
