import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React, { useId } from 'react';
import { Control, Controller, UseControllerProps } from 'react-hook-form';
import ContentEditable from './ContentEditable';

type Props = {
  rules?: UseControllerProps['rules'];
  control?: Control<any, any>;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  autoFocus?: boolean;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isRichText?: boolean;
  [key: string]: any;
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
  id,
  minRows,
  variant,
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
          {isRichText ? (
            <ContentEditable
              id={inputId}
              onChange={onChange}
              value={value}
              label={label}
              autofocus={autoFocus}
              size={size}
              disabled={disabled}
            />
          ) : (
            <>
              {label && (
                <label htmlFor={inputId} className="text-sm font-medium mb-1 block">
                  {label}
                </label>
              )}
              <Textarea
                {...rest}
                id={inputId}
                name={name}
                ref={ref}
                onBlur={onBlur}
                onChange={(event) => {
                  onChange(event);
                  onChangeProp?.(event);
                }}
                value={value ?? ''}
                rows={minRows}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                autoFocus={autoFocus}
                disabled={disabled}
              />
            </>
          )}
          {error && !!error.message && (
            <p id={`${inputId}-error`} className="errorText text-red-500 text-sm mt-1">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
