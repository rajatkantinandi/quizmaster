import React from 'react';
import { Question as IQuestion } from '../../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '../Icon';
import SanitizedHtml from '../SanitizedHtml';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedQuestionIndex: Function;
  handleMoveQuestions: Function;
}

export default function ExpandedView({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  setExpandedQuestionIndex,
  handleMoveQuestions,
}: Props) {
  const isWithoutOptions = question.options.length === 1;

  const getQuestionTextStyles = (isCorrect = false) =>
    isCorrect
      ? {
          backgroundColor: '#dcfce7',
          borderRadius: '4px',
        }
      : {};

  return (
    <Card className="my-3 border bg-[var(--secondary-card-bg)] p-6 text-black shadow-sm [transform:scaleY(0)] opacity-0 [transform-origin:50%_0%] animate-[slidedown_0.2s_forwards_ease-out]">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedQuestionIndex(null)}>
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="text-lg font-semibold">Question {questionNum}</h4>
          <span className="text-sm">{question.points} points</span>
          {!isValidQuestion && <Badge variant="destructive">Incomplete</Badge>}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="filled"
            color="dark"
            size="sm"
            onClick={(ev) => {
              ev.stopPropagation();
              handleMoveQuestions(question.questionId);
            }}>
            Move question
          </Button>
          <Button variant="light" color="teal" size="sm" title="Edit" onClick={setActiveQuestion}>
            Edit
          </Button>
          <Button variant="ghost" size="icon" title="Delete" onClick={deleteQuestion}>
            <Icon name="trash" width={18} color="var(--bg-red-50)" />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="caretUp" />
          </Button>
        </div>
      </div>
      <div className="my-2">
        {question.text ? (
          <SanitizedHtml>{question.text}</SanitizedHtml>
        ) : (
          <span className="italic text-sm">(No question text)</span>
        )}
      </div>
      <h6 className="text-base font-semibold mt-6">{isWithoutOptions ? 'Correct Answer' : 'Options'}</h6>
      <ol className="list-none">
        {question.options.map((option) => (
          <li
            className="mb-4 mt-3 rounded-[10px] border-2 border-[var(--border-light)] px-[10px] py-[5px]"
            key={option.optionId}
            style={getQuestionTextStyles(!!option.text && option.isCorrect)}>
            {option.text ? (
              <SanitizedHtml>{option.text}</SanitizedHtml>
            ) : (
              <span className="italic text-sm">(No option text)</span>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}
