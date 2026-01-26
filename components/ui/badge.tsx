import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(62,121,247,0.2)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-[rgba(62,121,247,0.15)] text-[#3e79f7]',
        secondary:
          'bg-[#f5f0fa] text-[#a461d8]',
        destructive:
          'bg-[rgba(255,107,114,0.15)] text-[#ff6b72]',
        success:
          'bg-[rgba(45,197,106,0.15)] text-[#2dc56a]',
        warning:
          'bg-[rgba(255,197,66,0.15)] text-[#ffc542]',
        info:
          'bg-[rgba(62,121,247,0.15)] text-[#3e79f7]',
        outline:
          'border border-[#e6ebf1] text-[#455560] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
