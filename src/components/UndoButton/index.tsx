import React from 'react';
import { Button } from '@/components/ui/button';

interface UndoButtonProps {
  onClick: () => void;
  time: number;
}

export default function UndoButton({ onClick, time }: UndoButtonProps) {
  return (
    <Button onClick={onClick} variant="default" className="gap-2">
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span>{5 - time}</span>
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
          <circle
            r="18"
            cx="20"
            cy="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="113"
            strokeDashoffset={(113 * time) / 5}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
      </span>
      Undo
    </Button>
  );
}
