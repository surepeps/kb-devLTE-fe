/** @format */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/general-components/card";
import JointVentureModalCard from "./joint-venture-card";
import Pagination from "./pagination";
import EmptyState from "./empty-state";
import Loading from "@/components/loading-component/loading";
import { IsMobile } from "@/hooks/isMobile";
import { useMarketplace } from "@/context/marketplace-context";

interface PropertyGridProps {
  marketplaceType: string;
  // JV specific props
  isComingFromSubmitLol?: boolean;
  setIsComingFromSubmitLol?: (value: boolean) => void;
  onSubmitLoi?: () => void;
  setPropertySelected?: (properties: any[]) => void;
  setIsAddInspectionModalOpened?: (value: boolean) => void;
  isAddForInspectionModalOpened?: boolean;
  // Buy specific props
  isComingFromPriceNeg?: boolean;
  setIsComingFromPriceNeg?: (value: boolean) => void;
  // Card page click
  onCardPageClick: (property: any) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  marketplaceType,
  isComingFromSubmitLol,
  setIsComingFromSubmitLol,
  onSubmitLoi,
  setPropertySelected,
  setIsAddInspectionModalOpened,
  isAddForInspectionModalOpened,
  isComingFromPriceNeg,
  setIsComingFromPriceNeg,
  onCardPageClick,
}) => {
  const isMobile = IsMobile();

  // Use marketplace context
  const {
    properties,
    formikStatus: isLoading,
    errMessage: error,
    usageOptions,
    rentFilterBy,
    jvFilterBy,
    homeCondition,
    selectedForInspection,
    toggleInspectionSelection,
    isSelectedForInspection,
    clearAllFilters,
    searchProperties,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    selectedMarketType,
  } = useMarketplace();

  // Get filter by based on marketplace type
  const getFilterBy = () => {
    switch (marketplaceType) {
      case "Buy a property":
        return usageOptions;
      case "Rent/Lease a property":
        return rentFilterBy;
      case "Find property for joint venture":
        return jvFilterBy;
      default:
        return [];
    }
  };

  const filterBy = getFilterBy();
  const condition =
    marketplaceType === "Rent/Lease a property" ? homeCondition : undefined;

  // Properties are already filtered by the API
  const filteredProperties = properties || [];
  const currentProperties = filteredProperties; // API handles pagination

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isLoading === "pending") return;

    setCurrentPage(page);

    // Get the current briefType and search with new page
    const getBriefType = (marketPlace: string) => {
      switch (marketPlace) {
        case "Buy a property":
          return "Outright Sales";
        case "Find property for joint venture":
          return "Joint Venture";
        case "Rent/Lease a property":
          return "Rent";
        default:
          return "Outright Sales";
      }
    };

    const briefType = getBriefType(marketplaceType);

    // Fetch new page data
    searchProperties({
      briefType,
      page,
      limit: itemsPerPage,
    });

    // Scroll to top of grid with proper positioning
    setTimeout(() => {
      const gridElement = document.getElementById("property-grid");
      if (gridElement) {
        const elementTop = gridElement.offsetTop;
        const offset = 80; // Account for any fixed headers
        window.scrollTo({
          top: Math.max(0, elementTop - offset),
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const createCardData = (property: any) => [
    {
      header: "Property Type",
      value: property.propertyType,
    },
    {
      header: "Price",
      value: `₦${Number(property.price || property.rentalPrice || 0).toLocaleString()}`,
    },
    {
      header: "Bedrooms",
      value:
        property.additionalFeatures?.noOfBedrooms ||
        property.noOfBedrooms ||
        property.propertyFeatures?.noOfBedrooms ||
        "N/A",
    },
    {
      header: "Location",
      value: `${property.location.state}, ${property.location.localGovernment}`,
    },
    {
      header: "Documents",
      value: `<ol>${property?.docOnProperty
        ?.map(
          (item: { _id: string; docName: string }) =>
            `<li key="${item._id}">${item.docName}</li>`,
        )
        .join("")}</ol>`,
    },
  ];

  const isPropertySelected = (property: any) => {
    return isSelectedForInspection(property._id);
  };

  // Loading state
  if (isLoading === "pending") {
    return (
      <div className="flex justify-center items-center py-20">
        <Loading />
      </div>
    );
  }

  // Error state with better handling
  if (isLoading === "failed" && error) {
    return (
      <EmptyState
        type="error"
        description={error}
        actionLabel="Retry"
        onAction={() => {
          // Retry current search
          const getBriefType = (marketPlace: string) => {
            switch (marketPlace) {
              case "Buy a property":
                return "Outright Sales";
              case "Find property for joint venture":
                return "Joint Venture";
              case "Rent/Lease a property":
                return "Rent";
              default:
                return "Outright Sales";
            }
          };

          const briefType = getBriefType(marketplaceType);

          searchProperties({
            briefType,
            page: currentPage,
            limit: itemsPerPage,
          });
        }}
      />
    );
  }

  // No properties state
  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        type="no-data"
        title="No properties available"
        description="There are currently no properties available in this category."
        actionLabel="Browse All Categories"
        onAction={clearAllFilters}
      />
    );
  }

  // No filtered results state
  if (filteredProperties.length === 0) {
    return (
      <EmptyState
        type="no-results"
        showFilters={true}
        onClearFilters={clearAllFilters}
      />
    );
  }

  return (
    <div id="property-grid" className="max-w-10xl mx-auto">
      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#09391C] font-semibold text-lg">
          {totalItems > 0
            ? `${totalItems} ${totalItems === 1 ? "property" : "properties"} found`
            : "Select the property brief you wish to inspect"}
        </p>
        {totalPages > 1 && (
          <p className="text-[#5A5D63] text-sm">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Property Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`grid gap-3 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {currentProperties.map((property, idx) => {
            if (marketplaceType === "Find property for joint venture") {
              return (
                <JointVentureModalCard
                  key={`${property._id}-${currentPage}`}
                  onClick={() => toggleInspectionSelection(property)}
                  isDisabled={isPropertySelected(property)}
                  onCardPageClick={() => onCardPageClick(property)}
                  isComingFromSubmitLol={isComingFromSubmitLol ?? false}
                  setIsComingFromSubmitLol={
                    setIsComingFromSubmitLol ?? (() => {})
                  }
                  cardData={createCardData(property)}
                  images={property?.pictures || []}
                  property={property}
                  properties={properties}
                  isPremium={property?.isPremium}
                  isAddInspectionalModalOpened={isAddForInspectionModalOpened}
                  setPropertySelected={setPropertySelected}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                  onSubmitLoi={onSubmitLoi}
                />
              );
            }

            return (
              <Card
                key={`${property._id}-${currentPage}`}
                style={isMobile ? { width: "100%" } : { width: "281px" }}
                images={property?.pictures || []}
                isAddForInspectionModalOpened={isAddForInspectionModalOpened}
                setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                setPropertySelected={setPropertySelected}
                isComingFromPriceNeg={isComingFromPriceNeg}
                setIsComingFromPriceNeg={setIsComingFromPriceNeg}
                isPremium={property?.isPremium}
                property={property}
                onCardPageClick={() => onCardPageClick(property)}
                onClick={() => toggleInspectionSelection(property)}
                cardData={createCardData(property)}
                isDisabled={isPropertySelected(property)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        isLoading={isLoading === "pending"}
      />
    </div>
  );
};

export default PropertyGrid;
