import { Group, Select } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import PageLoader from '../../components/PageLoader';
import QuizCard from '../../components/QuizCard';
import { useStore } from '../../useStore';

const DEFAULT_SORT_BY = 'createDate';

export default function Catalog({ userName }: any) {
  const { catalogList, getCatalogList, searchQuery, sortCatalogQuizzes } = useStore();
  const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
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

  useEffect(() => {
    sortCatalogQuizzes(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, catalogList]);

  if (!catalogList) {
    return <PageLoader />;
  }

  return (
    <Group>
      <Select
        placeholder="Sort by"
        onChange={(val) => setSortBy(val || DEFAULT_SORT_BY)}
        data={[
          { value: 'createDate', label: 'Create Date' },
          { value: 'name', label: 'Name' },
        ]}
        icon={<Icon width="16" name="sort" />}
        value={sortBy}
        transition="pop-top-left"
        transitionDuration={100}
        transitionTimingFunction="ease"
        style={{ marginLeft: 10 }}
      />
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
    </Group>
  );
}
