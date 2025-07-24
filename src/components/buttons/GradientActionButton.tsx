'use client';

import { cn } from '@/lib/utils';

type GradientActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function GradientActionButton({
  children,
  className,
  ...props
}: GradientActionButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
