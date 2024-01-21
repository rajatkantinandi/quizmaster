import React, { useState, useRef, useEffect } from 'react';
import { Title, Button, Group, Box } from '@mantine/core';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';
import UndoButton from '../UndoButton';

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
  const [wasUndoClickedOnce, setWasUndoClickedOnce] = useState(false);
  const [showUndoButton, setShowUndoButton] = useState(false);
  const timerRef = useRef(null as any);
  const userResponse = useRef(null as any);

  useEffect(() => {
    if (showUndoButton) {
      timerRef.current = setTimeout(() => {
        if (time === 4) {
          setIsUndoTimerRunning(false);
        } else {
          setTime(time + 1);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [showUndoButton, time]);

  function handleContinueClick(choice: number[]) {
    submitResponse(choice);
    continueGame();
  }

  function handleSubmitResponse(choice: number[]) {
    if (wasUndoClickedOnce) {
      submitResponse(choice);
    } else {
      userResponse.current = choice;
      setShowUndoButton(true);
      setIsUndoTimerRunning(true);
    }
  }

  function undoSubmit() {
    userResponse.current = null;
    clearTimeout(timerRef.current);
    setShowUndoButton(false);
    setWasUndoClickedOnce(true);
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
      {showUndoButton ? (
        <Group>
          <Button variant="default" onClick={() => handleContinueClick(userResponse.current)}>
            Continue
          </Button>
          {isUndoTimerRunning && <UndoButton time={time} onClick={() => undoSubmit()} />}
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
