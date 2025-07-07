/** @format */

"use client";
import React from "react";
import { useNewMarketplace } from "@/context/new-marketplace-context";

const MarketplaceTabs = () => {
  const { activeTab, setActiveTab } = useNewMarketplace();

  const tabs = [
    {
      id: "buy" as const,
      label: "Buy a property",
      briefType: "buy",
    },
    {
      id: "jv" as const,
      label: "Find property for joint venture",
      briefType: "jv",
    },
    {
      id: "rent" as const,
      label: "Rent/Lease a property",
      briefType: "rent",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          type="button"
          className={`min-w-fit h-11 sm:h-12 px-4 sm:px-6 flex items-center justify-center rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-[#8DDB90] text-white shadow-md"
              : "bg-white text-[#5A5D63] border-2 border-gray-200 hover:border-[#8DDB90] hover:text-[#8DDB90]"
          }`}
        >
          <span className="text-center leading-tight">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MarketplaceTabs;
