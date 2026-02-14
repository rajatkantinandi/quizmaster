import React from 'react';
import { Button } from '@/components/ui/button';

interface UndoButtonProps {
  onClick: () => void;
  time: number;
}

export default function UndoButton({ onClick, time }: UndoButtonProps) {
  return (
    <Button onClick={onClick} variant="default-button" className="relative">
      <span className="absolute left-3 top-1">{5 - time}</span>
      <svg className="absolute -top-0.5 -left-0.5 w-10 h-10 [transform:rotateY(-180deg)_rotateZ(-90deg)] [transform-origin:center] scale-60">
        <circle r="18" cx="20" cy="20"></circle>
      </svg>
      <span className="ml-6">Undo</span>
    </Button>
  );
}
