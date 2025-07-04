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
  itemsPerPage?: number;
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
  itemsPerPage = 12,
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
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter properties based on marketplace type and filters
  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    return properties.filter((property) => {
      // Filter by property type
      const typeMatch =
        filterBy?.includes("All") ||
        filterBy?.length === 0 ||
        filterBy?.includes(property.propertyType);

      // Filter by condition (for rent)
      const conditionMatch =
        !condition ||
        condition === "All" ||
        property.propertyCondition === condition;

      return typeMatch && conditionMatch;
    });
  }, [properties, filterBy, condition]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset page when filters change or when no results on current page
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    } else if (filteredProperties.length > 0 && currentPage < 1) {
      setCurrentPage(1);
    }
  }, [filterBy, condition, currentPage, totalPages, filteredProperties.length]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterBy, condition]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
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
          // Clear error state and try to refetch
          setErrMessage("");
          setFormikStatus("idle");
          setTimeout(() => {
            window.location.reload();
          }, 100);
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
          {filteredProperties.length > 0
            ? `${filteredProperties.length} ${filteredProperties.length === 1 ? "property" : "properties"} found`
            : "Select the property brief you wish to inspect"}
        </p>
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
                  isComingFromSubmitLol={isComingFromSubmitLol}
                  setIsComingFromSubmitLol={setIsComingFromSubmitLol}
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
        totalItems={filteredProperties.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PropertyGrid;
