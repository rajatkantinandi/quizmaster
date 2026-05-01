import React from 'react';
import { Helmet } from 'react-helmet';
import Quizzes from '../Quizzes';
import ConfigureQuiz from '../ConfigureQuiz';
import CreateQuiz from '../CreateQuiz';
import ConfigureGame from '../ConfigureGame';
import PlayQuiz from '../PlayQuiz';
import { useParams } from 'react-router';
import { useStore } from '../../useStore';
import Icon from '../../components/Icon';
import CheckAuthAndNavigate from '../../components/CheckAuthAndNavigate';
import { isValidUser } from '../../helpers/authHelper';
import { capitalizeFirstLetter } from '../../helpers/textHelpers';
import { Link } from 'react-router-dom';
import HeaderTabs from '../../components/TopTabs/HeaderTabs';
import Catalog from '../Catalog';
import { track } from '../../helpers/track';
import { TrackingEvent } from '../../constants';
import Footer from '../Quizzes/Footer';
import useVideoInModal from '../../helpers/useVideoInModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function AppLayout() {
  const { userName, viewType, id } = useParams();
  const { searchQuiz, quizzes, searchQuery, clearSearch } = useStore();
  const showDemoVideo = useVideoInModal({
    videoEmbedUrl: 'https://www.youtube.com/embed/2aGqrP1lpFw?autoplay=1',
    videoTitle: 'How to use the app',
  });

  function getTabsView() {
    switch (viewType) {
      case 'my-quizzes':
        return <Quizzes userName={userName} />;
      case 'configure-quiz': {
        if (id) {
          return <ConfigureQuiz quizId={id} userName={userName} />;
        } else {
          return <CreateQuiz userName={userName} />;
        }
      }
      case 'configure-game':
        return <ConfigureGame quizId={id} userName={userName} />;
      case 'play-game':
        return <PlayQuiz gameId={id} userName={userName} />;
      case 'catalog':
        return <Catalog userName={userName} />;
      default:
        return <CheckAuthAndNavigate />;
    }
  }

  return isValidUser ? (
    <>
      <Helmet>
        <title>{capitalizeFirstLetter(viewType).replace('-', ' ')} - Quizmaster</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <header className="h-[70px] border-b w-full sticky top-0 z-50 bg-[var(--background)]">
          <div className="flex justify-between items-center h-full px-6">
            <div className="flex h-full items-center gap-4">
              <Link to={`/my-quizzes/${userName}`} className="ml-4 flex h-full items-center">
                <Icon name="logo" className="block" width={150} height={50} />
              </Link>
              <HeaderTabs
                tabs={[
                  { title: 'My quizzes', url: `/my-quizzes/${userName}` },
                  { title: 'Catalog', url: `/catalog/${userName}` },
                ]}
                onChange={() => clearSearch()}
              />
            </div>
            {((quizzes.length > 0 && viewType === 'my-quizzes') || viewType === 'catalog') && (
              <Input
                type="text"
                placeholder="Search by quiz name"
                className="ml-5 mr-6 min-w-[240px] self-center rounded-full"
                value={searchQuery}
                onChange={(ev) => searchQuiz(ev.target.value)}
                onBlur={() => {
                  if (searchQuery.trim() && searchQuery.trim().length > 3) {
                    track(TrackingEvent.SEARCH, {
                      searchQuery,
                      isInCatalog: viewType === 'catalog',
                    });
                  }
                }}
              />
            )}
            <div className="flex h-full items-center">
              {(quizzes.length > 0 || viewType !== 'my-quizzes') && (
                <Button
                  onClick={showDemoVideo}
                  className="mr-5 my-auto"
                  leftIcon={<Icon color="#fff" name="playCircle" width={20} />}>
                  Watch demo
                </Button>
              )}
              <Button
                onClick={() => window.open('https://forms.gle/9bTd9ph1JVXKYw3XA', '_blank')}
                variant="outline"
                className="my-auto"
                leftIcon={<Icon color="var(--qm-primary)" name="feedback" width={20} />}>
                Share feedback
              </Button>
            </div>
          </div>
        </header>
        <main
          className={`flex-1 min-h-[calc(100vh-70px)] w-full ${
            window.location.pathname.includes('/my-quizzes') ? 'bg-[var(--off-white)]' : 'bg-[var(--background)]'
          } px-6 pt-4`}>
          {getTabsView()}
        </main>
        <Footer />
      </div>
    </>
  ) : (
    <CheckAuthAndNavigate />
  );
}

export default AppLayout;
