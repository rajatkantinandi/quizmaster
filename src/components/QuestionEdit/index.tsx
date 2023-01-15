import React, { useState } from 'react';
import { Question as IQuestion } from '../../types';
import styles from './styles.module.css';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput, FormTextArea } from '../FormInputs';
import { getEmptyOptions } from '../../helpers';
import { nanoid } from 'nanoid';
import { Title, Card, Button, ActionIcon, Text, Checkbox, Tabs, Group, TabsValue } from '@mantine/core';
import Icon from '../Icon';

interface Props {
  questionNum: number;
  question: IQuestion;
  saveQuestion: any;
  onQuestionChange: Function;
  deleteQuestion: Function;
  resetQuestion: Function;
  showPreview: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function QuestionEdit({
  questionNum,
  question,
  saveQuestion,
  onQuestionChange,
  deleteQuestion,
  resetQuestion,
  showPreview,
}: Props) {
  const formDefaultValues = {
    ...question,
    options: question.options.length > 0 ? question.options : getEmptyOptions(2),
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm({ defaultValues: formDefaultValues });
  const [, setRefresh] = useState(0);
  const [optionType, setOptionType] = useState<TabsValue>(
    question.options.length === 1 && question.options[0].isCorrect ? 'withoutOptions' : 'withOptions',
  );
  const { showAlert } = useStore();
  const options = watch('options');

  function onFormSubmit(data: FieldValues) {
    const validationError = getValidationError();

    if (validationError) {
      showAlert({ message: validationError, type: 'error' });

      return;
    }

    saveQuestion();
  }

  function setCorrectOption(optionId: string | number, ev: any) {
    const optionsData = options.map((option) => ({
      ...option,
      isCorrect: ev.target.checked && option.optionId === optionId,
    }));

    setValue('options', optionsData);
    setRefresh(Math.random());
    onQuestionChange(getValues());
  }

  function removeOption(optionId: string | number) {
    if (options.length === 2) {
      showAlert({ message: 'At least 2 options are mandatory!', type: 'error' });
    } else {
      const remainingOptions = options.filter((o) => o.optionId !== optionId);
      setValue('options', remainingOptions);
      setRefresh(Math.random());
      onQuestionChange(getValues());
    }
  }

  function addOption(ev: React.MouseEvent) {
    ev.preventDefault();
    const optionsData = options.concat({
      optionId: nanoid(),
      text: '',
      isCorrect: false,
    });

    setValue('options', optionsData);
    setRefresh(Math.random());
    onQuestionChange(getValues());
  }

  function getValidationError() {
    if (options.length === 1 && options[0].isCorrect) {
      return '';
    } else if (!options.some((option) => option.isCorrect)) {
      return 'Please select 1 correct option!';
    } else if (options.length < 2) {
      return 'At least 2 options are mandatory!';
    }

    return '';
  }

  function onTabChange(value) {
    setOptionType(value);

    if (value === 'withoutOptions') {
      const optionData = options[0];
      optionData.isCorrect = true;

      setValue('options', [optionData]);
    } else if (options.length === 1) {
      const optionData = options.concat(getEmptyOptions(1));

      optionData[1].isCorrect = false;
      setValue('options', optionData);
    }

    setRefresh(Math.random());
    onQuestionChange(getValues());
  }

  function onCancelClick(ev) {
    ev.preventDefault();
    resetQuestion();
  }

  function onDeleteClick(ev) {
    ev.preventDefault();
    deleteQuestion();
  }

  return (
    <Card shadow="sm" p="lg" my="sm" radius="md" withBorder className="secondaryCard">
      <form onSubmit={handleSubmit(onFormSubmit)} onChange={() => onQuestionChange(getValues())}>
        <Group position="apart" mb="lg">
          <Group>
            <Title mr="xl" order={4}>
              Question {questionNum}
            </Title>
            <Text weight="bold" component="span" size="sm">
              Points:
            </Text>
            <FormInput
              name="points"
              id="points"
              rules={{
                required: 'Required',
                validate: (value: number) => (value && value > 0) || 'Must be greater than 0',
              }}
              className={styles.pointsInput}
              errorMessage={errors.points?.message || ''}
              type="number"
              placeholder="Points"
              variant="filled"
              size="sm"
              radius="sm"
              register={register}
            />
          </Group>
          <Button
            leftIcon={<Icon name="preview" color="#ffffff" width={16} />}
            variant="filled"
            radius="md"
            compact
            onClick={showPreview}>
            Preview
          </Button>
        </Group>
        <FormTextArea
          name="text"
          id="text"
          rules={{
            required: 'The question text should not be empty!',
            validate: (value: string) => !!value.trim() || 'The question text should not be empty!',
          }}
          label={
            <Text weight="bold" className="mb-md">
              Question text <MarkDownLogo />
            </Text>
          }
          errorMessage={errors.text?.message || ''}
          placeholder="Enter text here"
          variant="filled"
          size="sm"
          radius="sm"
          register={register}
        />
        <Tabs variant="pills" pt="xl" pb="lg" defaultValue={optionType} keepMounted={false} onTabChange={onTabChange}>
          <Tabs.List>
            <Tabs.Tab value="withOptions">With Options</Tabs.Tab>
            <Tabs.Tab value="withoutOptions">Without Options</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="withOptions">
            {options.map((option, idx) => (
              <Group pt="sm" pb="sm" key={option.optionId}>
                <Checkbox
                  radius="xl"
                  size="md"
                  mb="xs"
                  checked={option.isCorrect}
                  onChange={(ev) => setCorrectOption(option.optionId, ev)}
                />
                <FormTextArea
                  name={`options[${idx}].text`}
                  id={`options[${idx}].text`}
                  rules={{
                    required: 'Option text should not be empty!',
                    validate: (value: string) => !!value.trim() || 'Option text should not be empty!',
                  }}
                  errorMessage={errors.options?.[idx]?.text?.message || ''}
                  label={
                    <Text weight="bold" className="mb-md">
                      Option {idx + 1} <MarkDownLogo />
                    </Text>
                  }
                  placeholder="Enter text here"
                  variant="filled"
                  size="sm"
                  radius="sm"
                  className="grow"
                  register={register}
                />
                <ActionIcon mb="xs" variant="transparent" onClick={() => removeOption(option.optionId)}>
                  <Icon width="20" name="trash" />
                </ActionIcon>
              </Group>
            ))}
            <Button
              radius="md"
              mt="lg"
              variant="default"
              onClick={addOption}
              leftIcon={<Icon name="plus" width={18} />}>
              Add option
            </Button>
          </Tabs.Panel>
          <Tabs.Panel value="withoutOptions">
            <FormTextArea
              name="options[0].text"
              id="options[0].text"
              rules={{
                required: 'The correct answer should not be empty!',
                validate: (value: string) => !!value.trim() || 'The correct answer should not be empty!',
              }}
              errorMessage={errors.options?.[0]?.text?.message || ''}
              placeholder="Enter text here"
              variant="filled"
              label={
                <Text weight="bold" mt="lg" className="mb-md">
                  Correct answer <MarkDownLogo />
                </Text>
              }
              size="sm"
              radius="sm"
              register={register}
            />
          </Tabs.Panel>
        </Tabs>
        <Group position="apart" mt="xl">
          <Button radius="md" color="red" variant="white" onClick={onDeleteClick}>
            Delete
          </Button>
          <div>
            <Button mr="sm" radius="md" variant="light" onClick={onCancelClick}>
              Cancel
            </Button>
            <Button radius="md" variant="filled" type="submit">
              Save
            </Button>
          </div>
        </Group>
      </form>
    </Card>
  );
}

const MarkDownLogo = () => (
  <a
    title="Input supports markdown format, click here to learn more..."
    href="https://commonmark.org/help/"
    target="_blank"
    rel="noreferrer">
    <Icon name="markdown" width="20" className={styles.markdownImg} />
  </a>
);
