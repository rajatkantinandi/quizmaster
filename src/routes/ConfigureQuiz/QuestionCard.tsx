import React, { useEffect } from 'react';
import styles from './styles.module.css';
import { Title, Card, Button } from '@mantine/core';
import Icon from '../../components/Icon';
import QuestionEdit from '../../components/QuestionEdit';
import QuestionView from '../../components/QuestionView';
import { useFieldArray } from 'react-hook-form';
import { getEmptyQuestion } from '../../helpers';
import { useStore } from '../../useStore';
import { Quiz } from '../../types';

export default function QuestionCard({
  activeCategoryName,
  questions,
  activeCategoryIndex,
  control,
  previewQuestionIndex,
  expandedQuestionIndex,
  activeQuestionIndex,
  activeCategoryId,
  setActiveQuestionIndex,
  isValidQuestion,
  setPreviewQuestionIndex,
  setExpandedQuestionIndex,
  quizId,
}) {
  const { fields, append, remove, replace, update } = useFieldArray({
    control,
    name: `categories[${activeCategoryIndex}].questions`,
  });
  const { getQuiz, showAlert, showModal } = useStore();
  const addQuestion = () => {
    const question = getEmptyQuestion(activeCategoryId);
    append(question);
    setActiveQuestionIndex(fields.length);
  };

  useEffect(() => {
    replace(questions);
  }, [activeCategoryIndex]);

  function handleDeleteQuestion(index: number) {
    const question = fields[index];

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
      setPreviewQuestionIndex(null);
    }
  }

  const resetQuestion = (index) => {
    getQuiz(parseInt(`${quizId}`)).then((quiz: Quiz) => {
      updateQuestionData(index, quiz.categories[activeCategoryIndex].questions[index]);
      setActiveQuestionIndex(null);
      setPreviewQuestionIndex(null);
    });
  };

  function updateQuestionData(index, data) {
    update(index, data);
  }

  function handleSaveQuestion() {
    setActiveQuestionIndex(null);
    setExpandedQuestionIndex(null);
    setPreviewQuestionIndex(null);

    showAlert({
      message: 'Question has been saved successfully.',
      type: 'success',
    });
  }

  return (
    <Card shadow="sm" withBorder className={`fullHeight primaryCard ${styles.questionsCard}`}>
      <Title order={5} mb="xl">
        {activeCategoryName || 'Unnamed Category'}
      </Title>
      {fields.map((item: any, idx) =>
        activeQuestionIndex === idx ? (
          <QuestionEdit
            questionNum={idx + 1}
            question={item}
            key={item.questionId}
            saveQuestion={handleSaveQuestion}
            onQuestionChange={(data) => updateQuestionData(idx, data)}
            deleteQuestion={() => handleDeleteQuestion(idx)}
            resetQuestion={() => resetQuestion(idx)}
            showPreview={() => {
              setActiveQuestionIndex(null);
              setExpandedQuestionIndex(idx);
              setPreviewQuestionIndex(idx);
            }}
          />
        ) : (
          <QuestionView
            questionNum={idx + 1}
            question={item}
            key={item.questionId}
            saveQuestion={handleSaveQuestion}
            isValidQuestion={isValidQuestion(item)}
            setActiveQuestion={(ev) => setActiveQuestionIndex(idx)}
            deleteQuestion={() => handleDeleteQuestion(idx)}
            isExpanded={expandedQuestionIndex === idx}
            isPreview={previewQuestionIndex === idx}
            setExpandedQuestionIndex={setExpandedQuestionIndex}
          />
        ),
      )}
      <Button mt="xl" onClick={addQuestion} radius="md" variant="default" leftIcon={<Icon name="plus" width={18} />}>
        Add Question
      </Button>
    </Card>
  );
}