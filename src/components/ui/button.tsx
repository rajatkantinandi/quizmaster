import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg border text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        filled: 'border-transparent bg-primary text-white hover:bg-primary-hover',
        default: 'border-transparent bg-default-button text-gray-900 hover:bg-default-button-hover',
        outline: 'bg-transparent text-primary border-primary hover:bg-primary/10',
        light: 'border-transparent bg-transparent text-primary hover:bg-primary/10',
        subtle: 'border-transparent bg-transparent text-primary p-1 hover:bg-transparent',
        ghost: 'border-transparent bg-transparent text-primary hover:bg-primary/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        xl: 'h-14 rounded-full px-10 text-base',
        icon: 'h-10 w-10',
      },
      color: {
        default: '',
        dark: '',
        red: '',
        green: '',
        pink: '',
        teal: '',
      },
    },
    compoundVariants: [
      { variant: 'filled', color: 'dark', className: 'bg-gray-700 hover:bg-gray-800 text-white' },
      {
        variant: 'outline',
        color: 'dark',
        className:
          'text-gray-700 border-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-400 dark:hover:bg-gray-800/30',
      },
      {
        variant: 'light',
        color: 'dark',
        className: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/30',
      },
      {
        variant: 'ghost',
        color: 'dark',
        className: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/30',
      },
      { variant: 'filled', color: 'red', className: 'bg-incorrect-color hover:opacity-90 text-white' },
      { variant: 'outline', color: 'red', className: 'text-incorrect-color border-incorrect-color hover:bg-red-50' },
      { variant: 'light', color: 'red', className: 'text-incorrect-color hover:bg-red-50' },
      { variant: 'ghost', color: 'red', className: 'text-incorrect-color hover:bg-red-50' },
      { variant: 'filled', color: 'green', className: 'bg-correct-color hover:opacity-90 text-white' },
      { variant: 'outline', color: 'green', className: 'text-correct-color border-correct-color hover:bg-green-50' },
      { variant: 'light', color: 'green', className: 'text-correct-color hover:bg-green-50' },
      { variant: 'ghost', color: 'green', className: 'text-correct-color hover:bg-green-50' },
      { variant: 'filled', color: 'pink', className: 'bg-quiz-pink hover:opacity-90 text-white' },
      { variant: 'outline', color: 'pink', className: 'text-quiz-pink border-quiz-pink hover:bg-pink-50' },
      { variant: 'light', color: 'pink', className: 'text-quiz-pink hover:bg-pink-50' },
      { variant: 'ghost', color: 'pink', className: 'text-quiz-pink hover:bg-pink-50' },
      { variant: 'filled', color: 'teal', className: 'bg-primary hover:bg-primary-hover text-white' },
      { variant: 'outline', color: 'teal', className: 'text-primary border-primary hover:bg-primary/10' },
      { variant: 'light', color: 'teal', className: 'text-primary hover:bg-primary/10' },
      { variant: 'ghost', color: 'teal', className: 'text-primary hover:bg-primary/10' },
    ],
    defaultVariants: {
      variant: 'filled',
      size: 'default',
      color: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  radius?: string | number;
  color?: 'default' | 'dark' | 'red' | 'green' | 'pink' | 'teal';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, asChild = false, leftIcon, radius, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const radiusStyle = radius ? { borderRadius: radius as string } : {};
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, color, className }))}
        ref={ref}
        style={{ ...radiusStyle, ...style }}
        {...props}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button };
