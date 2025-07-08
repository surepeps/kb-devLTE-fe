/** @format */

"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import useClickOutside from "@/hooks/clickOutside";
import LocationSearch from "./search/LocationSearch";
import RadioCheck from "../general-components/radioCheck";
import PriceRangeFilter from "./filters/PriceRangeFilter";
import BedroomFilter from "./filters/BedroomFilter";
import DocumentTypeFilter from "./filters/DocumentTypeFilter";
import MoreFiltersModal from "./filters/MoreFiltersModal";
import { Check } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: "buy" | "jv" | "rent";
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  tab,
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // State for form values
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0, display: "" });
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | string>("");
  const [selectedBathrooms, setSelectedBathrooms] = useState<number | string>(
    "",
  );
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [landSizeType, setLandSizeType] = useState<string>("plot");
  const [landSizeValue, setLandSizeValue] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

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

  // Property features
  const propertyFeatures = [
    "Air Conditioning",
    "Swimming Pool",
    "Garden/Lawn",
    "Gym/Fitness Center",
    "Security System",
    "Backup Generator",
    "Solar Power",
    "Balcony/Terrace",
    "Garage",
    "Servant Quarters",
    "Study Room",
    "Dining Room",
    "Family Lounge",
    "Kitchen Pantry",
    "Walk-in Closet",
    "En-suite Bathroom",
    "Guest Toilet",
    "Laundry Room",
    "Storage Room",
    "Elevator",
    "Playground",
    "24/7 Security",
    "CCTV Surveillance",
    "Intercom System",
    "Gated Community",
    "Paved Roads",
    "Street Lighting",
    "Water Treatment Plant",
  ];

  // Document types
  const documentTypes = [
    "Certificate of Occupancy (C of O)",
    "Deed of Assignment",
    "Survey Plan",
    "Building Plan Approval",
    "Tax Receipt",
    "Power of Attorney",
    "Probate/Letters of Administration",
    "Gazette",
    "Registered Conveyance",
    "Consent to Assignment",
    "Right of Occupancy",
    "Customary Right of Occupancy",
  ];

  // Initialize values from filters
  useEffect(() => {
    if (filters.priceRange) {
      setPriceRange(filters.priceRange);
    }
    if (filters.bedrooms) {
      setSelectedBedrooms(filters.bedrooms);
    }
    if (filters.bathrooms) {
      setSelectedBathrooms(filters.bathrooms);
    }
    if (filters.documentTypes) {
      setSelectedDocuments([...filters.documentTypes]);
    }
    if (filters.landSize) {
      setLandSizeType(filters.landSize.type || "plot");
      setLandSizeValue(filters.landSize.size?.toString() || "");
    }
    if (filters.desiredFeatures) {
      setSelectedFeatures([...filters.desiredFeatures]);
    }
  }, [filters]);

  useClickOutside(modalRef, onClose);

  const handleApplyFilters = () => {
    // Apply all current form values to filters
    if (priceRange.min > 0 || priceRange.max > 0) {
      onFilterChange("priceRange", priceRange);
    }
    if (selectedBedrooms) {
      onFilterChange("bedrooms", selectedBedrooms);
    }
    if (selectedBathrooms) {
      onFilterChange("bathrooms", selectedBathrooms);
    }
    if (selectedDocuments.length > 0) {
      onFilterChange("documentTypes", selectedDocuments);
    }
    if (landSizeValue) {
      onFilterChange("landSize", {
        type: landSizeType,
        size: parseInt(landSizeValue.replace(/,/g, "")),
      });
    }
    if (selectedFeatures.length > 0) {
      onFilterChange("desiredFeatures", selectedFeatures);
    }

    onApplyFilters();
    onClose();
  };

  const formatNumberInput = (value: string) => {
    const number = value.replace(/[^0-9]/g, "");
    return number ? parseInt(number).toLocaleString() : "";
  };

  const usageOptions = getUsageOptions();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9999] flex items-end sm:items-center justify-center"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-lg mx-4 mb-0 sm:mb-4 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#09391C]">
                  Filter Properties
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-[#5A5D63]" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Usage Options */}
              <div>
                <h3 className="text-sm font-medium text-[#09391C] mb-3">
                  Property Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
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
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium text-[#09391C] mb-3">
                  Location
                </h3>
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

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-[#09391C] mb-3">
                  Price Range
                </h3>
                <button
                  onClick={() => setIsPriceRangeModalOpened(true)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg text-left text-sm text-[#5A5D63] bg-white hover:border-[#8DDB90] transition-colors"
                >
                  {formatPriceDisplay(priceRadioValue, priceFormik) ||
                    "Select price range"}
                </button>
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

              {/* Document Type */}
              {tab !== "jv" && (
                <div>
                  <h3 className="text-sm font-medium text-[#09391C] mb-3">
                    Document Type
                  </h3>
                  <button
                    onClick={() => setIsDocumentModalOpened(true)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg text-left text-sm text-[#5A5D63] bg-white hover:border-[#8DDB90] transition-colors"
                  >
                    {formatDocumentsDisplay() || "Select documents"}
                  </button>
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

              {/* Bedrooms */}
              <div>
                <h3 className="text-sm font-medium text-[#09391C] mb-3">
                  Bedrooms
                </h3>
                <button
                  onClick={() => setIsBedroomModalOpened(true)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg text-left text-sm text-[#5A5D63] bg-white hover:border-[#8DDB90] transition-colors"
                >
                  {filters.bedrooms || "Select bedrooms"}
                </button>
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

              {/* More Filters */}
              <div>
                <h3 className="text-sm font-medium text-[#09391C] mb-3">
                  Additional Filters
                </h3>
                <button
                  onClick={() => setIsMoreFilterModalOpened(true)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg text-left text-sm text-[#5A5D63] bg-white hover:border-[#8DDB90] transition-colors"
                >
                  Bathrooms, Land Size & Features
                </button>
                {isMoreFilterModalOpened && (
                  <MoreFilter
                    filters={moreFilters}
                    setFilters={(newFilters: any) => {
                      setMoreFilters(newFilters);
                    }}
                    closeModal={setIsMoreFilterModalOpened}
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
              <button
                onClick={onClearFilters}
                className="w-full h-12 border border-[#FF3D00] text-[#FF3D00] rounded-lg font-medium hover:bg-[#FF3D00] hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="w-full h-12 bg-[#8DDB90] text-white rounded-lg font-medium hover:bg-[#76c77a] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
