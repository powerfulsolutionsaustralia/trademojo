'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'mojo' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30':
              variant === 'primary',
            'bg-secondary text-white hover:bg-secondary/90':
              variant === 'secondary',
            'bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/25':
              variant === 'accent',
            'bg-mojo text-white hover:bg-mojo-dark shadow-lg shadow-mojo/25':
              variant === 'mojo',
            'border-2 border-border text-foreground hover:border-primary hover:text-primary':
              variant === 'outline',
            'text-foreground hover:bg-border/50': variant === 'ghost',
          },
          {
            'text-sm px-4 py-2': size === 'sm',
            'text-base px-6 py-3': size === 'md',
            'text-lg px-8 py-4': size === 'lg',
            'text-xl px-10 py-5': size === 'xl',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
