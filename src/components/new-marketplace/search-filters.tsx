"use client";

import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMapMarkerAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { searchLocations, formatLocationString } from "@/utils/location-utils";
import useClickOutside from "@/hooks/clickOutside";

interface SearchFiltersProps {
  filters: {
    propertyType: "buy" | "rent" | "lease" | "joint-venture";
    location: {
      state?: string;
      lga?: string;
      area?: string;
    };
    priceRange: {
      min: number;
      max: number;
    };
    bedrooms?: number;
    bathrooms?: number;
    features?: string[];
    amenities?: string[];
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
  onSearch: (filters: any) => void;
}

const propertyTypes = [
  { value: "buy", label: "Buy a property", icon: "🏠" },
  { value: "rent", label: "Rent/Lease a property", icon: "🏢" },
  { value: "lease", label: "Long-term lease", icon: "📋" },
  { value: "joint-venture", label: "Joint venture", icon: "🤝" },
];

const bedroomOptions = [
  { value: 1, label: "1+ Bedrooms" },
  { value: 2, label: "2+ Bedrooms" },
  { value: 3, label: "3+ Bedrooms" },
  { value: 4, label: "4+ Bedrooms" },
  { value: 5, label: "5+ Bedrooms" },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: filters.priceRange.min.toString(),
    max: filters.priceRange.max.toString(),
  });

  const locationRef = useRef<HTMLDivElement>(null);

  useClickOutside(locationRef, () => setShowLocationDropdown(false));

  // Handle location search
  const handleLocationSearch = useCallback((query: string) => {
    setLocationQuery(query);

    if (query.length > 2) {
      const suggestions = searchLocations(query);
      setLocationSuggestions(suggestions);
      setShowLocationDropdown(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
    }
  }, []);

  // Handle location selection
  const handleLocationSelect = useCallback(
    (location: any) => {
      const locationString = formatLocationString(
        location.state,
        location.lga,
        location.area,
      );
      setLocationQuery(locationString);
      setShowLocationDropdown(false);

      onFilterChange({
        location: {
          state: location.state,
          lga: location.lga,
          area: location.area,
        },
      });
    },
    [onFilterChange],
  );

  // Format price input
  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? Number(numericValue).toLocaleString() : "";
  };

  // Handle price change
  const handlePriceChange = useCallback(
    (type: "min" | "max", value: string) => {
      const numericValue = Number(value.replace(/,/g, ""));
      const updatedRange = { ...priceRange, [type]: value };
      setPriceRange(updatedRange);

      onFilterChange({
        priceRange: {
          ...filters.priceRange,
          [type]: numericValue,
        },
      });
    },
    [priceRange, filters.priceRange, onFilterChange],
  );

  // Handle search submission
  const handleSearch = useCallback(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      {/* Property Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          What are you looking for?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onFilterChange({ propertyType: type.value })}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                filters.propertyType === type.value
                  ? "border-[#8DDB90] bg-[#8DDB90]/10 text-[#8DDB90]"
                  : "border-gray-200 hover:border-[#8DDB90]/50 text-gray-700"
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Location Search */}
        <div className="lg:col-span-4" ref={locationRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-gray-400"
              />
            </div>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => handleLocationSearch(e.target.value)}
              onFocus={() =>
                locationSuggestions.length > 0 && setShowLocationDropdown(true)
              }
              placeholder="Search by state, LGA, or area..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
            />

            <AnimatePresence>
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
                >
                  {locationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {formatLocationString(
                          suggestion.state,
                          suggestion.lga,
                          suggestion.area,
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {suggestion.area
                          ? "Area"
                          : suggestion.lga
                            ? "LGA"
                            : "State"}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Price Range */}
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (₦)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₦
              </span>
              <input
                type="text"
                value={priceRange.min}
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  handlePriceChange("min", formatted);
                }}
                placeholder="Min price"
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₦
              </span>
              <input
                type="text"
                value={priceRange.max}
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  handlePriceChange("max", formatted);
                }}
                placeholder="Max price"
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <select
            value={filters.bedrooms || ""}
            onChange={(e) =>
              onFilterChange({
                bedrooms: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
          >
            <option value="">Any</option>
            {bedroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
            Search
          </label>
          <button
            onClick={handleSearch}
            className="w-full bg-[#8DDB90] text-white py-3 px-6 rounded-lg hover:bg-[#7BC87F] transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Search Properties</span>
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Quick filters:</span>
          {[
            {
              label: "New Listings",
              action: () => onFilterChange({ sortBy: "date_new" }),
            },
            {
              label: "Price: Low to High",
              action: () => onFilterChange({ sortBy: "price_asc" }),
            },
            {
              label: "Price: High to Low",
              action: () => onFilterChange({ sortBy: "price_desc" }),
            },
            {
              label: "Featured",
              action: () => onFilterChange({ featured: true }),
            },
          ].map((filter, index) => (
            <button
              key={index}
              onClick={filter.action}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-[#8DDB90] hover:text-white transition-colors"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
