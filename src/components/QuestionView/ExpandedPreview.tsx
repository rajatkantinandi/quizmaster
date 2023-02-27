import React from 'react';
import { Question as IQuestion } from '../../types';
import { Title, Badge, ActionIcon, Text, List, Group, Button, Box } from '@mantine/core';
import Icon from '../Icon';
import Markdown from '../Markdown';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  isPreview: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedQuestionIndex: Function;
  saveQuestion: Function;
}

export default function ExpandedPreview({
  questionNum,
  question,
  isValidQuestion,
  isPreview,
  setActiveQuestion,
  deleteQuestion,
  setExpandedQuestionIndex,
  saveQuestion,
}: Props) {
  const isWithoutOptions = question.options.length === 1;
  const getQuestionTextStyles = (theme, isCorrect = false) =>
    isCorrect
      ? {
          backgroundColor: isCorrect ? theme.colors.green[2] : '',
          borderRadius: theme.radius.xs,
        }
      : {};

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
          {!isPreview && (
            <Button variant="light" compact radius="xl" color="red" onClick={deleteQuestion}>
              Delete
            </Button>
          )}
          <ActionIcon variant="transparent" title="Edit" onClick={setActiveQuestion}>
            <Icon name="pencil" width={22} />
          </ActionIcon>
          <ActionIcon variant="transparent" onClick={() => setExpandedQuestionIndex(null)}>
            <Icon name="caretDown" />
          </ActionIcon>
        </Group>
      </Group>
      <Box my="xs">
        {question.text ? (
          <Markdown>{question.text}</Markdown>
        ) : (
          <Text italic size="sm" span>
            (No question text)
          </Text>
        )}
      </Box>
      <Title mt="xl" order={6}>
        {isWithoutOptions ? 'Correct Answer' : 'Options'}
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
      {isValidQuestion && isPreview && (
        <Group position="right" mt="xl">
          <Button radius="md" variant="filled" onClick={() => saveQuestion()}>
            Save
          </Button>
        </Group>
      )}
    </>
  );
}
