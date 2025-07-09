"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import JointVentureModal from "./joint-venture-modal";
import JointVentureModalCard from "./joint-venture-card";
import Loading from "../loading-component/loading";
import Pagination from "../general-components/pagination";
import EmptyState from "../general-components/empty-state";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import { shuffleArray } from "@/utils/shuffleArray";
import { useRouter } from "next/navigation";
import { useSelectedBriefs } from "@/context/selected-briefs-context";

interface JointVentureSearchProps {
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

const JointVentureSearch: React.FC<JointVentureSearchProps> = ({
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
  const [jvFilterBy, setJvFilterBy] = useState<string[]>(["All"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uniqueProperties, setUniqueProperties] = useState<Set<any>>(
    new Set(propertiesSelected),
  );
  const [isComingFromSubmitLol, setIsComingFromSubmitLol] = useState(false);
  const [isLetterOfIntentionModalOpened, setIsLetterOfIntentionModalOpened] =
    useState(false);

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

  // Filter properties based on jv filter options
  useEffect(() => {
    if (jvFilterBy.length === 0 || jvFilterBy.includes("All")) {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter((property) =>
        jvFilterBy.some((option) => property.propertyType === option),
      );
      setFilteredProperties(filtered);
    }
    setTotalPages(Math.ceil(filteredProperties.length / itemsPerPage));
    setCurrentPage(1);
  }, [jvFilterBy, properties]);

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
          `${URLS.BASE}${URLS.fetchBriefs}?page=1&limit=1000&briefType=Joint Venture`,
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
        <JointVentureModal
          onSearch={handleSearch}
          addForInspectionPayload={addForInspectionPayload}
          setSelectedBriefs={setUniqueProperties}
          setAddInspectionModal={setIsAddInspectionModalOpened}
          inspectionType={inspectionType}
          setInspectionType={setInspectionType}
        />
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        {filteredProperties.length === 0 && !loading ? (
          <EmptyState
            title="No Joint Venture Properties Found"
            description="Try adjusting your search filters or check back later for new JV opportunities."
            actionText="Reset Filters"
            onAction={() => setJvFilterBy(["All"])}
          />
        ) : (
          <>
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-[#09391C] mb-2 md:mb-0">
                Available JV Properties ({filteredProperties.length})
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
                <JointVentureModalCard
                  key={property._id || index}
                  onClick={() => {
                    if (uniqueProperties.has(property)) {
                      handleRemoveProperty(property);
                    } else {
                      handlePropertySelection(property);
                    }
                  }}
                  isDisabled={uniqueProperties.has(property)}
                  onCardPageClick={() =>
                    router.push(`/property/JV/${property._id}`)
                  }
                  isComingFromSubmitLol={isComingFromSubmitLol}
                  setIsComingFromSubmitLol={setIsComingFromSubmitLol}
                  cardData={[]}
                  images={[]}
                  property={property}
                  isPremium={property?.isPremium}
                  properties={properties}
                  isAddInspectionalModalOpened={isAddForInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                  onSubmitLoi={() => setIsLetterOfIntentionModalOpened(true)}
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

export default JointVentureSearch;
