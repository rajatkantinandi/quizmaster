import classNames from 'classnames';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { Button, Checkbox, Divider, Icon, Input, Label, Tab, TextArea } from 'semantic-ui-react';
import { Option as IOption } from '../../types';
import Question from '../Question';
import styles from './styles.module.css';
import markdownLogo from '../../img/markdown.svg';
import { useAppStore } from '../../useAppStore';

interface Props {
  text: string;
  options: IOption[];
  saveQuestion: Function;
  correctOptionId?: string;
  point: number;
  onClose: Function;
  withoutOptions?: boolean;
}

export default function QuestionEdit({
  text,
  options,
  saveQuestion,
  correctOptionId = '',
  point,
  onClose,
  withoutOptions = false,
}: Props) {
  const [questionText, setQuestionText] = useState(text || '');
  const [questionOptions, setQuestionOptions] = useState<IOption[]>(
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
  const [isQuestionSaved, setIsQuestionSaved] = useState(false);
  const [isWithoutOptions, setIsWithoutOptions] = useState(withoutOptions);
  const { showErrorModal } = useAppStore();

  function handleSubmit(ev?: any) {
    if (ev) {
      ev.preventDefault();
    }

    const validationError = getValidationError();

    if (validationError) {
      showErrorModal({ message: validationError });
    } else {
      saveQuestion({
        text: questionText,
        options: isWithoutOptions ? questionOptions.slice(0, 1) : questionOptions,
        correctOptionId: isWithoutOptions ? questionOptions[0].id : questionCorrectOptionId,
        point: questionPoint,
        isWithoutOptions,
      });
      setIsPreview(true);
      setIsQuestionSaved(true);
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
    if (questionText.trim().length === 0) {
      return 'The question text should not be empty!';
    }
    if (isWithoutOptions) {
      if (questionOptions[0].optionText.trim().length === 0) {
        return 'The correct answer should not be empty!';
      }
    } else {
      if (questionOptions.length < 2) {
        return 'At least 2 options are mandatory!';
      }
      if (questionOptions.some((q) => q.optionText.trim().length === 0)) {
        return 'Option text should not be empty!';
      }
      if (!questionOptions.some((q) => q.id === questionCorrectOptionId)) {
        return 'Please select 1 correct option!';
      }
    }
    if (!questionPoint || questionPoint < 0) {
      return "Question's correct response points should be greater than zero!";
    }

    return '';
  }

  function togglePreview() {
    if (isPreview && isQuestionSaved) {
      setIsQuestionSaved(false);
    }

    setIsPreview(!isPreview);
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
        onSubmit={handleSubmit}>
        <div className={styles.editFormBody}>
          <Label as="label" className={styles.questionText}>
            <div className="mb-md">
              Question text <MarkDownLogo />
            </div>
            <TextArea rows={4} value={questionText} onChange={(ev) => setQuestionText(ev.target.value)} />
          </Label>
          <Divider />
          <Tab
            activeIndex={isWithoutOptions ? 1 : 0}
            panes={[
              {
                menuItem: 'With options',
                render: () => (
                  <Tab.Pane active={!isWithoutOptions}>
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
                          <TextArea
                            rows={1}
                            value={option.optionText}
                            onChange={(ev) => handleOptionChange(ev, option.id)}
                          />
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
                      <TextArea
                        rows={1}
                        value={questionOptions[0].optionText}
                        onChange={(ev) => handleOptionChange(ev, questionOptions[0].id)}
                      />
                    </Label>
                  </Tab.Pane>
                ),
              },
            ]}
            onTabChange={() => setIsWithoutOptions(!isWithoutOptions)}
          />
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
          onClose={onClose}
          isAttempted
          isCorrect
          isPreview
          isQuestionSaved={isQuestionSaved}
          submitResponse={() => handleSubmit()}
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
