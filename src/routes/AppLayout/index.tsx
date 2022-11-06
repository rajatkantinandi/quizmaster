import React, { useState } from 'react';
import { AppShell, Tabs, Header, Group, Button, TextInput } from '@mantine/core';
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

function AppLayout() {
  const [activeTab, setActiveTab] = useState<string | null>('my-quizzes');
  const navigate = useNavigate();
  const { userName, viewType, id } = useParams();
  const { showCreateQuizButton, searchQuiz } = useStore();

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
        <></>;
    }
  }

  return (
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
              {showCreateQuizButton && (
                <Group>
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
                </Group>
              )}
            </Group>
          </Header>
        }>
        <Tabs value={activeTab}>
          <Tabs.Panel value="my-quizzes">{getTabsView()}</Tabs.Panel>
        </Tabs>
      </AppShell>
    </>
  );
}

export default AppLayout;
