import React from 'react';
import { Question as IQuestion } from '../../types';
import { Title, Badge, ActionIcon, Text, List, Group, Button, Box } from '@mantine/core';
import Icon from '../Icon';
import Markdown from '../Markdown';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedPreviewQuestionIndex: Function;
  saveQuestion: Function;
}

export default function ExpandedPreview({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  setExpandedPreviewQuestionIndex,
  saveQuestion,
}: Props) {
  const getQuestionTextStyles = (theme, isCorrect = false) => ({
    backgroundColor: isCorrect ? theme.colors.green[2] : '#AFD0D4',
    borderRadius: theme.radius.xs,
  });

  return (
    <>
      <Group position="apart" mb="lg">
        <Group>
          <Title order={4}>Question {questionNum}</Title>
          <Text ml="md" mr="xl">
            {question.points} points
          </Text>
          {!isValidQuestion && (
            <Badge variant="filled" color="red">
              Incomplete
            </Badge>
          )}
        </Group>
        <Group>
          <Button variant="light" compact radius="xl" color="rgb(193, 6, 6)" onClick={deleteQuestion}>
            Delete
          </Button>
          <ActionIcon variant="transparent" onClick={setActiveQuestion}>
            <Icon name="pencil" width={22} />
          </ActionIcon>
          <ActionIcon variant="transparent" onClick={() => setExpandedPreviewQuestionIndex(null)}>
            <Icon name="caretDown" />
          </ActionIcon>
        </Group>
      </Group>
      <Box my="xs" sx={getQuestionTextStyles}>
        {question.text ? (
          <Markdown>{question.text}</Markdown>
        ) : (
          <Text italic size="sm" span>
            (No question text)
          </Text>
        )}
      </Box>
      <Title mt="xl" order={6}>
        {question.options.length === 1 ? 'Correct Answer' : 'Options'}
      </Title>
      <List type="ordered">
        {question.options.map((option) => (
          <Box
            className="py-md mt-md"
            component={List.Item}
            px="xs"
            mb="md"
            key={option.optionId}
            sx={(theme) => getQuestionTextStyles(theme, !!option.text && option.isCorrect)}>
            {option.text ? (
              <Markdown>{option.text}</Markdown>
            ) : (
              <Text italic size="sm" span>
                (No option text)
              </Text>
            )}
          </Box>
        ))}
      </List>
      {isValidQuestion && (
        <Group position="right" mt="xl">
          <Button radius="md" variant="filled" onClick={() => saveQuestion()}>
            Save
          </Button>
        </Group>
      )}
    </>
  );
}
