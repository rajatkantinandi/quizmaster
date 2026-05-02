import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router';
import CreateQuizButton from '../../components/CreateQuizButton';
import Icon from '../../components/Icon';
import ImportQuizzesButton from '../../components/ImportQuizzesButton';
import VideoPlayerOpenInModal from '../../components/VideoPlayerOpenInModal';

export default function NoQuizzes({ userName }: { userName: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex-col flex items-center w-full">
      <h2 className="mb-[10px] mt-[15px] text-[32px] text-[var(--qm-primary)]">Welcome to quizmaster</h2>
      <section className="flex-col flex items-center w-full">
        <p className="mb-[30px] mt-0 max-w-[800px] text-center text-[22px]">
          Quizmaster is a free & open source app that allows users to create and host quizzes, adding an entertaining
          and knowledgeable element to any event.
        </p>
        <VideoPlayerOpenInModal
          videoEmbedUrl="https://www.youtube.com/embed/2aGqrP1lpFw?autoplay=1"
          aspectRatio={1.78}
          thumbnailUrl="https://i.ytimg.com/vi/2aGqrP1lpFw/hqdefault.jpg"
          videoTitle="Watch the demo"
        />
        <p className="my-4 text-[20px] text-[var(--gray-dark)]">
          It is ideal for quizmasters looking to customise and host their quizzes.
        </p>
        <div className="flex justify-center gap-[50px] mt-xl">
          <CreateQuizButton userName={userName} />
          <Button
            size="lg"
            onClick={() => navigate(`/catalog/${userName}`)}
            className="shadow-sm bg-blue-800 hover:bg-blue-700 text-lg"
            leftIcon={<Icon color="white" width={18} height={18} name="download" />}>
            Add from catalog
          </Button>
          <ImportQuizzesButton size="lg" radius="xl" className="text-lg" />
        </div>
      </section>
      <Separator className="w-4/5 mt-[60px] mb-[50px]" />
      <section className="flex max-w-[1200px] flex-row p-5">
        <div className="flex flex-1 flex-col px-[10px] items-center gap-4">
          <Icon name="peopleNearby" width={100} height={100} color="var(--primary)" />
          <h4 className="mb-[10px] text-center font-bold text-[22px] text-[var(--primary)]">Free for everyone</h4>
          <ul className="list-disc pl-6">
            <li className="mb-2 font-body text-[18px] text-[var(--gray-dark)]">
              Create quizzes or use curated ones from our catalog for free.
            </li>
            <li className="mb-2 font-body text-[18px] text-[var(--gray-dark)]">
              Download and share quizzes with friends at no cost.
            </li>
          </ul>
        </div>
        <div className="flex flex-1 flex-col px-[10px] items-center gap-4">
          <Icon name="settingsWheels" width={100} height={100} color="var(--score-header-bg" />
          <h4 className="mb-[10px] text-center font-bold text-[22px] text-[var(--score-header-bg)]">
            Make your own quizzes!
          </h4>
          <ul className="list-disc pl-6">
            <li className="mb-2 font-body text-[18px] text-[var(--gray-dark)]">
              Create custom quizzes with various categories and questions.
            </li>
            <li className="mb-2 font-body text-[18px] text-[var(--gray-dark)]">
              Incorporate videos, images, formatted text, and custom question points.
            </li>
          </ul>
        </div>
        <div className="flex flex-1 flex-col px-[10px] items-center gap-4">
          <Icon name="partyPopper" width={100} height={100} color="var(--quiz-card-bg-1)" />
          <h4 className="mb-[10px] text-center font-bold text-[22px] text-[var(--quiz-card-bg-1)]">
            Make quiz hosting fun
          </h4>
          <ul className="list-disc pl-6">
            <li className="mb-2 font-body text-[18px] text-[var(--gray-dark)]">
              Form teams by typing in team names or opt for random team generation.
            </li>
            <li className="mb-2 font-body text-[18px] text-[var(--gray-dark)]">
              Flexibility to modify quiz settings like negative points, time limits, and the display of points while
              you're hosting.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
