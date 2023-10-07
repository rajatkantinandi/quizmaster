import React from 'react';
import { Affix, Button } from '@mantine/core';
import Icon from '../../components/Icon';
import { useNavigate } from 'react-router';

type Props = {
  userName: string;
  isFloating?: boolean;
};

function CreateQuizButton({ userName, isFloating = false }: Props): JSX.Element {
  const navigate = useNavigate();

  const Btn = (
    <Button
      size={isFloating ? 'xl' : 'lg'}
      onClick={() => navigate(`/configure-quiz/${userName}`)}
      variant="filled"
      sx={(theme) => ({ boxShadow: isFloating ? theme.shadows.lg : theme.shadows.sm })}
      radius="xl"
      leftIcon={<Icon name="plus" color="#ffffff" width={20} height={20} />}>
      Create Quiz
    </Button>
  );

  if (isFloating) {
    return <Affix position={{ bottom: 30, right: 30 }}>{Btn}</Affix>;
  }

  return Btn;
}

export default CreateQuizButton;
