import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { useId } from 'react';
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
  id,
  ref: inputRef,
  variant,
  size,
  radius,
  onChange: onChangeProp,
  ...rest
}: Props) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <Controller
      name={name || ''}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <div className={cn('flex-1', className)}>
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium mb-1 block">
              {label}
            </label>
          )}
          <Input
            {...rest}
            id={inputId}
            name={name}
            ref={(element) => {
              ref(element);
              if (typeof inputRef === 'function') {
                inputRef(element);
              } else if (inputRef) {
                inputRef.current = element;
              }
            }}
            onBlur={onBlur}
            size={typeof size === 'number' ? size : undefined}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            onChange={(ev: any) => {
              onChangeProp?.(ev);
              onChange(ev);
            }}
            value={value ?? ''}
            autoFocus={autoFocus}
            disabled={disabled}
          />
          {error && !!error.message && (
            <p
              id={`${inputId}-error`}
              className="mt-1 rounded-b-[10px] bg-background px-2.5 py-[5px] text-sm text-incorrect-color"
            >
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
