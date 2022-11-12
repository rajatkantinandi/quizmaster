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

export default function Quizzes() {
  const { userName } = useParams();
  const [loading, setLoading] = useState(true);
  const { getQuizzes, setQuizzes, ...rest } = useStore();
  const quizzes = rest.searchResults.length > 0 ? rest.searchResults : rest.quizzes;
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
          <Grid.Col span={4} offset={4} className="textAlignCenter" mt="xl" pt="xl">
            <Image className={styles.notingHere} width={100} src={noContent} />
            <Text color="gray" size="md" mb="sm">
              Nothing here! Please create a quiz to get started.
            </Text>
            <Button onClick={() => navigate(`/configure-quiz/${userName}`)} variant="filled">
              + Create Quiz
            </Button>
          </Grid.Col>
        </Grid>
      ) : (
        <>
          <Group mb="xl" position="apart">
            <Title order={2}>My Quizzes</Title>
            <Button onClick={() => navigate(`/configure-quiz/${userName}`)} variant="filled">
              + Create Quiz
            </Button>
          </Group>
          <Group>
            {quizzes.map((quiz, index) => (
              <Card shadow="sm" p="lg" mx="xs" my="sm" radius="md" withBorder className={styles.quizCard}>
                <Card.Section style={{ backgroundColor: tilesBGColors[index % 5] }}>
                  <Icon
                    name={`quiz_${(index % 13) + 1}`}
                    width="100%"
                    height={150}
                    color="#ffffff"
                    className={`my-lg ${styles.tileIcon}`}
                  />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text weight="bold" className={styles.truncate2Lines}>
                    {quiz.name}
                  </Text>
                  {quiz.isDraft && (
                    <Badge color="pink" variant="light">
                      Draft
                    </Badge>
                  )}
                </Group>
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
                    onClick={() => navigate(`/configure-quiz/${userName}/${quiz.quizId}`)}>
                    Edit
                  </Button>
                  {!quiz.isDraft && (
                    <Button
                      color="teal"
                      radius="md"
                      className={styles.playCardButton}
                      onClick={() => navigate(`/configure-game/${userName}/${quiz.quizId}`)}>
                      Play
                    </Button>
                  )}
                </Group>
              </Card>
            ))}
          </Group>
        </>
      )}
    </>
  );
}
