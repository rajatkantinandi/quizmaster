import React from 'react';
import { Button } from '@/components/ui/button';
import { plural } from '../../helpers/textHelpers';
import { QuizzesSelectorState } from '../../stores/appStore';

function QuizSelectorBanner({ show, message, selectedQuizzes, onNextClick, onCancelClick }: QuizzesSelectorState) {
  if (!show) return null;

  return (
    <div
      className="fixed top-[70px] left-1/2 -translate-x-1/2 w-[600px] bg-primary text-white p-4 rounded-lg shadow-xl z-50"
      style={{ backgroundColor: 'var(--qm-primary)' }}
    >
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg">{message}</span>
          {selectedQuizzes.length > 0 ? (
            <span className="ml-2 text-xs font-bold">
              {plural(selectedQuizzes.length, ' (%count quiz selected)', ' (%count quizzes selected)')}
            </span>
          ) : (
            ''
          )}
        </div>
        <div className="flex gap-2">
          {!!onNextClick && (
            <Button
              variant="light"
              size="sm"
              disabled={selectedQuizzes.length === 0}
              onClick={() => onNextClick(selectedQuizzes)}
            >
              Next
            </Button>
          )}
          {!!onCancelClick && (
            <Button variant="light" size="sm" onClick={() => onCancelClick()}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizSelectorBanner;
