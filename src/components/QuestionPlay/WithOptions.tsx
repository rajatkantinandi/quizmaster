import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';

interface Props {
  setSelectedChoices: (choices: number[]) => void;
  selectedOptionIds: number[] | null;
  options: IOption[];
  selectedChoices: number[] | null;
  isAttempted: boolean;
  isTimerRunning: boolean;
}

export default function WithOptions({
  options,
  setSelectedChoices,
  selectedOptionIds,
  selectedChoices,
  isAttempted,
  isTimerRunning,
}: Props) {
  function getChoiceClass(option: IOption) {
    if (!isAttempted || !selectedOptionIds) return '';
    if (selectedOptionIds.includes(option.optionId)) {
      return option.isCorrect
        ? 'data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700 data-[state=checked]:text-white'
        : 'data-[state=checked]:bg-red-700 data-[state=checked]:border-red-700 data-[state=checked]:text-white';
    }
    return option.isCorrect ? 'bg-red-200 border-red-500 dark:bg-red-950' : '';
  }

  return (
    <>
      <div
        className={cn(
          'grid items-start gap-x-4 gap-y-2',
          isAttempted ? 'grid-cols-[auto_auto_minmax(0,1fr)]' : 'grid-cols-[auto_minmax(0,1fr)]',
        )}
      >
        {isAttempted && <h6 className="mb-3 mt-4 text-base font-semibold">ANSWER</h6>}
        <h6 className="mb-3 mt-4 text-base font-semibold">{isAttempted ? 'ME' : 'OPTIONS'}</h6>
        <span />
        {options.map((option, index) => (
          <React.Fragment key={option.optionId}>
            {isAttempted && (
              <div className="flex justify-center py-0.5">
                {option.isCorrect && (
                  <Checkbox
                    checked
                    aria-label={`Correct answer ${index + 1}`}
                    className="pointer-events-none data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700 data-[state=checked]:text-white"
                    tabIndex={-1}
                  />
                )}
              </div>
            )}
            <Checkbox
              id={`option-${option.optionId}`}
              checked={selectedChoices?.includes(option.optionId) ?? false}
              onCheckedChange={(checked) => {
                setSelectedChoices(
                  checked
                    ? [...(selectedChoices || []), option.optionId]
                    : (selectedChoices || []).filter((id) => id !== option.optionId),
                );
              }}
              disabled={isAttempted || !isTimerRunning}
              className={cn('my-0.5', getChoiceClass(option))}
            />
            <label htmlFor={`option-${option.optionId}`} className="cursor-pointer">
              <SanitizedHtml>{option.text}</SanitizedHtml>
            </label>
          </React.Fragment>
        ))}
      </div>
      {!isAttempted && isTimerRunning && (
        <Button
          variant="filled"
          color="green"
          className="mt-5"
          onClick={() => document.getElementById('btnSubmitResponse')?.click()}
        >
          Submit
        </Button>
      )}
    </>
  );
}
