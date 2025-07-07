/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNewMarketplace, SearchParams } from "@/context/new-marketplace-context";
import SearchFilters from "./SearchFilters";
import { IsMobile } from "@/hooks/isMobile";

const BuyPropertySearch = () => {
  const {
    buyTab,
    searchTabProperties,
    setTabFilter,
    clearTabFilters,
    activeTab,
    setIsAddForInspectionOpen,
  } = useNewMarketplace();

  const isMobile = IsMobile();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (page = 1) => {
    const searchParams: SearchParams = {
      briefType: "buy",
      page,
      limit: 12,
    };

    // Add location filter
    if (filters.selectedState || filters.selectedLGA || filters.selectedArea) {
      const locationParts = [
        filters.selectedArea,
        filters.selectedLGA,
        filters.selectedState,
      ].filter(Boolean);
      searchParams.location = locationParts.join(", ");
    }

    // Add price range
    if (filters.priceRange.min > 0 || filters.priceRange.max > 0) {
      searchParams.priceRange = {
        min: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
        max: filters.priceRange.max > 0 ? filters.priceRange.max : undefined,
      };
    }

    // Add other filters
    if (filters.documentTypes.length > 0) {
      searchParams.documentType = filters.documentTypes;
    }

    if (filters.bedrooms) {
      searchParams.bedroom = filters.bedrooms;
    }

    if (filters.bathrooms) {
      searchParams.bathroom = filters.bathrooms;
    }

    if (filters.landSize.size) {
      searchParams.landSize = filters.landSize.size;
      searchParams.landSizeType = filters.landSize.type;
    }

    if (filters.desiredFeatures.length > 0) {
      searchParams.desireFeature = filters.desiredFeatures;
    }

    if (filters.homeCondition) {
      searchParams.homeCondition = filters.homeCondition;
    }

    // Perform search
    await searchTabProperties("buy", searchParams);
  };

  // Listen for pagination events
  useEffect(() => {
    const handlePaginationSearch = (event: CustomEvent) => {
      const { tab, page } = event.detail;
      if (tab === "buy") {
        handleSearch(page);
      }
    };

    window.addEventListener(
      "marketplace-search",
      handlePaginationSearch as EventListener,
    );

    return () => {
      window.removeEventListener(
        "marketplace-search",
        handlePaginationSearch as EventListener,
      );
    };
  }, [handleSearch]);

  // Search form
  const searchFormik = useFormik({
    initialValues: {
      location: "",
      propertyType: "",
      priceMin: "",
      priceMax: "",
      bedrooms: "",
    },
    onSubmit: (values) => {
      handleSearch();
    },
  });

  // Filter states
  const [filters, setFilters] = useState({
    selectedState: "",
    selectedLGA: "",
    selectedArea: "",
    priceRange: { min: 0, max: 0 },
    documentTypes: [] as string[],
    bedrooms: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
    landSize: {
      type: "plot",
      size: undefined as number | undefined,
    },
    desiredFeatures: [] as string[],
    homeCondition: "",
  });

  const handleClearFilters = () => {
    setFilters({
      selectedState: "",
      selectedLGA: "",
      selectedArea: "",
      priceRange: { min: 0, max: 0 },
      documentTypes: [],
      bedrooms: undefined,
      bathrooms: undefined,
      landSize: {
        type: "plot",
        size: undefined,
      },
      desiredFeatures: [],
      homeCondition: "",
    });

    searchFormik.resetForm();
    clearTabFilters("buy");
  };

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Initial load only
  useEffect(() => {
    if (activeTab === "buy" && buyTab.formikStatus === "idle") {
      handleSearch();
    }
  }, [activeTab]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#09391C]">
            Find Properties to Buy
          </h3>
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-[#8DDB90] font-medium"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          )}
        </div>
      </div>

      {/* Search Filters */}
      <div className={`${isMobile && !showFilters ? "hidden" : "block"}`}>
        <SearchFilters
          tab="buy"
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={handleClearFilters}
          onSearch={handleSearch}
          loading={buyTab.formikStatus === "pending"}
          selectedCount={buyTab.selectedForInspection.length}
          onOpenInspection={() => setIsAddForInspectionOpen(true)}
        />
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-[#5A5D63]">
          <span>
            {buyTab.properties.length > 0
              ? `${buyTab.totalItems} properties found`
              : buyTab.formikStatus === "success"
                ? "No properties found"
                : "Search for properties"}
          </span>
          {buyTab.properties.length > 0 && (
            <span>
              Page {buyTab.currentPage} of {buyTab.totalPages}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyPropertySearch;
