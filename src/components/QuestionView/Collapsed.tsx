import React from 'react';
import { Question as IQuestion } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '../Icon';
import SanitizedHtml from '../SanitizedHtml';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedQuestionIndex: Function;
  rearrangeMode: boolean;
}

export default function CollapsedView({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  setExpandedQuestionIndex,
  rearrangeMode,
}: Props) {
  const isWithoutOptions = question.options.length === 1;

  return (
    <Card
      className="my-3 cursor-pointer border bg-[var(--secondary-card-bg)] p-5 text-black shadow-sm [transform:scaleY(1.5)] opacity-0 [transform-origin:50%_0%] animate-[slidedown_0.2s_forwards_ease-in]"
      onClick={() => setExpandedQuestionIndex(questionNum - 1)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex">
            {questionNum}.{' '}
            {question.text ? (
              <SanitizedHtml className="ml-2 [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
                {question.text}
              </SanitizedHtml>
            ) : (
              <span className="italic text-sm ml-2">(No question text)</span>
            )}
          </div>
          {!isValidQuestion && <Badge variant="destructive">Incomplete</Badge>}
        </div>
        {rearrangeMode ? (
          <Button variant="ghost" size="icon" className="questionHandle">
            <Icon name="drag" />
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="light" color="teal" size="sm" title="Edit" onClick={setActiveQuestion}>
              Edit
            </Button>
            <Button variant="ghost" size="icon" title="Delete" onClick={deleteQuestion}>
              <Icon name="trash" width={18} color="var(--bg-red-50)" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="caretDown" />
            </Button>
          </div>
        )}
      </div>
      <ul className="ml-10 flex list-disc text-base">
        <li className="mr-6">{question.points} points</li>
        <li>{isWithoutOptions ? 'Without options' : 'With Options'}</li>
      </ul>
    </Card>
  );
}
