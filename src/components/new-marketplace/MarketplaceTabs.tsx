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
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          type="button"
          className={`min-w-fit h-12 px-6 flex items-center justify-center rounded-lg font-medium text-base transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-[#8DDB90] text-white shadow-md"
              : "bg-white text-[#5A5D63] border-2 border-gray-200 hover:border-[#8DDB90] hover:text-[#8DDB90]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MarketplaceTabs;
