/** @format */

"use client";
import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertySearchFilters, ActiveFilter } from "@/types/search.types";

interface ActiveFiltersProps {
  filters: Partial<PropertySearchFilters> & {
    priceRange?: { min: number; max: number; display?: string };
  };
  onRemoveFilter: (filterKey: string, value?: string | number) => void;
  onClearAll: () => void;
  onSubmitPreference?: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  onSubmitPreference,
}) => {
  const activeFilters: ActiveFilter[] = [];

  // Price Range
  if (
    filters.priceRange &&
    (filters.priceRange.min > 0 || filters.priceRange.max > 0)
  ) {
    activeFilters.push({
      key: "priceRange",
      label: `Price: ${filters.priceRange.display}`,
    });
  }

  // Location
  if (filters.selectedState || filters.selectedLGA || filters.selectedArea) {
    const locationParts = [
      filters.selectedArea,
      filters.selectedLGA,
      filters.selectedState,
    ].filter(Boolean);
    if (locationParts.length > 0) {
      activeFilters.push({
        key: "location",
        label: `Location: ${locationParts.join(", ")}`,
      });
    }
  }

  // Usage Options
  if (filters.usageOptions && filters.usageOptions.length > 0) {
    const validOptions = filters.usageOptions.filter(
      (option) => option !== "All",
    );
    validOptions.forEach((option) => {
      activeFilters.push({
        key: "usageOptions",
        label: `Type: ${option}`,
        value: option,
      });
    });
  }

  // Bedrooms
  if (filters.bedrooms) {
    activeFilters.push({
      key: "bedrooms",
      label: `Bedrooms: ${filters.bedrooms}`,
    });
  }

  // Bathrooms
  if (filters.bathrooms) {
    activeFilters.push({
      key: "bathrooms",
      label: `Bathrooms: ${filters.bathrooms}`,
    });
  }

  // Document Types
  if (filters.documentTypes && filters.documentTypes.length > 0) {
    filters.documentTypes.forEach((doc) => {
      // Shorten document names for display
      const shortDoc = doc.length > 20 ? doc.substring(0, 20) + "..." : doc;
      activeFilters.push({
        key: "documentTypes",
        label: `Doc: ${shortDoc}`,
        value: doc,
      });
    });
  }

  // Land Size
  if (filters.landSize && filters.landSize.size) {
    activeFilters.push({
      key: "landSize",
      label: `Land: ${filters.landSize.size} ${filters.landSize.type}`,
    });
  }

  // Desired Features
  if (filters.desiredFeatures && filters.desiredFeatures.length > 0) {
    filters.desiredFeatures.forEach((feature) => {
      const shortFeature =
        feature.length > 15 ? feature.substring(0, 15) + "..." : feature;
      activeFilters.push({
        key: "desiredFeatures",
        label: `Feature: ${shortFeature}`,
        value: feature,
      });
    });
  }

  // Tenant Criteria (for rent tab)
  if (filters.tenantCriteria && filters.tenantCriteria.length > 0) {
    filters.tenantCriteria.forEach((criteria) => {
      const shortCriteria =
        criteria.length > 15 ? criteria.substring(0, 15) + "..." : criteria;
      activeFilters.push({
        key: "tenantCriteria",
        label: `Criteria: ${shortCriteria}`,
        value: criteria,
      });
    });
  }

  // Home Condition (for rent tab)
  if (filters.homeCondition) {
    activeFilters.push({
      key: "homeCondition",
      label: `Condition: ${filters.homeCondition}`,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
    >
      {/* Header with Submit Preference Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {onSubmitPreference && (
            <button
              onClick={onSubmitPreference}
              className="bg-[#09391C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B423D] transition-colors whitespace-nowrap"
            >
              Submit Your Preference
            </button>
          )}
          <h3 className="text-sm font-medium text-[#09391C]">Active Filters</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-[#FF3D00] hover:text-[#E53100] font-medium transition-colors self-start sm:self-auto"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {activeFilters.map((filter, index) => (
            <motion.div
              key={`${filter.key}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 bg-[#8DDB90] text-white px-3 py-1 rounded-full text-xs font-medium max-w-full"
            >
              <span className="truncate">{filter.label}</span>
              <button
                onClick={() => onRemoveFilter(filter.key, filter.value)}
                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors flex-shrink-0"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActiveFilters;
