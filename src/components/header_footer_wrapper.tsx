"use client";

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import HeaderLogic from '@/logic/headerLogic';
import Footer from './footer';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function HeaderFooterWrapper({ children }: Props) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  return (
    <Fragment>
      {!isAdminRoute && <HeaderLogic />}
      {children}
      {!isAdminRoute && <Footer />}
    </Fragment>
  );
}