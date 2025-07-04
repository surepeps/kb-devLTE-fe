/** @format */

"use client";
import { usePageContext } from "@/context/page-context";
import React, { Fragment, useEffect, useState } from "react";
import Card from "../general-components/card";
import { epilogue } from "@/styles/font";
import sampleImage from "@/assets/Agentpic.png";
import toast from "react-hot-toast";
import Loading from "../loading-component/loading";
import { IsMobile } from "@/hooks/isMobile";
import RentSearchModal from "./rent-search-modal";
import BuyAPropertySearchModal from "./buy-a-property-modal";
import JointVentureModal from "./joint-venture-modal";
import JointVentureModalCard from "./joint-venture-card";
import SelectStateLGA from "./select-state-lga";
import { useFormik } from "formik";
import Mobile from "./for-mobile";
import { URLS } from "@/utils/URLS";
import { shuffleArray } from "@/utils/shuffleArray";
import { useRouter } from "next/navigation";
import { POST_REQUEST } from "@/utils/requests";
import { useSelectedBriefs } from "@/context/selected-briefs-context";
import PropertyGrid from "./property-grid";
import { useMarketplace } from "@/context/marketplace-context";

type PayloadProps = {
  twoDifferentInspectionAreas: boolean;
  initialAmount: number;
  toBeIncreaseBy: number;
};

const SearchModal = ({
  isAddForInspectionModalOpened,
  setIsAddInspectionModalOpened,
  setPropertiesSelected,
  propertiesSelected,
  addForInspectionPayload,
  setAddForInspectionPayload,
  isComingFromPriceNeg,
  comingFromPriceNegotiation,
  inspectionType,
  setInspectionType,
  isComingFromSubmitLol,
  setIsComingFromSubmitLol,
  isLetterOfIntentionModalOpened,
  setIsLetterOfIntentionModalOpened,
}: {
  isAddForInspectionModalOpened: boolean;
  setIsAddInspectionModalOpened: (type: boolean) => void;
  propertiesSelected: any[];
  setPropertiesSelected: (type: any[]) => void;
  addForInspectionPayload: PayloadProps;
  setAddForInspectionPayload: (type: PayloadProps) => void;
  isLetterOfIntentionModalOpened: boolean;
  setIsLetterOfIntentionModalOpened: (type: boolean) => void;
  /**
   * coming from the price negotiation button
   */
  isComingFromPriceNeg?: boolean;
  comingFromPriceNegotiation?: (type: boolean) => void;
  //inspection type
  inspectionType: "Buy" | "JV" | "Rent/Lease";
  setInspectionType: (type: "Buy" | "JV" | "Rent/Lease") => void;
  /**
   * coming from submit Lol button
   */
  isComingFromSubmitLol: boolean;
  setIsComingFromSubmitLol: (type: boolean) => void;
}) => {
  const [selectedType, setSelectedType] = useState<string>("Land");
  const { selectedType: userSelectedMarketPlace } = usePageContext();
  const { selectedBriefs, setSelectedBriefs } = useSelectedBriefs();
  const [uniqueProperties, setUniqueProperties] = useState<Set<any>>(
    new Set(propertiesSelected),
  );

  // Use marketplace context for state management
  const {
    formikStatus,
    setFormikStatus,
    errMessage,
    setErrMessage,
    properties,
    setProperties,
    usageOptions,
    setUsageOptions,
    rentFilterBy,
    setRentFilterBy,
    jvFilterBy,
    setJvFilterBy,
    homeCondition,
    setHomeCondition,
    searchStatus,
    setSearchStatus,
    clearAllFilters,
    toggleInspectionSelection,
    selectedForInspection,
    fetchInitialData,
    searchProperties,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  } = useMarketplace();

  const router = useRouter();

  const handleRemoveAllBriefs = () => {
    setUniqueProperties(new Set());
    setPropertiesSelected([]);
  };

  // Note: State syncing moved to marketplace context to avoid render issues

  const handleSearch = async (searchPayload: any) => {
    setCurrentPage(1); // Reset to first page on new search

    // Get the correct briefType based on marketplace selection
    const getBriefType = (marketPlace: string) => {
      switch (marketPlace) {
        case "Buy a property":
          return "Outright Sales";
        case "Find property for joint venture":
          return "Joint Venture";
        case "Rent/Lease a property":
          return "Rent";
        default:
          return "Outright Sales";
      }
    };

    const briefType = getBriefType(userSelectedMarketPlace);

    // Build search parameters according to backend API
    const searchParams = {
      briefType,
      page: 1,
      limit: itemsPerPage,

      // Location filter
      ...(searchPayload.selectedState && {
        location: JSON.stringify({
          state: searchPayload.selectedState,
          localGovernment: searchPayload.selectedLGA || "",
          area: searchPayload.selectedArea || "",
        }),
      }),

      // Price range filter
      ...((searchPayload.minPrice || searchPayload.maxPrice) && {
        priceRange: {
          ...(searchPayload.minPrice && {
            min: Number(searchPayload.minPrice),
          }),
          ...(searchPayload.maxPrice && {
            max: Number(searchPayload.maxPrice),
          }),
        },
      }),

      // Property features
      ...(searchPayload.bedroom && { bedroom: Number(searchPayload.bedroom) }),
      ...(searchPayload.bathroom && {
        bathroom: Number(searchPayload.bathroom),
      }),

      // Document type filter
      ...(searchPayload.documentType &&
        searchPayload.documentType.length > 0 && {
          documentType: searchPayload.documentType,
        }),

      // Desire features filter
      ...(searchPayload.desireFeature &&
        searchPayload.desireFeature.length > 0 && {
          desireFeature: searchPayload.desireFeature,
        }),

      // Home condition filter
      ...(searchPayload.homeCondition &&
        searchPayload.homeCondition !== "All" && {
          homeCondition: searchPayload.homeCondition,
        }),

      // Tenant criteria filter (for rent)
      ...(searchPayload.tenantCriteria &&
        searchPayload.tenantCriteria.length > 0 && {
          tenantCriteria: searchPayload.tenantCriteria,
        }),

      // Property type filter
      ...(searchPayload.propertyType &&
        searchPayload.propertyType !== "All" && {
          type: searchPayload.propertyType,
        }),

      // Land size filters
      ...(searchPayload.landSizeType && {
        landSizeType: searchPayload.landSizeType,
      }),
      ...(searchPayload.landSize && {
        landSize: Number(searchPayload.landSize),
      }),
    };

    try {
      await toast.promise(searchProperties(searchParams), {
        loading: "Searching properties...",
        success: `Search completed!`,
        error: "Failed to search properties",
      });
    } catch (err: any) {
      console.error("Search failed:", err);
    }
  };

  const renderDynamicComponent = () => {
    switch (userSelectedMarketPlace) {
      case "Buy a property":
        return (
          <div className="relative w-full flex flex-col">
            <BuyAPropertySearchModal
              addForInspectionPayload={addForInspectionPayload}
              setSelectedBriefs={setUniqueProperties}
              setAddInspectionModal={setIsAddInspectionModalOpened}
              inspectionType={inspectionType}
              setInspectionType={setInspectionType}
              onSearch={handleSearch}
            />
            <section className="w-full flex-1 overflow-y-auto flex justify-center items-start md:mt-[20px]">
              {(formikStatus || usageOptions) && renderBriefs("Buy a property")}
            </section>
          </div>
        );
      case "Rent/Lease a property":
        return (
          <div className="relative w-full flex flex-col">
            <RentSearchModal
              setSelectedBriefs={setUniqueProperties}
              setAddInspectionModal={setIsAddInspectionModalOpened}
              addForInspectionPayload={addForInspectionPayload}
              inspectionType={inspectionType}
              setInspectionType={setInspectionType}
              onSearch={handleSearch}
            />
            <section className="flex-1 overflow-y-auto flex justify-center items-start md:mt-[20px]">
              {formikStatus && renderBriefs(userSelectedMarketPlace)}
            </section>
          </div>
        );
      case "Find property for joint venture":
        return (
          <div className="relative w-full flex flex-col">
            <JointVentureModal
              onSearch={handleSearch}
              addForInspectionPayload={addForInspectionPayload}
              setSelectedBriefs={setUniqueProperties}
              setAddInspectionModal={setIsAddInspectionModalOpened}
              inspectionType={inspectionType}
              setInspectionType={setInspectionType}
            />
            <section className="flex-1 overflow-y-auto flex justify-center items-start md:mt-[20px]">
              {formikStatus && renderBriefs(userSelectedMarketPlace)}
            </section>
          </div>
        );
      default:
        return <></>;
    }
  };

  const getPropertyGridMarketplaceType = () => {
    return userSelectedMarketPlace;
  };

  const handleCardPageClick = (property: any) => {
    const marketType =
      userSelectedMarketPlace === "Buy a property"
        ? "Buy"
        : userSelectedMarketPlace === "Rent/Lease a property"
          ? "Rent"
          : "JV";

    if (marketType === "Buy") {
      const selectedBriefsParam = encodeURIComponent(
        JSON.stringify(Array.from(uniqueProperties)),
      );
      router.push(
        `/property/${marketType}/${property._id}?selectedBriefs=${selectedBriefsParam}`,
      );
    } else {
      router.push(`/property/${marketType}/${property._id}`);
    }
  };

  const renderBriefs = (type: string) => {
    return (
      <PropertyGrid
        marketplaceType={type}
        itemsPerPage={12}
        // JV specific props
        isComingFromSubmitLol={isComingFromSubmitLol}
        setIsComingFromSubmitLol={setIsComingFromSubmitLol}
        onSubmitLoi={() => setIsLetterOfIntentionModalOpened(true)}
        setPropertySelected={setPropertiesSelected}
        setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
        isAddForInspectionModalOpened={isAddForInspectionModalOpened}
        // Buy specific props
        isComingFromPriceNeg={isComingFromPriceNeg}
        setIsComingFromPriceNeg={comingFromPriceNegotiation}
        // Card page click
        onCardPageClick={handleCardPageClick}
      />
    );
  };

  const handlePropertiesSelection = (property: any) => {
    toggleInspectionSelection(property);
  };

  useEffect(() => {
    // Only consider up to 2 selected briefs
    const selected = propertiesSelected.slice(0, 2);

    if (selected.length === 1) {
      setAddForInspectionPayload({
        initialAmount: 10000,
        toBeIncreaseBy: 0,
        twoDifferentInspectionAreas: false,
      });
    } else if (selected.length === 2) {
      const [a, b] = selected.map((item) => item.location.localGovernment);
      const uniqueLGAs = new Set([a, b]);
      if (uniqueLGAs.size === 1) {
        // Both briefs are from the same localGovernment
        setAddForInspectionPayload({
          initialAmount: 10000,
          toBeIncreaseBy: 0,
          twoDifferentInspectionAreas: false,
        });
      } else {
        // Briefs are from different localGovernments
        setAddForInspectionPayload({
          initialAmount: 10000,
          toBeIncreaseBy: 5000,
          twoDifferentInspectionAreas: true,
        });
      }
    } else {
      // No briefs selected
      setAddForInspectionPayload({
        initialAmount: 0,
        toBeIncreaseBy: 0,
        twoDifferentInspectionAreas: false,
      });
    }
  }, [propertiesSelected]);

  const is_mobile = IsMobile();

  // Data fetching using marketplace context to avoid AbortError issues
  useEffect(() => {
    if (!userSelectedMarketPlace) return;

    let briefType = "";
    switch (userSelectedMarketPlace) {
      case "Buy a property":
        briefType = "Outright Sales";
        break;
      case "Find property for joint venture":
        briefType = "Joint Venture";
        break;
      case "Rent/Lease a property":
        briefType = "Rent";
        break;
      default:
        briefType = "Outright Sales";
    }
    const briefToFetch = `${URLS.fetchBriefs}?page=1&limit=1000&briefType=${encodeURIComponent(briefType)}`;

    // Use the context method for fetching (removed fetchInitialData from deps to avoid re-render loop)
    fetchInitialData(briefToFetch);
  }, [userSelectedMarketPlace]);

  return (
    <Fragment>
      {is_mobile ? (
        <Mobile
          searchStatus={searchStatus}
          selectedMarketPlace={userSelectedMarketPlace}
          renderBrief={renderDynamicComponent}
          selectedBriefs={selectedForInspection.length}
          onSelectBrief={handlePropertiesSelection}
          selectedBriefsList={
            new Set(selectedForInspection.map((item) => item.property))
          } // pass as Set
          onSubmitForInspection={(selectedBriefsList: Set<any>) => {
            setPropertiesSelected(Array.from(selectedBriefsList));
            setIsAddInspectionModalOpened(true);
          }}
          setPropertiesSelected={setPropertiesSelected}
          handleSearch={handleSearch}
          onRemoveAllBriefs={handleRemoveAllBriefs}
        />
      ) : (
        <>{userSelectedMarketPlace && renderDynamicComponent()}</>
      )}
    </Fragment>
  );
};

export default SearchModal;
