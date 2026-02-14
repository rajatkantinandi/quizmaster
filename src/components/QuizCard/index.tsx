import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Icon, { IconName } from '../../components/Icon';
import { tilesBGColors, TrackingEvent } from '../../constants';
import { plural } from '../../helpers';
import { track } from '../../helpers/track';
import { useStore } from '../../useStore';

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

  async function handlePlayGame(quizId: number) {
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
    <Card
      shadow="sm"
      className="w-[20%] min-w-[250px] h-[320px] p-[10px_16px_16px] m-2 rounded-[10px] flex flex-col relative overflow-hidden">
      <div style={{ backgroundColor: tilesBGColors[index % 5] }} className="py-4">
        <Icon
          name={`quiz_${(index % 13) + 1}` as IconName}
          width="100%"
          height={120}
          color="#ffffff"
          className="my-4 opacity-50"
        />
      </div>
      <CardContent className="flex flex-col justify-between flex-1">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mt-4">
            <h3 className="font-bold text-sm truncate-2-line" title={quizMetadata.name}>
              {quizMetadata.name}
            </h3>
            {quizMetadata.isDraft && (
              <Badge variant="secondary" className="ml-2 shrink-0">
                Draft
              </Badge>
            )}
            {quizMetadata.isPublished && (
              <Badge variant="success" className="ml-2 shrink-0">
                Published
              </Badge>
            )}
          </div>
          <p className="text-xs italic text-gray-500 mb-1">
            Created on:{' '}
            {new Date(quizMetadata.createDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p className="text-sm">
            {plural(quizMetadata.numOfCategories, '%count category', '%count categories')},{' '}
            {plural(quizMetadata.numOfQuestions, '%count question', '%count questions')}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4 w-full gap-2">
          {quizMetadata.isInCatalog || quizMetadata.isDraft ? (
            <Button
              variant="secondary"
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
                className="flex-1"
                leftIcon={<Icon color="#ffffff" name="playCircle" width={16} />}
                onClick={() => handlePlayGame(quizMetadata.quizId)}>
                Play
              </Button>
              <Button
                title="Edit quiz"
                variant="light"
                size="icon"
                onClick={() => navigate(`/configure-quiz/${userName}/${quizMetadata.quizId}`)}>
                <Icon color="var(--gray-dark)" name="pencil" width={18} />
              </Button>
              {!!handleDownload && (
                <Button title="Download quiz" variant="light" size="icon" onClick={handleDownload}>
                  <Icon color="var(--gray-dark)" name="download" width={18} />
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
      {quizzesSelector.show && !quizMetadata.isInCatalog && (
        <button
          className="absolute inset-0 bg-white/50 border-0 cursor-pointer"
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
        </button>
      )}
    </Card>
  );
}
