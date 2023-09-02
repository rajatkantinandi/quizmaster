import React from 'react';
import TeamAvatar from '../../components/TeamAvatar';
import { Button, Text, Accordion, Group, Badge, Title } from '@mantine/core';
import { Question as IQuestion } from '../../types';
import styles from './styles.module.css';

export default function QuestionsList({
  categories,
  selectedOptionsData,
  teams,
  attemptedQuestionIds,
  selectedQuestion,
  isQuestionPointsHidden,
  shouldEnableQuestion,
  showQuestion,
}) {
  const questionPointsAverage =
    categories.reduce(
      (sum, category) => sum + category.questions.reduce((sum, question) => sum + parseInt(question.points), 0),
      0,
    ) / categories.reduce((count, category) => count + category.questions.length, 0);
  const minQuestionPoint = Math.min(
    ...categories.map((category) => Math.min(...category.questions.map((question) => parseInt(question.points)))),
  );

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
      const correctOptionIds = question.options.filter((x) => x.isCorrect).map((x) => x.optionId);
      const selectedOptionIds = selectedOptionsData.find(
        (x) => x.questionId === question.questionId,
      )?.selectedOptionIds;

      return correctOptionIds.length === selectedOptionIds.length &&
        !correctOptionIds.some((x) => !selectedOptionIds.includes(x))
        ? 'green'
        : 'red';
    } else {
      return 'blue';
    }
  }

  function getBadgeColor(points) {
    if (parseInt(points) > minQuestionPoint + questionPointsAverage * 0.8) {
      return 'red';
    } else if (parseInt(points) > minQuestionPoint + questionPointsAverage * 0.6) {
      return 'orange';
    } else if (parseInt(points) > minQuestionPoint + questionPointsAverage * 0.4) {
      return 'yellow';
    } else if (parseInt(points) > minQuestionPoint + questionPointsAverage * 0.2) {
      return 'lime';
    } else {
      return 'green';
    }
  }

  return (
    <Accordion
      multiple
      defaultValue={categories.map((x) => `${x.categoryId}`)}
      className={styles.categoryGrid}
      variant="filled">
      {categories.map((category) => (
        <Accordion.Item className="grow" key={category.categoryId} value={`${category.categoryId}`}>
          <Accordion.Control>
            <Title order={6}>{category.categoryName}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Button.Group orientation="vertical">
              {category.questions.map((question) => (
                <Button
                  my="sm"
                  styles={{
                    inner: {
                      display: 'inherit',
                    },
                  }}
                  disabled={!shouldEnableQuestion(question)}
                  variant={selectedQuestion?.questionId === question.questionId ? 'filled' : 'light'}
                  color={getQuestionColor(question)}
                  fullWidth
                  onClick={() => showQuestion(question.questionId, category.categoryId)}
                  key={question.questionId}>
                  <Group position="apart" style={{ width: '100%' }}>
                    {isQuestionPointsHidden &&
                    !attemptedQuestionIds.includes(question.questionId) &&
                    selectedQuestion?.questionId !== question.questionId ? (
                      <Text>Question {question.questionNum}</Text>
                    ) : (
                      <Group>
                        <Text>Question {question.questionNum}</Text>
                        <Badge variant="filled" color={getBadgeColor(question.points)} size="sm">
                          {question.points} pts
                        </Badge>
                      </Group>
                    )}
                    <TeamAvatar {...getAvatarProps(question)} />
                  </Group>
                </Button>
              ))}
            </Button.Group>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
