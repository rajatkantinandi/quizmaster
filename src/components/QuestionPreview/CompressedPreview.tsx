import React from 'react';
import { Question as IQuestion } from '../../types';
import { Title, Badge, ActionIcon, Text, List, Group, Button } from '@mantine/core';
import Icon from '../Icon';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedPreviewQuestionIndex: Function;
}

export default function CompressedPreview({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  setExpandedPreviewQuestionIndex,
}: Props) {
  return (
    <>
      <Group position="apart">
        <Group>
          <Title order={4}>
            {questionNum}.{' '}
            {question.text || (
              <Text italic size="sm" span>
                (No question text)
              </Text>
            )}
          </Title>
          {!isValidQuestion && (
            <Badge variant="filled" color="red">
              Incomplete
            </Badge>
          )}
        </Group>
        <Group>
          <Button variant="light" radius="xl" compact color="rgb(193, 6, 6)" onClick={deleteQuestion}>
            Delete
          </Button>
          <ActionIcon variant="transparent" onClick={setActiveQuestion}>
            <Icon name="pencil" width={14} />
          </ActionIcon>
          <ActionIcon variant="transparent" onClick={() => setExpandedPreviewQuestionIndex(questionNum - 1)}>
            <span className="arrow arrowUp"></span>
          </ActionIcon>
        </Group>
      </Group>
      <List className="flex" ml="lg">
        <List.Item mr="xl">{question.points} points</List.Item>
        <List.Item>{question.options.length === 1 ? 'Without options' : 'With Options'}</List.Item>
      </List>
    </>
  );
}
