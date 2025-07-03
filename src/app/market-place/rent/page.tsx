"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RentPropertySearch from "@/components/marketplace/rent-property-search";
import { usePageContext } from "@/context/page-context";

const RentPropertyPage = () => {
  const router = useRouter();
  const {
    isAddForInspectionModalOpened,
    setIsAddForInspectionModalOpened,
    isComingFromPriceNeg,
    setIsComingFromPriceNeg,
  } = usePageContext();

  const [propertiesSelected, setPropertiesSelected] = useState<any[]>([]);
  const [addForInspectionPayload, setAddInspectionPayload] = useState<{
    twoDifferentInspectionAreas: boolean;
    initialAmount: number;
    toBeIncreaseBy: number;
  }>({
    twoDifferentInspectionAreas: false,
    initialAmount: 10000,
    toBeIncreaseBy: 0,
  });
  const [inspectionType, setInspectionType] = useState<
    "Buy" | "JV" | "Rent/Lease"
  >("Rent/Lease");

  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <nav className="text-sm text-[#5A5D63] mb-4">
            <button
              onClick={() => router.push("/")}
              className="hover:text-[#09391C]"
            >
              Home
            </button>
            <span className="mx-2">›</span>
            <button
              onClick={() => router.push("/market-place")}
              className="hover:text-[#09391C]"
            >
              Marketplace
            </button>
            <span className="mx-2">›</span>
            <span className="text-[#09391C] font-medium">Rent/Lease</span>
          </nav>

          <h1 className="text-2xl md:text-4xl font-bold text-[#09391C] font-display mb-4">
            Rent/Lease Properties
          </h1>
          <p className="text-sm md:text-lg text-[#5A5D63] max-w-2xl mx-auto">
            Find your next rental home or lease property. Browse available
            properties for rent across different locations.
          </p>
        </div>

        {/* Search and Results */}
        <RentPropertySearch
          propertiesSelected={propertiesSelected}
          setPropertiesSelected={setPropertiesSelected}
          isAddForInspectionModalOpened={isAddForInspectionModalOpened}
          setIsAddInspectionModalOpened={setIsAddForInspectionModalOpened}
          addForInspectionPayload={addForInspectionPayload}
          setAddForInspectionPayload={setAddInspectionPayload}
          isComingFromPriceNeg={isComingFromPriceNeg}
          comingFromPriceNegotiation={setIsComingFromPriceNeg}
          inspectionType={inspectionType}
          setInspectionType={setInspectionType}
        />
      </div>
    </div>
  );
};

export default RentPropertyPage;
