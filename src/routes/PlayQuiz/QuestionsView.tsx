import React from 'react';
import TeamAvatar from '../../components/TeamAvatar';
import { Button, Text, Accordion, Group, Badge, Title } from '@mantine/core';
import { Question as IQuestion } from '../../types';

export default function QuestionsView({
  categories,
  selectedOptionsData,
  teams,
  attemptedQuestionIds,
  selectedQuestion,
  isQuestionPointsHidden,
  shouldEnableQuestion,
  showQuestion,
}) {
  function getAvatarProps(question) {
    const team = teams.find((team) => team.selectedOptions.some((x) => x.questionId === question.questionId));
    const shouldShowAvatar = attemptedQuestionIds.includes(question.questionId) && !!team;

    return {
      shouldShowAvatar,
      size: 'small',
      team,
    };
  }

  function getQuestionColor(question: IQuestion): string {
    if (attemptedQuestionIds.includes(question.questionId)) {
      const correctOptionId = question.options.find((x) => x.isCorrect)?.optionId;
      const selectedOptionId = selectedOptionsData.find((x) => x.questionId === question.questionId)?.selectedOptionId;

      return correctOptionId === parseInt(selectedOptionId) ? 'green' : 'red';
    } else {
      return 'blue';
    }
  }

  return (
    <Accordion multiple defaultValue={categories.map((x) => `${x.categoryId}`)} variant="separated">
      {categories.map((category) => (
        <Accordion.Item key={category.categoryId} value={`${category.categoryId}`}>
          <Accordion.Control>
            <Title order={6}>{category.categoryName}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Button.Group orientation="vertical">
              {category.questions.map((question) => (
                <Button
                  leftIcon={<TeamAvatar {...getAvatarProps(question)} />}
                  my="sm"
                  radius="md"
                  disabled={!shouldEnableQuestion(question)}
                  variant={selectedQuestion?.questionId === question.questionId ? 'filled' : 'light'}
                  color={getQuestionColor(question)}
                  fullWidth
                  onClick={() => showQuestion(question.questionId, category.categoryId)}
                  key={question.questionId}>
                  {isQuestionPointsHidden ? (
                    <Text>Question {question.questionNum}</Text>
                  ) : (
                    <Group position="apart">
                      <Text>Question {question.questionNum}</Text>
                      <Badge variant="filled" color="red" size="sm">
                        Points {question.points}
                      </Badge>
                    </Group>
                  )}
                </Button>
              ))}
            </Button.Group>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
