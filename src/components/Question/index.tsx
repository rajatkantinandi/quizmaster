import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import { Option as IOption } from '../../types';
import Markdown from '../Markdown';
import Option from './Option';
import styles from './styles.module.css';

interface Props {
  text: string;
  options: IOption[];
  submitResponse: Function;
  isAttempted: boolean;
  isCorrect: boolean;
  correctOptionHash?: string;
  onClose: Function;
  preSelectedChoice?: string;
  isPreview?: boolean;
  isQuestionSaved?: boolean;
  isWithoutOptions?: boolean;
  pauseTimer?: Function;
}

export default function Question({
  text,
  options,
  submitResponse,
  isAttempted,
  isCorrect,
  correctOptionHash = '',
  onClose,
  preSelectedChoice = '',
  isPreview = false,
  isQuestionSaved = true,
  isWithoutOptions = false,
  pauseTimer,
}: Props) {
  const [selectedChoice, setSelectedChoice] = useState(preSelectedChoice);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(isPreview);

  useEffect(() => {
    // sync selected choice from props with state when changed from the edit component
    setSelectedChoice(preSelectedChoice);
  }, [preSelectedChoice]);

  useEffect(() => {
    if (isAttempted && !isPreview) {
      // reveal answer when question is attempted due to timeout
      setIsAnswerRevealed(true);
    }
  }, [isAttempted, isPreview]);

  function handleSubmit(ev: any) {
    ev.preventDefault();

    // submit response or save question on clicking submit or save button
    submitResponse(selectedChoice);
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Markdown>{text}</Markdown>
      <Divider />
      <div className="flex flexWrap">
        {isWithoutOptions ? (
          // Show correct answer for question without options when answer is revealed
          isAnswerRevealed && (
            <div className={styles.correctAns}>
              <div className={styles.heading}>Correct answer</div>
              <Markdown>{options[0].optionText}</Markdown>
            </div>
          )
        ) : (
          <>
            {options.map((option) => (
              <Option
                id={option.id}
                checked={selectedChoice === option.id}
                onChange={(value: string) => setSelectedChoice(value)}
                optionText={option.optionText}
                key={option.id}
                className={classNames({
                  [styles.isAttempted]: isAttempted,
                  [styles.correct]:
                    (isCorrect && selectedChoice === option.id) || correctOptionHash === btoa(option.optionText),
                  [styles.inCorrect]: selectedChoice === option.id && !isCorrect,
                  [styles.isPreview]: isPreview,
                })}
                disabled={isAttempted}
              />
            ))}
          </>
        )}
      </div>
      {/* show reveal answer button for question without options in non preview mode when playing */}
      {isWithoutOptions && !isPreview && !isAnswerRevealed && (
        <Button
          type="button"
          color="blue"
          onClick={() => {
            setIsAnswerRevealed(true);

            // pause timer when the answer is revealed
            if (pauseTimer) {
              pauseTimer();
            }
          }}>
          Reveal answer
        </Button>
      )}
      <Divider />
      {isAttempted && (!isPreview || isQuestionSaved) ? (
        <Button size="large" onClick={() => onClose()} type="button" color="blue">
          Close
        </Button>
      ) : isWithoutOptions && !isPreview ? (
        // Show correct & incorrect button in non preview mode when playing
        // When answer is revealed show correct or incorrect button for the quiz host, clicking on which will add points accordingly
        isAnswerRevealed && (
          <div className="flex">
            <Button type="button" size="large" className="fullWidth" color="red" onClick={() => submitResponse(null)}>
              Incorrect
            </Button>
            <Button
              type="button"
              size="large"
              className="ml-lg fullWidth"
              color="green"
              onClick={() => submitResponse(options[0].id)}>
              Correct
            </Button>
          </div>
        )
      ) : (
        // for preview mode show save button & while playing show submit button for mcq
        <Button type="submit" size="large" color="green">
          {isPreview ? 'Save' : 'Submit'}
        </Button>
      )}
    </form>
  );
}
