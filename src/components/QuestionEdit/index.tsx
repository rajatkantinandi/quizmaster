import classNames from 'classnames';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { Button, Checkbox, Divider, Icon, Input, Label, TextArea } from 'semantic-ui-react';
import { Option as IOption } from '../../types';
import Question from '../Question';
import styles from './styles.module.css';
import markdownLogo from '../../img/markdown.svg';

interface Props {
  text: string;
  options: IOption[];
  saveQuestion: Function;
  correctOptionId?: string;
  point: number;
}

export default function QuestionEdit({ text, options, saveQuestion, correctOptionId = '', point }: Props) {
  const [questionText, setQuestionText] = useState(text || '');
  const [questionOptions, setQuestionOptions] = useState(
    options.length > 0
      ? options
      : [
          {
            id: nanoid(),
            optionText: '',
          },
          {
            id: nanoid(),
            optionText: '',
          },
        ],
  );
  const [questionCorrectOptionId, setQuestionCorrectOptionId] = useState(correctOptionId || '');
  const [questionPoint, setQuestionPoint] = useState(point);
  const [isPreview, setIsPreview] = useState(false);

  function handleSubmit(ev?: any) {
    if (ev) {
      ev.preventDefault();
    }

    const validationError = getValidationError();

    if (validationError) {
      alert(validationError);
    } else {
      saveQuestion({
        text: questionText,
        options: questionOptions,
        correctOptionId: questionCorrectOptionId,
        point: questionPoint,
      });
    }
  }

  function handleOptionChange(ev: any, id: string) {
    setQuestionOptions(
      questionOptions.map((o) => {
        if (o.id === id) {
          return { id, optionText: ev.target.value };
        } else {
          return o;
        }
      }),
    );
  }

  function getValidationError() {
    let errorText = '';

    if (questionText.trim().length === 0) {
      errorText = 'The question text should not be empty!';
    } else if (questionOptions.length < 2) {
      errorText = 'At least 2 options are mandatory!';
    } else if (questionOptions.some((q) => q.optionText.trim().length === 0)) {
      errorText = 'Option text should not be empty!';
    } else if (!questionOptions.some((q) => q.id === questionCorrectOptionId)) {
      errorText = 'Please select 1 correct option!';
    } else if (!questionPoint || questionPoint < 0) {
      errorText = "Question's correct response points should be greater than zero!";
    }

    return errorText;
  }

  return (
    <div>
      <label className={classNames('flex alignCenter', styles.previewSlider)}>
        <input type="checkbox" aria-label="Preview" checked={isPreview} onChange={() => setIsPreview(!isPreview)} />
        <div className={styles.edit}>Edit</div>
        <div className={styles.preview}>Preview</div>
      </label>
      <form
        aria-hidden={isPreview}
        className={classNames(styles.container, { [styles.toggledOff]: isPreview })}
        onSubmit={handleSubmit}>
        <div className={styles.editFormBody}>
          <Label as="label" className={styles.questionText}>
            <div className="mb-md">
              Question text <MarkDownLogo />
            </div>
            <TextArea rows={4} value={questionText} onChange={(ev) => setQuestionText(ev.target.value)} />
          </Label>
          <Divider />
          {questionOptions.map((option, idx) => (
            <div className="flex alignStart" key={option.id}>
              <Checkbox
                checked={option.id === questionCorrectOptionId}
                value={option.id}
                className={classNames('mr-lg mt-lg', styles.optionCheckbox)}
                onChange={(ev, data) => setQuestionCorrectOptionId(data.value as string)}
              />
              <Label as="label" className={styles.optionText}>
                <div className="mb-md">
                  Option {idx + 1} <MarkDownLogo />
                </div>
                <TextArea rows={1} value={option.optionText} onChange={(ev) => handleOptionChange(ev, option.id)} />
              </Label>
              <Button
                icon={<Icon name="trash" />}
                basic
                className="mt-lg"
                onClick={() => setQuestionOptions(questionOptions.filter((o) => o.id !== option.id))}
              />
            </div>
          ))}
          <Button
            color="blue"
            onClick={() => {
              setQuestionOptions(questionOptions.concat({ id: nanoid(), optionText: '' }));
            }}
            type="button"
            className="alignSelfStart">
            Add Option
          </Button>
          <Divider />
          <Input
            label="Points for correct response"
            onChange={(ev) => setQuestionPoint(parseInt(ev.target.value, 10) || 0)}
            value={questionPoint}
            type="number"
          />
        </div>
        <Divider />
        <Button size="large" className="fullWidth" color="green" type="submit">
          Save
        </Button>
      </form>
      <div aria-hidden={!isPreview} className={classNames(styles.container, { [styles.toggledOff]: !isPreview })}>
        <Question
          text={questionText}
          options={questionOptions}
          preSelectedChoice={questionCorrectOptionId}
          onClose={() => setIsPreview(false)}
          isAttempted
          isCorrect
          isPreview
          submitResponse={() => handleSubmit()}
        />
      </div>
    </div>
  );
}

const MarkDownLogo = () => (
  <a
    title="Input supports markdown format, click learn more..."
    href="https://commonmark.org/help/"
    target="_blank"
    rel="noreferrer">
    <img src={markdownLogo} alt="" className={styles.markdownImg} />
  </a>
);
