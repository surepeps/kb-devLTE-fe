/** @format */
'use client';
import { ReactNode } from 'react';
import { EditBriefProvider } from '@/context/admin-context/brief-management/edit-brief';

export default function TestingLayout({ children }: { children: ReactNode }) {
  return <EditBriefProvider>{children}</EditBriefProvider>;
}
