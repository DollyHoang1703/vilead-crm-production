import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-[10px] border border-[#e6ebf1] bg-white px-3 py-2 text-sm text-[#455560] ring-offset-background transition-all duration-300 placeholder:text-[rgba(114,132,154,0.4)] hover:border-[#699dff] focus-visible:outline-none focus-visible:border-[#3e79f7] focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f7f7f8] resize-y',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
