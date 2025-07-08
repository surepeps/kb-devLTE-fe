/** @format */

"use client";
import React, { useState, Fragment, useEffect } from "react";
import { useFormik } from "formik";
import Input from "../../general-components/Input";
import RadioCheck from "../../general-components/radioCheck";
import { AnimatePresence } from "framer-motion";
import LocationSearch from "./LocationSearch";
import FilterModal from "../FilterModal";
import StandardPreloader from "../StandardPreloader";
import ActiveFilters from "../ActiveFilters";
import PriceRangeFilter from "../filters/PriceRangeFilter";
import BedroomFilter from "../filters/BedroomFilter";
import DocumentTypeFilter from "../filters/DocumentTypeFilter";
import MoreFiltersModal from "../filters/MoreFiltersModal";

interface SearchFiltersProps {
  tab: "buy" | "jv" | "rent";
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onSearch: () => void;
  loading: boolean;
  selectedCount?: number;
  onOpenInspection?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  tab,
  filters,
  onFilterChange,
  onClearFilters,
  onSearch,
  loading,
  selectedCount = 0,
  onOpenInspection,
}) => {
  // Modal states for new filter components
  const [isPriceRangeModalOpened, setIsPriceRangeModalOpened] = useState(false);
  const [isDocumentModalOpened, setIsDocumentModalOpened] = useState(false);
  const [isBedroomModalOpened, setIsBedroomModalOpened] = useState(false);
  const [isMoreFilterModalOpened, setIsMoreFilterModalOpened] = useState(false);

  // Mobile filter modal state
  const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);

  // Usage options for tab
  const getUsageOptions = () => {
    switch (tab) {
      case "buy":
        return ["All", "Land", "Residential", "Commercial", "Duplex"];
      case "jv":
        return [
          "All",
          "Land Development",
          "Commercial",
          "Residential",
          "Mixed Use",
        ];
      case "rent":
        return ["All", "Apartment", "House", "Office", "Shop", "Warehouse"];
      default:
        return ["All"];
    }
  };

  // Handlers for new filter components
  const handlePriceRangeSelect = (priceRange: {
    min: number;
    max: number;
    display: string;
  }) => {
    onFilterChange("priceRange", priceRange);
    setIsPriceRangeModalOpened(false);
  };

  const handleBedroomSelect = (bedrooms: number | string) => {
    onFilterChange("bedrooms", bedrooms);
    setIsBedroomModalOpened(false);
  };

  const handleDocumentSelect = (documents: string[]) => {
    onFilterChange("documentTypes", documents);
    setIsDocumentModalOpened(false);
  };

  const handleMoreFiltersApply = (moreFilters: any) => {
    if (moreFilters.bathrooms) {
      onFilterChange("bathrooms", moreFilters.bathrooms);
    }
    if (moreFilters.landSize) {
      onFilterChange("landSize", moreFilters.landSize);
    }
    if (moreFilters.features) {
      onFilterChange("desiredFeatures", moreFilters.features);
    }
    setIsMoreFilterModalOpened(false);
  };

  const formatPriceDisplay = () => {
    if (
      filters.priceRange &&
      (filters.priceRange.min > 0 || filters.priceRange.max > 0)
    ) {
      return (
        filters.priceRange.display ||
        `₦${filters.priceRange.min?.toLocaleString() || 0} - ₦${filters.priceRange.max?.toLocaleString() || 0}`
      );
    }
    return "";
  };

  const formatDocumentsDisplay = () => {
    const docs = filters.documentTypes || [];
    return docs.length > 0 ? `${docs.length} documents selected` : "";
  };

  const usageOptions = getUsageOptions();

  // Sync location formik with filter changes
  useEffect(() => {
    locationFormik.setValues({
      selectedLGA: filters.selectedLGA || "",
      selectedState: filters.selectedState || "",
      selectedArea: filters.selectedArea || "",
      locationDisplay:
        filters.selectedState || filters.selectedLGA || filters.selectedArea
          ? [filters.selectedArea, filters.selectedLGA, filters.selectedState]
              .filter(Boolean)
              .join(", ")
          : "",
    });
  }, [filters.selectedState, filters.selectedLGA, filters.selectedArea]);

  // Sync price formik with filter changes
  useEffect(() => {
    priceFormik.setValues({
      minPrice: filters.priceRange?.min || 0,
      maxPrice: filters.priceRange?.max || 0,
    });
  }, [filters.priceRange]);

  return (
    <Fragment>
      {/* Loading Overlay */}
      <StandardPreloader
        isVisible={loading}
        message="Searching properties..."
        overlay={false}
      />

      {/* Mobile Filter Modal */}
      <FilterModal
        isOpen={isMobileFilterModalOpen}
        onClose={() => setIsMobileFilterModalOpen(false)}
        tab={tab}
        filters={filters}
        onFilterChange={onFilterChange}
        onApplyFilters={onSearch}
        onClearFilters={onClearFilters}
      />

      {/* Selected Filters Card */}
      <SelectedFiltersCard
        filters={filters}
        onRemoveFilter={onFilterChange}
        onClearAll={onClearFilters}
      />

      {/* Mobile Filter Section */}
      <div className="lg:hidden bg-white border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#09391C]">
            Filter Properties
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMobileFilterModalOpen(true)}
              className="px-4 py-2 border border-[#8DDB90] text-[#8DDB90] rounded-lg text-sm font-medium hover:bg-[#8DDB90] hover:text-white transition-colors"
            >
              Filters
            </button>
            <button
              onClick={onSearch}
              disabled={loading}
              className="px-4 py-2 bg-[#8DDB90] text-white rounded-lg text-sm font-medium hover:bg-[#76c77a] transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Quick Location Search for Mobile */}
        <div className="w-full">
          <LocationSearch
            placeholder="Quick location search..."
            value={filters.locationDisplay || ""}
            onChange={(location, details) => {
              if (details) {
                onFilterChange("selectedState", details.state);
                onFilterChange("selectedLGA", details.lga);
                onFilterChange("selectedArea", details.area || "");
                onFilterChange("locationDisplay", location);
              } else {
                onFilterChange("selectedState", "");
                onFilterChange("selectedLGA", "");
                onFilterChange("selectedArea", "");
                onFilterChange("locationDisplay", "");
              }
            }}
          />
        </div>

        {/* Selected Properties Button for Mobile */}
        {selectedCount > 0 && (
          <button
            className="w-full bg-[#FF3D00] text-white py-3 rounded-lg font-medium hover:bg-[#E53100] transition-colors"
            type="button"
            onClick={() => {
              if (onOpenInspection) {
                onOpenInspection();
              }
            }}
          >
            {selectedCount} selected brief{selectedCount !== 1 ? "s" : ""} -
            Continue
          </button>
        )}
      </div>

      {/* Filter by checkboxes - exact copy of existing design - Hidden on mobile */}
      <div className="container min-h-[181px] hidden lg:flex flex-col gap-[25px] py-[25px] px-[30px] bg-[#FFFFFF] sticky top-0 z-20">
        <div className="w-full pb-[10px] flex flex-wrap justify-between items-center gap-[20px] border-b-[1px] border-[#C7CAD0]">
          <div className="flex flex-wrap gap-[15px]">
            <h3 className="font-semibold text-[#1E1E1E]">Filter by</h3>
            {usageOptions.map((item: string, idx: number) => (
              <RadioCheck
                key={idx}
                type="checkbox"
                name="filterBy"
                isChecked={filters.usageOptions?.includes(item) || false}
                value={item}
                handleChange={() => {
                  const current = filters.usageOptions || [];
                  const updated = current.includes(item)
                    ? current.filter((opt: string) => opt !== item)
                    : [...current, item];
                  onFilterChange("usageOptions", updated);
                }}
              />
            ))}
          </div>
          <div className="flex gap-[30px]">
            <button
              className="h-[34px] w-[133px] bg-[#8DDB90] text-white shadow-md font-medium text-sm"
              type="button"
              onClick={() => {
                // Navigate to post property
                window.open("/post_property", "_blank");
              }}
            >
              List property
            </button>
            <button
              className={`h-[34px] w-[140px] font-medium text-sm ${
                selectedCount > 0
                  ? "bg-[#FF3D00] text-white border-[1px] border-[#FF3D00] hover:bg-[#E53100]"
                  : "bg-transparent text-[#FF3D00] border-[1px] border-[#FF3D00]"
              }`}
              type="button"
              onClick={() => {
                if (selectedCount > 0 && onOpenInspection) {
                  onOpenInspection();
                } else {
                  console.log("No properties selected");
                }
              }}
              disabled={selectedCount === 0}
            >
              {selectedCount} selected brief{selectedCount !== 1 ? "s" : ""}
            </button>
          </div>
        </div>

        {/* Filter inputs row - exact copy of existing design */}
        <div className="w-full flex items-center gap-[15px]">
          {/* Location Input - Fixed width */}
          <div className="w-[280px]">
            <LocationSearch
              placeholder="Enter state, LGA, or area..."
              value={filters.locationDisplay || ""}
              onChange={(location, details) => {
                if (details) {
                  onFilterChange("selectedState", details.state);
                  onFilterChange("selectedLGA", details.lga);
                  onFilterChange("selectedArea", details.area || "");
                  onFilterChange("locationDisplay", location);
                } else {
                  onFilterChange("selectedState", "");
                  onFilterChange("selectedLGA", "");
                  onFilterChange("selectedArea", "");
                  onFilterChange("locationDisplay", "");
                }
              }}
            />
          </div>

          {/* Price Range Input - Equal flex */}
          <div className="flex-1 min-w-0">
            <Input
              className="w-full h-[50px]"
              style={{ marginTop: "-30px" }}
              placeholder="Price Range"
              type="text"
              label=""
              readOnly
              showDropdownIcon={true}
              value={formatPriceDisplay(priceRadioValue, priceFormik)}
              name="price"
              onClick={() => setIsPriceRangeModalOpened(true)}
            />
            {isPriceRangeModalOpened && (
              <PriceRange
                heading="Price Range"
                formik={priceFormik}
                closeModal={setIsPriceRangeModalOpened}
                setSlectedRadioValue={setPriceRadioValue}
                selectedRadioValue={priceRadioValue}
              />
            )}
          </div>

          {/* Document Type Input - Equal flex */}
          {tab !== "jv" && (
            <div className="flex-1 min-w-0">
              <Input
                className="w-full h-[50px] text-sm"
                style={{ marginTop: "-30px" }}
                placeholder="Document Type"
                type="text"
                label=""
                readOnly
                showDropdownIcon={true}
                name=""
                value={formatDocumentsDisplay()}
                onClick={() => setIsDocumentModalOpened(true)}
              />
              {isDocumentModalOpened && (
                <DocumentTypeComponent
                  docsSelected={filters.documentTypes || []}
                  setDocsSelected={(docs: string[]) =>
                    onFilterChange("documentTypes", docs)
                  }
                  closeModal={setIsDocumentModalOpened}
                />
              )}
            </div>
          )}

          {/* Bedroom Input - Equal flex */}
          <div className="flex-1 min-w-0">
            <Input
              className="w-full h-[50px] text-sm"
              style={{ marginTop: "-30px" }}
              placeholder="bedroom"
              type="text"
              label=""
              readOnly
              showDropdownIcon={true}
              name=""
              value={filters.bedrooms || ""}
              onClick={() => setIsBedroomModalOpened(true)}
            />
            {isBedroomModalOpened && (
              <BedroomComponent
                noOfBedrooms={filters.bedrooms}
                closeModal={setIsBedroomModalOpened}
                setNumberOfBedrooms={(bedrooms: number) =>
                  onFilterChange("bedrooms", bedrooms)
                }
              />
            )}
          </div>

          {/* Buttons Container - Fixed width */}
          <div className="flex gap-[15px] shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreFilterModalOpened(true)}
                className="w-[120px] h-[50px] border-[1px] border-[#09391C] text-base text-[#09391C] font-medium"
              >
                More filter
              </button>
              {isMoreFilterModalOpened && (
                <MoreFilter
                  filters={moreFilters}
                  setFilters={(newFilters: any) => {
                    setMoreFilters(newFilters);
                    onFilterChange("bathrooms", newFilters.bathroom);
                    onFilterChange("landSize", newFilters.landSize);
                    onFilterChange(
                      "desiredFeatures",
                      newFilters.desirer_features,
                    );
                  }}
                  closeModal={setIsMoreFilterModalOpened}
                />
              )}
            </div>
            <button
              type="button"
              className="w-[140px] h-[50px] bg-[#8DDB90] text-base text-white font-bold"
              onClick={() => {
                // Update filters based on form values before searching
                onFilterChange(
                  "selectedState",
                  locationFormik.values.selectedState,
                );
                onFilterChange(
                  "selectedLGA",
                  locationFormik.values.selectedLGA,
                );
                onFilterChange(
                  "selectedArea",
                  locationFormik.values.selectedArea,
                );
                onFilterChange("priceRange", {
                  min: priceFormik.values.minPrice,
                  max: priceFormik.values.maxPrice,
                });
                onSearch();
              }}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchFilters;
