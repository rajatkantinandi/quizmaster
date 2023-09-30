import { Group } from '@mantine/core';
import { useEffect } from 'react';
import PageLoader from '../../components/PageLoader';
import QuizCard from '../../components/QuizCard';
import { useStore } from '../../useStore';

export default function Catalog({ userName }: any) {
  const { catalogList, getCatalogList } = useStore();

  useEffect(() => {
    getCatalogList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!catalogList) {
    return <PageLoader />;
  }

  return (
    <Group>
      {catalogList.map((item, index) => (
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
