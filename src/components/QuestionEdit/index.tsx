import { useMemo, useState, forwardRef } from 'react';
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
  const draftQuestion = useMemo(() => JSON.parse(JSON.stringify(question)), [question]);
  const { handleSubmit, setValue, watch, control } = useForm({
    defaultValues: {
      ...draftQuestion,
      options: draftQuestion.options.length > 0 ? draftQuestion.options : getEmptyOptions(2),
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
    <Card className="w-full max-w-none border bg-[var(--secondary-card-bg)] p-6 shadow-sm [transform:scaleY(0)] opacity-0 [transform-origin:50%_0%] animate-[slidedown_0.2s_forwards_ease-out]">
      <form onSubmit={handleSubmit(onFormSubmit)} ref={ref}>
        <div className="mb-5 flex items-center gap-8">
          <h4 className="text-lg font-bold">Question {questionNum}</h4>
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold">Points:</div>
            <FormInput
              name="points"
              id="points"
              rules={{
                required: 'Required',
                validate: (value: number) => (value && value > 0) || 'Must be greater than 0',
              }}
              className="w-[110px]"
              type="number"
              placeholder="Points"
              variant="filled"
              size="sm"
              radius="sm"
              control={control}
            />
          </div>
        </div>
        <FormTextArea
          name="text"
          rules={{
            required: 'The question text should not be empty!',
            validate: (value: string) => !!getTextContent(value) || 'The question text should not be empty!',
          }}
          label={
            <span className="font-bold mb-3 flex gap-2 items-center">
              Question text <MarkDownLogo />
            </span>
          }
          size="md"
          className="w-full"
          control={control}
          autoFocus
          isRichText
        />
        <Tabs defaultValue={optionType} onValueChange={onTabChange} className="pt-6">
          <TabsList className="w-fit">
            <TabsTrigger value="withOptions">With Options</TabsTrigger>
            <TabsTrigger value="withoutOptions">Without Options</TabsTrigger>
          </TabsList>
          <TabsContent value="withOptions" className="mt-6">
            {fields.map((item: any, idx: number) => (
              <div className="flex items-start gap-4 py-3" key={options[idx].optionId}>
                <Checkbox
                  checked={options[idx].isCorrect}
                  className="mt-[54px] h-8 w-8 rounded-[8px]"
                  onCheckedChange={(ev: any) => setCorrectOption(options[idx].optionId, { target: { checked: ev } })}
                />
                <FormTextArea
                  name={`options[${idx}].text`}
                  rules={{
                    required: 'Option should not be empty!',
                    validate: (value: string) => !!getImageOrTextContent(value) || 'Option should not be empty!',
                  }}
                  label={
                    <span className="font-bold mb-3 flex gap-2 items-center">
                      Option {idx + 1} <MarkDownLogo />
                    </span>
                  }
                  className="max-w-full w-[calc(100%-70px)] mr-2.5 mb-2.5"
                  control={control}
                  isRichText
                  autoFocus={idx === fields.length - 1 && focusOnLastOption}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mb-2 mt-[54px]"
                  onClick={() => removeOption(idx)}>
                  <Icon width="20" name="trash" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="default" id="addOptionBtn" onClick={addOption} className="mt-3 rounded-xl">
              <Icon name="plus" width={18} className="mr-2" />
              Add option
            </Button>
          </TabsContent>
          <TabsContent value="withoutOptions" className="mt-6">
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
                  <span className="font-bold mb-3 flex gap-2 items-center">
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
