'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type LayoutProps = {
  children: ReactNode;
  withTransparentFooter?: boolean;
};

export default function Layout({ children, withTransparentFooter }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer transparent={withTransparentFooter} />
    </div>
  );
}
