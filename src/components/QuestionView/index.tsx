import React from 'react';
import { Question as IQuestion } from '../../types';
import { Card } from '@mantine/core';
import ExpandedPreview from './ExpandedPreview';
import CollapsedPreview from './CollapsedPreview';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  isExpanded: boolean;
  isPreview: boolean;
  setExpandedQuestionIndex: Function;
  saveQuestion: Function;
}

export default function QuestionView({
  questionNum,
  question,
  isValidQuestion,
  isPreview,
  setActiveQuestion,
  deleteQuestion,
  isExpanded,
  setExpandedQuestionIndex,
  saveQuestion,
}: Props) {
  return (
    <Card shadow="sm" p="lg" radius="md" my="sm" withBorder className="secondaryCard">
      {isExpanded ? (
        <ExpandedPreview
          questionNum={questionNum}
          question={question}
          isValidQuestion={isValidQuestion}
          setActiveQuestion={setActiveQuestion}
          deleteQuestion={deleteQuestion}
          setExpandedQuestionIndex={setExpandedQuestionIndex}
          saveQuestion={saveQuestion}
          isPreview={isPreview}
        />
      ) : (
        <CollapsedPreview
          questionNum={questionNum}
          question={question}
          isValidQuestion={isValidQuestion}
          setActiveQuestion={setActiveQuestion}
          deleteQuestion={deleteQuestion}
          setExpandedQuestionIndex={setExpandedQuestionIndex}
          isPreview={isPreview}
        />
      )}
    </Card>
  );
}
