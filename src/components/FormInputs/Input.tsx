import { Text, TextInput, TextInputProps } from '@mantine/core';
import classNames from 'classnames';
import React from 'react';
import { Control, Controller, UseControllerProps } from 'react-hook-form';

type Props = TextInputProps & {
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

export default function Input({
  control,
  name,
  rules,
  label,
  autoFocus = false,
  size,
  className,
  disabled,
  isRichText,
  onChange: onChangeProp,
  ...rest
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={classNames('grow', className)}>
          <TextInput
            onChange={(ev) => {
              onChangeProp?.(ev);

              onChange(ev);
            }}
            label={label}
            value={value}
            size={size}
            autoFocus={autoFocus}
            disabled={disabled}
            {...rest}
          />
          {error && !!error.message && <Text className="errorText">⚠ {error.message}</Text>}
        </div>
      )}
    />
  );
}
