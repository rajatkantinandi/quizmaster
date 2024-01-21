import React from 'react';
import { AppShell, Header, Group, TextInput, Button } from '@mantine/core';
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
import HeaderTabs from '../../components/TopTabs/HeaderTabs';
import Catalog from '../Catalog';
// import Cookies from 'js-cookie';

function AppLayout() {
  const { userName, viewType, id } = useParams();
  const { searchQuiz, quizzes, searchQuery, clearSearch } = useStore();

  function getTabsView() {
    switch (viewType) {
      case 'my-quizzes':
        return <Quizzes userName={userName} />;
      case 'configure-quiz': {
        if (id) {
          return <ConfigureQuiz quizId={id} userName={userName} />;
        } else {
          return <CreateQuiz userName={userName} />;
        }
      }
      case 'configure-game':
        return <ConfigureGame quizId={id} userName={userName} />;
      case 'play-game':
        return <PlayQuiz gameId={id} userName={userName} />;
      case 'catalog':
        return <Catalog userName={userName} />;
      default:
        return <CheckAuthAndNavigate />;
    }
  }

  // function getNameInitials() {
  //   const name = userData.name || Cookies.get('userName') || '';
  //   const firstNameLastNameArr = name.split(' ');

  //   if (firstNameLastNameArr[1]) {
  //     return `${firstNameLastNameArr[0]?.charAt(0)?.toUpperCase()}${firstNameLastNameArr[1]?.charAt(0)?.toUpperCase()}`;
  //   } else {
  //     return firstNameLastNameArr[0]?.charAt(0)?.toUpperCase();
  //   }
  // }

  return isValidUser ? (
    <>
      <Helmet>
        <title>{capitalizeFirstLetter(viewType).replace('-', ' ')} - Quizmaster</title>
      </Helmet>
      <AppShell
        styles={(theme) => ({
          main: window.location.pathname.includes('/my-quizzes') ? { backgroundColor: 'var(--off-white)' } : {},
        })}
        header={
          <Header height={70}>
            <Group position="apart" className={styles.headerTabs} pr="xl">
              <Group>
                <Link to={`/my-quizzes/${userName}`}>
                  <Icon name="logo" className="ml-lg mt-lg" width={150} height={50} />
                </Link>
                <HeaderTabs
                  tabs={[
                    { title: 'My quizzes', url: `/my-quizzes/${userName}` },
                    { title: 'Catalog', url: `/catalog/${userName}` },
                  ]}
                  onChange={() => clearSearch()}
                />
              </Group>
              {((quizzes.length > 0 && viewType === 'my-quizzes') || viewType === 'catalog') && (
                <TextInput
                  mr="xl"
                  type="text"
                  placeholder="Search by quiz name"
                  variant="filled"
                  radius="xl"
                  size="md"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(ev) => searchQuiz(ev.target.value)}
                  icon={<Icon name="search" width={16} />}
                />
              )}
              <Button
                onClick={() => window.open('https://forms.gle/9bTd9ph1JVXKYw3XA', '_blank')}
                variant="outline"
                leftIcon={<Icon color="var(--qm-primary)" name="feedback" width={20} />}>
                Share feedback
              </Button>
              {/* TODO: make menu visible when we add real users */}
              {/* {userName !== 'guest' && (
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
              )} */}
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
