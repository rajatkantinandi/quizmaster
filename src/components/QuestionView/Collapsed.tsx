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
      className="secondaryCard clickable slideUp shadow-sm p-6 my-4 border cursor-pointer"
      onClick={() => setExpandedQuestionIndex(questionNum - 1)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex">
            {questionNum}.{' '}
            {<SanitizedHtml className="truncatedOneLine ml-2">{question.text}</SanitizedHtml> || (
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
          <div className="flex items-center gap-2">
            <Button variant="light" size="sm" className="rounded-full text-red-500" onClick={deleteQuestion}>
              Delete
            </Button>
            <Button variant="ghost" size="icon" title="Edit" onClick={setActiveQuestion}>
              <Icon name="pencil" width={22} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="caretDown" />
            </Button>
          </div>
        )}
      </div>
      <ul className="flex ml-4 list-disc">
        <li className="mr-6">{question.points} points</li>
        <li>{isWithoutOptions ? 'Without options' : 'With Options'}</li>
      </ul>
    </Card>
  );
}
