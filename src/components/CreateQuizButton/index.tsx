import React from 'react';
import { Button } from '@/components/ui/button';
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
      className={isFloating ? 'shadow-lg' : 'shadow-sm'}
      radius="xl"
      leftIcon={<Icon name="plus" color="#ffffff" width={20} height={20} />}
    >
      Create Quiz
    </Button>
  );

  if (isFloating) {
    return <div className="fixed bottom-8 right-8">{Btn}</div>;
  }

  return Btn;
}

export default CreateQuizButton;
