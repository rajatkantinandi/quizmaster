import React from 'react';
import TeamAvatar from '../../components/TeamAvatar';
import { Button, Text, Accordion, Group, Badge, Title } from '@mantine/core';
import { Question as IQuestion } from '../../types';
import styles from './styles.module.css';
import { getPointsColor } from '../../helpers';

export default function QuestionsList({
  categories,
  selectedOptionsData,
  teams,
  attemptedQuestionIds,
  selectedQuestion,
  isQuestionPointsHidden,
  shouldEnableQuestion,
  showQuestion,
  minQuestionPoint,
  maxQuestionPoint,
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

  function getQuestionBackgroundColor(question: IQuestion) {
    if (attemptedQuestionIds.includes(question.questionId)) {
      const correctOptionIds = question.options.filter((x) => x.isCorrect).map((x) => x.optionId);
      const selectedOptionIds = selectedOptionsData.find(
        (x) => x.questionId === question.questionId,
      )?.selectedOptionIds;

      return correctOptionIds.length === selectedOptionIds.length &&
        !correctOptionIds.some((x) => !selectedOptionIds.includes(x))
        ? 'var(--points-color-1)'
        : 'var(--points-color-5)';
    } else {
      return getPointsColor(question.points, minQuestionPoint, maxQuestionPoint).bgColor;
    }
  }

  function getQuestionColor(question: IQuestion) {
    if (attemptedQuestionIds.includes(question.questionId)) {
      return 'var(--off-white)';
    } else {
      return getPointsColor(question.points, minQuestionPoint, maxQuestionPoint).color;
    }
  }

  return (
    <>
      <div className={styles.colorPallet}>
        <span>Lowest point</span>
        <div className={styles.bar} />
        <span>Highest point</span>
      </div>
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
                        color: getQuestionColor(question),
                      },
                      root: {
                        backgroundColor: getQuestionBackgroundColor(question),
                        ':hover': {
                          backgroundColor: getQuestionBackgroundColor(question),
                        },
                      },
                    }}
                    disabled={!shouldEnableQuestion(question)}
                    variant={selectedQuestion?.questionId === question.questionId ? 'filled' : 'light'}
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
                          <Badge
                            variant="filled"
                            styles={{
                              root: {
                                backgroundColor: attemptedQuestionIds.includes(question.questionId)
                                  ? 'var(--gray-dark)' // Show a neutral color when question is attempted
                                  : getPointsColor(question.points, minQuestionPoint, maxQuestionPoint).color,
                              },
                            }}>
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
    </>
  );
}
