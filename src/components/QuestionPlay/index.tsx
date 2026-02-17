import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';
import { useForm } from 'react-hook-form';
import WithoutOptions from './WithoutOptions';
import WithOptions from './WithOptions';
import { useStore } from '../../useStore';
import { getPointsColor } from '../../helpers';

interface Props {
  submitResponse: Function;
  setIsTimerRunning: Function;
  continueGame: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectedOptionIds: number[] | null;
  selectedQuestion: {
    questionId?: string;
    text: string;
    options: IOption[];
    points: number;
    questionNum?: number;
  };
  isAttempted: boolean;
  isTimerRunning: boolean;
  isGameCompleted: boolean;
  negativePointsMultiplier: number;
  minQuestionPoint: number;
  maxQuestionPoint: number;
}

export default function QuestionPlay({
  submitResponse,
  setIsTimerRunning,
  selectedOptionIds,
  selectedQuestion,
  isAttempted,
  isTimerRunning,
  isGameCompleted,
  negativePointsMultiplier,
  continueGame,
  minQuestionPoint,
  maxQuestionPoint,
}: Props) {
  const { showAlert } = useStore();
  const [selectedChoices, setSelectedChoices] = useState(selectedOptionIds);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const { options, text, points } = selectedQuestion;
  const isWithoutOptions = options.length === 1;
  const { handleSubmit } = useForm();

  useEffect(() => {
    if (isAttempted) {
      setIsAnswerRevealed(true);
    }
  }, [isAttempted]);

  useEffect(() => {
    setSelectedChoices(selectedOptionIds);
  }, [selectedOptionIds]);

  return (
    <Card className="my-0 max-h-[calc(90vh-120px)] overflow-auto border border-[var(--qm-card-border)] bg-[var(--secondary-card-bg)] px-6 py-5 shadow-sm">
      <form
        onSubmit={handleSubmit(() => {
          if (selectedChoices) {
            submitResponse(selectedChoices);
          } else {
            showAlert({
              message: 'Please select atleast one option',
              type: 'warning',
            });
          }
        })}
      >
        <div className="mb-2 flex items-center gap-4">
          <h4 className="text-lg font-semibold mr-4">Question {selectedQuestion.questionNum}</h4>
          {negativePointsMultiplier === 0 ? (
            <Badge
              style={{
                backgroundColor: getPointsColor(points, minQuestionPoint, maxQuestionPoint).color,
              }}
            >
              {points} pts
            </Badge>
          ) : (
            <div className="flex gap-4">
              <Badge
                style={{
                  backgroundColor: getPointsColor(points, minQuestionPoint, maxQuestionPoint).color,
                }}
              >
                Correct: {points} points
              </Badge>
              <Badge variant="destructive">Incorrect: {(points * negativePointsMultiplier).toFixed(2)} points</Badge>
            </div>
          )}
          {!isAttempted && isGameCompleted && (
            <Badge variant="secondary" className="bg-orange-500">
              Unanswered
            </Badge>
          )}
        </div>
        <div className="mb-3 mt-2 text-black">
          <SanitizedHtml>{text}</SanitizedHtml>
        </div>
        {isWithoutOptions ? (
          <WithoutOptions
            isAnswerRevealed={isAnswerRevealed || isGameCompleted}
            setIsTimerRunning={setIsTimerRunning}
            options={options}
            setIsAnswerRevealed={setIsAnswerRevealed}
            isAttempted={isAttempted || isGameCompleted}
            submitResponse={submitResponse}
            continueGame={continueGame}
          />
        ) : (
          <WithOptions
            options={options}
            setSelectedChoices={setSelectedChoices}
            selectedOptionIds={selectedOptionIds}
            selectedChoices={selectedChoices}
            isAttempted={isAttempted || isGameCompleted}
            isTimerRunning={isTimerRunning}
          />
        )}
        {isAttempted && !isGameCompleted && (
          <Button className="mt-6" variant="default" onClick={continueGame}>
            Continue
          </Button>
        )}
        <button className="hidden" id="btnSubmitResponse" type="submit">
          Submit
        </button>
      </form>
    </Card>
  );
}
