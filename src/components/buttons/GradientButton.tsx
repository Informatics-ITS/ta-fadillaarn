'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type GradientButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function GradientButton({ href, children }: GradientButtonProps) {
  return (
    <Link
      href={href}
      className='inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-105'
    >
      {children}
      <ArrowRight className='h-4 w-4' />
    </Link>
  );
}
