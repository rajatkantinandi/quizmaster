import React from 'react';
import { Question as IQuestion } from '../../types';
import ExpandedView from './Expanded';
import CollapsedView from './Collapsed';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  isExpanded: boolean;
  setExpandedQuestionId: Function;
}

export default function QuestionView({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  isExpanded,
  setExpandedQuestionId,
}: Props) {
  return (
    <>
      {isExpanded ? (
        <ExpandedView
          questionNum={questionNum}
          question={question}
          isValidQuestion={isValidQuestion}
          setActiveQuestion={setActiveQuestion}
          deleteQuestion={deleteQuestion}
          setExpandedQuestionId={setExpandedQuestionId}
        />
      ) : (
        <CollapsedView
          questionNum={questionNum}
          question={question}
          isValidQuestion={isValidQuestion}
          setActiveQuestion={setActiveQuestion}
          deleteQuestion={deleteQuestion}
          setExpandedQuestionId={setExpandedQuestionId}
        />
      )}
    </>
  );
}
