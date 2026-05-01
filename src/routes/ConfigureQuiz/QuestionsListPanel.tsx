import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '../../components/Icon';
import QuestionView from '../../components/QuestionView';
import { Control, useFieldArray } from 'react-hook-form';
import { useStore } from '../../useStore';
import { Category, Question } from '../../types';
import { ReactSortable } from 'react-sortablejs';
import type { ConfigureQuizFormValues } from './index';

type Props = {
  activeCategory?: Category;
  activeCategoryIndex: number;
  control: Control<ConfigureQuizFormValues>;
  expandedQuestionIndex: number | null | 'all';
  activeQuestionIndex: number | null;
  setActiveQuestionIndex: (idx: number | null) => void;
  isValidQuestion: (question: Question) => boolean;
  setExpandedQuestionIndex: (idx: number | null | 'all') => void;
  handleRearrangeQuestions: () => void;
  rearrangeMode: boolean;
  handleMoveQuestions: Function;
  onAddQuestion: () => void;
  onEditQuestion: (idx: number) => void;
};

export default function QuestionsListPanel({
  activeCategory,
  activeCategoryIndex,
  control,
  expandedQuestionIndex,
  activeQuestionIndex,
  setActiveQuestionIndex,
  isValidQuestion,
  setExpandedQuestionIndex,
  handleRearrangeQuestions,
  rearrangeMode,
  handleMoveQuestions,
  onAddQuestion,
  onEditQuestion,
}: Props) {
  const { remove, replace } = useFieldArray({
    control,
    name: `categories.${activeCategoryIndex}.questions` as const,
  });
  const { showAlert, showModal } = useStore();
  const questions = activeCategory?.questions || [];
  const activeCategoryName = activeCategory?.categoryName || '';

  const addQuestion = () => {
    if (!activeCategoryName) {
      showAlert({
        message: 'Please enter a category name before adding a new question!',
        type: 'warning',
      });
      return;
    }

    onAddQuestion();
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
    <Card className="h-[calc(100vh-180px)] w-full max-w-[1300px] flex-1 overflow-x-hidden overflow-y-scroll bg-[var(--primary-card-bg)] px-6 py-5 text-black">
      <div className="mb-md flex items-center justify-between">
        <h4 className="text-lg font-semibold">{activeCategoryName || 'Unnamed Category'}</h4>
        <div className="flex items-center">
          {rearrangeMode ? (
            <Button
              size="sm"
              className="h-9 w-[150px] rounded-[10px] bg-teal-600 px-4 text-sm hover:bg-teal-700"
              onClick={handleRearrangeQuestions}>
              Done
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                className="mr-md h-9 min-w-[180px] rounded-[10px] border border-gray-300 bg-white px-4 text-sm text-gray-800 hover:bg-gray-100"
                onClick={() => setExpandedQuestionIndex(expandedQuestionIndex === 'all' ? null : 'all')}
                leftIcon={<Icon name={expandedQuestionIndex === 'all' ? 'minus' : 'plus'} width={14} />}>
                {expandedQuestionIndex === 'all' ? 'Collapse' : 'Expand'} questions
              </Button>
              <Button
                size="sm"
                className="h-9 rounded-[10px] bg-green-600 px-5 text-sm hover:bg-green-700"
                onClick={handleRearrangeQuestions}>
                Rearrange Questions
              </Button>
            </>
          )}
        </div>
      </div>
      {rearrangeMode && (
        <p className="mb-md">
          Drag the questions using the drag handle on the right corner of each question to rearrange them. Click the
          "Done" button above, after rearranging them.
        </p>
      )}
      {/* @ts-expect-error - react-sortablejs types are incompatible with React 18/19 */}
      <ReactSortable
        list={questions.map((item, idx) => ({ ...item, id: idx + 1, name: item.text }))}
        chosenClass="bg-[var(--dragging-question-bg)]"
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
              onEditQuestion(idx);
            }}
            deleteQuestion={(ev) => handleDeleteQuestion(ev, idx)}
            isExpanded={expandedQuestionIndex === 'all' || expandedQuestionIndex === idx}
            setExpandedQuestionIndex={setExpandedQuestionIndex}
            rearrangeMode={rearrangeMode}
            handleMoveQuestions={handleMoveQuestions}
          />
        ))}
      </ReactSortable>
      {!rearrangeMode && (
        <Button className="mt-xl" onClick={addQuestion} variant="default" leftIcon={<Icon name="plus" width={18} />}>
          Add Question
        </Button>
      )}
    </Card>
  );
}
