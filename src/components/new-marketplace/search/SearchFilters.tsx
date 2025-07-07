/** @format */

"use client";
import React, { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import Button from "@/components/general-components/button";

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStateChange = (state: string) => {
    onFilterChange("selectedState", state);
    onFilterChange("selectedLGA", ""); // Reset LGA when state changes
    onFilterChange("selectedArea", ""); // Reset area when state changes
  };

  const handleLGAChange = (lga: string) => {
    onFilterChange("selectedLGA", lga);
    onFilterChange("selectedArea", ""); // Reset area when LGA changes
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFilterChange("priceRange", { min, max });
  };

  const states = [
    "Lagos",
    "Abuja",
    "Ogun",
    "Oyo",
    "Kano",
    "Rivers",
    "Kaduna",
    "Anambra",
    "Imo",
    "Enugu",
  ];

  const lgas = {
    Lagos: [
      "Ikeja",
      "Victoria Island",
      "Lekki",
      "Ajah",
      "Surulere",
      "Yaba",
      "Ikoyi",
    ],
    Abuja: ["Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa"],
    Ogun: ["Abeokuta North", "Sagamu", "Ijebu Ode", "Ado-Odo/Ota"],
  };

  const documentTypes = [
    "Certificate of Occupancy (C of O)",
    "Deed of Assignment",
    "Governor's Consent",
    "Survey Plan",
    "Building Plan Approval",
  ];

  const desiredFeatures = [
    "Swimming Pool",
    "Gym",
    "Parking Space",
    "Generator",
    "Security",
    "Garden",
    "Balcony",
    "Air Conditioning",
    "Internet",
    "Elevator",
  ];

  const homeConditions = [
    "New",
    "Renovated",
    "Good",
    "Fair",
    "Needs Renovation",
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Basic Filters Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* State Selection */}
        <div>
          <label className="block text-sm font-medium text-[#24272C] mb-1">
            State
          </label>
          <select
            value={filters.selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* LGA Selection */}
        <div>
          <label className="block text-sm font-medium text-[#24272C] mb-1">
            LGA
          </label>
          <select
            value={filters.selectedLGA}
            onChange={(e) => handleLGAChange(e.target.value)}
            disabled={!filters.selectedState}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm disabled:bg-gray-100"
          >
            <option value="">Select LGA</option>
            {filters.selectedState &&
              lgas[filters.selectedState as keyof typeof lgas]?.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
          </select>
        </div>

        {/* Area Input */}
        <div>
          <label className="block text-sm font-medium text-[#24272C] mb-1">
            Area
          </label>
          <input
            type="text"
            value={filters.selectedArea}
            onChange={(e) => onFilterChange("selectedArea", e.target.value)}
            placeholder="Enter specific area"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
          />
        </div>
      </div>

      {/* Basic Filters Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-[#24272C] mb-1">
            Min Price (₦)
          </label>
          <input
            type="number"
            value={filters.priceRange.min || ""}
            onChange={(e) =>
              handlePriceRangeChange(
                parseInt(e.target.value) || 0,
                filters.priceRange.max,
              )
            }
            placeholder="Minimum"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#24272C] mb-1">
            Max Price (₦)
          </label>
          <input
            type="number"
            value={filters.priceRange.max || ""}
            onChange={(e) =>
              handlePriceRangeChange(
                filters.priceRange.min,
                parseInt(e.target.value) || 0,
              )
            }
            placeholder="Maximum"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-[#24272C] mb-1">
            Bedrooms
          </label>
          <select
            value={filters.bedrooms || ""}
            onChange={(e) =>
              onFilterChange("bedrooms", parseInt(e.target.value) || undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}+ Bedroom{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-[#24272C] mb-1">
            Bathrooms
          </label>
          <select
            value={filters.bathrooms || ""}
            onChange={(e) =>
              onFilterChange("bathrooms", parseInt(e.target.value) || undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}+ Bathroom{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="border-t pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-[#8DDB90] font-medium text-sm hover:text-[#76c77a] transition-colors"
        >
          Advanced Filters
          <ChevronDown
            size={16}
            className={`transform transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t">
          {/* Document Types */}
          {tab !== "jv" && (
            <div>
              <label className="block text-sm font-medium text-[#24272C] mb-2">
                Required Documents
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {documentTypes.map((doc) => (
                  <label key={doc} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.documentTypes.includes(doc)}
                      onChange={(e) => {
                        const updatedDocs = e.target.checked
                          ? [...filters.documentTypes, doc]
                          : filters.documentTypes.filter(
                              (d: string) => d !== doc,
                            );
                        onFilterChange("documentTypes", updatedDocs);
                      }}
                      className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]"
                    />
                    <span className="text-sm text-[#24272C]">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Home Condition */}
          {tab !== "jv" && (
            <div>
              <label className="block text-sm font-medium text-[#24272C] mb-2">
                Property Condition
              </label>
              <select
                value={filters.homeCondition}
                onChange={(e) =>
                  onFilterChange("homeCondition", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
              >
                <option value="">Any Condition</option>
                {homeConditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Desired Features */}
          <div>
            <label className="block text-sm font-medium text-[#24272C] mb-2">
              Desired Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {desiredFeatures.map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.desiredFeatures.includes(feature)}
                    onChange={(e) => {
                      const updatedFeatures = e.target.checked
                        ? [...filters.desiredFeatures, feature]
                        : filters.desiredFeatures.filter(
                            (f: string) => f !== feature,
                          );
                      onFilterChange("desiredFeatures", updatedFeatures);
                    }}
                    className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm text-[#24272C]">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Land Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#24272C] mb-1">
                Land Size Type
              </label>
              <select
                value={filters.landSize.type}
                onChange={(e) =>
                  onFilterChange("landSize", {
                    ...filters.landSize,
                    type: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
              >
                <option value="plot">Plot</option>
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
                <option value="sqm">Square Meters</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#24272C] mb-1">
                Land Size
              </label>
              <input
                type="number"
                value={filters.landSize.size || ""}
                onChange={(e) =>
                  onFilterChange("landSize", {
                    ...filters.landSize,
                    size: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Enter size"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8DDB90] text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onClearFilters}
          className="text-[#5A5D63] hover:text-[#24272C] font-medium text-sm transition-colors"
        >
          Clear All Filters
        </button>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onSearch}
            value={loading ? "Searching..." : "Search Properties"}
            disabled={loading}
            className="px-6 py-2 bg-[#8DDB90] text-white rounded-lg font-medium hover:bg-[#76c77a] transition-colors disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
