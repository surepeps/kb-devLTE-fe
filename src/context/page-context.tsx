/** @format */
'use client';
import { GlobalContextTypes } from '@/types';
import { createContext, useContext, useState } from 'react';

/** @format */
const PageContext = createContext<GlobalContextTypes | undefined>(undefined);

export const PageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isContactUsClicked, setIsContactUsClicked] = useState<boolean>(false);

  return (
    <PageContext.Provider value={{ isContactUsClicked, setIsContactUsClicked }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('');
  }
  return context;
};
