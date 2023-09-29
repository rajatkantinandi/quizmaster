import { ActionIcon, Badge, Button, Card, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router';
import Icon, { IconName } from '../../components/Icon';
import { tilesBGColors } from '../../constants';
import { plural } from '../../helpers';
import { downloadQuiz } from '../../helpers/importExport';
import { Quiz } from '../../types';
import { useStore } from '../../useStore';
import styles from './styles.module.css';

type Props = {
  quiz: Quiz;
  index: number;
  userName: string;
};

export default function QuizCard({ quiz, index, userName }: Props) {
  const navigate = useNavigate();
  const { quizzesSelector, showAlert, toggleSelectedQuizzes, getInCompletedGame } = useStore();

  function getQuestionsCount(categories): number {
    return categories.reduce((count, category) => {
      count += category.questions.length;

      return count;
    }, 0);
  }

  async function handlePlayGame(quizId) {
    const gameId = await getInCompletedGame(quizId);

    if (gameId) {
      navigate(`/play-game/${userName}/${gameId}`);
    } else {
      navigate(`/configure-game/${userName}/${quizId}`);
    }
  }

  return (
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
              <Button title="Download quiz" variant="light" className="iconButton" onClick={() => downloadQuiz(quiz)}>
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
              name={quizzesSelector.selectedQuizzes.includes(quiz.quizId) ? 'checkmarkFilled' : 'checkmarkOutline'}
              width={200}
              height={200}
            />
          </ActionIcon>
        )}
      </Card>
    </div>
  );
}
