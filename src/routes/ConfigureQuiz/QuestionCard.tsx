import React, { useState } from 'react';
import styles from './styles.module.css';
import { Title, Card, Button, Group } from '@mantine/core';
import Icon from '../../components/Icon';
import QuestionEdit from '../../components/QuestionEdit';
import QuestionView from '../../components/QuestionView';
import { useFieldArray } from 'react-hook-form';
import { getEmptyQuestion } from '../../helpers';
import { useStore } from '../../useStore';
import { Quiz } from '../../types';
import { ReactSortable } from 'react-sortablejs';

export default function QuestionCard({
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
}) {
  const { append, remove, update, replace } = useFieldArray({
    control,
    name: `categories[${activeCategoryIndex}].questions`,
  });
  const { getQuiz, showAlert, showModal } = useStore();

  const addQuestion = () => {
    if (!activeCategoryName) {
      showAlert({
        message: 'Please enter a category name before adding a new question!',
        type: 'warning',
      });
      return;
    }

    const question = getEmptyQuestion(activeCategoryId);
    append(question);
    setActiveQuestionIndex(questions.length);
    setExpandedQuestionIndex(null);
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
      getQuiz(quizId).then((quiz: Quiz) => {
        const originalQuestion = (quiz.categories[activeCategoryIndex]?.questions || [])[activeQuestionIndex];

        if (originalQuestion) {
          updateQuestionData(activeQuestionIndex, originalQuestion);
        } else {
          remove(activeQuestionIndex);
        }

        setActiveQuestionIndex(null);
      });
    }
  };

  function updateQuestionData(index, data) {
    update(index, data);
  }

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
        data.map((x) => {
          delete x.id;
          return x;
        }),
      );
    }
  }

  return (
    <Card shadow="sm" withBorder className={`fullHeight primaryCard ${styles.questionsCard}`}>
      <Group position="apart">
        <Title order={5} mb="xl">
          {activeCategoryName || 'Unnamed Category'}
        </Title>
        {rearrangeMode ? (
          <Button size="xs" color="teal" onClick={handleRearrangeQuestions}>
            Complete Rearranging
          </Button>
        ) : (
          <Button size="xs" color="teal" onClick={handleRearrangeQuestions}>
            Rearrange Questions
          </Button>
        )}
      </Group>
      <ReactSortable
        list={questions.map((item, idx) => ({ ...item, id: idx + 1, name: item.text }))}
        chosenClass={styles.chosenStyle}
        handle=".questionHandle"
        setList={onQuestionSwap}>
        {questions.map((item: any, idx) =>
          activeQuestionIndex === idx ? (
            <QuestionEdit
              questionNum={idx + 1}
              question={item}
              key={item.questionId}
              saveQuestion={(data) => handleSaveQuestion(idx, data)}
              onQuestionChange={(data) => updateQuestionData(idx, data)}
              deleteQuestion={(ev) => handleDeleteQuestion(ev, idx)}
              resetQuestion={resetQuestion}
            />
          ) : (
            <QuestionView
              questionNum={idx + 1}
              question={item}
              key={item.questionId}
              isValidQuestion={isValidQuestion(item)}
              setActiveQuestion={(ev) => setActiveQuestionIndex(idx)}
              deleteQuestion={(ev) => handleDeleteQuestion(ev, idx)}
              isExpanded={expandedQuestionIndex === item.questionId}
              setExpandedQuestionIndex={setExpandedQuestionIndex}
              rearrangeMode={rearrangeMode}
            />
          ),
        )}
      </ReactSortable>
      {!rearrangeMode && (
        <Button mt="xl" onClick={addQuestion} variant="default" leftIcon={<Icon name="plus" width={18} />}>
          Add Question
        </Button>
      )}
    </Card>
  );
}
