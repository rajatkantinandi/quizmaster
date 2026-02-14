import React from 'react';
import { Helmet } from 'react-helmet';
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
    <section style={{ minHeight: '100vh', backgroundColor: 'var(--qm-primary)' }}>
      <Helmet>
        <title>Homepage - Quizmaster</title>
      </Helmet>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'var(--qm-primary)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Icon color="#ffffff" name="logo" style={{ marginBottom: '1rem' }} width={200} height={60} />
          </div>
          {getViewType()}
        </div>
      </div>
    </section>
  );
}
