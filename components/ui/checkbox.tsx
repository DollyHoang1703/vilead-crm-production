'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-[18px] w-[18px] shrink-0 rounded-[10px] border border-[#e6ebf1] bg-white ring-offset-background transition-all duration-300 hover:border-[#3e79f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f7f7f8] data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7] data-[state=checked]:text-white',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
