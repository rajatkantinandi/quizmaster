/**
 *
 * Icon
 *
 */
import React from 'react';
import { Button } from '@mantine/core';
import Icon from '../../components/Icon';
import { useNavigate } from 'react-router';

function CreateQuizButton({ userName }): JSX.Element {
  const navigate = useNavigate();

  return (
    <Button
      size="lg"
      onClick={() => navigate(`/configure-quiz/${userName}`)}
      variant="filled"
      className="round"
      sx={(theme) => ({ boxShadow: theme.shadows.sm })}
      leftIcon={<Icon name="plus" color="#ffffff" />}>
      Create Quiz
    </Button>
  );
}

export default CreateQuizButton;
