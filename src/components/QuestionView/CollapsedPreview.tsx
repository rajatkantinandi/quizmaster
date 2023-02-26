import React from 'react';
import { Question as IQuestion } from '../../types';
import { Badge, ActionIcon, Text, List, Group, Button } from '@mantine/core';
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
    <>
      <Group position="apart">
        <Group>
          <div>
            {questionNum}.{' '}
            {<Markdown>{question.text}</Markdown> || (
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
        <Group>
          {!isPreview && (
            <Button variant="light" radius="xl" compact color="rgb(193, 6, 6)" onClick={deleteQuestion}>
              Delete
            </Button>
          )}
          <ActionIcon variant="transparent" title="Edit" onClick={setActiveQuestion}>
            <Icon name="pencil" width={22} />
          </ActionIcon>
          <ActionIcon variant="transparent" onClick={() => setExpandedQuestionIndex(questionNum - 1)}>
            <Icon name="caretUp" />
          </ActionIcon>
        </Group>
      </Group>
      <List className="flex" ml="lg">
        <List.Item mr="xl">{question.points} points</List.Item>
        <List.Item>{isWithoutOptions ? 'Without options' : 'With Options'}</List.Item>
      </List>
    </>
  );
}
