/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNewMarketplace } from "@/context/new-marketplace-context";
import MarketplaceTabs from "./MarketplaceTabs";
import BuyTab from "./tabs/BuyTab";
import JointVentureTab from "./tabs/JointVentureTab";
import RentTab from "./tabs/RentTab";
import AddForInspection from "./AddForInspection";

const NewMarketPlace = () => {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    isAddForInspectionOpen,
    setIsAddForInspectionOpen,
  } = useNewMarketplace();

  const [hasError, setHasError] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return <BuyTab />;
      case "jv":
        return <JointVentureTab />;
      case "rent":
        return <RentTab />;
      default:
        return <BuyTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      {isAddForInspectionOpen ? (
        <AddForInspection />
      ) : (
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-[#5A5D63] mb-6">
            <button
              onClick={() => router.push("/")}
              className="hover:text-[#09391C]"
            >
              Home
            </button>
            <span className="mx-2">›</span>
            <span className="text-[#09391C] font-medium">New Marketplace</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#09391C] font-display mb-4">
              Welcome to <span className="text-[#8DDB90]">Khabiteq Realty</span>{" "}
              Marketplace
            </h1>
            <p className="text-lg md:text-xl text-[#5A5D63] max-w-3xl mx-auto">
              Whether you're buying, selling, renting, or investing (JV), how
              can we assist you?
            </p>
          </div>

          {/* Marketplace Tabs */}
          <MarketplaceTabs />

          {/* CTA Section */}
          <div className="text-center mb-8">
            <p className="text-lg text-[#5A5D63] mb-4">
              Didn't find a match for your search?
            </p>
            <button
              className="bg-transparent border-2 border-[#09391C] text-[#09391C] px-6 py-3 rounded-lg font-semibold hover:bg-[#09391C] hover:text-white transition-colors"
              type="button"
              onClick={() => router.push("/preference")}
            >
              Share your preference
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full">{renderTabContent()}</div>
        </div>
      )}
    </div>
  );
};

export default NewMarketPlace;
