import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '../Icon';
import { importQuizzes } from '../../helpers/importExport';
import { cn } from '@/lib/utils';

function ImportQuizzesButton({
  size = 'default',
  radius = 'md',
  className,
}: {
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'icon';
  radius?: string;
  className?: string;
}): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      importQuizzes(Array.from(e.target.files));
    }
  };
  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="text/csv,application/json"
        multiple
        style={{ display: 'none' }}
      />
      <Button
        size={size}
        onClick={handleClick}
        className={cn(`bg-lime-700 hover:bg-lime-800`, className)}
        leftIcon={<Icon color="white" width={18} height={18} name="download" />}
        radius={radius}>
        Import Quizzes
      </Button>
    </>
  );
}

export default ImportQuizzesButton;
