import React from 'react';
import { Button } from '@mantine/core';
import Icon from '../../components/Icon';
import { useNavigate } from 'react-router';

type Props = {
  userName: string;
  isFloating?: boolean;
};

function CreateQuizButton({ userName, isFloating = false }: Props): JSX.Element {
  const navigate = useNavigate();

  return (
    <Button
      size={isFloating ? 'xl' : 'lg'}
      onClick={() => navigate(`/configure-quiz/${userName}`)}
      variant="filled"
      sx={(theme) => ({
        boxShadow: theme.shadows.sm,
        ...(isFloating
          ? {
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              boxShadow: '2px 2px 12px -2px var(--shadow-color-dark)',
            }
          : {}),
      })}
      radius="xl"
      leftIcon={<Icon name="plus" color="#ffffff" width={20} height={20} />}>
      Create Quiz
    </Button>
  );
}

export default CreateQuizButton;
