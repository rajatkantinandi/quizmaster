import { useState, forwardRef } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { getEmptyOptions, getEmptyOption } from '../../helpers';
import { FormInput, FormTextArea } from '../FormInputs';
import { getTextContent, getImageOrTextContent, getCleanText } from '../../helpers/dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '../Icon';

interface Props {
  questionNum: number;
  question: any;
  saveQuestion: any;
}

function QuestionEdit({ questionNum, question, saveQuestion }: Props, ref: any) {
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
  const [optionType, setOptionType] = useState<string>(
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

  function getValidationError() {
    const questionText = getTextContent(data.text);

    if (!questionText) {
      return 'Question text should not be empty!';
    }

    const options = data.options;

    if (isWithoutOptions) {
      const correctAnswerText = getTextContent(options[0].text);

      if (!correctAnswerText) {
        return 'Correct answer should not be empty!';
      }
    } else {
      const isCorrectOptions = options.filter((option: any) => option.isCorrect);

      if (isCorrectOptions.length === 0) {
        return 'At least one option should be marked as correct!';
      }
    }
  }

  function setCorrectOption(optionId: number, ev: { target: { checked: boolean } }) {
    const newOptions = options.map((option: any) => ({
      ...option,
      isCorrect: option.optionId === optionId ? ev.target.checked : option.isCorrect,
    }));

    setValue('options', newOptions);
  }

  function addOption() {
    append(getEmptyOption());
    setFocusOnLastOption(true);
  }

  function removeOption(idx: number) {
    if (options.length === 2) {
      showAlert({
        message: 'At least 2 options are required!',
        type: 'error',
      });

      return;
    }

    remove(idx);
  }

  function onTabChange(value: string) {
    if (isWithoutOptions && options[0].isCorrect) {
    } else if (!options.some((option: any) => option.isCorrect)) {
      showAlert({
        message: 'At least one option should be marked as correct!',
        type: 'error',
      });

      return;
    }

    setOptionType(value);
  }

  function isValidQuestion(question: any) {
    const questionText = getCleanText(question.text);

    if (!questionText) {
      return false;
    }

    const options = question.options;

    if (options.length === 1 && options[0].isCorrect) {
      return !!getTextContent(options[0].text);
    }

    const isCorrectOptions = options.filter((option: any) => option.isCorrect);

    if (isCorrectOptions.length === 0) {
      return false;
    }

    return options.every((option: any) => !!getTextContent(option.text));
  }

  const data = watch();

  return (
    <Card className="secondaryCard slideDown shadow-sm max-w-[800px] mx-auto border">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-4">
          <span className="text-sm font-bold">Points:</span>
          <FormInput
            name="points"
            id="points"
            rules={{
              required: 'Required',
              validate: (value: number) => (value && value > 0) || 'Must be greater than 0',
            }}
            className="w-[75px]"
            type="number"
            placeholder="Points"
            variant="filled"
            size="sm"
            radius="sm"
            control={control}
          />
        </div>
        <FormTextArea
          name="text"
          rules={{
            required: 'The question text should not be empty!',
            validate: (value: string) => !!getTextContent(value) || 'The question text should not be empty!',
          }}
          label={
            <span className="font-bold mb-3 block">
              Question text <MarkDownLogo />
            </span>
          }
          size="md"
          className="resize-vertical w-full"
          control={control}
          autoFocus
          isRichText
        />
        <Tabs defaultValue={optionType} onValueChange={onTabChange} className="pt-6">
          <TabsList>
            <TabsTrigger value="withOptions">With Options</TabsTrigger>
            <TabsTrigger value="withoutOptions">Without Options</TabsTrigger>
          </TabsList>
          <TabsContent value="withOptions">
            {fields.map((item: any, idx: number) => (
              <div className="flex items-start gap-3 pt-4 pb-4" key={options[idx].optionId}>
                <Checkbox
                  checked={options[idx].isCorrect}
                  onCheckedChange={(ev: any) => setCorrectOption(options[idx].optionId, { target: { checked: ev } })}
                />
                <FormTextArea
                  name={`options[${idx}].text`}
                  rules={{
                    required: 'Option should not be empty!',
                    validate: (value: string) => !!getImageOrTextContent(value) || 'Option should not be empty!',
                  }}
                  label={
                    <span className="font-bold mb-3 block">
                      Option {idx + 1} <MarkDownLogo />
                    </span>
                  }
                  className="max-w-full w-[calc(100%-70px)] mr-2.5 mb-2.5"
                  control={control}
                  isRichText
                  autoFocus={idx === fields.length - 1 && focusOnLastOption}
                />
                <Button variant="ghost" size="icon" className="mb-2" onClick={() => removeOption(idx)}>
                  <Icon width="20" name="trash" />
                </Button>
              </div>
            ))}
            <Button variant="default" id="addOptionBtn" onClick={addOption} className="mt-3">
              <Icon name="plus" width={18} className="mr-2" />
              Add option
            </Button>
          </TabsContent>
          <TabsContent value="withoutOptions">
            {fields.map((item: any, idx: number) => (
              <FormTextArea
                name={`options[${idx}].text`}
                key={item.id}
                rules={{
                  required: 'The correct answer should not be empty!',
                  validate: (value: string) =>
                    !!getImageOrTextContent(value) || 'The correct answer should not be empty!',
                }}
                label={
                  <span className="font-bold mt-4 mb-3 block">
                    Correct answer <MarkDownLogo />
                  </span>
                }
                control={control}
                className="max-w-full w-[calc(100%-70px)] mr-2.5 mb-2.5"
                isRichText
                autoFocus
              />
            ))}
          </TabsContent>
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
    <Icon name="markdown" width="20" className="align-middle" />
  </a>
);

export default forwardRef(QuestionEdit);
