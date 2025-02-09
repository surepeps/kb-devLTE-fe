/** @format */
'use client';
import { usePageContext } from '@/context/page-context';
import React, { ReactNode } from 'react';

const Body = ({ children }: { children: ReactNode }) => {
  const { isContactUsClicked, isModalOpened, viewImage } = usePageContext();
  return (
    <section
      className={`${
        (isContactUsClicked || isModalOpened || viewImage) &&
        'filter brightness-[30%] bg-[#EEF1F1] transition-all duration-500 overflow-hidden'
      } w-[100%]`}>
      {children}
    </section>
  );
};

export default Body;
