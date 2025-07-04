/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import { usePageContext } from "@/context/page-context";
import { useAgentAccess } from "@/hooks/useAgentAccess";
import AgentNav from "@/components/agent-page-components/agent_navbar";
import { AgentNavData } from "@/enums";
import { DataProps } from "@/types/agent_data_props";
import CreateBrief from "@/components/propertyType";
import Overview from "@/components/overview";
// import { completeTransactionData } from '@/data/sampleDataForAgent';
import Brief from "@/components/brief";
import { URLS } from "@/utils/URLS";
import { GET_REQUEST } from "@/utils/requests";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { briefData } from "@/data/sampleDataForAgent";
import Settings from "@/components/settings-components/settings";
import { motion } from "framer-motion";

// Function to shuffle array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

type BriefDataProps = {
  docOnProperty: { _id: string; isProvided: boolean; docName: string }[];
  pictures: any[];
  propertyType: string;
  price: number;
  location: { state: string; localGovernment: string; area: string };
  propertyFeatures: { additionalFeatures: string[]; noOfBedrooms: number };
  createdAt: string;
  documents?: string[];
};

const Form2 = () => {
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const { selectedNav } = usePageContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Agent access control
  const { canAccessBriefs } = useAgentAccess({
    requireOnboarding: true,
    requireApproval: true,
  });
  // const [briefsData, setBriefsData] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [errMessage, setErrMessage] = useState<string>('');
  // const { user } = useUserContext();

  /**TotalBrief */
  const [totalBriefData, setTotalBriefData] = useState<any[]>([]);
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [detailsToCheck, setDetailsToCheck] = useState<DataProps>(briefData[0]);

  /**Draft Brief */
  const [showDraftBriefFullDetails, setShowDraftBriefFullDetails] =
    useState<boolean>(false);
  const [detailsToCheckForDraftBrief, setDetailsToCheckForDraftBrief] =
    useState<DataProps>(briefData[0]);

  /**Transaction History */
  const [showTransactionHistory, setShowTransactionHistory] =
    useState<boolean>(false);
  const [
    detailsToCheckForTransactionHistory,
    setDetailsToCheckForTransactionHistory,
  ] = useState<DataProps>(briefData[0]);

  const renderComponent = () => {
    switch (selectedNav) {
      case AgentNavData.OVERVIEW:
        return <Overview />;
      case AgentNavData.CREATE_BRIEF:
        return <CreateBrief />;
      case AgentNavData.TOTAL_BRIEF:
        if (totalBriefData.length === 0) {
          return (
            <div className="w-full h-[200px] flex justify-center items-center">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                viewport={{ once: true }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-3xl font-bold text-gray-600 text-[24px] leading-[32px] tracking-[0.25px] font-archivo"
              >
                No Briefs Available
              </motion.h2>
            </div>
          );
        } else {
          return (
            <Brief
              headerData={headerData}
              detailsToCheck={detailsToCheck}
              setShowFullDetails={setShowFullDetails}
              setDetailsToCheck={setDetailsToCheck}
              showFullDetails={showFullDetails}
              heading="Total Brief"
              isLoading={isLoading}
              data={totalBriefData}
            />
          );
        }
      // case AgentNavData.DRAFT_BRIEF:
      //   return (
      //     <Brief
      //       headerData={headerData}
      //       detailsToCheck={detailsToCheckForDraftBrief}
      //       setShowFullDetails={setShowDraftBriefFullDetails}
      //       setDetailsToCheck={setDetailsToCheckForDraftBrief}
      //       showFullDetails={showDraftBriefFullDetails}
      //       heading='Draft Brief'
      //       isLoading={isLoading}
      //       data={briefData}
      //     />
      //   );
      //   case AgentNavData.TRANSACTION_HISTORY:
      //     return (
      //       <Brief
      //         headerData={transactionHeaderData}
      //         detailsToCheck={detailsToCheckForTransactionHistory}
      //         setShowFullDetails={setShowTransactionHistory}
      //         setDetailsToCheck={setDetailsToCheckForTransactionHistory}
      //         showFullDetails={showTransactionHistory}
      //         heading='Complete Transaction'
      //         isLoading={isLoading}
      //         data={completeTransactionData}
      //       />
      //     );
      case AgentNavData.SETTINGS:
        return <Settings />;
    }
  };

  useEffect(() => {
    const getTotalBriefs = async () => {
      setIsLoading(true);
      try {
        const response = await GET_REQUEST(
          URLS.BASE +
            URLS.fetchBriefs +
            "?page=1&limit=1000&briefType=Outright Sales",
          Cookies.get("token"),
        );

        if (response?.success === false) {
          console.error("Failed to get agent data:", response);
          toast.error("Failed to get data");
          return;
        }

        const data = response;
        if (!data?.data) {
          console.error("Invalid response structure:", data);
          toast.error("Invalid data structure received");
          return;
        }

        // Filter approved properties and shuffle them
        const approvedData = Array.isArray(data.data)
          ? data.data.filter((item: any) => item.isApproved === true)
          : [];
        const shuffledData = shuffleArray(approvedData);
        setTotalBriefData(shuffledData);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    getTotalBriefs();
  }, [selectedNav]);

  return (
    <div
      className={`min-h-screen bg-[#EEF1F1] transition duration-500 ${
        (isContactUsClicked || isModalOpened) && "brightness-[30%]"
      }`}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#09391C] font-display mb-2">
            Agent Dashboard
          </h1>
          <p className="text-[#5A5D63]">
            Manage your property briefs and track your performance
          </p>
        </div>

        {/* Navigation and Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <AgentNav />
          <div className="p-6">{selectedNav && renderComponent()}</div>
        </div>
      </div>
    </div>
  );
};

const headerData: string[] = [
  "Date",
  "Property Type",
  "Location",
  "Price Range",
  "Document",
  "Full details",
];

const transactionHeaderData: string[] = [
  "Date",
  "Property Type",
  "Location",
  "Property price",
  "Amount sold",
  "Full details",
];

export default Form2;
