/** @format */

"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/general-components/button";
import GlobalPropertyCard from "@/components/common/property-cards/GlobalPropertyCard";
import GlobalJVPropertyCard from "@/components/common/property-cards/GlobalJVPropertyCard";
import { motion, useInView } from "framer-motion";
import { URLS } from "@/utils/URLS";
import { usePageContext } from "@/context/page-context";
import { useGlobalPropertyActions } from "@/context/global-property-actions-context";
import GlobalPriceNegotiationModal from "@/components/modals/GlobalPriceNegotiationModal";
import GlobalLOIUploadModal from "@/components/modals/GlobalLOIUploadModal";
import "ldrs/react/Trio.css";
import { Trio } from "ldrs/react";
import { epilogue } from "@/styles/font";
import { shuffleArray } from "@/utils/shuffleArray";
import { GET_REQUEST } from "@/utils/requests";
import { useRouter } from "next/navigation";

// Helper function to create card data based on property type
const createPropertyCardData = (property: any, propertyType: string) => {
  const cardData = [];

  // Common fields
  cardData.push({ header: "Property Type", value: property?.propertyType || "N/A" });
  
  if (propertyType === "Joint Venture") {
    cardData.push({ 
      header: "Investment Amount", 
      value: property?.investmentAmount ? `₦${Number(property.investmentAmount).toLocaleString()}` : "N/A" 
    });
    cardData.push({ header: "Investment Type", value: property?.investmentType || "N/A" });
    cardData.push({ header: "Expected ROI", value: property?.expectedROI || "N/A" });
  } else {
    const price = propertyType === "Rent" ? property?.rentalPrice : property?.price;
    cardData.push({ 
      header: "Price", 
      value: price ? `₦${Number(price).toLocaleString()}` : "N/A" 
    });
  }

  cardData.push({ header: "Bedrooms", value: property?.bedrooms || "N/A" });
  cardData.push({ header: "Bathrooms", value: property?.bathrooms || "N/A" });
  cardData.push({ 
    header: "Location", 
    value: `${property?.state || ""}, ${property?.lga || ""}`.replace(/^,\s*|,\s*$/g, '') || "N/A" 
  });

  return cardData;
};

const Section2 = () => {
  const [buttons, setButtons] = useState({
    button1: true,
    button2: false,
    button3: false,
    button4: false,
  });
  const { setCardData } = usePageContext();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedMarketPlace, setSelectedMarketPlace] = useState("Buy a property");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showLOIModal, setShowLOIModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const housesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const areHousesVisible = useInView(housesRef, { once: true });

  // Global property actions context
  const {
    toggleInspectionSelection,
    isSelectedForInspection,
    addNegotiatedPrice,
    getNegotiatedPrice,
    removeNegotiatedPrice,
    addLOIDocument,
    getLOIDocument,
    removeLOIDocument,
  } = useGlobalPropertyActions();

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

  const sanitizeUrl = (url: string) => {
    if (!url) return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/")
    ) {
      return url;
    }
    return "https://" + url.replace(/^\/+/, "");
  };

  useEffect(() => {
    const briefType = getBriefType(selectedMarketPlace);
    const url = `${URLS.BASE}${
      URLS.fetchBriefs
    }?page=1&limit=4&briefType=${encodeURIComponent(briefType)}`;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check if BASE URL is available
        if (
          !URLS.BASE ||
          URLS.BASE === "undefined" ||
          URLS.BASE.includes("undefined")
        ) {
          console.warn("API URL not configured, using empty state");
          setProperties([]);
          setCardData([]);
          return;
        }

        console.log("Fetching properties from:", url);
        const data = await GET_REQUEST(url);

        // Handle API error response
        if (data.error) {
          console.warn("API request failed:", data.error);
          setProperties([]);
          setCardData([]);
          return;
        }

        // Handle successful response
        let approved = Array.isArray(data.data)
          ? data.data.filter((item: any) => item.isApproved === true)
          : [];

        if (buttons.button2) {
          approved = approved.filter(
            (item: any) => item.propertyType === "Land",
          );
        }

        const sanitizedApproved = shuffleArray(approved)
          .slice(0, 4)
          .map((item: any) => ({
            ...item,
            pictures: item?.pictures?.map((img: string) => sanitizeUrl(img)),
          }));

        console.log(
          `Successfully loaded ${sanitizedApproved.length} properties`,
        );
        setProperties(sanitizedApproved);
        setCardData(approved);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setProperties([]);
        setCardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMarketPlace, setCardData, buttons.button2]);

  const handleShowMoreClick = () => {
    window.location.href = "/market-place";
  };

  const handlePriceNegotiation = (property: any) => {
    setSelectedProperty(property);
    setShowPriceModal(true);
  };

  const handleLOIUpload = (property: any) => {
    setSelectedProperty(property);
    setShowLOIModal(true);
  };

  const handlePriceNegotiationSubmit = async (property: any, negotiatedPrice: number) => {
    const originalPrice = property?.price || property?.rentalPrice || 0;
    addNegotiatedPrice(property._id, originalPrice, negotiatedPrice);
  };

  const handleLOISubmit = async (property: any, document: File) => {
    addLOIDocument(property._id, document);
  };

  const handleInspectionToggle = (property: any) => {
    const sourceTab = buttons.button4 ? "jv" : buttons.button3 ? "rent" : "buy";
    toggleInspectionSelection(property, sourceTab, "homepage");
  };

  return (
    <section className="flex justify-center items-center bg-[#8DDB901A] pb-[30px]">
      <div className="container min-h-[700px] flex flex-col justify-center items-center gap-[20px] px-[10px] overflow-hidden">
        <div className="min-h-[128px] w-full lg:w-[870px] flex flex-col justify-center items-center gap-[9px] pt-[40px]">
          <h2 className="text-[24px] leading-[28.13px] lg:text-[36px] lg:leading-[57.6px] md:leading-[32px] text-[#09391C] text-center font-semibold">
            See what other buyers are exploring
          </h2>
          <p className="text-[#5A5D63] text-base md:text-[18px] leading-[28.8px] tracking-[5%] font-normal text-center">
            Discover properties recently viewed by buyers like you. Stay
            inspired by trending options and explore opportunities you might
            have missed
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`md:min-w-[466px] min-h-[38px] py-[10px] gap-[15px] flex flex-wrap justify-center`}
        >
          <Button
            value="House for sale"
            green={buttons.button1}
            onClick={() => {
              setButtons({
                button1: true,
                button2: false,
                button3: false,
                button4: false,
              });
              setSelectedMarketPlace("Buy a property");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button1 ? "" : "text-[#5A5D63]"
            }`}
          />
          <Button
            green={buttons.button2}
            value="Land for sale"
            onClick={() => {
              setButtons({
                button1: false,
                button2: true,
                button3: false,
                button4: false,
              });
              setSelectedMarketPlace("Buy a property");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button2 ? "" : "text-[#5A5D63]"
            }`}
          />
          <Button
            green={buttons.button3}
            value="Rent/Lease a house"
            onClick={() => {
              setButtons({
                button1: false,
                button2: false,
                button3: true,
                button4: false,
              });
              setSelectedMarketPlace("Rent/Lease a property");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[200px] ${
              buttons.button3 ? "" : "text-[#5A5D63] "
            }`}
          />
          <Button
            green={buttons.button4}
            value="Property for Joint Venture"
            onClick={() => {
              setButtons({
                button1: false,
                button2: false,
                button3: false,
                button4: true,
              });
              setSelectedMarketPlace("Find property for joint venture");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[220px] ${
              buttons.button4 ? "" : "text-[#5A5D63] "
            }`}
          />
        </motion.div>

        <motion.div
          ref={housesRef}
          initial={{ opacity: 0, x: 20 }}
          animate={areHousesVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3 }}
          className={`min-h-[446px] overflow-y-clip hide-scrollbar w-full md:min-h-[412px] flex flex-wrap justify-center md:justify-center items-center gap-[10px]`}
        >
          {isLoading ? (
            <div className="w-[inherit] flex justify-center items-center">
              <Trio size={50} speed={1.3} color="#09391C" />
            </div>
          ) : properties.length !== 0 ? (
            properties?.map((property: any, idx: number) => {
              // Determine property type for card data generation
              let propertyType = "Outright Sales";
              if (buttons.button3) propertyType = "Rent";
              if (buttons.button4) propertyType = "Joint Venture";

              const cardData = createPropertyCardData(property, propertyType);
              const isSelected = isSelectedForInspection(property._id);
              const negotiatedPrice = getNegotiatedPrice(property._id);
              const loiDocument = getLOIDocument(property._id);

              // Property click handler
              const handlePropertyClick = () => {
                if (buttons.button1 || buttons.button2) {
                  router.push(`/property/buy/${property?._id}`);
                } else if (buttons.button3) {
                  router.push(`/property/rent/${property?._id}`);
                } else if (buttons.button4) {
                  router.push(`/property/jv/${property?._id}`);
                }
              };

              // Render appropriate card based on property type
              if (buttons.button4) {
                // Joint Venture Card
                return (
                  <GlobalJVPropertyCard
                    key={idx}
                    property={property}
                    cardData={cardData}
                    images={property?.pictures || []}
                    isPremium={property?.isPremium || false}
                    onPropertyClick={handlePropertyClick}
                    onLOIUpload={() => handleLOIUpload(property)}
                    onInspectionToggle={() => handleInspectionToggle(property)}
                    onRemoveLOI={removeLOIDocument}
                    isSelected={isSelected}
                    loiDocument={loiDocument}
                    className="mx-auto"
                  />
                );
              } else {
                // Standard Property Card (Buy/Rent)
                const tab = buttons.button3 ? "rent" : "buy";
                return (
                  <GlobalPropertyCard
                    key={idx}
                    tab={tab}
                    property={property}
                    cardData={cardData}
                    images={property?.pictures || []}
                    isPremium={property?.isPremium || false}
                    onPropertyClick={handlePropertyClick}
                    onPriceNegotiation={() => handlePriceNegotiation(property)}
                    onInspectionToggle={() => handleInspectionToggle(property)}
                    onRemoveNegotiation={removeNegotiatedPrice}
                    isSelected={isSelected}
                    negotiatedPrice={negotiatedPrice}
                    className="mx-auto"
                  />
                );
              }
            })
          ) : (
            <div className="w-[inherit] flex justify-center items-center">
              <p
                className={`text-[#09391C] text-base font-semibold ${epilogue.className}`}
              >
                No properties available at the moment
              </p>
            </div>
          )}
        </motion.div>
        
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={handleShowMoreClick}
            type="button"
            className="flex justify-center items-center gap-2"
          >
            <span className="text-base font-display text-[#09391C] leading-[25px] font-semibold">
              View more
            </span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showPriceModal && selectedProperty && (
        <GlobalPriceNegotiationModal
          isOpen={showPriceModal}
          property={selectedProperty}
          onClose={() => {
            setShowPriceModal(false);
            setSelectedProperty(null);
          }}
          onSubmit={handlePriceNegotiationSubmit}
          existingNegotiation={getNegotiatedPrice(selectedProperty._id)}
        />
      )}

      {showLOIModal && selectedProperty && (
        <GlobalLOIUploadModal
          isOpen={showLOIModal}
          property={selectedProperty}
          onClose={() => {
            setShowLOIModal(false);
            setSelectedProperty(null);
          }}
          onSubmit={handleLOISubmit}
          existingDocument={getLOIDocument(selectedProperty._id)}
        />
      )}
    </section>
  );
};

export default Section2;
