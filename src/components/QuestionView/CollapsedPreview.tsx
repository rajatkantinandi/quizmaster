import React from 'react';
import { Question as IQuestion } from '../../types';
import { Badge, ActionIcon, Text, List, Group, Button, Card } from '@mantine/core';
import Icon from '../Icon';
import HTML from '../HTML';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  isPreview: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedQuestionIndex: Function;
}

export default function CollapsedPreview({
  questionNum,
  question,
  isValidQuestion,
  isPreview,
  setActiveQuestion,
  deleteQuestion,
  setExpandedQuestionIndex,
}: Props) {
  const isWithoutOptions = question.options.length === 1;

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      my="sm"
      withBorder
      className="secondaryCard clickable slideUp"
      onClick={() => setExpandedQuestionIndex(questionNum - 1)}>
      <Group position="apart" noWrap>
        <Group>
          <div className="flex">
            {questionNum}.{' '}
            {<HTML className="truncatedOneLine ml-md">{question.text}</HTML> || (
              <Text italic size="sm" span>
                (No question text)
              </Text>
            )}
          </div>
          {!isValidQuestion && (
            <Badge variant="filled" color="red">
              Incomplete
            </Badge>
          )}
        </Group>
        <Group className="noShrink">
          {!isPreview && (
            <Button variant="light" radius="xl" compact color="red" onClick={deleteQuestion}>
              Delete
            </Button>
          )}
          <ActionIcon variant="transparent" title="Edit" onClick={setActiveQuestion}>
            <Icon name="pencil" width={22} />
          </ActionIcon>
          <ActionIcon variant="transparent">
            <Icon name="caretDown" />
          </ActionIcon>
        </Group>
      </Group>
      <List className="flex" ml="lg">
        <List.Item mr="xl">{question.points} points</List.Item>
        <List.Item>{isWithoutOptions ? 'Without options' : 'With Options'}</List.Item>
      </List>
    </Card>
  );
}
