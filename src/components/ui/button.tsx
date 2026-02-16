import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-hover',
        destructive: 'bg-incorrect-color text-white hover:bg-red-600',
        outline: 'border border-primary bg-transparent text-primary hover:border-primary-hover',
        secondary: 'bg-qm-card text-primary hover:bg-qm-card/80 border border-qm-card-border',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        filled: 'bg-primary text-white hover:bg-primary-hover',
        light: 'bg-transparent text-primary hover:bg-primary/10',
        'default-button': 'bg-default-button text-gray-900 hover:bg-default-button-hover',
        green: 'bg-green-600 text-white hover:bg-green-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-full px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  radius?: string | number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, leftIcon, radius, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const radiusStyle = radius ? { borderRadius: radius as string } : {};
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
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
