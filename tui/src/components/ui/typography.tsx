import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TypographyNativeElements = 'h1' | 'h2' | 'h3' | 'h4' | 'p';

export type TypographyProops = {
  className?: string;
  as?: TypographyNativeElements;
  variant?: TypographyNativeElements;
  children: ReactNode;
};

const styles = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7'
} as const satisfies Record<TypographyNativeElements, string>;

export function Typography({
  className,
  children,
  variant = 'p',
  as: As = variant
}: TypographyProops) {
  return <As className={cn(styles[variant], className)}>{children}</As>;
}
