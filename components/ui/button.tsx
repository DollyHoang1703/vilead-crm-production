import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-omi-ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#3e79f7] text-white border border-[#3e79f7] rounded-[10px] hover:bg-[#699dff] hover:border-[#699dff] active:bg-[#2a59d1] active:border-[#2a59d1]',
        destructive:
          'bg-[#ff6b72] text-white border border-[#ff6b72] rounded-[10px] hover:bg-[#ff9496] hover:border-[#ff9496] active:bg-[#d9505c] active:border-[#d9505c]',
        outline:
          'border border-[#e6ebf1] bg-white text-[#455560] rounded-[10px] hover:bg-[#f0f7ff] hover:border-[#699dff] hover:text-[#699dff] active:border-[#2a59d1] active:text-[#2a59d1]',
        secondary:
          'bg-[#f7f7f8] text-[#455560] border border-transparent rounded-[10px] hover:bg-[#e6ebf1]',
        ghost:
          'text-[#455560] hover:bg-[#fafafb] rounded-[10px]',
        link: 'text-[#3e79f7] underline-offset-4 hover:underline hover:text-[#2a59d1]',
        success:
          'bg-[#2dc56a] text-white border border-[#2dc56a] rounded-[10px] hover:bg-[#04d182] hover:border-[#04d182]',
        warning:
          'bg-[#ffc542] text-white border border-[#ffc542] rounded-[10px] hover:bg-[#ffd86b] hover:border-[#ffd86b]',
      },
      size: {
        default: 'h-10 px-4 py-[8.5px]',
        sm: 'h-9 px-3 py-[9px] text-[13px]',
        lg: 'h-10 px-5 py-[8.5px]',
        icon: 'h-8 w-8 p-0 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
