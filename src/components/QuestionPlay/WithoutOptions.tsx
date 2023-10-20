import React, { useState, useRef, useEffect } from 'react';
import { Title, Button, Group, Box } from '@mantine/core';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';
import UndoButtonIcon from './UndoButtonIcon';

interface Props {
  isAnswerRevealed: boolean;
  setIsTimerRunning: Function;
  options: IOption[];
  setIsAnswerRevealed: Function;
  setSelectedChoices: Function;
  isAttempted: boolean;
}

export default function WithoutOptions({
  isAnswerRevealed,
  setIsTimerRunning,
  options,
  isAttempted,
  setIsAnswerRevealed,
  setSelectedChoices,
}: Props) {
  const [isUndoTimerRunning, setIsUndoTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null as any);
  const userResponse = useRef(null as any);

  useEffect(() => {
    if (isUndoTimerRunning) {
      timerRef.current = setTimeout(() => {
        if (time === 4) {
          clearTimeout(timerRef.current);
          setIsUndoTimerRunning(false);
          handleSelectedChoice(userResponse.current);
        }

        setTime(time + 1);
      }, 1000);
    }
  }, [isUndoTimerRunning, time]);

  function handleSelectedChoice(choice: number[]) {
    setSelectedChoices(choice);

    setTimeout(() => {
      document.getElementById('btnSubmitResponse')?.click();
    }, 100);
  }

  function handleSubmitResponse(choice: number[]) {
    userResponse.current = choice;
    setIsUndoTimerRunning(true);
  }

  function undoSubmit() {
    userResponse.current = null;
    setIsUndoTimerRunning(false);
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
        <SanitizedHtml>{options[0].text}</SanitizedHtml>
      </Box>
      {isUndoTimerRunning ? (
        <Group>
          <Button variant="outline" onClick={() => handleSelectedChoice(userResponse.current)}>
            Confirm Submit
          </Button>
          <Button onClick={() => undoSubmit()} leftIcon={<UndoButtonIcon>{5 - time}</UndoButtonIcon>}>
            Undo
          </Button>
        </Group>
      ) : (
        <>
          {!isAttempted && (
            <Group>
              <Button color="red" onClick={() => handleSubmitResponse([])}>
                Incorrect
              </Button>
              <Button color="green" onClick={() => handleSubmitResponse([options[0].optionId])}>
                Correct
              </Button>
            </Group>
          )}
        </>
      )}
    </>
  ) : (
    <Button
      color="green"
      onClick={() => {
        setIsAnswerRevealed(true);

        // pause timer when the answer is revealed
        if (setIsTimerRunning) {
          setIsTimerRunning(false);
        }
      }}>
      Reveal answer
    </Button>
  );
}
