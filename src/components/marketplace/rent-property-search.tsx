"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import RentSearchModal from "./rent-search-modal";
import Card from "../general-components/card";
import Loading from "../loading-component/loading";
import Pagination from "../general-components/pagination";
import EmptyState from "../general-components/empty-state";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import { shuffleArray } from "@/utils/shuffleArray";
import { useRouter } from "next/navigation";
import { useSelectedBriefs } from "@/context/selected-briefs-context";

interface RentPropertySearchProps {
  propertiesSelected: any[];
  setPropertiesSelected: (properties: any[]) => void;
  isAddForInspectionModalOpened: boolean;
  setIsAddInspectionModalOpened: (opened: boolean) => void;
  addForInspectionPayload: any;
  setAddForInspectionPayload: (payload: any) => void;
  isComingFromPriceNeg?: boolean;
  comingFromPriceNegotiation?: (type: boolean) => void;
  inspectionType: "Buy" | "JV" | "Rent/Lease";
  setInspectionType: (type: "Buy" | "JV" | "Rent/Lease") => void;
}

const RentPropertySearch: React.FC<RentPropertySearchProps> = ({
  propertiesSelected,
  setPropertiesSelected,
  isAddForInspectionModalOpened,
  setIsAddInspectionModalOpened,
  addForInspectionPayload,
  setAddForInspectionPayload,
  isComingFromPriceNeg,
  comingFromPriceNegotiation,
  inspectionType,
  setInspectionType,
}) => {
  const router = useRouter();
  const { selectedBriefs, setSelectedBriefs } = useSelectedBriefs();
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rentFilterBy, setRentFilterBy] = useState<string[]>([]);
  const [homeCondition, setHomeCondition] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uniqueProperties, setUniqueProperties] = useState<Set<any>>(
    new Set(propertiesSelected),
  );

  const itemsPerPage = 12;

  const handleSearch = async (searchPayload: any) => {
    setLoading(true);
    try {
      const response = await POST_REQUEST(
        URLS.BASE + URLS.searchBrief,
        searchPayload,
      );
      const data = Array.isArray(response) ? response : response?.data;

      if (!data) {
        toast.error("Failed to fetch properties");
        return;
      }

      const shuffledData = shuffleArray(data);
      setProperties(shuffledData);
      setFilteredProperties(shuffledData);
      setTotalPages(Math.ceil(shuffledData.length / itemsPerPage));
      setCurrentPage(1);
      toast.success("Properties loaded!");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search properties");
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelection = (property: any) => {
    const maximumSelection = 2;
    if (uniqueProperties.size === maximumSelection) {
      return toast.error(
        `Maximum of ${maximumSelection} properties can be selected`,
      );
    }

    const newSet = new Set(uniqueProperties);
    newSet.add(property);
    setUniqueProperties(newSet);
    setPropertiesSelected(Array.from(newSet));
    toast.success("Property selected");
  };

  const handleRemoveProperty = (property: any) => {
    const newSet = new Set(uniqueProperties);
    newSet.delete(property);
    setUniqueProperties(newSet);
    setPropertiesSelected(Array.from(newSet));
    toast.success("Property removed");
  };

  // Filter properties based on rent filter options and condition
  useEffect(() => {
    let filtered = properties;

    if (rentFilterBy.length > 0 && !rentFilterBy.includes("All")) {
      filtered = filtered.filter((property) =>
        rentFilterBy.some((option) => property.propertyType === option),
      );
    }

    if (homeCondition && !homeCondition.includes("All")) {
      filtered = filtered.filter(
        (property) => property.propertyCondition === homeCondition,
      );
    }

    setFilteredProperties(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [rentFilterBy, homeCondition, properties]);

  // Get current page properties
  const getCurrentPageProperties = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProperties.slice(startIndex, endIndex);
  };

  // Load initial data
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${URLS.BASE}${URLS.fetchBriefs}?page=1&limit=1000&briefType=Rent`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        const approvedData = Array.isArray(data.data)
          ? data.data.filter((item: any) => item.isApproved === true)
          : [];

        const shuffledData = shuffleArray(approvedData);
        setProperties(shuffledData);
        setFilteredProperties(shuffledData);
        setTotalPages(Math.ceil(shuffledData.length / itemsPerPage));
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Sync local selection to context
  useEffect(() => {
    setSelectedBriefs(Array.from(uniqueProperties));
  }, [uniqueProperties, setSelectedBriefs]);

  if (loading && properties.length === 0) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      {/* Search Modal */}
      <div className="mb-6 md:mb-8">
        <RentSearchModal
          homeCondition={homeCondition}
          setHomeCondition={setHomeCondition}
          rentFilterBy={rentFilterBy}
          setRentFilterBy={setRentFilterBy}
          selectedBriefs={uniqueProperties.size}
          setSelectedBriefs={setUniqueProperties}
          setAddInspectionModal={setIsAddInspectionModalOpened}
          addForInspectionPayload={addForInspectionPayload}
          setUsageOptions={setRentFilterBy}
          inspectionType={inspectionType}
          setInspectionType={setInspectionType}
          onSearch={handleSearch}
          searchStatus={{
            status: loading ? "pending" : "success",
            couldNotFindAProperty: false,
          }}
        />
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        {filteredProperties.length === 0 && !loading ? (
          <EmptyState
            title="No Rental Properties Found"
            description="Try adjusting your search filters or check back later for new rental listings."
            actionText="Reset Filters"
            onAction={() => {
              setRentFilterBy([]);
              setHomeCondition("");
            }}
          />
        ) : (
          <>
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-[#09391C] mb-2 md:mb-0">
                Available Rentals ({filteredProperties.length})
              </h2>
              {uniqueProperties.size > 0 && (
                <div className="text-sm text-[#5A5D63]">
                  {uniqueProperties.size} property(ies) selected
                </div>
              )}
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
              {getCurrentPageProperties().map((property, index) => (
                <Card
                  key={property._id || index}
                  images={property?.pictures || []}
                  property={property}
                  isPremium={property?.isPremium}
                  onCardPageClick={() => {
                    router.push(`/property/Rent/${property._id}`);
                  }}
                  onClick={() => {
                    if (uniqueProperties.has(property)) {
                      handleRemoveProperty(property);
                    } else {
                      handlePropertySelection(property);
                    }
                  }}
                  cardData={[
                    {
                      header: "Property Type",
                      value: property.propertyType,
                    },
                    {
                      header: "Price",
                      value: property.price
                        ? `₦${Number(property.price).toLocaleString()}`
                        : "N/A",
                    },
                    {
                      header: "Bedrooms",
                      value: property.noOfBedrooms || "N/A",
                    },
                    {
                      header: "Location",
                      value: `${property.location.state}, ${property.location.localGovernment}`,
                    },
                  ]}
                  isDisabled={uniqueProperties.has(property)}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                  isAddForInspectionModalOpened={isAddForInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  isComingFromPriceNeg={isComingFromPriceNeg}
                  setIsComingFromPriceNeg={comingFromPriceNegotiation}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RentPropertySearch;
