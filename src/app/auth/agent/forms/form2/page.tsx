/** @format */
'use client';
import React, { useState } from 'react';
import { usePageContext } from '@/context/page-context';
import AgentNav from '@/components/agent_navbar';
import { AgentNavData } from '@/enums';
import { DataProps } from '@/types/agent_data_props';
import PropertyType from '@/components/propertyType';
import Overview from '@/components/overview';
import { briefData } from '@/data/sampleDataForAgent';
import TotalBrief from '@/components/totalBriefs';

const Form2 = () => {
  const { isContactUsClicked } = usePageContext();
  const { selectedNav } = usePageContext();

  /**TotalBrief */
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [detailsToCheck, setDetailsToCheck] = useState<DataProps>(briefData[0]);

  /**Draft Brief */
  const [showDraftBriefFullDetails, setShowDraftBriefFullDetails] =
    useState<boolean>(false);
  const [detailsToCheckForDraftBrief, setDetailsToCheckForDraftBrief] =
    useState<DataProps>(briefData[0]);

  return (
    <section
      className={`flex w-full items-center filter justify-center transition duration-500 bg-[#EEF1F1] min-h-[800px] py-[40px]  ${
        isContactUsClicked && 'brightness-[30%]'
      }`}>
      <div className='container flex flex-col min-h-[700px] items-center p-[20px]'>
        <AgentNav />
        {selectedNav === AgentNavData.CREATE_BRIEF && <PropertyType />}
        {selectedNav === AgentNavData.OVERVIEW && <Overview />}
        {selectedNav === AgentNavData.TOTAL_BRIEF && (
          <TotalBrief
            detailsToCheck={detailsToCheck}
            setShowFullDetails={setShowFullDetails}
            setDetailsToCheck={setDetailsToCheck}
            showFullDetails={showFullDetails}
            heading='Total Brief'
            data={briefData}
          />
        )}
        {selectedNav === AgentNavData.DRAFT_BRIEF && (
          <TotalBrief
            detailsToCheck={detailsToCheckForDraftBrief}
            setShowFullDetails={setShowDraftBriefFullDetails}
            setDetailsToCheck={setDetailsToCheckForDraftBrief}
            showFullDetails={showDraftBriefFullDetails}
            heading='Draft Brief'
            data={briefData}
          />
        )}
      </div>
    </section>
  );
};

export default Form2;
