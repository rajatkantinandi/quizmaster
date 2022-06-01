import classNames from 'classnames';
import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Divider, Icon, Label, Tab } from 'semantic-ui-react';
import { Question as IQuestion, Option } from '../../types';
import Question from '../Question';
import styles from './styles.module.css';
import markdownLogo from '../../img/markdown.svg';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { FormInputTypes } from '../../constants';
import { getEmptyOptions } from '../../helpers';

interface Props {
  selectedQuestion: IQuestion;
  saveQuestion: Function;
  onClose: Function;
}

export default function QuestionEdit({ selectedQuestion, saveQuestion, onClose }: Props) {
  const { text, options, points } = selectedQuestion;
  const formDefaultValues = {
    text,
    points,
    options: options.length > 0 ? options : getEmptyOptions(2),
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({ defaultValues: formDefaultValues });

  useEffect(() => {
    reset(formDefaultValues);
  }, [selectedQuestion.questionId]);

  const [refreshComponent, setRefreshComponent] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [isQuestionSaved, setIsQuestionSaved] = useState(false);
  const [isWithoutOptions, setIsWithoutOptions] = useState(options.length === 1);
  const { showErrorModal } = useStore();
  const optionsData = getValues('options');

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

  function setQuestionCorrectOptionId(optionId: string | number, checked: boolean) {
    const options = optionsData.map((option) => ({
      ...option,
      isCorrect: checked && option.optionId === optionId,
    }));
    setValue('options', options);
    setRefreshComponent(Math.random());
  }

  function removeOption(ev: React.MouseEvent, optionId: string | number) {
    ev.preventDefault();
    if (optionsData.length === 2) {
      showErrorModal({ message: 'At least 2 options are mandatory!' });
    } else {
      const remainingOptions = optionsData.filter((o) => o.optionId !== optionId);
      setValue('options', remainingOptions);
      setRefreshComponent(Math.random());
    }
  }

  function addOption(ev: React.MouseEvent) {
    ev.preventDefault();
    const options = optionsData.concat({
      optionId: nanoid(),
      text: '',
      isCorrect: false,
    });

    setValue('options', options);
    setRefreshComponent(Math.random());
  }

  function getValidationError() {
    if (!optionsData.some((option) => option.isCorrect)) {
      return 'Please select 1 correct option!';
    } else if (optionsData.length < 2) {
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
              componentType={FormInputTypes.TEXT_AREA}
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
                    {optionsData.map((option: Option, idx: number) => (
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
                            componentType={FormInputTypes.TEXT_AREA}
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
                        componentType={FormInputTypes.TEXT_AREA}
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
          isAttempted
          isQuestionSaved={isQuestionSaved}
          submitResponse={() => onFormSubmit(getValues())}
          isWithoutOptions={isWithoutOptions}
          selectedOptionId={
            isWithoutOptions ? optionsData[0].optionId : optionsData.find((option) => option.isCorrect)?.optionId
          }
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
