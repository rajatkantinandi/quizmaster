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
  setExpandedQuestionIndex: Function;
}

export default function ExpandedView({
  questionNum,
  question,
  isValidQuestion,
  setActiveQuestion,
  deleteQuestion,
  setExpandedQuestionIndex,
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
    <Card shadow="sm" p="lg" radius="md" my="sm" withBorder className="secondaryCard slideDown">
      <Card className="secondaryCard clickable" p={0} onClick={() => setExpandedQuestionIndex(null)}>
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
            <Button variant="light" compact radius="xl" color="red" onClick={deleteQuestion}>
              Delete
            </Button>
            <ActionIcon variant="transparent" title="Edit" onClick={setActiveQuestion}>
              <Icon name="pencil" width={22} />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <Icon name="caretUp" />
            </ActionIcon>
          </Group>
        </Group>
      </Card>
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
