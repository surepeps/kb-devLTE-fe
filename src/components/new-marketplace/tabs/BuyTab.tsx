/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { useNewMarketplace } from "@/context/new-marketplace-context";
import BuyPropertySearch from "../search/BuyPropertySearch";
import PropertyGrid from "../PropertyGrid";
import PriceNegotiationModal from "../modals/PriceNegotiationModal";

const BuyTab = () => {
  const {
    buyTab,
    fetchTabData,
    activeTab,
    isSelectedForInspection,
    toggleInspectionSelection,
    addNegotiatedPrice,
    removeNegotiatedPrice,
    getNegotiatedPrice,
    setIsAddForInspectionOpen,
  } = useNewMarketplace();

  // Modal states
  const [priceNegotiationModal, setPriceNegotiationModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null,
  });

  // Fetch initial data when tab becomes active (only once)
  useEffect(() => {
    if (
      activeTab === "buy" &&
      buyTab.formikStatus === "idle" &&
      buyTab.properties.length === 0
    ) {
      fetchTabData("buy");
    }
  }, [activeTab, fetchTabData]);

  const handlePropertyClick = (property: any) => {
    // Navigate to property details page
    const propertyId = property._id;
    window.open(`/property/buy/${propertyId}`, "_blank");
  };

  const handleInspectionToggle = (property: any) => {
    toggleInspectionSelection("buy", property);
  };

  const handlePriceNegotiation = (property: any) => {
    setPriceNegotiationModal({
      isOpen: true,
      property,
    });
  };

  const handleNegotiationSubmit = (property: any, negotiatedPrice: number) => {
    const originalPrice = property.price || 0;
    addNegotiatedPrice("buy", property._id, originalPrice, negotiatedPrice);

    // Automatically select for inspection
    if (!isSelectedForInspection("buy", property._id)) {
      toggleInspectionSelection("buy", property);
    }

    setPriceNegotiationModal({ isOpen: false, property: null });
  };

  const handleRemoveNegotiation = (propertyId: string) => {
    removeNegotiatedPrice("buy", propertyId);
  };

  const openAddForInspection = () => {
    setIsAddForInspectionOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Debug Section - Remove in production */}
      <div className="bg-yellow-50 p-4 rounded border">
        <h4 className="font-bold text-sm mb-2">Context Debug Info:</h4>
        <p className="text-xs">Status: {buyTab.formikStatus}</p>
        <p className="text-xs">Properties: {buyTab.properties.length}</p>
        <p className="text-xs">Search Status: {buyTab.searchStatus.status}</p>
        <button
          onClick={debugFetch}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Force Fetch
        </button>
      </div>

      {/* Direct API Test */}
      <DebugMarketplace />

      {/* Search and Filters */}
      <BuyPropertySearch />

      {/* Properties Grid */}
      <PropertyGrid
        tab="buy"
        properties={buyTab.properties}
        loading={buyTab.formikStatus === "pending"}
        error={buyTab.errMessage}
        searchStatus={buyTab.searchStatus}
        currentPage={buyTab.currentPage}
        totalPages={buyTab.totalPages}
        totalItems={buyTab.totalItems}
        onPropertyClick={handlePropertyClick}
        onInspectionToggle={handleInspectionToggle}
        onPriceNegotiation={handlePriceNegotiation}
        onRemoveNegotiation={handleRemoveNegotiation}
        selectedForInspection={buyTab.selectedForInspection}
        negotiatedPrices={buyTab.negotiatedPrices}
        onOpenAddForInspection={openAddForInspection}
      />

      {/* Price Negotiation Modal */}
      {priceNegotiationModal.isOpen && (
        <PriceNegotiationModal
          isOpen={priceNegotiationModal.isOpen}
          property={priceNegotiationModal.property}
          onClose={() =>
            setPriceNegotiationModal({ isOpen: false, property: null })
          }
          onSubmit={handleNegotiationSubmit}
          existingNegotiation={getNegotiatedPrice(
            "buy",
            priceNegotiationModal.property?._id,
          )}
        />
      )}
    </div>
  );
};

export default BuyTab;
