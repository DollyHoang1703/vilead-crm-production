import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[10px] border border-[#e6ebf1] bg-white px-3 py-2 text-sm text-[#455560] ring-offset-background transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#455560] placeholder:text-[rgba(114,132,154,0.4)] hover:border-[#699dff] focus-visible:outline-none focus-visible:border-[#3e79f7] focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f7f7f8]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
