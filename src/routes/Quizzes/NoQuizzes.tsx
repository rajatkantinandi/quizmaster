import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
          Quizmaster is a free & open source app that allows users to create and host quizzes, adding an entertaining
          and knowledgeable element to any event.
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
        <div className="flex justify-center gap-[50px] mt-xl">
          <CreateQuizButton userName={userName} />
          <Button
            size="lg"
            onClick={() => navigate(`/catalog/${userName}`)}
            className="rounded-full shadow-sm bg-blue-800 hover:bg-blue-700"
            leftIcon={<Icon color="white" width="16" name="download" />}
          >
            Add from catalog
          </Button>
          <ImportQuizzesButton size="lg" radius="xl" />
        </div>
      </section>
      <Separator className="w-4/5 mt-[60px] mb-[50px]" />
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
              you're hosting.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
