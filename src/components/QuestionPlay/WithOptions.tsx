import React from 'react';
import { Title, Button, Checkbox, Group, createStyles } from '@mantine/core';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';

interface Props {
  setSelectedChoices: Function;
  selectedOptionIds: number[] | null;
  options: IOption[];
  selectedChoices: number[] | null;
  isAttempted: boolean;
  isTimerRunning: Boolean;
}

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: 'rgb(255, 198, 198)',
    borderColor: theme.colors.red,
  },
}));

export default function WithOptions({
  options,
  setSelectedChoices,
  selectedOptionIds,
  selectedChoices,
  isAttempted,
  isTimerRunning,
}: Props) {
  const { classes } = useStyles();

  function getCheckboxColor(option) {
    if (selectedOptionIds && option.isCorrect && selectedOptionIds.includes(option.optionId)) {
      return 'green';
    } else if (
      selectedOptionIds &&
      ((!option.isCorrect && selectedOptionIds.includes(option.optionId)) ||
        (option.isCorrect && !selectedOptionIds.includes(option.optionId)))
    ) {
      return 'red';
    } else {
      return '';
    }
  }

  return (
    <>
      <Group align="flex-start">
        {isAttempted && (
          <Checkbox.Group
            value={options.filter((x) => x.isCorrect).map((x) => x.optionId.toString())}
            orientation="vertical"
            label={<Title order={6}>ANSWER</Title>}
            size="md"
            my="lg">
            {options.map((x, idx) =>
              x.isCorrect ? (
                <Checkbox
                  value={x.optionId.toString()}
                  key={x.optionId}
                  checked
                  color="green"
                  className="justifyCenter"
                  style={{ pointerEvents: 'none' }}
                  radius="xl"
                  tabIndex={-1}
                  size="lg"
                />
              ) : (
                <div style={{ width: '24px', height: '24px' }} key={`empty_${idx}`}></div>
              ),
            )}
          </Checkbox.Group>
        )}
        <Checkbox.Group
          value={selectedChoices ? selectedChoices.map((x) => x.toString()) : undefined}
          orientation="vertical"
          label={<Title order={6}>{isAttempted ? 'ME' : 'OPTIONS'}</Title>}
          size="md"
          my="lg"
          onChange={(value) => setSelectedChoices(value.map((x) => parseInt(x)))}>
          {options.map((option) => (
            <Checkbox
              label={<SanitizedHtml>{option.text}</SanitizedHtml>}
              color={getCheckboxColor(option)}
              value={option.optionId.toString()}
              classNames={{
                input:
                  selectedOptionIds && option.isCorrect && !selectedOptionIds.includes(option.optionId)
                    ? classes.input
                    : '',
              }}
              tabIndex={isAttempted || !isTimerRunning ? -1 : undefined}
              style={isAttempted || !isTimerRunning ? { pointerEvents: 'none' } : {}}
              radius="xl"
              size="lg"
              key={option.optionId}
            />
          ))}
        </Checkbox.Group>
      </Group>
      {!isAttempted && isTimerRunning && (
        <Button color="green" onClick={() => document.getElementById('btnSubmitResponse')?.click()}>
          Submit
        </Button>
      )}
    </>
  );
}
