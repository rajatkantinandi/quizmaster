import { Group } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import PageLoader from '../../components/PageLoader';
import QuizCard from '../../components/QuizCard';
import { useStore } from '../../useStore';

export default function Catalog({ userName }: any) {
  const { catalogList, getCatalogList, searchQuery } = useStore();
  const filteredCatalogList = useMemo(
    () =>
      searchQuery && catalogList
        ? catalogList.filter((quiz) => quiz.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : catalogList || [],
    [searchQuery, catalogList],
  );

  useEffect(() => {
    getCatalogList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!catalogList) {
    return <PageLoader />;
  }

  return (
    <Group>
      {filteredCatalogList.map((item, index) => (
        <QuizCard
          quizMetadata={{
            name: item.name,
            quizId: item.quizId,
            createDate: item.createDate,
            numOfCategories: item.numOfCategories,
            numOfQuestions: item.numOfQuestions,
            isInCatalog: true,
          }}
          index={index}
          userName={userName}
          key={item.quizId}
        />
      ))}
    </Group>
  );
}
