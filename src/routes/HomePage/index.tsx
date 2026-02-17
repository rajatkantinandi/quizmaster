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
    <section className="min-h-screen bg-[var(--qm-primary)]">
      <Helmet>
        <title>Homepage - Quizmaster</title>
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-[var(--qm-primary)] p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Icon color="#ffffff" name="logo" className="mb-4" width={200} height={60} />
          </div>
          {getViewType()}
        </div>
      </div>
    </section>
  );
}
