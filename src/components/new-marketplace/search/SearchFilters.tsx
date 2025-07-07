/** @format */

"use client";
import React, { useState, Fragment, useEffect } from "react";
import { useFormik } from "formik";
import SelectStateLGA from "../../marketplace/select-state-lga";
import Input from "../../general-components/Input";
import PriceRange from "../../marketplace/price-range";
import BedroomComponent from "../../marketplace/bedroom";
import MoreFilter from "../../marketplace/more-filter";
import DocumentTypeComponent from "../../marketplace/document-type";
import RadioCheck from "../../general-components/radioCheck";
import { AnimatePresence } from "framer-motion";

interface SearchFiltersProps {
  tab: "buy" | "jv" | "rent";
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onSearch: () => void;
  loading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  tab,
  filters,
  onFilterChange,
  onClearFilters,
  onSearch,
  loading,
}) => {
  // Modal states for existing components
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

  // State/LGA formik for existing SelectStateLGA component
  const locationFormik = useFormik({
    initialValues: {
      selectedLGA: filters.selectedLGA || "",
      selectedState: filters.selectedState || "",
    },
    onSubmit: () => {},
  });

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

  const usageOptions = getUsageOptions();

  // Sync location formik with filter changes
  useEffect(() => {
    locationFormik.setValues({
      selectedLGA: filters.selectedLGA || "",
      selectedState: filters.selectedState || "",
    });
  }, [filters.selectedState, filters.selectedLGA]);

  // Sync price formik with filter changes
  useEffect(() => {
    priceFormik.setValues({
      minPrice: filters.priceRange?.min || 0,
      maxPrice: filters.priceRange?.max || 0,
    });
  }, [filters.priceRange]);

  return (
    <Fragment>
      {/* Filter by checkboxes - exact copy of existing design */}
      <div className="container min-h-[181px] hidden md:flex flex-col gap-[25px] py-[25px] px-[30px] bg-[#FFFFFF] sticky top-0 z-20">
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
              className="h-[34px] w-[133px] bg-transparent text-[#FF3D00] border-[1px] border-[#FF3D00] font-medium text-sm"
              type="button"
              onClick={() => {
                // Handle selected briefs - this will be managed by parent component
                console.log("Selected briefs clicked");
              }}
            >
              0 selected briefs
            </button>
          </div>
        </div>

        {/* Filter inputs row - exact copy of existing design */}
        <div className="w-full flex items-center gap-[15px]">
          {/* Location Input - Fixed width */}
          <div className="w-[280px]">
            <SelectStateLGA
              placeholder="Enter state, lga, city...."
              formik={locationFormik}
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
