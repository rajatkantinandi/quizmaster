import classNames from 'classnames';
import React, { useState } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import { Option as IOption } from '../../types';
import Option from './Option';
import styles from './styles.module.css';

interface Props {
  text: string;
  options: IOption[];
  submitResponse: Function;
  isAttempted: boolean;
  isCorrect: boolean;
  correctOptionHash: string;
}

export default function Question({ text, options, submitResponse, isAttempted, isCorrect, correctOptionHash }: Props) {
  const [selectedChoice, setSelectedChoice] = useState('');

  function handleSubmit(ev: any) {
    ev.preventDefault();
    submitResponse(selectedChoice);
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.questionText}>{text}</div>
      <Divider />
      <div className="flex flexWrap">
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
            })}
            disabled={isAttempted}
          />
        ))}
      </div>
      <Divider />
      {!isAttempted && (
        <Button type="submit" color="green" className="alignSelfEnd">
          Submit
        </Button>
      )}
    </form>
  );
}
