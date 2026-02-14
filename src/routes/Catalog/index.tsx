import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2" style={{ marginLeft: 10 }}>
        <Select value={sortBy} onValueChange={(val) => setSortBy(val || DEFAULT_SORT_BY)}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Icon width="16" name="sort" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createDate">Create Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
