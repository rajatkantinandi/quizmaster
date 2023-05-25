import React from 'react';
import { TextareaProps } from '@mantine/core';
import { Control, Controller, UseControllerProps } from 'react-hook-form';
import ContentEditable from './ContentEditable';

interface Props extends TextareaProps {
  rules: UseControllerProps['rules'];
  errorMessage: string;
  control: Control<any, any>;
  name: string;
}

export default function FormTextArea({ errorMessage, control, name, rules, label, autoFocus, ...rest }: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <ContentEditable onChange={onChange} value={value} label={label} autofocus={autoFocus} />
      )}
    />
  );
}
