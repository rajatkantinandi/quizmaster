import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { Title, Card, Button, Group, Text } from '@mantine/core';
import Icon from '../../components/Icon';
import QuestionEdit from '../../components/QuestionEdit';
import QuestionView from '../../components/QuestionView';
import { Control, useFieldArray } from 'react-hook-form';
import { getEmptyQuestion } from '../../helpers';
import { useStore } from '../../useStore';
import { Question, Quiz } from '../../types';
import { ReactSortable } from 'react-sortablejs';
import Modal from '../../components/Modal';

type Props = {
  activeCategoryName: string;
  questions: Question[];
  activeCategoryIndex: number;
  control: Control<any, any>;
  expandedQuestionIndex: number | null | 'all';
  activeQuestionIndex: number | null;
  activeCategoryId?: number;
  setActiveQuestionIndex: (idx: number | null) => void;
  isValidQuestion: (question: Question) => boolean;
  setExpandedQuestionIndex: (idx: number | null | 'all') => void;
  quizId: string;
  updateQuizData: () => void;
  handleRearrangeQuestions: () => void;
  rearrangeMode: boolean;
  isPreview: boolean;
};

export default function QuestionsListPanel({
  activeCategoryName,
  questions,
  activeCategoryIndex,
  control,
  expandedQuestionIndex,
  activeQuestionIndex,
  activeCategoryId,
  setActiveQuestionIndex,
  isValidQuestion,
  setExpandedQuestionIndex,
  quizId,
  updateQuizData,
  handleRearrangeQuestions,
  rearrangeMode,
  isPreview,
}: Props) {
  const {
    append,
    remove,
    update: updateQuestionData,
    replace,
  } = useFieldArray({
    control,
    name: `categories[${activeCategoryIndex}].questions`,
  });
  const { getQuiz, showAlert, showModal } = useStore();
  const questionEditRef = useRef<HTMLFormElement>();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  useEffect(() => {
    if (!activeQuestionIndex) {
      setIsAddingQuestion(false); // When edit mode is closed, reset isAddingQuestion
    }
  }, [activeQuestionIndex]);

  const addQuestion = () => {
    if (!activeCategoryName) {
      showAlert({
        message: 'Please enter a category name before adding a new question!',
        type: 'warning',
      });
      return;
    }

    const question = getEmptyQuestion(activeCategoryId!);
    append(question);
    setActiveQuestionIndex(questions.length);
    setExpandedQuestionIndex(null);
    setIsAddingQuestion(true);
  };

  function handleDeleteQuestion(ev, index: number) {
    ev.stopPropagation();
    const question = questions[index];

    if (isValidQuestion(question)) {
      showModal({
        title: 'Delete Question',
        body: 'Are you sure you want to delete this question?',
        okCallback: () => deleteQuestion(index),
        okText: 'Delete Question',
        cancelText: 'Cancel',
      });
    } else {
      deleteQuestion(index);
    }
  }

  function deleteQuestion(index) {
    remove(index);

    if (index === activeQuestionIndex) {
      setActiveQuestionIndex(null);
    }
  }

  const resetQuestion = () => {
    if (activeQuestionIndex !== null && activeQuestionIndex >= 0) {
      getQuiz(quizId, isPreview).then((quiz: Quiz) => {
        const originalQuestion = (quiz.categories[activeCategoryIndex]?.questions || [])[activeQuestionIndex];

        if (originalQuestion && originalQuestion.categoryId) {
          updateQuestionData(activeQuestionIndex, originalQuestion);
        } else {
          remove(activeQuestionIndex);
        }

        setActiveQuestionIndex(null);
      });
    }
  };

  async function handleSaveQuestion(idx, question) {
    updateQuestionData(idx, question);
    await updateQuizData();
    setActiveQuestionIndex(null);
    setExpandedQuestionIndex(idx);

    showAlert({
      message: 'Question has been saved successfully.',
      type: 'success',
    });
  }

  function onQuestionSwap(data) {
    const updatedQuestionIds = data.map((x) => x.questionId).join(',');
    const initialQuestionIds = questions.map((x) => x.questionId).join(',');

    if (initialQuestionIds !== updatedQuestionIds) {
      replace(
        // Remove id required for react sortable before updating questions state
        data.map((x) => {
          delete x.id;
          return x;
        }),
      );
    }
  }

  return (
    <Card shadow="sm" withBorder className={`fullHeight primaryCard ${styles.questionsListPanel}`}>
      <Group position="apart" align="center" mb="md">
        <Title order={4}>{activeCategoryName || 'Unnamed Category'}</Title>
        <div className="flex alignCenter">
          {rearrangeMode ? (
            <Button size="sm" style={{ width: 130 }} color="teal" onClick={handleRearrangeQuestions}>
              Done
            </Button>
          ) : (
            <>
              <Button
                size="xs"
                mr="md"
                variant="white"
                color="dark"
                miw={170}
                onClick={() => setExpandedQuestionIndex(expandedQuestionIndex === 'all' ? null : 'all')}
                leftIcon={<Icon name={expandedQuestionIndex === 'all' ? 'minus' : 'plus'} width={14} />}>
                {expandedQuestionIndex === 'all' ? 'Collapse' : 'Expand'} questions
              </Button>
              <Button size="xs" color="green" onClick={handleRearrangeQuestions}>
                Rearrange Questions
              </Button>
            </>
          )}
        </div>
      </Group>
      {rearrangeMode && (
        <Text mb="md">
          Drag the questions using the drag handle on the right corner of each question to rearrange them. Click the
          "Done" button above, after rearranging them.
        </Text>
      )}
      <ReactSortable
        list={questions.map((item, idx) => ({ ...item, id: idx + 1, name: item.text }))}
        chosenClass={styles.chosenStyle}
        handle=".questionHandle"
        setList={onQuestionSwap}>
        {questions.map((item: any, idx) => (
          <QuestionView
            questionNum={idx + 1}
            question={item}
            key={item.questionId}
            isValidQuestion={isValidQuestion(item)}
            setActiveQuestion={(ev) => {
              ev.stopPropagation();
              setActiveQuestionIndex(idx);
            }}
            deleteQuestion={(ev) => handleDeleteQuestion(ev, idx)}
            isExpanded={expandedQuestionIndex === 'all' || expandedQuestionIndex === idx}
            setExpandedQuestionIndex={setExpandedQuestionIndex}
            rearrangeMode={rearrangeMode}
          />
        ))}
      </ReactSortable>
      {typeof activeQuestionIndex === 'number' && !!questions[activeQuestionIndex] && (
        <Modal
          modalProps={{
            title: isAddingQuestion ? 'Add new question' : 'Edit question',
            body: (
              <QuestionEdit
                questionNum={activeQuestionIndex + 1}
                question={questions[activeQuestionIndex]}
                saveQuestion={(data) => handleSaveQuestion(activeQuestionIndex, data)}
                ref={questionEditRef}
              />
            ),
            okText: 'Save',
            size: 'xl',
            cancelCallback: resetQuestion,
            okCallback: () => questionEditRef.current?.requestSubmit(),
            closeOnOkClick: false,
          }}
        />
      )}
      {!rearrangeMode && (
        <Button mt="xl" onClick={addQuestion} variant="default" leftIcon={<Icon name="plus" width={18} />}>
          Add Question
        </Button>
      )}
    </Card>
  );
}
