import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../useStore';
import { Helmet } from 'react-helmet';
import { Group, Text } from '@mantine/core';
import PageLoader from '../../components/PageLoader';
import QuizSelectorBanner from '../../components/QuizSelectorBanner';
import NoQuizzes from './NoQuizzes';
import ActionBar from './ActionBar';
import CreateQuizButton from '../../components/CreateQuizButton';
import QuizCard from '../../components/QuizCard';
import { getQuestionsCount } from '../../helpers';
import { downloadQuiz } from '../../helpers/importExport';

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
  const filteredQuizzes = useMemo(
    () =>
      rest.searchQuery
        ? rest.quizzes.filter((quiz) => quiz.name.toLowerCase().includes(rest.searchQuery.toLowerCase()))
        : rest.quizzes,
    [rest.quizzes, rest.searchQuery],
  );

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
      ) : filteredQuizzes.length === 0 && !rest.searchQuery.trim() ? (
        <NoQuizzes userName={userName} />
      ) : (
        <>
          <QuizSelectorBanner {...quizzesSelector} />
          <ActionBar quizzes={filteredQuizzes} />
          <Group>
            {filteredQuizzes.map((quiz, index) => {
              const { quizId, categories, createDate, name, isDraft, isPublished, isAddedFromCatalog } = quiz;

              return (
                <QuizCard
                  quizMetadata={{
                    quizId,
                    numOfCategories: categories.length,
                    numOfQuestions: getQuestionsCount(categories),
                    createDate,
                    name,
                    isDraft,
                    isPublished,
                    isAddedFromCatalog,
                  }}
                  index={index}
                  userName={userName}
                  key={quizId}
                  handleDownload={() => downloadQuiz(quiz)}
                />
              );
            })}
            {/* No search results */}
            {filteredQuizzes.length === 0 && (
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
