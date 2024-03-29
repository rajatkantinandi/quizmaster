import React, { useState, forwardRef } from 'react';
import styles from './styles.module.css';
import { useStore } from '../../useStore';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { FormInput, FormTextArea } from '../FormInputs';
import { getEmptyOptions, getEmptyOption } from '../../helpers';
import { Title, Card, Button, ActionIcon, Text, Checkbox, Tabs, Group, TabsValue } from '@mantine/core';
import Icon from '../Icon';
import classNames from 'classnames';
import { getTextContent, getImageOrTextContent, getCleanText } from '../../helpers/dom';

interface Props {
  questionNum: number;
  question: any;
  saveQuestion: any;
}

function QuestionEdit({ questionNum, question, saveQuestion }: Props, ref) {
  const { handleSubmit, setValue, watch, control } = useForm({
    defaultValues: {
      ...question,
      options: question.options.length > 0 ? question.options : getEmptyOptions(2),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });
  const options = watch('options');
  const [optionType, setOptionType] = useState<TabsValue>(
    options.length === 1 && options[0].isCorrect ? 'withoutOptions' : 'withOptions',
  );
  const [focusOnLastOption, setFocusOnLastOption] = useState(false);
  const { showAlert } = useStore();
  const isWithoutOptions = options.length === 1;

  function onFormSubmit(data: FieldValues) {
    const validationError = getValidationError();

    if (validationError) {
      showAlert({ message: validationError, type: 'error' });

      return;
    }

    saveQuestion(data);
  }

  function setCorrectOption(optionId: string | number, ev: any) {
    const optionsData = options.map((option) => ({
      ...option,
      isCorrect: option.optionId === optionId ? ev.target.checked : option.isCorrect,
    }));

    setValue('options', optionsData);
  }

  function removeOption(index: number) {
    if (options.length === 2) {
      showAlert({ message: 'At least 2 options are mandatory!', type: 'error' });
    } else {
      remove(index);
    }
  }

  function addOption(ev: React.MouseEvent) {
    ev.preventDefault();

    setTimeout(() => {
      document.querySelector('#addOptionBtn')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    append(getEmptyOption());
    setFocusOnLastOption(true);
  }

  function getValidationError() {
    if (isWithoutOptions && options[0].isCorrect) {
      return '';
    } else if (!options.some((option) => option.isCorrect)) {
      return 'Please select 1 correct option!';
    } else if (options.length < 2) {
      return 'At least 2 options are mandatory!';
    } else {
      const optionTexts = options.map((x) => x.text);

      if (optionTexts.length >= 2) {
        const el = document.createElement('div');

        for (let i = 0; i < optionTexts.length - 1; i++) {
          el.innerHTML = optionTexts[i];
          const option1Text = getCleanText(el.innerText);

          for (let j = i + 1; j < optionTexts.length; j++) {
            el.innerHTML = optionTexts[j];
            const option2Text = getCleanText(el.innerText); // replacing multiple space with single space

            if (option1Text === option2Text) {
              return 'All options must have different text';
            } else {
              continue;
            }
          }
        }
      }
    }

    return '';
  }

  function onTabChange(value) {
    setOptionType(value);

    if (value === 'withoutOptions') {
      const optionData = options[0];
      optionData.isCorrect = true;

      setValue('options', [optionData]);
    } else if (isWithoutOptions) {
      const optionData = options.concat(getEmptyOptions(1));

      optionData[1].isCorrect = false;
      setValue('options', optionData);
    }
  }

  return (
    <Card shadow="sm" mx="auto" maw={800} withBorder className={'secondaryCard slideDown'}>
      <form onSubmit={handleSubmit(onFormSubmit)} ref={ref}>
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
              type="number"
              placeholder="Points"
              variant="filled"
              size="sm"
              radius="sm"
              control={control}
            />
          </Group>
        </Group>
        <FormTextArea
          name="text"
          rules={{
            required: 'The question text should not be empty!',
            validate: (value: string) => !!getTextContent(value) || 'The question text should not be empty!',
          }}
          label={
            <Text weight="bold" className="mb-md">
              Question text <MarkDownLogo />
            </Text>
          }
          size="md"
          className={classNames('resizeVertical', styles.questionText)}
          control={control}
          autoFocus
          isRichText
        />
        <Tabs variant="pills" pt="xl" defaultValue={optionType} keepMounted={false} onTabChange={onTabChange}>
          <Tabs.List>
            <Tabs.Tab value="withOptions">With Options</Tabs.Tab>
            <Tabs.Tab value="withoutOptions">Without Options</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="withOptions">
            {fields.map((item, idx) => (
              <Group pt="sm" pb="sm" key={options[idx].optionId}>
                <Checkbox
                  radius="xl"
                  size="md"
                  mb="xs"
                  checked={options[idx].isCorrect}
                  onChange={(ev) => setCorrectOption(options[idx].optionId, ev)}
                />
                <FormTextArea
                  name={`options[${idx}].text`}
                  rules={{
                    required: 'Option should not be empty!',
                    validate: (value: string) => !!getImageOrTextContent(value) || 'Option should not be empty!',
                  }}
                  label={
                    <Text weight="bold" className="mb-md">
                      Option {idx + 1} <MarkDownLogo />
                    </Text>
                  }
                  className={classNames(styles.optionText)}
                  control={control}
                  isRichText
                  autoFocus={idx === fields.length - 1 && focusOnLastOption}
                />
                <ActionIcon mb="xs" variant="transparent" onClick={() => removeOption(idx)}>
                  <Icon width="20" name="trash" />
                </ActionIcon>
              </Group>
            ))}
            <Button
              mt="md"
              variant="default"
              id="addOptionBtn"
              onClick={addOption}
              leftIcon={<Icon name="plus" width={18} />}>
              Add option
            </Button>
          </Tabs.Panel>
          <Tabs.Panel value="withoutOptions">
            {fields.map((item, idx) => (
              <FormTextArea
                name={`options[${idx}].text`}
                key={item.id}
                rules={{
                  required: 'The correct answer should not be empty!',
                  validate: (value: string) =>
                    !!getImageOrTextContent(value) || 'The correct answer should not be empty!',
                }}
                label={
                  <Text weight="bold" mt="lg" className="mb-md">
                    Correct answer <MarkDownLogo />
                  </Text>
                }
                control={control}
                className={classNames(styles.optionText)}
                isRichText
                autoFocus
              />
            ))}
          </Tabs.Panel>
        </Tabs>
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

export default forwardRef(QuestionEdit);
