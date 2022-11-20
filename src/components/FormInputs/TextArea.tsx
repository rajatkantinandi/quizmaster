import React from 'react';
import { Textarea, TextareaProps } from '@mantine/core';

interface Props extends TextareaProps {
  rules: object;
  errorMessage: string;
  register?: any;
}

export default function TextArea({ errorMessage, register, name, rules, ...rest }: Props) {
  return (
    <Textarea
      {...rest}
      {...register(name, rules)}
      error={errorMessage ? <span className="absolute">{errorMessage}</span> : false}
    />
  );
}
