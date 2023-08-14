import React from 'react';
import { Question as IQuestion } from '../../types';
import { Badge, ActionIcon, Text, List, Group, Button, Card } from '@mantine/core';
import Icon from '../Icon';
import SanitizedHtml from '../SanitizedHtml';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedQuestionIndex: Function;
}

export default function CollapsedView({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  setExpandedQuestionIndex,
}: Props) {
  const isWithoutOptions = question.options.length === 1;

  return (
    <Card
      shadow="sm"
      p="lg"
      my="sm"
      withBorder
      className="secondaryCard clickable slideUp"
      onClick={() => setExpandedQuestionIndex(questionNum - 1)}>
      <Group position="apart" noWrap>
        <Group>
          <div className="flex">
            {questionNum}.{' '}
            {<SanitizedHtml className="truncatedOneLine ml-md">{question.text}</SanitizedHtml> || (
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
          <Button variant="light" compact color="red" onClick={deleteQuestion}>
            Delete
          </Button>
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
