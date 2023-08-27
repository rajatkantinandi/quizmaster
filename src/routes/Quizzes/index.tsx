import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../../useStore';
import { Helmet } from 'react-helmet';
import { Text, Button, Grid, Card, Group, Badge, Image, Title, Select, ActionIcon } from '@mantine/core';
import styles from './styles.module.css';
import { plural } from '../../helpers/textHelpers';
import Icon, { IconName } from '../../components/Icon';
import { tilesBGColors } from '../../constants';
import PageLoader from '../../components/PageLoader';
import noContent from '../../images/no_content.png';
import CreateQuizButton from '../../components/CreateQuizButton';
import QuizSelectorAlert from '../../components/QuizSelectorAlert';
import { downloadQuiz } from '../../helpers/importExport';
import ImportQuizzesButton from '../../components/ImportQuizzesButton';
import classNames from 'classnames';

export default function Quizzes({ userName }) {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recency');
  const {
    getQuizzes,
    quizzesSelector,
    setQuizzesSelectorState,
    deleteQuizzes,
    publishQuizzes,
    toggleSelectedQuizzes,
    showModal,
    showAlert,
    sortQuizzes,
    getInCompletedGame,
    ...rest
  } = useStore();
  const quizzes = rest.searchQuery ? rest.searchResults : rest.quizzes;
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes().then((quizzes) => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getQuestionsCount(categories): number {
    return categories.reduce((count, category) => {
      count += category.questions.length;

      return count;
    }, 0);
  }

  function handleDeleteQuizzes() {
    setQuizzesSelectorState({
      action: 'delete',
      message: 'Select quizzes to delete',
      show: true,
      selectedQuizzes: [],
      onNextClick: (selectedQuizzes) => {
        showModal({
          title: 'Delete Quizzes',
          body: (
            <>
              <p>Are you sure you want to delete following quizzes ?</p>
              <ol>
                {selectedQuizzes.map((quizId) => (
                  <li key={quizId}>{quizzes.find((quiz) => quiz.quizId === quizId)?.name}</li>
                ))}
              </ol>
            </>
          ),
          okCallback: async () => {
            await deleteQuizzes(selectedQuizzes);
            setQuizzesSelectorState({
              action: '',
              message: '',
              show: false,
              selectedQuizzes: [],
            });
          },
          cancelCallback: () => {
            setQuizzesSelectorState({
              action: '',
              message: '',
              show: false,
              selectedQuizzes: [],
            });
          },
          okText: 'Delete Quizzes',
          cancelText: 'Cancel',
        });
      },
      onCancelClick: () => {
        setQuizzesSelectorState({
          action: '',
          message: '',
          show: false,
          selectedQuizzes: [],
        });
      },
    });
  }

  // function handlePublishQuizzes() {
  //   if (quizzes.some((quiz) => !quiz.isDraft && !quiz.isPublished)) {
  //     setQuizzesSelectorState({
  //       action: 'publish',
  //       message: 'Select quizzes to publish',
  //       show: true,
  //       selectedQuizzes: [],
  //       onNextClick: (selectedQuizzes) => {
  //         showModal({
  //           title: 'Publish Quizzes',
  //           body: (
  //             <>
  //               <p>Are you sure you want to publish following quizzes ?</p>
  //               <ol>
  //                 {selectedQuizzes.map((quizId) => (
  //                   <li key={quizId}>{quizzes.find((quiz) => quiz.quizId === quizId)?.name}</li>
  //                 ))}
  //               </ol>
  //             </>
  //           ),
  //           okCallback: async () => {
  //             await publishQuizzes(selectedQuizzes);
  //             setQuizzesSelectorState({
  //               action: '',
  //               message: '',
  //               show: false,
  //               selectedQuizzes: [],
  //             });
  //           },
  //           cancelCallback: () => {
  //             setQuizzesSelectorState({
  //               action: '',
  //               message: '',
  //               show: false,
  //               selectedQuizzes: [],
  //             });
  //           },
  //           okText: 'Publish Quizzes',
  //           cancelText: 'Cancel',
  //         });
  //       },
  //       onCancelClick: () => {
  //         setQuizzesSelectorState({
  //           action: '',
  //           message: '',
  //           show: false,
  //           selectedQuizzes: [],
  //         });
  //       },
  //     });
  //   } else {
  //     showAlert({
  //       message: 'No quiz to publish. Please complete the quizzes before publish if they are in draft state.',
  //       type: 'info',
  //     });
  //   }
  // }

  async function handlePlayGame(quizId) {
    const gameId = await getInCompletedGame(quizId);

    if (gameId) {
      navigate(`/play-game/${userName}/${gameId}`);
    } else {
      navigate(`/configure-game/${userName}/${quizId}`);
    }
  }

  return (
    <>
      <Helmet>
        <title>Quizzes</title>
      </Helmet>
      {loading ? (
        <PageLoader />
      ) : quizzes.length === 0 ? (
        <Grid align="center" mt="xl" pt="xl">
          {rest.searchQuery ? (
            <Grid.Col span={4} offset={4} className="textAlignCenter" mt="xl" pt="xl">
              <Text color="gray" size="md" mb="sm">
                No results found
              </Text>
            </Grid.Col>
          ) : (
            <Grid.Col span={4} offset={4} className="textAlignCenter" mt="xl" pt="xl">
              <Image className={styles.notingHere} width={100} src={noContent} />
              <Text color="gray" size="md" mb="sm">
                Nothing here! Please create a quiz to get started.
              </Text>
              <CreateQuizButton userName={userName} />
              <Text size="lg" my="lg">
                Or
              </Text>
              <ImportQuizzesButton size="md" radius="xl" />
            </Grid.Col>
          )}
        </Grid>
      ) : (
        <>
          <QuizSelectorAlert {...quizzesSelector} />
          <Group position="apart" className={styles.pageTitleWrapper}>
            <Group mb="xl" mt="md">
              <Title order={2}>My Quizzes</Title>
              <CreateQuizButton userName={userName} />
            </Group>
            <Group>
              <ImportQuizzesButton />
              <Button
                onClick={handleDeleteQuizzes}
                className={classNames('noTextOnSmallScreen', styles.deleteButton)}
                title="Delete Quizzes"
                leftIcon={<Icon color="white" width="16" name="trash" />}>
                Delete Quizzes
              </Button>
              {/* TODO: enable publish button when we have backend */}
              {/* <Button
                onClick={handlePublishQuizzes}
                className={styles.publishQuiz}
                leftIcon={<Icon color="white" width="16" name="publish" />}>
                Publish Quizzes
              </Button> */}
              <Select
                placeholder="Sort by"
                className={styles.sort}
                onChange={(val) => {
                  setSortBy(val || 'recency');
                  sortQuizzes(val || 'recency');
                }}
                data={[
                  { value: 'recency', label: 'Recently Updated' },
                  { value: 'createDate', label: 'Create Date' },
                  { value: 'name', label: 'Name' },
                ]}
                icon={<Icon width="16" name="sort" />}
                value={sortBy}
                transition="pop-top-left"
                transitionDuration={100}
                transitionTimingFunction="ease"
              />
            </Group>
          </Group>
          <Group>
            {quizzes.map((quiz, index) => (
              <div className={styles.quizCardWrapper} key={quiz.quizId}>
                <Card shadow="sm" p="lg" withBorder>
                  <Card.Section style={{ backgroundColor: tilesBGColors[index % 5] }}>
                    <Icon
                      name={`quiz_${(index % 13) + 1}` as IconName}
                      width="100%"
                      height={150}
                      color="#ffffff"
                      className={`my-lg ${styles.tileIcon}`}
                    />
                  </Card.Section>
                  <Group position="apart" mt="md">
                    <Text weight="bold" className={styles.truncate2Lines}>
                      {quiz.name}
                    </Text>
                    {quiz.isDraft && (
                      <Badge color="pink" variant="light">
                        Draft
                      </Badge>
                    )}
                    {quiz.isPublished && (
                      <Badge color="green" variant="light">
                        Published
                      </Badge>
                    )}
                  </Group>
                  <Text mb="xs" size="xs" italic>
                    Created on:{' '}
                    {new Date(quiz.createDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text>
                    {plural(quiz.categories.length, '%count Category', '%count Categories')},{' '}
                    {plural(getQuestionsCount(quiz.categories), '%count Question', '%count Questions')}
                  </Text>
                  <Group position="apart" className={styles.cardButton}>
                    {quiz.isDraft ? (
                      <Button
                        color="pink"
                        fullWidth
                        leftIcon={<Icon color="#ffffff" name="pencil" width={16} />}
                        onClick={() => navigate(`/configure-quiz/${userName}/${quiz.quizId}`)}>
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          color="teal"
                          className="grow"
                          leftIcon={<Icon color="#ffffff" name="playCircle" width={16} />}
                          onClick={() => handlePlayGame(quiz.quizId)}>
                          Play
                        </Button>
                        <Button
                          title="Edit quiz"
                          variant="light"
                          className="iconButton"
                          onClick={() => navigate(`/configure-quiz/${userName}/${quiz.quizId}`)}>
                          <Icon color="var(--gray-dark)" name="pencil" width={18} />
                        </Button>
                        <Button
                          title="Download quiz"
                          variant="light"
                          className="iconButton"
                          onClick={() => downloadQuiz(quiz)}>
                          <Icon color="var(--gray-dark)" name="download" width={18} />
                        </Button>
                      </>
                    )}
                  </Group>
                  {quizzesSelector.show && (
                    <ActionIcon
                      variant="transparent"
                      className={styles.cardSelectBtn}
                      onClick={() => {
                        if (quizzesSelector.action === 'publish' && quiz.isDraft) {
                          showAlert({
                            message: 'Quiz in draft state is not allowed to publish.',
                            type: 'info',
                          });
                        } else {
                          toggleSelectedQuizzes(quiz.quizId);
                        }
                      }}>
                      <Icon
                        name={
                          quizzesSelector.selectedQuizzes.includes(quiz.quizId) ? 'checkmarkFilled' : 'checkmarkOutline'
                        }
                        width={200}
                        height={200}
                      />
                    </ActionIcon>
                  )}
                </Card>
              </div>
            ))}
          </Group>
        </>
      )}
    </>
  );
}
