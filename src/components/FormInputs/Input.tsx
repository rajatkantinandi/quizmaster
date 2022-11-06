import React from 'react';
import { TextInput, TextInputProps } from '@mantine/core';

interface Props extends TextInputProps {
  rules: object;
  errorMessage: string;
  register?: any;
}

export default function Input({ errorMessage, register, name, rules, ...rest }: Props) {
  return (
    <TextInput
      {...rest}
      {...register(name, rules)}
      error={errorMessage ? <span className="absolute">{errorMessage}</span> : false}
    />
  );
}
