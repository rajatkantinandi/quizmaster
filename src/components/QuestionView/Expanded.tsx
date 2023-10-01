import React from 'react';
import { Question as IQuestion } from '../../types';
import { Title, Badge, ActionIcon, Text, List, Group, Button, Box, Card } from '@mantine/core';
import Icon from '../Icon';
import SanitizedHtml from '../SanitizedHtml';

interface Props {
  questionNum: number;
  question: IQuestion;
  isValidQuestion: boolean;
  setActiveQuestion: any;
  deleteQuestion: any;
  setExpandedQuestionId: Function;
}

export default function ExpandedView({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  setExpandedQuestionId,
}: Props) {
  const isWithoutOptions = question.options.length === 1;
  const getQuestionTextStyles = (theme, isCorrect = false) =>
    isCorrect
      ? {
          backgroundColor: theme.colors.green[2],
          borderRadius: theme.radius.xs,
        }
      : {};

  return (
    <Card shadow="sm" p="lg" my="sm" withBorder className="secondaryCard slideDown clickable">
      <div>
        <Group position="apart" noWrap>
          <Group>
            <Title order={4}>Question {questionNum}</Title>
            <Text>{question.points} points</Text>
            {!isValidQuestion && (
              <Badge variant="filled" color="red">
                Incomplete
              </Badge>
            )}
          </Group>
          <Group className="noShrink">
            <Button variant="light" radius="xl" compact color="red" onClick={deleteQuestion}>
              Delete
            </Button>
            <ActionIcon variant="transparent" title="Edit" onClick={setActiveQuestion}>
              <Icon name="pencil" width={22} />
            </ActionIcon>
            <ActionIcon variant="transparent" onClick={() => setExpandedQuestionId(null)}>
              <Icon name="caretUp" />
            </ActionIcon>
            <ActionIcon variant="transparent" className="questionHandle">
              <Icon name="drag" />
            </ActionIcon>
          </Group>
        </Group>
      </div>
      <Box my="xs">
        {question.text ? (
          <SanitizedHtml>{question.text}</SanitizedHtml>
        ) : (
          <Text italic size="sm" span>
            (No question text)
          </Text>
        )}
      </Box>
      <Title mt="xl" order={6}>
        {isWithoutOptions ? 'Correct Answer' : 'Options'}
      </Title>
      <List type="ordered" listStyleType="none">
        {question.options.map((option) => (
          <Box
            className="py-md mt-md outline"
            component={List.Item}
            px="xs"
            mb="md"
            key={option.optionId}
            sx={(theme) => getQuestionTextStyles(theme, !!option.text && option.isCorrect)}>
            {option.text ? (
              <SanitizedHtml>{option.text}</SanitizedHtml>
            ) : (
              <Text italic size="sm" span>
                (No option text)
              </Text>
            )}
          </Box>
        ))}
      </List>
    </Card>
  );
}
