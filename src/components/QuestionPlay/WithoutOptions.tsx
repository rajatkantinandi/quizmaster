import React from 'react';
import { Title, Button, Group, Box } from '@mantine/core';
import { Option as IOption } from '../../types';
import Markdown from '../Markdown';

interface Props {
  isAnswerRevealed: boolean;
  setIsPlaying: Function;
  options: IOption[];
  setIsAnswerRevealed: Function;
  setSelectedChoice: Function;
  isAttempted: boolean;
}

export default function WithoutOptions({
  isAnswerRevealed,
  setIsPlaying,
  options,
  isAttempted,
  setIsAnswerRevealed,
  setSelectedChoice,
}: Props) {
  function handleSelectedChoice(choice) {
    setSelectedChoice(choice);

    setTimeout(() => {
      document.getElementById('btnSubmitResponse')?.click();
    }, 100);
  }

  const getQuestionTextStyles = (theme, isCorrect = false) =>
    isCorrect
      ? {
          backgroundColor: theme.colors.green[2],
          borderRadius: theme.radius.xs,
        }
      : {};
  return isAnswerRevealed ? (
    <>
      <Title mt="xl" order={6}>
        Correct Answer
      </Title>
      <Box
        className="py-md mt-md"
        px="xs"
        mb="md"
        key={options[0].optionId}
        sx={(theme) => getQuestionTextStyles(theme, !!options[0].text && options[0].isCorrect)}>
        <Markdown>{options[0].text}</Markdown>
      </Box>
      {!isAttempted && (
        <Group>
          <Button radius="md" color="red" onClick={() => handleSelectedChoice('')}>
            Incorrect
          </Button>
          <Button radius="md" color="green" onClick={() => handleSelectedChoice(options[0].optionId)}>
            Correct
          </Button>
        </Group>
      )}
    </>
  ) : (
    <Button
      color="green"
      radius="md"
      onClick={() => {
        setIsAnswerRevealed(true);

        // pause timer when the answer is revealed
        if (setIsPlaying) {
          setIsPlaying(false);
        }
      }}>
      Reveal answer
    </Button>
  );
}
