import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import ImportQuizzesButton from '../../components/ImportQuizzesButton';
import { Quiz } from '../../types';
import { useStore } from '../../useStore';

type Props = {
  quizzes: Quiz[];
};

const DEFAULT_SORT_BY = 'recency';

export default function ActionBar({ quizzes }: Props) {
  const { setQuizzesSelectorState, showModal, deleteQuizzes, sortQuizzes } = useStore();
  const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);

  useEffect(() => {
    sortQuizzes(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, quizzes]);

  function handleDeleteQuizzes() {
    setQuizzesSelectorState({
      action: 'delete',
      message: 'Select quizzes to delete',
      show: true,
      selectedQuizzes: [],
      onNextClick: (selectedQuizzes) => {
        showModal({
          title: 'Delete Quizzes',
          body: (
            <>
              <p>Are you sure you want to delete following quizzes ?</p>
              <ol>
                {selectedQuizzes.map((quizId) => (
                  <li key={quizId}>{quizzes.find((quiz) => quiz.quizId === quizId)?.name}</li>
                ))}
              </ol>
            </>
          ),
          okCallback: async () => {
            await deleteQuizzes(selectedQuizzes);
            setQuizzesSelectorState({
              action: '',
              message: '',
              show: false,
              selectedQuizzes: [],
            });
          },
          cancelCallback: () => {
            setQuizzesSelectorState({
              action: '',
              message: '',
              show: false,
              selectedQuizzes: [],
            });
          },
          okText: 'Delete Quizzes',
          cancelText: 'Cancel',
        });
      },
      onCancelClick: () => {
        setQuizzesSelectorState({
          action: '',
          message: '',
          show: false,
          selectedQuizzes: [],
        });
      },
    });
  }

  return (
    <div className="mt-md mb-lg flex w-[95%] gap-[25px] px-3 max-[1240px]:w-[98.5%]">
      <ImportQuizzesButton />
      <Button
        onClick={handleDeleteQuizzes}
        className={cn('bg-[#c10606] text-white hover:bg-[#a80505]')}
        title="Delete Quizzes"
        leftIcon={<Icon color="white" width="16" name="trash" />}
      >
        Delete Quizzes
      </Button>
      <Select value={sortBy} onValueChange={(val) => setSortBy(val || DEFAULT_SORT_BY)}>
        <SelectTrigger className="max-w-[190px]">
          <div className="flex items-center gap-2">
            <Icon width="16" name="sort" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recency">Recently Updated</SelectItem>
          <SelectItem value="createDate">Create Date</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
