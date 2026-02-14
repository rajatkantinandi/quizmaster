import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '../Icon';
import { importQuizzes } from '../../helpers/importExport';

function ImportQuizzesButton({
  size = 'sm',
  radius = 'md',
}: {
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'icon';
  radius?: string;
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
        className="bg-lime-700 hover:bg-lime-800"
        leftIcon={<Icon color="white" width="16" name="download" />}
        radius={radius}>
        Import Quizzes
      </Button>
    </>
  );
}

export default ImportQuizzesButton;
