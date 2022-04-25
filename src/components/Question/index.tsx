import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import { Option as IOption, Question as IQuestion } from '../../types';
import Markdown from '../Markdown';
import Option from './Option';
import styles from './styles.module.css';

interface Props {
  submitResponse: Function;
  onClose: Function;
  isPreview?: boolean;
  isQuestionSaved?: boolean;
  pauseTimer?: Function;
  selectedOptionId: any;
  selectedQuestion: {
    id?: string;
    text: string;
    options: IOption[];
  };
  isWithoutOptions: boolean;
}

export default function Question({
  submitResponse,
  onClose,
  isPreview = false,
  isQuestionSaved = true,
  pauseTimer,
  selectedOptionId,
  selectedQuestion,
  isWithoutOptions,
}: Props) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(isPreview);
  const { options } = selectedQuestion;

  useEffect(() => {
    if (!isPreview) {
      // reveal answer when question is attempted due to timeout
      setIsAnswerRevealed(!!selectedOptionId);
    }
  }, [selectedQuestion.id, selectedOptionId, isPreview]);

  function handleSubmit(ev: any) {
    ev.preventDefault();

    submitResponse(selectedChoice);
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Markdown>{selectedQuestion.text}</Markdown>
      <Divider />
      <div className="flex flexWrap">
        {isWithoutOptions
          ? // Show correct answer for question without options when answer is revealed
            isAnswerRevealed && (
              <div className={styles.correctAns}>
                <div className={styles.heading}>Correct answer</div>
                <Markdown>{options[0].text}</Markdown>
              </div>
            )
          : options.map((option) => (
              <Option
                id={option.optionId}
                checked={selectedChoice === option.optionId}
                onChange={(value: any) => setSelectedChoice(value)}
                optionText={option.text}
                key={option.optionId}
                className={classNames({
                  [styles.isAttempted]: !!selectedOptionId,
                  [styles.correct]: option.isCorrect && selectedOptionId === option.optionId,
                  [styles.inCorrect]: !option.isCorrect && selectedOptionId === option.optionId,
                  [styles.isPreview]: isPreview,
                })}
                disabled={!!selectedOptionId}
              />
            ))}
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
      {!!selectedOptionId && (!isPreview || isQuestionSaved) ? (
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
              onClick={() => submitResponse(options[0].optionId)}>
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
