import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';
import { Control, Controller, UseControllerProps } from 'react-hook-form';

type Props = {
  rules?: UseControllerProps['rules'];
  control?: Control<any, any>;
  name?: string;
  autoFocus?: boolean;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isRichText?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  [key: string]: any;
};

export default function FormInput({
  control,
  name,
  rules,
  label,
  autoFocus = false,
  className,
  disabled,
  isRichText,
  onChange: onChangeProp,
  ...rest
}: Props) {
  return (
    <Controller
      name={name || ''}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={cn('flex-1', className)}>
          {label && <label className="text-sm font-medium mb-1 block">{label}</label>}
          <Input
            onChange={(ev: any) => {
              onChangeProp?.(ev);
              onChange(ev);
            }}
            value={value ?? ''}
            autoFocus={autoFocus}
            disabled={disabled}
            {...rest}
          />
          {error && !!error.message && <p className="errorText text-red-500 text-sm mt-1">⚠ {error.message}</p>}
        </div>
      )}
    />
  );
}
