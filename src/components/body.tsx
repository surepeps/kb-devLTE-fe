/** @format */
'use client';
import { usePageContext } from '@/context/page-context';
import React, { Fragment, ReactNode } from 'react';
import SubmitPopUp from './submit';
import OnUpgradeNotification from './settings-components/on-ugrade-notification';
import ApproveBriefs from './admincomponents/approveBriefs';
import RejectBriefs from './admincomponents/rejectBriefs';
import DeleteBriefs from './admincomponents/deleteBriefs';
//import SubmitPopUp from './submit';

const Body = ({ children }: { children: ReactNode }) => {
  const {
    isContactUsClicked,
    isModalOpened,
    viewImage,
    isSubmittedSuccessfully,
    settings,
    dashboard,
  } = usePageContext();
  return (
    <Fragment>
      <section
        className={`${
          (isContactUsClicked ||
            isModalOpened ||
            viewImage ||
            isSubmittedSuccessfully ||
            settings.isUpgradeButtonClicked ||
            dashboard.approveBriefsTable.isApproveClicked ||
            dashboard.approveBriefsTable.isDeleteClicked ||
            dashboard.approveBriefsTable.isRejectClicked) &&
          'filter brightness-[30%] bg-[#EEF1F1] transition-all duration-500 overflow-hidden'
        } w-[100%]`}>
        {children}
      </section>
      {isSubmittedSuccessfully && <SubmitPopUp />}
      {settings.isUpgradeButtonClicked && <OnUpgradeNotification />}
      {dashboard.approveBriefsTable.isApproveClicked && <ApproveBriefs />}
      {dashboard.approveBriefsTable.isRejectClicked && <RejectBriefs />}
      {dashboard.approveBriefsTable.isDeleteClicked && <DeleteBriefs />}
    </Fragment>
  );
};

export default Body;
