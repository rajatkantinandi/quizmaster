import React, { useState, useRef, useEffect } from 'react';
import { Title, Button, Group, Box } from '@mantine/core';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';
import UndoTimer from './undoTimer';

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
  const [userResponse, setUserResponse] = useState({
    isConfirmed: false,
    value: null as any,
  });
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null as any);

  useEffect(() => {
    if (timer > 0) {
      if (timer === 5) {
        clearTimeout(timerRef.current);
        handleSelectedChoice(userResponse.value);
        setUserResponse({
          isConfirmed: false,
          value: null,
        });
      } else {
        timerRef.current = setTimeout(() => {
          setTimer(timer + 1);
        }, 1000);
      }
    }
  }, [timer]);

  function handleSelectedChoice(choice: number[]) {
    setSelectedChoices(choice);

    setTimeout(() => {
      document.getElementById('btnSubmitResponse')?.click();
    }, 100);
  }

  function handleSubmitResponse(choice: number[]) {
    setUserResponse({
      isConfirmed: true,
      value: choice,
    });
    setTimer(timer + 1);
  }

  function undoSubmit() {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    setTimer(0);
    setUserResponse({
      isConfirmed: false,
      value: null,
    });
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
      {userResponse.isConfirmed ? (
        <Group>
          <Button variant="outline" onClick={() => handleSelectedChoice(userResponse.value)}>
            Confirm Submit
          </Button>
          <Button onClick={() => undoSubmit()} leftIcon={<UndoTimer>{5 - timer}</UndoTimer>}>
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
