/** @format */
'use client';
import { ReactNode } from 'react';
import { EditBriefProvider } from '@/context/admin-context/brief-management/edit-brief';
import { PageContextProvider } from '@/context/page-context';

export default function TestingLayout({ children }: { children: ReactNode }) {
  return (
    <PageContextProvider>
      <EditBriefProvider>{children}</EditBriefProvider>
    </PageContextProvider>
  );
}
