import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { Button, Checkbox, Divider, Icon, Input, Label, TextArea } from 'semantic-ui-react';
import { Option as IOption } from '../../types';
import styles from './styles.module.css';

interface Props {
  text: string;
  options: IOption[];
  saveQuestion: Function;
  correctOptionId?: string;
}

export default function QuestionEdit({ text, options, saveQuestion, correctOptionId = '' }: Props) {
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

  function handleSubmit(ev: any) {
    ev.preventDefault();

    const validationError = getValidationError();

    if (validationError) {
      alert(validationError);
    } else {
      saveQuestion({ text: questionText, options: questionOptions, correctOptionId: questionCorrectOptionId });
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
      errorText = 'THe question text should not be empty!';
    } else if (questionOptions.length < 2) {
      errorText = 'At least 2 options are mandatory!';
    } else if (questionOptions.some((q) => q.optionText.trim().length === 0)) {
      errorText = 'Option text should not be empty!';
    } else if (!questionOptions.some((q) => q.id === questionCorrectOptionId)) {
      errorText = 'Please select 1 correct option!';
    }

    return errorText;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Label>
        <div className="mb-md">Question text</div>
        <TextArea className="fullWidth" value={questionText} onChange={(ev) => setQuestionText(ev.target.value)} />
      </Label>
      <Divider />
      {questionOptions.map((option, idx) => (
        <div className="flex alignCenter" key={option.id}>
          <Checkbox
            checked={option.id === questionCorrectOptionId}
            value={option.id}
            className="mr-lg"
            onChange={(ev, data) => setQuestionCorrectOptionId(data.value as string)}
          />
          <Input
            label={`Option ${idx + 1}`}
            onChange={(ev) => handleOptionChange(ev, option.id)}
            value={option.optionText}
            className="mr-lg"
          />
          <Button
            icon={<Icon name="trash" />}
            basic
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
      <Button color="green" type="submit">
        Save
      </Button>
    </form>
  );
}
