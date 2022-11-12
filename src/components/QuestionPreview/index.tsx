import React from 'react';
import { Question as IQuestion } from '../../types';
import { Card } from '@mantine/core';
import ExpandedPreview from './ExpandedPreview';
import CompressedPreview from './CompressedPreview';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  expandedPreviewQuestionIndex: boolean;
  setExpandedPreviewQuestionIndex: Function;
}

export default function QuestionPreview({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  expandedPreviewQuestionIndex,
  setExpandedPreviewQuestionIndex,
}: Props) {
  return (
    <Card shadow="sm" p="lg" radius="md" my="sm" withBorder className="secondaryCard">
      {expandedPreviewQuestionIndex ? (
        <ExpandedPreview
          questionNum={questionNum}
          question={question}
          isValidQuestion={isValidQuestion}
          setActiveQuestion={setActiveQuestion}
          deleteQuestion={deleteQuestion}
          setExpandedPreviewQuestionIndex={setExpandedPreviewQuestionIndex}
        />
      ) : (
        <CompressedPreview
          questionNum={questionNum}
          question={question}
          isValidQuestion={isValidQuestion}
          setActiveQuestion={setActiveQuestion}
          deleteQuestion={deleteQuestion}
          setExpandedPreviewQuestionIndex={setExpandedPreviewQuestionIndex}
        />
      )}
    </Card>
  );
}
