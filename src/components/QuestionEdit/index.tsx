import classNames from 'classnames';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { Button, Checkbox, Divider, Icon, Label, Tab } from 'semantic-ui-react';
import { Question as IQuestion } from '../../types';
import Question from '../Question';
import styles from './styles.module.css';
import markdownLogo from '../../img/markdown.svg';
import { useAppStore } from '../../useAppStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';

interface Props {
  selectedQuestion: IQuestion;
  saveQuestion: Function;
  onClose: Function;
}

export default function QuestionEdit({ selectedQuestion, saveQuestion, onClose }: Props) {
  const { text, options, points } = selectedQuestion;
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      text,
      points,
      options:
        options.length > 0
          ? options
          : [
              {
                optionId: nanoid(),
                text: '',
                isCorrect: false,
              },
              {
                optionId: nanoid(),
                text: '',
                isCorrect: false,
              },
            ],
    },
  });
  const [optionsData, setOptionData] = useState(getValues('options'));
  const [isPreview, setIsPreview] = useState(false);
  const [isQuestionSaved, setIsQuestionSaved] = useState(false);
  const [isWithoutOptions, setIsWithoutOptions] = useState(options.length === 1);
  const { showErrorModal } = useAppStore();

  function onFormSubmit(data: FieldValues) {
    if (isWithoutOptions) {
      const firstOption = data.options[0];
      firstOption.isCorrect = true;
      data.options = [firstOption];
    } else {
      const validationError = getValidationError();

      if (validationError) {
        showErrorModal({ message: validationError });

        return;
      }
    }

    saveQuestion(data);
    setIsPreview(true);
    setIsQuestionSaved(true);
  }

  function togglePreview() {
    if (isPreview && isQuestionSaved) {
      setIsQuestionSaved(false);
    }

    setIsPreview(!isPreview);
  }

  function setQuestionCorrectOptionId(optionId: any, checked: boolean) {
    const options = getValues('options').map((option) => ({
      ...option,
      isCorrect: option.optionId === optionId,
    }));
    setOptionData(options);
    setValue('options', options);
  }

  function removeOption(ev: any, optionId: any) {
    ev.preventDefault();
    const options = getValues('options');

    if (options.length === 2) {
      showErrorModal({ message: 'At least 2 options are mandatory!' });
    } else {
      const remainingOptions = options.filter((o) => o.optionId !== optionId);
      setOptionData(remainingOptions);
      setValue('options', remainingOptions);
    }
  }

  function addOption(ev: any) {
    ev.preventDefault();
    const options = getValues('options').concat({
      optionId: nanoid(),
      text: '',
      isCorrect: false,
    });

    setOptionData(options);
    setValue('options', options);
  }

  function getValidationError() {
    const options = getValues('options');

    if (!options.some((option) => option.isCorrect)) {
      return 'Please select 1 correct option!';
    } else if (options.length === 1) {
      return 'At least 2 options are mandatory!';
    }

    return '';
  }

  return (
    <div>
      <label className={classNames('flex alignCenter', styles.previewSlider)}>
        <input type="checkbox" aria-label="Preview" checked={isPreview} onChange={togglePreview} />
        <div className={styles.edit}>Edit</div>
        <div className={styles.preview}>Preview</div>
      </label>
      <form
        aria-hidden={isPreview}
        className={classNames(styles.container, { [styles.toggledOff]: isPreview })}
        onSubmit={handleSubmit(onFormSubmit)}>
        <div className={styles.editFormBody}>
          <Label as="label" className={styles.questionText}>
            <div className="mb-md">
              Question text <MarkDownLogo />
            </div>
            <FormInput
              name="text"
              control={control}
              rules={{
                required: 'The question text should not be empty!',
                validate: (value: string) => !!value.trim() || 'The question text should not be empty!',
              }}
              errorMessage={errors.text?.message || ''}
              componentType="textArea"
              inputProps={{
                rows: 4,
              }}
            />
          </Label>
          <Divider />
          <Tab
            activeIndex={isWithoutOptions ? 1 : 0}
            panes={[
              {
                menuItem: 'With options',
                render: () => (
                  <Tab.Pane active={!isWithoutOptions}>
                    {getValues('options').map((option: any, idx: number) => (
                      <div className="flex alignStart" key={option.optionId}>
                        <Checkbox
                          checked={option.isCorrect}
                          className={classNames('mr-lg mt-lg', styles.optionCheckbox)}
                          onChange={(ev, data) => setQuestionCorrectOptionId(option.optionId, !!data.checked)}
                        />
                        <Label as="label" className={styles.optionText}>
                          <div className="mb-md">
                            Option {idx + 1} <MarkDownLogo />
                          </div>
                          <FormInput
                            name={`options[${idx}].text`}
                            control={control}
                            rules={{
                              required: 'Option text should not be empty!',
                              validate: (value: string) => !!value.trim() || 'Option text should not be empty!',
                            }}
                            errorMessage={errors.options?.[idx]?.text?.message || ''}
                            componentType="textArea"
                            inputProps={{
                              rows: 1,
                            }}
                          />
                        </Label>
                        <Button
                          icon={<Icon name="trash" />}
                          basic
                          className="mt-lg"
                          onClick={(ev) => removeOption(ev, option.optionId)}
                        />
                      </div>
                    ))}
                    <Button color="blue" onClick={addOption} type="button" className="alignSelfStart">
                      Add Option
                    </Button>
                  </Tab.Pane>
                ),
              },
              {
                menuItem: 'Without options',
                render: () => (
                  <Tab.Pane active={isWithoutOptions}>
                    <Label as="label" className={styles.correctAns}>
                      <div className="mb-md">
                        Correct answer <MarkDownLogo />
                      </div>
                      <FormInput
                        name="options[0].text"
                        control={control}
                        rules={{
                          required: 'The correct answer should not be empty!',
                          validate: (value: string) => !!value.trim() || 'The correct answer should not be empty!',
                        }}
                        errorMessage={errors.options?.[0]?.text?.message || ''}
                        componentType="textArea"
                        inputProps={{
                          rows: 1,
                        }}
                      />
                    </Label>
                  </Tab.Pane>
                ),
              },
            ]}
            onTabChange={() => setIsWithoutOptions(!isWithoutOptions)}
          />
          <Divider />
          <FormInput
            name="points"
            control={control}
            rules={{
              required: "Question's correct response points should not be empty",
              validate: (value: number) =>
                (value && value > 0) || "Question's correct response points should be greater than zero!",
            }}
            errorMessage={errors.points?.message || ''}
            inputProps={{
              label: 'Points for correct response',
              type: 'number',
            }}
          />
        </div>
        <Divider />
        <Button size="large" className="fullWidth" color="green" type="submit">
          Save
        </Button>
      </form>
      <div aria-hidden={!isPreview} className={classNames(styles.container, { [styles.toggledOff]: !isPreview })}>
        <Question
          selectedQuestion={getValues()}
          onClose={onClose}
          isPreview
          isQuestionSaved={isQuestionSaved}
          submitResponse={() => onFormSubmit(getValues())}
          isWithoutOptions={isWithoutOptions}
        />
      </div>
    </div>
  );
}

const MarkDownLogo = () => (
  <a
    title="Input supports markdown format, click here to learn more..."
    href="https://commonmark.org/help/"
    target="_blank"
    rel="noreferrer">
    <img src={markdownLogo} alt="" className={styles.markdownImg} />
  </a>
);
