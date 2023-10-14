import { Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router';
import CreateQuizButton from '../../components/CreateQuizButton';
import Icon from '../../components/Icon';
import ImportQuizzesButton from '../../components/ImportQuizzesButton';
import styles from './styles.module.css';

export default function NoQuizzes({ userName }: { userName: string }) {
  const navigate = useNavigate();

  return (
    <div className="flexCol flex alignCenter fullWidth">
      <h2 className={styles.welcomeHeader}>Welcome to quizmaster</h2>
      <p className={styles.secondaryText}>
        You can either create a quiz or add any quiz from our catalog or import existing quiz from your device
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
    </div>
  );
}
