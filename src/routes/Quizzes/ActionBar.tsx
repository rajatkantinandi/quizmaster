import { Button, Group, Select } from '@mantine/core';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import ImportQuizzesButton from '../../components/ImportQuizzesButton';
import { Quiz } from '../../types';
import { useStore } from '../../useStore';
import styles from './styles.module.css';

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

  // function handlePublishQuizzes() {
  //   if (quizzes.some((quiz) => !quiz.isDraft && !quiz.isPublished)) {
  //     setQuizzesSelectorState({
  //       action: 'publish',
  //       message: 'Select quizzes to publish',
  //       show: true,
  //       selectedQuizzes: [],
  //       onNextClick: (selectedQuizzes) => {
  //         showModal({
  //           title: 'Publish Quizzes',
  //           body: (
  //             <>
  //               <p>Are you sure you want to publish following quizzes ?</p>
  //               <ol>
  //                 {selectedQuizzes.map((quizId) => (
  //                   <li key={quizId}>{quizzes.find((quiz) => quiz.quizId === quizId)?.name}</li>
  //                 ))}
  //               </ol>
  //             </>
  //           ),
  //           okCallback: async () => {
  //             await publishQuizzes(selectedQuizzes);
  //             setQuizzesSelectorState({
  //               action: '',
  //               message: '',
  //               show: false,
  //               selectedQuizzes: [],
  //             });
  //           },
  //           cancelCallback: () => {
  //             setQuizzesSelectorState({
  //               action: '',
  //               message: '',
  //               show: false,
  //               selectedQuizzes: [],
  //             });
  //           },
  //           okText: 'Publish Quizzes',
  //           cancelText: 'Cancel',
  //         });
  //       },
  //       onCancelClick: () => {
  //         setQuizzesSelectorState({
  //           action: '',
  //           message: '',
  //           show: false,
  //           selectedQuizzes: [],
  //         });
  //       },
  //     });
  //   } else {
  //     showAlert({
  //       message: 'No quiz to publish. Please complete the quizzes before publish if they are in draft state.',
  //       type: 'info',
  //     });
  //   }
  // }

  return (
    <Group className={styles.pageTitleWrapper} spacing={25} mt="md" mb="lg">
      <ImportQuizzesButton />
      <Button
        onClick={handleDeleteQuizzes}
        className={classNames('noTextOnSmallScreen', styles.deleteButton)}
        title="Delete Quizzes"
        leftIcon={<Icon color="white" width="16" name="trash" />}>
        Delete Quizzes
      </Button>
      {/* TODO: enable publish button when we have backend */}
      {/* <Button
        onClick={handlePublishQuizzes}
        className={styles.publishQuiz}
        leftIcon={<Icon color="white" width="16" name="publish" />}>
        Publish Quizzes
      </Button> */}
      <Select
        placeholder="Sort by"
        className={styles.sort}
        onChange={(val) => setSortBy(val || DEFAULT_SORT_BY)}
        data={[
          { value: 'recency', label: 'Recently Updated' },
          { value: 'createDate', label: 'Create Date' },
          { value: 'name', label: 'Name' },
        ]}
        icon={<Icon width="16" name="sort" />}
        value={sortBy}
        transition="pop-top-left"
        transitionDuration={100}
        transitionTimingFunction="ease"
      />
    </Group>
  );
}
