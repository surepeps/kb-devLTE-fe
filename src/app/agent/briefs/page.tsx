/** @format */
'use client';
import React, { useState } from 'react';
import { usePageContext } from '@/context/page-context';
import AgentNav from '@/components/agent_navbar';
import { AgentNavData } from '@/enums';
import { DataProps } from '@/types/agent_data_props';
import PropertyType from '@/components/propertyType';
import Overview from '@/components/overview';
import { briefData, completeTransactionData } from '@/data/sampleDataForAgent';
import Brief from '@/components/brief';
// import { GET_REQUEST } from '@/utils/requests';
// import { URLS } from '@/utils/URLS';
// import { useUserContext } from '@/context/user-context';

const Form2 = () => {
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const { selectedNav } = usePageContext();
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [errMessage, setErrMessage] = useState<string>('');
  // const { user } = useUserContext();

  /**TotalBrief */
  // const [briefData, setBriefData] = useState<DataProps[]>([]);
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [detailsToCheck, setDetailsToCheck] = useState<DataProps>(briefData[0]);

  /**Draft Brief */
  const [showDraftBriefFullDetails, setShowDraftBriefFullDetails] = useState<boolean>(false);
  const [detailsToCheckForDraftBrief, setDetailsToCheckForDraftBrief] = useState<DataProps>(briefData[0]);

  /**Transaction History */
  const [showTransactionHistory, setShowTransactionHistory] = useState<boolean>(false);
  const [detailsToCheckForTransactionHistory, setDetailsToCheckForTransactionHistory] = useState<DataProps>(
    briefData[0]
  );

  // useEffect(() => {
  //   const loadData = async () => {
  //     const result = await fetch(URLS.BASE + URLS.agentfetchTotalBriefs);
  //     if (result.success) {
  //       const combinedData = [...result.data.sellProperties, ...result.data.rentProperties];
  //       const formattedData = combinedData.map((property) => ({
  //         date: new Date(property.createdAt).toLocaleDateString(),
  //         propertyType: property.propertyType,
  //         location: `${property.location.state}, ${property.location.localGovernment}`,
  //         propertyPrice: property.price || property.rentalPrice,
  //         document: property.docOnProperty ? property.docOnProperty.map(doc => doc.docName).join(', ') : 'N/A',
  //       }));
  //       setBriefData(formattedData);
  //     } else {
  //       setErrMessage(result.message);
  //     }
  //     setIsLoading(false);
  //   };

  //   loadData();
  // }, []);


  // if (isLoading) return <p>Loading...</p>;
  // if (errMessage) return <p>{errMessage}</p>;


  return (
    <section
      className={`flex w-full items-center filter justify-center transition duration-500 bg-[#EEF1F1] min-h-[800px] py-[40px]  ${
        (isContactUsClicked || isModalOpened) && 'brightness-[30%]'
      }`}
    >
      <div className='container flex flex-col min-h-[700px] items-center p-[20px]'>
        <AgentNav />
        {selectedNav === AgentNavData.OVERVIEW && <Overview />}
        {selectedNav === AgentNavData.CREATE_BRIEF && <PropertyType />}
        {selectedNav === AgentNavData.TOTAL_BRIEF && (
          <Brief
            headerData={headerData}
            detailsToCheck={detailsToCheck}
            setShowFullDetails={setShowFullDetails}
            setDetailsToCheck={setDetailsToCheck}
            showFullDetails={showFullDetails}
            heading='Total Brief'
            data={briefData}
          />
        )}
        {selectedNav === AgentNavData.DRAFT_BRIEF && (
          <Brief
            headerData={headerData}
            detailsToCheck={detailsToCheckForDraftBrief}
            setShowFullDetails={setShowDraftBriefFullDetails}
            setDetailsToCheck={setDetailsToCheckForDraftBrief}
            showFullDetails={showDraftBriefFullDetails}
            heading='Draft Brief'
            data={briefData}
          />
        )}
        {selectedNav === AgentNavData.TRANSACTION_HISTORY && (
          <Brief
            headerData={transactionHeaderData}
            detailsToCheck={detailsToCheckForTransactionHistory}
            setShowFullDetails={setShowTransactionHistory}
            setDetailsToCheck={setDetailsToCheckForTransactionHistory}
            showFullDetails={showTransactionHistory}
            heading='Complete Transaction'
            data={completeTransactionData}
          />
        )}
      </div>
    </section>
  );
};

const headerData: string[] = ['Date', 'Property Type', 'Location', 'Property price', 'Document', 'Full details'];

const transactionHeaderData: string[] = [
  'Date',
  'Property Type',
  'Location',
  'Property price',
  'Amount sold',
  'Full details',
];

export default Form2;
