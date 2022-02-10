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
}: Props) {
  const [selectedChoice, setSelectedChoice] = useState(preSelectedChoice);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(isPreview);

  useEffect(() => {
    setSelectedChoice(preSelectedChoice);
  }, [preSelectedChoice]);

  function handleSubmit(ev: any) {
    ev.preventDefault();

    submitResponse(selectedChoice);
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Markdown>{text}</Markdown>
      <Divider />
      <div className="flex flexWrap">
        {isWithoutOptions ? (
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
      {isWithoutOptions && !isPreview && !isAnswerRevealed && (
        <Button type="button" color="blue" onClick={() => setIsAnswerRevealed(true)}>
          Reveal answer
        </Button>
      )}
      <Divider />
      {isAttempted && (!isPreview || isQuestionSaved) ? (
        <Button size="large" onClick={() => onClose()} type="button" color="blue">
          Close
        </Button>
      ) : isWithoutOptions ? (
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
        <Button type="submit" size="large" color="green">
          {isPreview ? 'Save' : 'Submit'}
        </Button>
      )}
    </form>
  );
}
