/** @format */

"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import useClickOutside from "@/hooks/clickOutside";
import LocationSearch from "./search/LocationSearch";
import PriceRange from "../marketplace/price-range";
import BedroomComponent from "../marketplace/bedroom";
import MoreFilter from "../marketplace/more-filter";
import DocumentTypeComponent from "../marketplace/document-type";
import RadioCheck from "../general-components/radioCheck";
import { useFormik } from "formik";

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

  // Modal states for nested components
  const [isPriceRangeModalOpened, setIsPriceRangeModalOpened] = useState(false);
  const [isDocumentModalOpened, setIsDocumentModalOpened] = useState(false);
  const [isBedroomModalOpened, setIsBedroomModalOpened] = useState(false);
  const [isMoreFilterModalOpened, setIsMoreFilterModalOpened] = useState(false);
  const [priceRadioValue, setPriceRadioValue] = useState("");

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

  // Price formik for existing PriceRange component
  const priceFormik = useFormik({
    initialValues: {
      minPrice: filters.priceRange?.min || 0,
      maxPrice: filters.priceRange?.max || 0,
    },
    onSubmit: () => {},
  });

  // More filters state for existing MoreFilter component
  const [moreFilters, setMoreFilters] = useState({
    bathroom: filters.bathrooms || undefined,
    landSize: filters.landSize || {
      type: "plot",
      size: undefined,
    },
    desirer_features: filters.desiredFeatures || [],
  });

  useClickOutside(modalRef, onClose);

  const formatPriceDisplay = (radioValue: string, formik: any) => {
    if (radioValue) {
      return radioValue;
    }
    const { minPrice, maxPrice } = formik.values;
    if (minPrice > 0 || maxPrice > 0) {
      const min = minPrice > 0 ? `₦${minPrice.toLocaleString()}` : "Min";
      const max = maxPrice > 0 ? `₦${maxPrice.toLocaleString()}` : "Max";
      return `${min} - ${max}`;
    }
    return "";
  };

  const formatDocumentsDisplay = () => {
    const docs = filters.documentTypes || [];
    return docs.length > 0 ? `${docs.length} documents selected` : "";
  };

  const handleApplyFilters = () => {
    // Update price range from formik
    onFilterChange("priceRange", {
      min: priceFormik.values.minPrice,
      max: priceFormik.values.maxPrice,
    });

    // Update more filters
    onFilterChange("bathrooms", moreFilters.bathroom);
    onFilterChange("landSize", moreFilters.landSize);
    onFilterChange("desiredFeatures", moreFilters.desirer_features);

    onApplyFilters();
    onClose();
  };

  const usageOptions = getUsageOptions();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center"
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
