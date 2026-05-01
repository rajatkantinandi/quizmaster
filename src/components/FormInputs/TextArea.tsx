import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React from 'react';
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
  ...rest
}: Props) {
  return (
    <Controller
      name={name || ''}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={cn('flex-1', className)}>
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
            <>
              {label && <label className="text-sm font-medium mb-1 block">{label}</label>}
              <Textarea onChange={onChange} value={value} autoFocus={autoFocus} disabled={disabled} {...rest} />
            </>
          )}
          {error && !!error.message && <p className="errorText text-red-500 text-sm mt-1">⚠ {error.message}</p>}
        </div>
      )}
    />
  );
}
