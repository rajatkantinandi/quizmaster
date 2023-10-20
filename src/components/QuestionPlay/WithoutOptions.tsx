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
  isAttempted: boolean;
  submitResponse: Function;
  continueGame: Function;
}

export default function WithoutOptions({
  isAnswerRevealed,
  setIsTimerRunning,
  options,
  isAttempted,
  setIsAnswerRevealed,
  submitResponse,
  continueGame,
}: Props) {
  const [isUndoTimerRunning, setIsUndoTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isUndoClicked, setIsUndoClicked] = useState(false);
  const timerRef = useRef(null as any);
  const userResponse = useRef(null as any);

  useEffect(() => {
    if (isUndoTimerRunning) {
      timerRef.current = setTimeout(() => {
        if (time === 4) {
          handleContinueClick(userResponse.current);
        }

        setTime(time + 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [isUndoTimerRunning, time]);

  function handleContinueClick(choice: number[]) {
    submitResponse(choice);
    continueGame();
  }

  function handleSubmitResponse(choice: number[]) {
    if (isUndoClicked) {
      submitResponse(choice);
    } else {
      userResponse.current = choice;
      setIsUndoTimerRunning(true);
    }
  }

  function undoSubmit() {
    userResponse.current = null;
    clearTimeout(timerRef.current);
    setIsUndoTimerRunning(false);
    setIsUndoClicked(true);
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
          <Button variant="default" onClick={() => handleContinueClick(userResponse.current)}>
            Continue
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
