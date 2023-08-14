import React from 'react';
import { Button, FileButton, MantineSize } from '@mantine/core';
import Icon from '../Icon';
import { importQuizzes } from '../../helpers/importExport';

function ImportQuizzesButton({ size = 'sm' }: { size?: MantineSize }): JSX.Element {
  return (
    <FileButton onChange={(files) => importQuizzes(files)} accept="text/csv" multiple>
      {(props) => (
        <Button {...props} size={size} leftIcon={<Icon color="white" width="16" name="download" />}>
          Import Quizzes
        </Button>
      )}
    </FileButton>
  );
}

export default ImportQuizzesButton;
