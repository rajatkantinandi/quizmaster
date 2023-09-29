import React, { useEffect, useState } from 'react';
import { useStore } from '../../useStore';
import { Helmet } from 'react-helmet';
import { Group, Text } from '@mantine/core';
import PageLoader from '../../components/PageLoader';
import QuizSelectorBanner from '../../components/QuizSelectorBanner';
import NoQuizzes from './NoQuizzes';
import ActionBar from './ActionBar';
import QuizCard from './QuizCard';
import CreateQuizButton from '../../components/CreateQuizButton';

export default function Quizzes({ userName }) {
  const [loading, setLoading] = useState(true);
  const {
    getQuizzes,
    quizzesSelector,
    setQuizzesSelectorState,
    deleteQuizzes,
    publishQuizzes,
    toggleSelectedQuizzes,
    showModal,
    showAlert,
    sortQuizzes,
    getInCompletedGame,
    ...rest
  } = useStore();
  const quizzes = rest.searchQuery ? rest.searchResults : rest.quizzes;

  useEffect(() => {
    getQuizzes().then((quizzes) => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Quizzes</title>
      </Helmet>
      {loading ? (
        <PageLoader />
      ) : quizzes.length === 0 && !rest.searchQuery.trim() ? (
        <NoQuizzes userName={userName} />
      ) : (
        <>
          <QuizSelectorBanner {...quizzesSelector} />
          <ActionBar quizzes={quizzes} />
          <Group>
            {quizzes.map((quiz, index) => (
              <QuizCard quiz={quiz} index={index} userName={userName} key={quiz.quizId} />
            ))}
            {/* No search results */}
            {quizzes.length === 0 && (
              <div className="ml-xl mt-xl">
                <Text color="gray" size="xl" mb="sm">
                  No search results found
                </Text>
              </div>
            )}
          </Group>
          <CreateQuizButton userName={userName} isFloating />
        </>
      )}
    </>
  );
}
