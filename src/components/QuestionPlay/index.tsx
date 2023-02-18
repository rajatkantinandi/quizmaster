import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Title, Card, Button, Text, Checkbox, Group, Box } from '@mantine/core';
import { Option as IOption } from '../../types';
import Markdown from '../Markdown';
import styles from './styles.module.css';
import { useForm } from 'react-hook-form';

interface Props {
  submitResponse: Function;
  pauseTimer?: Function;
  selectedOptionId: number | null | string;
  selectedQuestion: {
    questionId?: string;
    text: string;
    options: IOption[];
    points: number;
    questionNum?: number;
  };
  isAttempted: boolean;
}

export default function QuestionPlay({
  submitResponse,
  pauseTimer,
  selectedOptionId,
  selectedQuestion,
  isAttempted,
}: Props) {
  const [selectedChoice, setSelectedChoice] = useState(selectedOptionId);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const { options, text, points } = selectedQuestion;
  const getQuestionTextStyles = (theme, isCorrect = false) => ({
    backgroundColor: isCorrect ? theme.colors.green[2] : '#AFD0D4',
    borderRadius: theme.radius.xs,
  });
  const { handleSubmit } = useForm();

  useEffect(() => {
    if (isAttempted) {
      // reveal answer when question is attempted due to timeout
      setIsAnswerRevealed(true);
    }
  }, [isAttempted]);

  useEffect(() => {
    setSelectedChoice(selectedOptionId);
  }, [selectedOptionId]);

  function submitQuestionResponse() {
    document.getElementById('btnSubmitResponse')?.click();
  }

  function handleSelectedChoice(choice) {
    setSelectedChoice(choice);

    setTimeout(() => {
      submitQuestionResponse();
    }, 100);
  }

  return (
    <Card shadow="sm" p="lg" radius="md" my="sm" withBorder className="secondaryCard">
      <form onSubmit={handleSubmit(() => submitResponse(selectedChoice === '' ? null : selectedChoice))}>
        <Group>
          <Title mr="xl" order={4}>
            Question {selectedQuestion.questionNum}
          </Title>
          <Text weight="bold" component="span" size="sm">
            Points: {points}
          </Text>
        </Group>
        <Box my="xs" sx={getQuestionTextStyles}>
          <Markdown>{text}</Markdown>
        </Box>
        {options.length === 1 ? (
          // Show correct answer for question without options when answer is revealed
          isAnswerRevealed ? (
            <>
              <Title mt="xl" order={6}>
                Correct Answer
              </Title>
              <Box
                className="py-md mt-md"
                px="xs"
                mb="md"
                key={options[0].optionId}
                sx={(theme) => getQuestionTextStyles(theme, !!options[0].text && options[0].isCorrect)}>
                <Markdown>{options[0].text}</Markdown>
              </Box>
              {selectedOptionId === '' && (
                <Group>
                  <Button radius="md" color="red" onClick={() => handleSelectedChoice('')}>
                    Incorrect
                  </Button>
                  <Button radius="md" color="green" onClick={() => handleSelectedChoice(options[0].optionId)}>
                    Correct
                  </Button>
                </Group>
              )}
            </>
          ) : (
            <Button
              color="green"
              radius="md"
              onClick={() => {
                setIsAnswerRevealed(true);

                // pause timer when the answer is revealed
                if (pauseTimer) {
                  pauseTimer();
                }
              }}>
              Reveal answer
            </Button>
          )
        ) : (
          <>
            <Checkbox.Group
              value={selectedChoice === null ? undefined : [selectedChoice.toString()]}
              orientation="vertical"
              label={<Title order={6}>Options</Title>}
              size="md"
              my="lg"
              onChange={(value: string[]) => setSelectedChoice(value[value.length - 1])}>
              {options.map((option) => (
                <Checkbox
                  key={option.optionId}
                  label={<Markdown>{option.text}</Markdown>}
                  className={classNames({
                    [styles.isAttempted]: isAttempted,
                    [styles.correct]: option.isCorrect && selectedOptionId === option.optionId,
                    [styles.inCorrect]: !option.isCorrect && selectedOptionId === option.optionId,
                  })}
                  value={option.optionId.toString()}
                  disabled={isAttempted}
                  radius="xl"
                  color="red"
                  size="lg"
                />
              ))}
            </Checkbox.Group>
            {!isAttempted && (
              <Button radius="md" color="green" onClick={submitQuestionResponse}>
                Submit
              </Button>
            )}
          </>
        )}
        <button className="displayNone" id="btnSubmitResponse" type="submit">
          Submit
        </button>
      </form>
    </Card>
  );
}
