/** @format */
'use client';
import { ReactNode } from 'react';
import { PageContextProvider } from '@/context/page-context';

export default function TestingLayout({ children }: { children: ReactNode }) {
  return (
    <PageContextProvider>
      {children}
    </PageContextProvider>
  );
}
