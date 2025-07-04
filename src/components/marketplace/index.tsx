/** @format */

"use client";
import { usePageContext } from "@/context/page-context";
import { basic_styling_architecture } from "@/utils/tool";
import React, { useEffect, useState } from "react";
import SearchModal from "./search-modal";
import { IsMobile } from "@/hooks/isMobile";
import { useRouter } from "next/navigation";
import Card from "./add-for-inspection/card";
import AddForInspection from "./add-for-inspection";
import { useMarketplace } from "@/context/marketplace-context";

const MarketPlace = () => {
  const router = useRouter();

  const {
    selectedType,
    setSelectedType,
    isAddForInspectionModalOpened,
    setIsAddForInspectionModalOpened,
    isComingFromPriceNeg,
    setIsComingFromPriceNeg,
    propertySelectedForInspection,
    setPropertySelectedForInspection,
  } = usePageContext();

  // Add error state for marketplace component
  const [hasError, setHasError] = useState(false);

  // const [isAddForInspectionModalOpened, setIsAddForInspectionModalOpened] =
  //   React.useState<boolean>(false);
  const {
    selectedForInspection,
    clearInspectionSelection,
    formikStatus,
    errMessage,
    properties,
  } = useMarketplace();

  const [propertiesSelected, setPropertiesSelected] = React.useState<any[]>([]);
  const [isLetterOfIntentionModalOpened, setIsLetterOfIntentionModalOpened] =
    useState(false);
  const [addForInspectionPayload, setAddInspectionPayload] = React.useState<{
    twoDifferentInspectionAreas: boolean;
    initialAmount: number;
    toBeIncreaseBy: number;
  }>({
    twoDifferentInspectionAreas: false,
    initialAmount: 10000,
    toBeIncreaseBy: 0,
  });
  // const [isComingFromPriceNeg, setIsComingFromPriceNeg] =
  //   React.useState<boolean>(false);
  const [inspectionType, setInspectionType] = useState<
    "Buy" | "JV" | "Rent/Lease"
  >("Buy");
  const [isComingFromSubmitLol, setIsComingFromSubmitLol] =
    React.useState<boolean>(false);

  const is_mobile = IsMobile();

  // Handle marketplace errors - this useEffect must come before any early returns
  useEffect(() => {
    console.log("Marketplace status:", {
      formikStatus,
      errMessage,
      propertiesCount: properties?.length,
    });

    if (formikStatus === "failed" && errMessage) {
      console.error("Marketplace error:", errMessage);
      setHasError(true);
    } else if (formikStatus === "success") {
      setHasError(false);
    }
  }, [formikStatus, errMessage, properties]);

  useEffect(() => {
    if (propertySelectedForInspection) {
      setPropertiesSelected([
        {
          ...propertySelectedForInspection,
          _id: propertySelectedForInspection.propertyId,
          price: propertySelectedForInspection.price,
          propertyType: propertySelectedForInspection.propertyType,
          noOfBedrooms: propertySelectedForInspection.bedRoom,
          location: propertySelectedForInspection.location,
          docOnProperty: Array.isArray(
            propertySelectedForInspection.docOnProperty,
          )
            ? (
                propertySelectedForInspection.docOnProperty as Array<
                  string | { docName: string }
                >
              ).map((doc) => (typeof doc === "string" ? doc : doc.docName))
            : [],
        },
      ]);
    }
  }, [propertySelectedForInspection]);

  // Sync marketplace context selection with local state
  useEffect(() => {
    if (selectedForInspection.length > 0) {
      setPropertiesSelected(selectedForInspection.map((item) => item.property));
    }
  }, [selectedForInspection]);

  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      {isAddForInspectionModalOpened ? (
        <AddForInspection
          payload={addForInspectionPayload}
          setIsAddForInspectionModalOpened={setIsAddForInspectionModalOpened}
          setPropertiesSelected={setPropertiesSelected}
          propertiesSelected={propertiesSelected}
          isComingFromPriceNeg={isComingFromPriceNeg}
          comingFromPriceNegotiation={setIsComingFromPriceNeg}
          inspectionType={inspectionType}
          setInspectionType={setInspectionType}
          isComingFromSubmitLol={isComingFromSubmitLol}
          setIsComingFromSubmitLol={setIsComingFromSubmitLol}
          isAddForInspectionModalOpened={isAddForInspectionModalOpened}
        />
      ) : (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-[#5A5D63] mb-6">
            <button
              onClick={() => router.push("/")}
              className="hover:text-[#09391C]"
            >
              Home
            </button>
            <span className="mx-2">›</span>
            <span className="text-[#09391C] font-medium">Marketplace</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#09391C] font-display mb-4">
              Welcome to <span className="text-[#8DDB90]">Khabiteq Realty</span>{" "}
              Marketplace
            </h1>
            <p className="text-lg md:text-xl text-[#5A5D63] max-w-3xl mx-auto">
              Whether you're buying, selling, renting, or investing (JV), how
              can we assist you?
            </p>
          </div>

          {/* Type Selection */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-8">
            {[
              "Buy a property",
              "Find property for joint venture",
              "Rent/Lease a property",
            ].map((item: string, idx: number) => (
              <ButtonBoxModal
                selectedType={selectedType}
                onSelect={() => {
                  setSelectedType(item);
                }}
                isSelected
                key={idx}
                text={item}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mb-8">
            <p className="text-lg text-[#5A5D63] mb-4">
              Didn't find a match for your search?
            </p>
            <button
              className="bg-transparent border-2 border-[#09391C] text-[#09391C] px-6 py-3 rounded-lg font-semibold hover:bg-[#09391C] hover:text-white transition-colors"
              type="button"
              onClick={() => router.push("/preference")}
            >
              Share your preference
            </button>
          </div>

          {/* Search Modal */}
          <div className="w-full">
            <SearchModal
              propertiesSelected={propertiesSelected}
              setPropertiesSelected={setPropertiesSelected}
              isAddForInspectionModalOpened={isAddForInspectionModalOpened}
              setIsAddInspectionModalOpened={setIsAddForInspectionModalOpened}
              addForInspectionPayload={addForInspectionPayload}
              setAddForInspectionPayload={setAddInspectionPayload}
              isComingFromPriceNeg={isComingFromPriceNeg}
              comingFromPriceNegotiation={setIsComingFromPriceNeg}
              inspectionType={inspectionType}
              setInspectionType={setInspectionType}
              isComingFromSubmitLol={isComingFromSubmitLol}
              setIsComingFromSubmitLol={setIsComingFromSubmitLol}
              isLetterOfIntentionModalOpened={isLetterOfIntentionModalOpened}
              setIsLetterOfIntentionModalOpened={
                setIsLetterOfIntentionModalOpened
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ButtonBoxModal = ({
  text,
  onSelect,
  selectedType,
}: {
  text: string;
  selectedType: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <button
      onClick={onSelect}
      type="button"
      className={`min-w-fit h-12 px-6 flex items-center justify-center rounded-lg font-medium text-base transition-all duration-300 ${
        selectedType === text
          ? "bg-[#8DDB90] text-white shadow-md"
          : "bg-white text-[#5A5D63] border-2 border-gray-200 hover:border-[#8DDB90] hover:text-[#8DDB90]"
      }`}
    >
      {text}
    </button>
  );
};
export default MarketPlace;
