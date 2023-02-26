import React, { useEffect, useState } from 'react';
import { Title, Card, Text, Group, Box, Button } from '@mantine/core';
import { Option as IOption } from '../../types';
import Markdown from '../Markdown';
import { useForm } from 'react-hook-form';
import WithoutOptions from './WithoutOptions';
import WithOptions from './WithOptions';

interface Props {
  submitResponse: Function;
  setIsPlaying: Function;
  continueGame: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectedOptionId: number | null | string;
  selectedQuestion: {
    questionId?: string;
    text: string;
    options: IOption[];
    points: number;
    questionNum?: number;
  };
  isAttempted: boolean;
  isPlaying: boolean;
  winner: string;
}

export default function QuestionPlay({
  submitResponse,
  setIsPlaying,
  selectedOptionId,
  selectedQuestion,
  isAttempted,
  isPlaying,
  winner,
  continueGame,
}: Props) {
  const [selectedChoice, setSelectedChoice] = useState(selectedOptionId);
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
    setSelectedChoice(selectedOptionId);
  }, [selectedOptionId]);

  return (
    <Card shadow="sm" p="lg" radius="md" my="sm" withBorder className="secondaryCard">
      <form onSubmit={handleSubmit(() => submitResponse(selectedChoice === '' ? null : selectedChoice))}>
        <Group>
          <Title mr="xl" order={4}>
            Question {selectedQuestion.questionNum}
          </Title>
          <Text weight="bold" component="span" size="sm">
            Points: {points}
          </Text>
        </Group>
        <Box my="xs">
          <Markdown>{text}</Markdown>
        </Box>
        {isWithoutOptions ? (
          <WithoutOptions
            isAnswerRevealed={isAnswerRevealed}
            setIsPlaying={setIsPlaying}
            options={options}
            setIsAnswerRevealed={setIsAnswerRevealed}
            setSelectedChoice={setSelectedChoice}
            isAttempted={isAttempted}
          />
        ) : (
          <WithOptions
            options={options}
            setSelectedChoice={setSelectedChoice}
            selectedOptionId={selectedOptionId}
            selectedChoice={selectedChoice}
            isAttempted={isAttempted}
            isPlaying={isPlaying}
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
