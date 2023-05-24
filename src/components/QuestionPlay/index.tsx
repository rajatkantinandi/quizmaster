import React, { useEffect, useState } from 'react';
import { Title, Card, Text, Group, Box, Button, Badge } from '@mantine/core';
import { Option as IOption } from '../../types';
import Markdown from '../Markdown';
import { useForm } from 'react-hook-form';
import WithoutOptions from './WithoutOptions';
import WithOptions from './WithOptions';

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
  winner: string;
  negativePointsForIncorrect: number;
}

export default function QuestionPlay({
  submitResponse,
  setIsTimerRunning,
  selectedOptionIds,
  selectedQuestion,
  isAttempted,
  isTimerRunning,
  winner,
  negativePointsForIncorrect,
  continueGame,
}: Props) {
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
    <Card shadow="sm" p="lg" radius="md" my="sm" withBorder className="secondaryCard">
      <form onSubmit={handleSubmit(() => submitResponse(selectedChoices))}>
        <Group>
          <Title mr="xl" order={4}>
            Question {selectedQuestion.questionNum}
          </Title>
          {negativePointsForIncorrect === 0 ? (
            <Text weight="bold" component="span" size="sm">
              Points: {points}
            </Text>
          ) : (
            <Group spacing="xl">
              <Badge color="green" variant="filled">
                Correct: {points} points
              </Badge>
              <Badge color="red" variant="filled">
                Incorrect: {negativePointsForIncorrect} points
              </Badge>
            </Group>
          )}
        </Group>
        <Box my="xs">
          <Markdown>{text}</Markdown>
        </Box>
        {isWithoutOptions ? (
          <WithoutOptions
            isAnswerRevealed={isAnswerRevealed}
            setIsTimerRunning={setIsTimerRunning}
            options={options}
            setIsAnswerRevealed={setIsAnswerRevealed}
            setSelectedChoices={setSelectedChoices}
            isAttempted={isAttempted}
          />
        ) : (
          <WithOptions
            options={options}
            setSelectedChoices={setSelectedChoices}
            selectedOptionIds={selectedOptionIds}
            selectedChoices={selectedChoices}
            isAttempted={isAttempted}
            isTimerRunning={isTimerRunning}
          />
        )}
        {isAttempted && !winner && (
          <Button mt="xl" variant="default" radius="md" onClick={continueGame}>
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
