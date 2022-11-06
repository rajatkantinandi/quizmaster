import React, { useState, useEffect } from 'react';
import { AppShell, Tabs, Header, Group, Button, TextInput, Menu, Avatar } from '@mantine/core';
import { Helmet } from 'react-helmet';
import Quizzes from '../Quizzes';
import ConfigureQuiz from '../ConfigureQuiz';
import CreateQuiz from '../CreateQuiz';
import ConfigureGame from '../ConfigureGame';
import PlayQuiz from '../PlayQuiz';
import styles from './styles.module.css';
import { useNavigate, useParams } from 'react-router';
import { useStore } from '../../useStore';
import Icon from '../../components/Icon';
import CheckAuthAndNavigate from '../../components/CheckAuthAndNavigate';
import { isValidUser } from '../../helpers/authHelper';

function AppLayout() {
  const { userName, viewType, id } = useParams();
  const [activeTab, setActiveTab] = useState<string | null>('');
  const navigate = useNavigate();
  const { showCreateQuizButton, searchQuiz, logout } = useStore();

  useEffect(() => {
    if (viewType === 'quizzes') {
      setActiveTab('my-quizzes');
    } else {
      setActiveTab('');
    }
  }, [viewType]);

  function onTabChange(value) {
    setActiveTab(value);
    navigate(`/quizzes/${userName}`);
  }

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

  return isValidUser ? (
    <>
      <Helmet>
        <title>AppLayout</title>
      </Helmet>
      <AppShell
        styles={(theme) => ({
          main: window.location.pathname.includes('/quizzes') ? { backgroundColor: '#f3f3f3' } : {},
        })}
        header={
          <Header height={70}>
            <Group position="apart" className={styles.headerTabs} pr="xl">
              <Tabs value={activeTab} onTabChange={onTabChange} className={styles.headerTabs}>
                <Tabs.List className={styles.headerTabs}>
                  <Tabs.Tab value="my-quizzes">My Quizzes</Tabs.Tab>
                </Tabs.List>
              </Tabs>
              <Group>
                {showCreateQuizButton && (
                  <>
                    <TextInput
                      mr="xl"
                      type="text"
                      placeholder="Search by quiz name"
                      variant="filled"
                      radius="md"
                      size="md"
                      onChange={(ev) => searchQuiz(ev.target.value)}
                      icon={<Icon name="search" width={16} />}
                    />
                    <Button onClick={() => navigate(`/configure-quiz/${userName}`)} variant="filled">
                      + Create Quiz
                    </Button>
                  </>
                )}
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Avatar color="cyan" radius="xl">
                      {userName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Hi, {userName}</Menu.Label>
                    <Menu.Item onClick={logout}>Sign out</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Header>
        }>
        <Tabs value={activeTab}>{getTabsView()}</Tabs>
      </AppShell>
    </>
  ) : (
    <CheckAuthAndNavigate />
  );
}

export default AppLayout;
