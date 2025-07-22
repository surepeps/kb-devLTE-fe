/** @format */

"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UniversalPropertyCard, createPropertyCardData } from "@/components/common/property-cards";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import Loading from "@/components/loading-component/loading";
import FailedRequest from "@/components/general-components/FailedRequest";
import StandardPreloader from "./StandardPreloader";
import { IsMobile } from "@/hooks/isMobile";
import { useNewMarketplace } from "@/context/new-marketplace-context";

interface PropertyGridProps {
  tab: "buy" | "rent" | "shortlet" | "jv";
  properties: any[];
  loading: boolean;
  error: string;
  searchStatus: {
    status: "pending" | "success" | "failed" | "idle";
    couldNotFindAProperty: boolean;
  };
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPropertyClick: (property: any) => void;
  onInspectionToggle: (property: any) => void;
  onPriceNegotiation?: (property: any) => void;
  onRemoveNegotiation?: (propertyId: string) => void;
  onLOIUpload?: (property: any) => void;
  onRemoveLOI?: (propertyId: string) => void;
  selectedForInspection: any[];
  negotiatedPrices?: any[];
  loiDocuments?: any[];

}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  tab,
  properties,
  loading,
  error,
  searchStatus,
  currentPage,
  totalPages,
  totalItems,
  onPropertyClick,
  onInspectionToggle,
  onPriceNegotiation = () => {},
  onRemoveNegotiation = () => {},
  onLOIUpload = () => {},
  onRemoveLOI = () => {},
  selectedForInspection,
  negotiatedPrices = [],
  loiDocuments = [],
}) => {
  const isMobile = IsMobile();
  const { setTabPage } = useNewMarketplace();



  const handlePageChange = (page: number) => {
    setTabPage(tab, page);
    // Trigger search with new page
    window.dispatchEvent(
      new CustomEvent("marketplace-search", { detail: { tab, page } }),
    );
  };

  // Loading state - check both loading prop and search status
  if (loading || searchStatus.status === "pending") {
    return (
      <StandardPreloader
        isVisible={true}
        message={searchStatus.status === "pending" ? "Searching properties..." : "Loading properties..."}
        overlay={false}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <FailedRequest
        message={error}
        onRetry={() => {
          // Trigger search retry
          window.dispatchEvent(
            new CustomEvent("marketplace-search", {
              detail: { tab, page: currentPage },
            }),
          );
        }}
      />
    );
  }

  // Empty state - only show if search is complete and no properties found
  if (searchStatus.status === "success" && (searchStatus.couldNotFindAProperty || properties.length === 0)) {
    return <EmptyState tab={tab} />;
  }

  // Selected properties indicator
  const selectedCount = selectedForInspection.length;
  const hasSelectedProperties = selectedCount > 0;

  // Check if we're in demo mode (properties have demo IDs)
  const isDemoMode =
    properties.length > 0 && properties.some((p) => p._id?.includes("demo"));

  return (
    <div className="w-full">
      <div className="space-y-6 mx-auto max-w-6xl">
        {/* Demo Mode Warning */}
        {isDemoMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></div>
              <p className="text-yellow-800 text-sm">
                <strong>Demo Mode:</strong> Showing sample data due to server
                connectivity issues. The marketplace functionality is working
                normally.
              </p>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-2 xl:gap-4 justify-items-center px-2 lg:px-2">
          <AnimatePresence>
            {properties.map((property, index) => {
              const cardData = createPropertyCardData(property, tab === "jv" ? "Joint Venture" : undefined);
              const isSelected = selectedForInspection.some(
                (item) => item.propertyId === property._id,
              );
              const negotiatedPrice = negotiatedPrices.find(
                (price) => price.propertyId === property._id,
              );
              const loiDocument = loiDocuments.find(
                (doc) => doc.propertyId === property._id,
              );

              return (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="w-full"
                >
                  <UniversalPropertyCard
                    property={property}
                    cardData={cardData}
                    images={property.pictures || property.images || []}
                    isPremium={property.isPremium || false}
                    onPropertyClick={() => onPropertyClick(property)}
                    onInspectionToggle={() => onInspectionToggle(property)}
                    onPriceNegotiation={() => onPriceNegotiation?.(property)}
                    onRemoveNegotiation={onRemoveNegotiation}
                    onLOIUpload={() => onLOIUpload?.(property)}
                    onRemoveLOI={onRemoveLOI}
                    isSelected={isSelected}
                    negotiatedPrice={negotiatedPrice}
                    loiDocument={loiDocument}
                    maxSelections={2}
                    currentSelections={selectedForInspection.length}
                    useGlobalInspection={true}
                    sourceTab={tab}
                    sourcePage="marketplace"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[#5A5D63] text-xs sm:text-sm">
          <span className="text-center sm:text-left">
            Showing {(currentPage - 1) * 12 + 1} -{" "}
            {Math.min(currentPage * 12, totalItems)} of {totalItems} properties
          </span>
          <span className="text-center sm:text-right">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyGrid;
