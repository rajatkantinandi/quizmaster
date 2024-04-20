import React, { useEffect, useState } from 'react';
import { Title, Card, Group, Box, Button, Badge } from '@mantine/core';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';
import { useForm } from 'react-hook-form';
import WithoutOptions from './WithoutOptions';
import WithOptions from './WithOptions';
import { useStore } from '../../useStore';
import styles from './styles.module.css';
import classNames from 'classnames';
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
      // reveal answer when question is attempted due to timeout
      setIsAnswerRevealed(true);
    }
  }, [isAttempted]);

  useEffect(() => {
    setSelectedChoices(selectedOptionIds);
  }, [selectedOptionIds]);

  return (
    <Card shadow="sm" p="lg" my="sm" withBorder className={classNames('secondaryCard', styles.container)}>
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
        })}>
        <Group>
          <Title mr="xl" order={4}>
            Question {selectedQuestion.questionNum}
          </Title>
          {negativePointsMultiplier === 0 ? (
            <Badge
              styles={{
                root: {
                  backgroundColor: getPointsColor(points, minQuestionPoint, maxQuestionPoint).color,
                },
              }}
              variant="filled">
              {points} pts
            </Badge>
          ) : (
            <Group spacing="xl">
              <Badge
                styles={{
                  root: {
                    backgroundColor: getPointsColor(points, minQuestionPoint, maxQuestionPoint).color,
                  },
                }}
                variant="filled">
                Correct: {points} points
              </Badge>
              <Badge color="red" variant="filled">
                Incorrect: {(points * negativePointsMultiplier).toFixed(2)} points
              </Badge>
            </Group>
          )}
          {!isAttempted && isGameCompleted && (
            <Badge color="orange" variant="filled">
              Unanswered
            </Badge>
          )}
        </Group>
        <Box my="xs">
          <SanitizedHtml>{text}</SanitizedHtml>
        </Box>
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
          <Button mt="xl" variant="default" onClick={continueGame}>
            Continue
          </Button>
        )}
        <button className="displayNone" id="btnSubmitResponse" type="submit">
          Submit
        </button>
      </form>
    </Card>
  );
}
