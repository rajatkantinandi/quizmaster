import { Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router';
import CreateQuizButton from '../../components/CreateQuizButton';
import Icon from '../../components/Icon';
import ImportQuizzesButton from '../../components/ImportQuizzesButton';
import VideoPlayerOpenInModal from '../../components/VideoPlayerOpenInModal';
import styles from './styles.module.css';

export default function NoQuizzes({ userName }: { userName: string }) {
  const navigate = useNavigate();

  return (
    <div className="flexCol flex alignCenter fullWidth">
      <h2 className={styles.welcomeHeader}>Welcome to quizmaster</h2>
      <p className={styles.secondaryText}>
        Quizmaster is a free app that allows users to create and host quizzes, adding an entertaining and knowledgeable
        element to any event.
      </p>
      <VideoPlayerOpenInModal
        videoEmbedUrl="https://www.youtube.com/embed/2aGqrP1lpFw?autoplay=1"
        aspectRatio={1.78}
        thumbnailUrl="https://i.ytimg.com/vi/2aGqrP1lpFw/hqdefault.jpg"
        videoTitle="Watch the demo"
      />
      <p className={styles.secondaryText2}>It is ideal for quizmasters looking to customise and host their quizzes.</p>
      <Group position="center" mt="xl" spacing={50}>
        <CreateQuizButton userName={userName} />
        <Button
          size="lg"
          onClick={() => navigate(`/catalog/${userName}`)}
          variant="filled"
          sx={(theme) => ({ boxShadow: theme.shadows.sm, backgroundColor: theme.colors.blue[8] })}
          radius="xl"
          leftIcon={<Icon color="white" width="16" name="download" />}>
          Add from catalog
        </Button>
        <ImportQuizzesButton size="lg" radius="xl" />
      </Group>
    </div>
  );
}
