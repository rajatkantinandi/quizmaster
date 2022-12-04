import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useStore } from '../../useStore';
import { Helmet } from 'react-helmet';
import { Text, Button, Grid, Card, Group, Badge, Image, Title } from '@mantine/core';
import styles from './styles.module.css';
import { plural } from '../../helpers/textHelpers';
import Icon from '../../components/Icon';
import { tilesBGColors } from '../../constants';
import PageLoader from '../../components/PageLoader';
import noContent from '../../images/no_content.png';
import CreateQuizButton from '../../components/CreateQuizButton';

export default function Quizzes() {
  const { userName } = useParams();
  const [loading, setLoading] = useState(true);
  const { getQuizzes, setQuizzes, ...rest } = useStore();
  const quizzes = rest.searchQuery ? rest.searchResults : rest.quizzes;
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes().then((quizzes) => {
      setQuizzes(quizzes);
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
            </Grid.Col>
          )}
        </Grid>
      ) : (
        <>
          <Group position="apart" className={styles.pageTitleWrapper}>
            <Group mb="xl" mt="md">
              <Title order={2}>My Quizzes</Title>
              <CreateQuizButton userName={userName} />
            </Group>
            <Button.Group>
              <Button className={styles.deleteButton} leftIcon={<Icon color="white" width="16" name="trash" />}>
                Delete Quizzes
              </Button>
              <Button variant="outline">Second</Button>
              <Button className={styles.publishQuiz}>Publish Quizzes</Button>
            </Button.Group>
          </Group>
          <Group>
            {quizzes.map((quiz, index) => (
              <div className={styles.quizCardWrapper}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Card.Section style={{ backgroundColor: tilesBGColors[index % 5] }}>
                    <Icon
                      name={`quiz_${(index % 13) + 1}`}
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
                    <Button
                      color="pink"
                      radius="md"
                      fullWidth={quiz.isDraft}
                      className={quiz.isDraft ? '' : styles.playCardButton}
                      leftIcon={<Icon color="#ffffff" name="pencil" width={16} />}
                      onClick={() => navigate(`/configure-quiz/${userName}/${quiz.quizId}`)}>
                      Edit
                    </Button>
                    {!quiz.isDraft && (
                      <Button
                        color="teal"
                        radius="md"
                        className={styles.playCardButton}
                        leftIcon={<Icon color="#ffffff" name="play" width={16} />}
                        onClick={() => navigate(`/configure-game/${userName}/${quiz.quizId}`)}>
                        Play
                      </Button>
                    )}
                  </Group>
                </Card>
              </div>
            ))}
          </Group>
        </>
      )}
    </>
  );
}
