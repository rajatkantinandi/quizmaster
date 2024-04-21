import { ActionIcon, Badge, Button, Card, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Icon, { IconName } from '../../components/Icon';
import { tilesBGColors, TrackingEvent } from '../../constants';
import { plural } from '../../helpers';
import { track } from '../../helpers/track';
import { useStore } from '../../useStore';
import styles from './styles.module.css';

type QuizMetadata = {
  name: string;
  numOfCategories: number;
  numOfQuestions: number;
  isDraft?: boolean;
  isPublished?: boolean;
  isAddedFromCatalog?: boolean;
  isInCatalog?: boolean;
  createDate: string;
  quizId: number;
};

type Props = {
  quizMetadata: QuizMetadata;
  index: number;
  userName: string;
  handleDownload?: () => void;
};

export default function QuizCard({ quizMetadata, index, userName, handleDownload }: Props) {
  const navigate = useNavigate();
  const { quizzesSelector, showAlert, toggleSelectedQuizzes, getInCompletedGame } = useStore();
  const [isImportingFromCatalog, setIsImportingFromCatalog] = useState(false);

  async function handlePlayGame(quizId) {
    const gameId = await getInCompletedGame(quizId);

    track(TrackingEvent.PLAY_QUIZ, {
      quizName: quizMetadata.name,
      isAddedFromCatalog: !!quizMetadata.isAddedFromCatalog,
      numOfCategories: quizMetadata.numOfCategories,
      numOfQuestions: quizMetadata.numOfQuestions,
    });

    if (gameId) {
      navigate(`/play-game/${userName}/${gameId}`);
    } else {
      navigate(`/configure-game/${userName}/${quizId}`);
    }
  }

  async function previewQuiz(quizName: string) {
    setIsImportingFromCatalog(true);
    track(TrackingEvent.CATALOG_QUIZ_PREVIEWED, {
      quizName,
      isAddedFromCatalog: true,
      numOfCategories: quizMetadata.numOfCategories,
      numOfQuestions: quizMetadata.numOfQuestions,
    });

    navigate(`/configure-quiz/${userName}/preview?quizName=${quizName}`);
  }

  return (
    <Card shadow="sm" p="lg" withBorder className={styles.quizCardWrapper}>
      <Card.Section style={{ backgroundColor: tilesBGColors[index % 5] }}>
        <Icon
          name={`quiz_${(index % 13) + 1}` as IconName}
          width="100%"
          height={120}
          color="#ffffff"
          className={`my-lg ${styles.tileIcon}`}
        />
      </Card.Section>
      <div className="flex flexCol spaceBetween grow">
        <div className="flex flexCol">
          <Group position="apart" mt="md">
            <Text weight="bold" className="truncatedTwoLine" title={quizMetadata.name}>
              {quizMetadata.name}
            </Text>
            {quizMetadata.isDraft && (
              <Badge color="pink" variant="light">
                Draft
              </Badge>
            )}
            {quizMetadata.isPublished && (
              <Badge color="green" variant="light">
                Published
              </Badge>
            )}
          </Group>
          <Text mb="xs" size="xs" italic>
            Created on:{' '}
            {new Date(quizMetadata.createDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
          <Text>
            {plural(quizMetadata.numOfCategories, '%count category', '%count categories')},{' '}
            {plural(quizMetadata.numOfQuestions, '%count question', '%count questions')}
          </Text>
        </div>
        <Group position="apart" className="mt-lg fullWidth">
          {quizMetadata.isInCatalog || quizMetadata.isDraft ? (
            <Button
              color="pink"
              fullWidth
              leftIcon={<Icon color="#ffffff" name={quizMetadata.isInCatalog ? 'play' : 'pencil'} width={16} />}
              disabled={isImportingFromCatalog}
              onClick={() => {
                if (quizMetadata.isInCatalog) {
                  previewQuiz(quizMetadata.name);
                } else {
                  navigate(`/configure-quiz/${userName}/${quizMetadata.quizId}`);
                }
              }}>
              {quizMetadata.isInCatalog ? 'Preview' : 'Edit'}
            </Button>
          ) : (
            <>
              <Button
                color="teal"
                className="grow"
                leftIcon={<Icon color="#ffffff" name="playCircle" width={16} />}
                onClick={() => handlePlayGame(quizMetadata.quizId)}>
                Play
              </Button>
              <Button
                title="Edit quiz"
                variant="light"
                className="iconButton"
                onClick={() => navigate(`/configure-quiz/${userName}/${quizMetadata.quizId}`)}>
                <Icon color="var(--gray-dark)" name="pencil" width={18} />
              </Button>
              {!!handleDownload && (
                <Button title="Download quiz" variant="light" className="iconButton" onClick={handleDownload}>
                  <Icon color="var(--gray-dark)" name="download" width={18} />
                </Button>
              )}
            </>
          )}
        </Group>
      </div>
      {quizzesSelector.show && !quizMetadata.isInCatalog && (
        <ActionIcon
          variant="transparent"
          className={styles.cardSelectBtn}
          onClick={() => {
            if (quizzesSelector.action === 'publish' && quizMetadata.isDraft) {
              showAlert({
                message: 'Quiz in draft state is not allowed to publish.',
                type: 'info',
              });
            } else {
              toggleSelectedQuizzes(quizMetadata.quizId);
            }
          }}>
          <Icon
            name={
              quizzesSelector.selectedQuizzes.includes(quizMetadata.quizId) ? 'checkmarkFilled' : 'checkmarkOutline'
            }
            width={200}
            height={200}
          />
        </ActionIcon>
      )}
    </Card>
  );
}
