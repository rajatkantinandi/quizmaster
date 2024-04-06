import { Button, Divider, Group } from '@mantine/core';
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
      <section className="flexCol flex alignCenter fullWidth">
        <p className={styles.secondaryText}>
          Quizmaster is a free app that allows users to create and host quizzes, adding an entertaining and
          knowledgeable element to any event.
        </p>
        <VideoPlayerOpenInModal
          videoEmbedUrl="https://www.youtube.com/embed/2aGqrP1lpFw?autoplay=1"
          aspectRatio={1.78}
          thumbnailUrl="https://i.ytimg.com/vi/2aGqrP1lpFw/hqdefault.jpg"
          videoTitle="Watch the demo"
        />
        <p className={styles.secondaryText2}>
          It is ideal for quizmasters looking to customise and host their quizzes.
        </p>
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
      </section>
      <Divider style={{ width: '80%', marginTop: 60, marginBottom: 50 }} />
      <section className={styles.keyFeatures}>
        <div className={styles.feature}>
          <Icon name="peopleNearby" width={100} height={100} />
          <h4>Free for everyone</h4>
          <ul>
            <li>Create quizzes or use curated ones from our catalog for free.</li>
            <li>Download and share quizzes with friends at no cost.</li>
          </ul>
        </div>
        <div className={styles.feature}>
          <Icon name="settingsWheels" width={100} height={100} />
          <h4>Make your own quizzes!</h4>
          <ul>
            <li>Create custom quizzes with various categories and questions.</li>
            <li>Incorporate videos, images, formatted text, and custom question points.</li>
          </ul>
        </div>
        <div className={styles.feature}>
          <Icon name="partyPopper" width={100} height={100} />
          <h4>Make quiz hosting fun</h4>
          <ul>
            <li>Form teams by typing in team names or opt for random team generation.</li>
            <li>
              Flexibility to modify quiz settings like negative points, time limits, and the display of points while
              you’re hosting.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
