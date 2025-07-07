/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { useNewMarketplace } from "@/context/new-marketplace-context";
import RentPropertySearch from "../search/RentPropertySearch";
import PropertyGrid from "../PropertyGrid";
import PriceNegotiationModal from "../modals/PriceNegotiationModal";

const RentTab = () => {
  const {
    rentTab,
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

  // Fetch initial data when tab becomes active
  useEffect(() => {
    if (activeTab === "rent" && rentTab.formikStatus === "idle") {
      fetchTabData("rent");
    }
  }, []);

  const handlePropertyClick = (property: any) => {
    // Navigate to property details page
    const propertyId = property._id;
    window.open(`/property/rent/${propertyId}`, "_blank");
  };

  const handleInspectionToggle = (property: any) => {
    toggleInspectionSelection("rent", property);
  };

  const handlePriceNegotiation = (property: any) => {
    setPriceNegotiationModal({
      isOpen: true,
      property,
    });
  };

  const handleNegotiationSubmit = (property: any, negotiatedPrice: number) => {
    const originalPrice = property.price || 0;
    addNegotiatedPrice("rent", property._id, originalPrice, negotiatedPrice);

    // Automatically select for inspection
    if (!isSelectedForInspection("rent", property._id)) {
      toggleInspectionSelection("rent", property);
    }

    setPriceNegotiationModal({ isOpen: false, property: null });
  };

  const handleRemoveNegotiation = (propertyId: string) => {
    removeNegotiatedPrice("rent", propertyId);
  };

  const openAddForInspection = () => {
    setIsAddForInspectionOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <RentPropertySearch />

      {/* Properties Grid */}
      <PropertyGrid
        tab="rent"
        properties={rentTab.properties}
        loading={rentTab.formikStatus === "pending"}
        error={rentTab.errMessage}
        searchStatus={rentTab.searchStatus}
        currentPage={rentTab.currentPage}
        totalPages={rentTab.totalPages}
        totalItems={rentTab.totalItems}
        onPropertyClick={handlePropertyClick}
        onInspectionToggle={handleInspectionToggle}
        onPriceNegotiation={handlePriceNegotiation}
        onRemoveNegotiation={handleRemoveNegotiation}
        selectedForInspection={rentTab.selectedForInspection}
        negotiatedPrices={rentTab.negotiatedPrices}
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
            "rent",
            priceNegotiationModal.property?._id,
          )}
        />
      )}
    </div>
  );
};

export default RentTab;
