import classNames from 'classnames';
import React from 'react';
import { Title, Button, Checkbox } from '@mantine/core';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';
import styles from './styles.module.css';

interface Props {
  setSelectedChoice: Function;
  selectedOptionId: number | null | string;
  options: IOption[];
  selectedChoice: number | null | string;
  isAttempted: boolean;
  isTimerRunning: Boolean;
}

export default function WithOptions({
  options,
  setSelectedChoice,
  selectedOptionId,
  selectedChoice,
  isAttempted,
  isTimerRunning,
}: Props) {
  return (
    <>
      <Checkbox.Group
        value={selectedChoice === null ? undefined : [selectedChoice.toString()]}
        orientation="vertical"
        label={<Title order={6}>Options</Title>}
        size="md"
        my="lg"
        onChange={(value: string[]) => setSelectedChoice(value[value.length - 1])}>
        {options.map((option) => (
          <Checkbox
            key={option.optionId}
            label={<SanitizedHtml>{option.text}</SanitizedHtml>}
            className={classNames({
              [styles.isAttempted]: isAttempted,
              [styles.correct]:
                option.isCorrect && selectedOptionId && parseInt(selectedOptionId.toString()) === option.optionId,
              [styles.inCorrect]:
                !option.isCorrect && selectedOptionId && parseInt(selectedOptionId.toString()) === option.optionId,
            })}
            value={option.optionId.toString()}
            disabled={isAttempted || !isTimerRunning}
            radius="xl"
            size="lg"
          />
        ))}
      </Checkbox.Group>
      {!isAttempted && isTimerRunning && (
        <Button radius="md" color="green" onClick={() => document.getElementById('btnSubmitResponse')?.click()}>
          Submit
        </Button>
      )}
    </>
  );
}
