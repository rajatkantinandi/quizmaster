import React from 'react';
import { Dialog, Text, Button, Group } from '@mantine/core';
import { plural } from '../../helpers/textHelpers';
import { QuizzesSelectorState } from '../../stores/appStore';

function QuizSelectorBanner({ show, message, selectedQuizzes, onNextClick, onCancelClick }: QuizzesSelectorState) {
  return (
    <Dialog
      opened={show}
      size="lg"
      shadow="xl"
      styles={() => ({
        root: {
          backgroundColor: 'var(--qm-primary)',
          color: 'white',
          width: '600px',
        },
      })}
      position={{
        top: 70,
        left: 'calc(50% - 300px)',
      }}>
      <Group position="apart">
        <Text size="lg">
          {message}
          {selectedQuizzes.length > 0 ? (
            <Text ml="md" component="span" size="xs" weight="bold">
              {plural(selectedQuizzes.length, ' (%count quiz selected)', ' (%count quizzes selected)')}
            </Text>
          ) : (
            ''
          )}
        </Text>
        <Group position="left">
          {!!onNextClick && (
            <Button
              variant="light"
              size="sm"
              disabled={selectedQuizzes.length === 0}
              onClick={() => onNextClick(selectedQuizzes)}>
              Next
            </Button>
          )}
          {!!onCancelClick && (
            <Button variant="light" size="sm" onClick={() => onCancelClick()}>
              Cancel
            </Button>
          )}
        </Group>
      </Group>
    </Dialog>
  );
}

export default QuizSelectorBanner;
