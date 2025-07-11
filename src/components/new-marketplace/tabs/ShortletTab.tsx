/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { useNewMarketplace } from "@/context/new-marketplace-context";
import ShortletPropertySearch from "../search/ShortletPropertySearch";
import PropertyGrid from "../PropertyGrid";
import PriceNegotiationModal from "../modals/PriceNegotiationModal";

const ShortletTab = () => {
  const {
    shortletTab,
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
      activeTab === "shortlet" &&
      shortletTab.formikStatus === "idle" &&
      shortletTab.properties.length === 0
    ) {
      fetchTabData("shortlet");
    }
  }, [
    activeTab,
    shortletTab.formikStatus,
    shortletTab.properties.length,
    fetchTabData,
  ]);

  const handlePropertyClick = (property: any) => {
    // Navigate to property details page
    const propertyId = property._id;
    window.open(`/property/shortlet/${propertyId}`, "_blank");
  };

  const handleInspectionToggle = (property: any) => {
    toggleInspectionSelection("shortlet", property);
  };

  const handlePriceNegotiation = (property: any) => {
    setPriceNegotiationModal({
      isOpen: true,
      property,
    });
  };

  const handleNegotiationSubmit = (property: any, negotiatedPrice: number) => {
    const originalPrice = property.price || 0;
    addNegotiatedPrice(
      "shortlet",
      property._id,
      originalPrice,
      negotiatedPrice,
    );

    // Automatically select for inspection
    if (!isSelectedForInspection("shortlet", property._id)) {
      toggleInspectionSelection("shortlet", property);
    }

    setPriceNegotiationModal({ isOpen: false, property: null });
  };

  const handleRemoveNegotiation = (propertyId: string) => {
    removeNegotiatedPrice("shortlet", propertyId);
  };

  const openAddForInspection = () => {
    setIsAddForInspectionOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <ShortletPropertySearch />

      {/* Properties Grid */}
      <PropertyGrid
        tab="shortlet"
        properties={shortletTab.properties}
        loading={shortletTab.formikStatus === "pending"}
        error={shortletTab.errMessage}
        searchStatus={shortletTab.searchStatus}
        currentPage={shortletTab.currentPage}
        totalPages={shortletTab.totalPages}
        totalItems={shortletTab.totalItems}
        onPropertyClick={handlePropertyClick}
        onInspectionToggle={handleInspectionToggle}
        onPriceNegotiation={handlePriceNegotiation}
        onRemoveNegotiation={handleRemoveNegotiation}
        selectedForInspection={shortletTab.selectedForInspection}
        negotiatedPrices={shortletTab.negotiatedPrices}
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
            "shortlet",
            priceNegotiationModal.property?._id,
          )}
        />
      )}
    </div>
  );
};

export default ShortletTab;
