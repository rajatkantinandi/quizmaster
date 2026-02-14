import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Option as IOption } from '../../types';
import SanitizedHtml from '../SanitizedHtml';

interface Props {
  setSelectedChoices: Function;
  selectedOptionIds: number[] | null;
  options: IOption[];
  selectedChoices: number[] | null;
  isAttempted: boolean;
  isTimerRunning: Boolean;
}

export default function WithOptions({
  options,
  setSelectedChoices,
  selectedOptionIds,
  selectedChoices,
  isAttempted,
  isTimerRunning,
}: Props) {
  const inputClass = (option: IOption) => {
    if (selectedOptionIds && option.isCorrect && !selectedOptionIds.includes(option.optionId)) {
      return 'bg-red-200 border-red-500';
    }
    return '';
  };

  return (
    <>
      <div className="flex items-start gap-4">
        {isAttempted && (
          <div className="flex flex-col gap-2">
            <h6 className="text-base font-semibold my-4">ANSWER</h6>
            {options.map((x, idx) =>
              x.isCorrect ? (
                <Checkbox
                  key={x.optionId}
                  checked
                  className="justify-center"
                  style={{ pointerEvents: 'none' }}
                  tabIndex={-1}
                />
              ) : (
                <div style={{ width: '24px', height: '24px' }} key={`empty_${idx}`}></div>
              ),
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h6 className="text-base font-semibold my-4">{isAttempted ? 'ME' : 'OPTIONS'}</h6>
          {options.map((option) => (
            <div key={option.optionId} className="flex items-center gap-2">
              <Checkbox
                id={`option-${option.optionId}`}
                checked={selectedChoices?.includes(option.optionId)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedChoices([...(selectedChoices || []), option.optionId]);
                  } else {
                    setSelectedChoices((selectedChoices || []).filter((id) => id !== option.optionId));
                  }
                }}
                disabled={isAttempted || !isTimerRunning}
                className={inputClass(option)}
              />
              <label htmlFor={`option-${option.optionId}`} className="flex-1 cursor-pointer">
                <SanitizedHtml>{option.text}</SanitizedHtml>
              </label>
            </div>
          ))}
        </div>
      </div>
      {!isAttempted && isTimerRunning && (
        <Button variant="green" className="mt-4" onClick={() => document.getElementById('btnSubmitResponse')?.click()}>
          Submit
        </Button>
      )}
    </>
  );
}
