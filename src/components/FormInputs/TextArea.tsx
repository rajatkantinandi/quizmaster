import { Text, Textarea, TextareaProps } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';
import { Control, Controller, UseControllerProps } from 'react-hook-form';
import ContentEditable from './ContentEditable';

type Props = TextareaProps & {
  rules: UseControllerProps['rules'];
  control: Control<any, any>;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  autoFocus?: boolean;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isRichText?: boolean;
};

export default function FormTextArea({
  control,
  name,
  rules,
  label,
  autoFocus = false,
  size,
  className,
  disabled,
  isRichText,
  ...rest
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={classNames('grow', className)}>
          {isRichText ? (
            <ContentEditable
              onChange={onChange}
              value={value}
              label={label}
              autofocus={autoFocus}
              size={size}
              disabled={disabled}
            />
          ) : (
            <Textarea
              onChange={onChange}
              label={label}
              value={value}
              size={size}
              autoFocus={autoFocus}
              disabled={disabled}
              {...rest}
            />
          )}
          {error && !!error.message && <Text className="errorText">⚠ {error.message}</Text>}
        </div>
      )}
    />
  );
}
