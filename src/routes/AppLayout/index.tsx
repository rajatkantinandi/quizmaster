import React from 'react';
import { AppShell, Header, Group, TextInput, Menu, Avatar } from '@mantine/core';
import { Helmet } from 'react-helmet';
import Quizzes from '../Quizzes';
import ConfigureQuiz from '../ConfigureQuiz';
import CreateQuiz from '../CreateQuiz';
import ConfigureGame from '../ConfigureGame';
import PlayQuiz from '../PlayQuiz';
import styles from './styles.module.css';
import { useParams } from 'react-router';
import { useStore } from '../../useStore';
import Icon from '../../components/Icon';
import CheckAuthAndNavigate from '../../components/CheckAuthAndNavigate';
import { isValidUser } from '../../helpers/authHelper';
import { capitalizeFirstLetter } from '../../helpers/textHelpers';
import { Link } from 'react-router-dom';

function AppLayout() {
  const { userName, viewType, id } = useParams();
  const { searchQuiz, logout, quizzes, userData } = useStore();

  function getTabsView() {
    switch (viewType) {
      case 'quizzes':
        return <Quizzes />;
      case 'configure-quiz': {
        if (id) {
          return <ConfigureQuiz quizId={id} />;
        } else {
          return <CreateQuiz />;
        }
      }
      case 'configure-game':
        return <ConfigureGame />;
      case 'play-game':
        return <PlayQuiz />;
      default:
        return <CheckAuthAndNavigate />;
    }
  }

  function getNameInitials() {
    const firstNameLastNameArr = userData.name.split(' ');

    return `${firstNameLastNameArr[0]?.charAt(0)?.toUpperCase()}${firstNameLastNameArr[1]?.charAt(0)?.toUpperCase()}`;
  }

  return isValidUser ? (
    <>
      <Helmet>
        <title>{capitalizeFirstLetter(viewType).replace('-', ' ')} - Quizmaster</title>
      </Helmet>
      <AppShell
        styles={(theme) => ({
          main: window.location.pathname.includes('/quizzes') ? { backgroundColor: 'var(--off-white)' } : {},
        })}
        header={
          <Header height={70}>
            <Group position="apart" className={styles.headerTabs} pr="xl">
              <Link to={`/quizzes/${userName}`}>
                <Icon name="logo" className="ml-lg" width={150} height={50} />
              </Link>
              {quizzes.length > 0 && viewType === 'quizzes' && (
                <TextInput
                  mr="xl"
                  type="text"
                  placeholder="Search by quiz name"
                  variant="filled"
                  radius="xl"
                  size="md"
                  className={styles.searchInput}
                  onChange={(ev) => searchQuiz(ev.target.value)}
                  icon={<Icon name="search" width={16} />}
                />
              )}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar color="cyan" radius="xl">
                    {getNameInitials()}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Hi, {userName}</Menu.Label>
                  <Menu.Item onClick={logout}>Sign out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Header>
        }>
        {getTabsView()}
      </AppShell>
    </>
  ) : (
    <CheckAuthAndNavigate />
  );
}

export default AppLayout;
