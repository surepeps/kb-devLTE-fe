/** @format */
'use client';
import { usePageContext } from '@/context/page-context';
import React, { Fragment, ReactNode } from 'react';
import SubmitPopUp from './submit';
import OnUpgradeNotification from './settings-components/on-ugrade-notification';
//import SubmitPopUp from './submit';

const Body = ({ children }: { children: ReactNode }) => {
  const {
    isContactUsClicked,
    isModalOpened,
    viewImage,
    isSubmittedSuccessfully,
    settings,
  } = usePageContext();
  return (
    <Fragment>
      <section
        className={`${
          (isContactUsClicked ||
            isModalOpened ||
            viewImage ||
            isSubmittedSuccessfully ||
            settings.isUpgradeButtonClicked) &&
          'filter brightness-[30%] bg-[#EEF1F1] transition-all duration-500 overflow-hidden'
        } w-[100%]`}>
        {children}
      </section>
      {isSubmittedSuccessfully && <SubmitPopUp />}
      {settings.isUpgradeButtonClicked && <OnUpgradeNotification />}
    </Fragment>
  );
};

export default Body;
