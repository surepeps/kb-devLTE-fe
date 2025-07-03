"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSort,
  faMapMarkerAlt,
  faHeart,
  faShareAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import SearchFilters from "./search-filters";
import PropertyGrid from "./property-grid";
import PropertyMap from "./property-map";
import FilterModal from "./filter-modal";
import PropertyDetails from "./property-details";
import NegotiationModal from "@/components/modals/negotiation-modal";
import PriceModal from "@/components/modals/price-modal";
import LoadingSpinner from "./loading-spinner";
import EmptyState from "./empty-state";
import { useMarketplace } from "@/context/marketplace-context";
import { usePageContext } from "@/context/page-context";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import { shuffleArray } from "@/utils/shuffleArray";

interface Property {
  _id: string;
  title: string;
  price: number;
  rentalPrice?: number;
  location: {
    state: string;
    localGovernment: string;
    area?: string;
    coordinates?: [number, number];
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  isNegotiable: boolean;
  isFeatured: boolean;
  dateCreated: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface SearchFilters {
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
  sortBy: "price_asc" | "price_desc" | "date_new" | "date_old" | "relevance";
}

const NewMarketplace: React.FC = () => {
  const router = useRouter();
  const { selectedType, setSelectedType } = usePageContext();
  const { selectedForInspection } = useMarketplace();

  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    propertyType: "buy",
    location: {},
    priceRange: { min: 0, max: 1000000000 },
    sortBy: "date_new",
  });

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Computed values
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  // Load properties
  const loadProperties = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    try {
      const searchPayload = {
        marketType: filters.propertyType,
        state: filters.location.state,
        lga: filters.location.lga,
        area: filters.location.area,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        features: filters.features,
        amenities: filters.amenities,
      };

      const response = await POST_REQUEST(
        URLS.BASE + URLS.searchBrief,
        searchPayload,
      );

      const data = Array.isArray(response) ? response : response?.data || [];
      const shuffledData = shuffleArray(data);

      setProperties(shuffledData);
      applyFiltersAndSort(shuffledData, filters);
      toast.success(`Found ${shuffledData.length} properties`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to load properties");
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(
    (propertyList: Property[], filters: SearchFilters) => {
      let filtered = [...propertyList];

      // Apply price filter
      filtered = filtered.filter((property) => {
        const price = property.price || property.rentalPrice || 0;
        return (
          price >= filters.priceRange.min && price <= filters.priceRange.max
        );
      });

      // Apply bedroom filter
      if (filters.bedrooms) {
        filtered = filtered.filter(
          (property) => property.bedrooms >= filters.bedrooms!,
        );
      }

      // Apply bathroom filter
      if (filters.bathrooms) {
        filtered = filtered.filter(
          (property) => property.bathrooms >= filters.bathrooms!,
        );
      }

      // Apply features filter
      if (filters.features && filters.features.length > 0) {
        filtered = filtered.filter((property) =>
          filters.features!.some((feature) =>
            property.features?.some((pFeature) =>
              pFeature.toLowerCase().includes(feature.toLowerCase()),
            ),
          ),
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const priceA = a.price || a.rentalPrice || 0;
        const priceB = b.price || b.rentalPrice || 0;

        switch (filters.sortBy) {
          case "price_asc":
            return priceA - priceB;
          case "price_desc":
            return priceB - priceA;
          case "date_new":
            return (
              new Date(b.dateCreated).getTime() -
              new Date(a.dateCreated).getTime()
            );
          case "date_old":
            return (
              new Date(a.dateCreated).getTime() -
              new Date(b.dateCreated).getTime()
            );
          default:
            return 0;
        }
      });

      setFilteredProperties(filtered);
      setCurrentPage(1);
    },
    [],
  );

  // Handle search
  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setSearchFilters(filters);
      loadProperties(filters);
    },
    [loadProperties],
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updatedFilters = { ...searchFilters, ...newFilters };
      setSearchFilters(updatedFilters);
      applyFiltersAndSort(properties, updatedFilters);
    },
    [searchFilters, properties, applyFiltersAndSort],
  );

  // Handle property selection for negotiation
  const handleNegotiate = useCallback((property: Property) => {
    setSelectedProperty(property);
    setShowNegotiation(true);
  }, []);

  // Handle negotiation submission
  const handleNegotiationSubmit = useCallback((negotiationData: any) => {
    console.log("Negotiation submitted:", negotiationData);
    toast.success("Negotiation request submitted successfully!");
    setShowNegotiation(false);
    setSelectedProperty(null);
  }, []);

  // Initialize with default search
  useEffect(() => {
    const initialFilters: SearchFilters = {
      propertyType:
        selectedType === "Buy a property"
          ? "buy"
          : selectedType === "Rent/Lease a property"
            ? "rent"
            : "buy",
      location: {},
      priceRange: { min: 0, max: 1000000000 },
      sortBy: "date_new",
    };

    setSearchFilters(initialFilters);
    loadProperties(initialFilters);
  }, [selectedType, loadProperties]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-4">
            <button
              onClick={() => router.push("/")}
              className="hover:text-[#8DDB90] transition-colors"
            >
              Home
            </button>
            <span className="mx-2">›</span>
            <span className="text-[#8DDB90] font-medium">New Marketplace</span>
          </nav>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Advanced Property{" "}
                <span className="text-[#8DDB90]">Marketplace</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Discover your perfect property with advanced search and
                filtering
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#8DDB90] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-[#8DDB90] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Map View
              </button>
            </div>
          </div>

          {/* Search Filters */}
          <SearchFilters
            filters={searchFilters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {/* Results Summary & Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="text-gray-700">
              <span className="font-semibold">{filteredProperties.length}</span>{" "}
              properties found
              {searchFilters.location.state && (
                <span className="ml-2">
                  in{" "}
                  <span className="font-medium">
                    {searchFilters.location.state}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 mt-3 md:mt-0">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faFilter} />
                <span>Filters</span>
              </button>

              <button
                onClick={() => setShowPriceModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faSort} />
                <span>Sort</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner key="loading" />
          ) : filteredProperties.length === 0 ? (
            <EmptyState
              key="empty"
              onReset={() => handleSearch(searchFilters)}
            />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {viewMode === "grid" ? (
                <PropertyGrid
                  properties={paginatedProperties}
                  onNegotiate={handleNegotiate}
                  onViewDetails={setSelectedProperty}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              ) : (
                <PropertyMap
                  properties={filteredProperties}
                  onPropertySelect={setSelectedProperty}
                  onNegotiate={handleNegotiate}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={searchFilters}
        onApply={handleFilterChange}
      />

      <PriceModal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        onApply={(priceFilters) => {
          handleFilterChange({
            priceRange: priceFilters.priceRange,
            sortBy: priceFilters.sortBy,
          });
        }}
        currentFilters={{
          priceRange: searchFilters.priceRange,
          sortBy: searchFilters.sortBy,
          currency: "NGN",
          includeNegotiable: true,
        }}
        propertyType={searchFilters.propertyType === "rent" ? "rent" : "buy"}
      />

      {selectedProperty && showNegotiation && (
        <NegotiationModal
          isOpen={showNegotiation}
          onClose={() => {
            setShowNegotiation(false);
            setSelectedProperty(null);
          }}
          property={{
            id: selectedProperty._id,
            title: selectedProperty.title,
            askingPrice:
              selectedProperty.price || selectedProperty.rentalPrice || 0,
            image: selectedProperty.images?.[0],
            location: `${selectedProperty.location.area ? selectedProperty.location.area + ", " : ""}${selectedProperty.location.localGovernment}, ${selectedProperty.location.state}`,
          }}
          onSubmit={handleNegotiationSubmit}
        />
      )}

      {selectedProperty && !showNegotiation && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onNegotiate={() => setShowNegotiation(true)}
        />
      )}
    </div>
  );
};

export default NewMarketplace;
