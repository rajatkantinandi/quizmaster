import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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

  const getQuestionTextStyles = (isCorrect = false) =>
    isCorrect
      ? {
          backgroundColor: '#dcfce7',
          borderRadius: '4px',
        }
      : {};

  return isAnswerRevealed ? (
    <>
      <h6 className="text-base font-semibold mt-6">Correct Answer</h6>
      <div
        className="py-3 mt-3 px-2 mb-4"
        key={options[0].optionId}
        style={getQuestionTextStyles(!!options[0].text && options[0].isCorrect)}
      >
        <SanitizedHtml>{options[0].text}</SanitizedHtml>
      </div>
      {showUndoButton ? (
        <div className="flex gap-2">
          <Button variant="default" onClick={() => handleContinueClick(userResponse.current)}>
            Continue
          </Button>
          {isUndoTimerRunning && <UndoButton time={time} onClick={() => undoSubmit()} />}
        </div>
      ) : (
        <>
          {!isAttempted && (
            <div className="flex gap-2">
              <Button variant="filled" color="red" onClick={() => handleSubmitResponse([])}>
                Incorrect
              </Button>
              <Button variant="filled" color="green" onClick={() => handleSubmitResponse([options[0].optionId])}>
                Correct
              </Button>
            </div>
          )}
        </>
      )}
    </>
  ) : (
    <Button
      variant="filled"
      color="green"
      onClick={() => {
        setIsAnswerRevealed(true);

        if (setIsTimerRunning) {
          setIsTimerRunning(false);
        }
      }}
    >
      Reveal answer
    </Button>
  );
}
