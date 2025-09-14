/** @format */

"use client";
import React, { useState } from "react";
import { useGlobalPropertyActions } from "@/context/global-property-actions-context";
import GlobalPropertyCard from "./GlobalPropertyCard";
import GlobalJVPropertyCard from "./GlobalJVPropertyCard";
import SimplifiedPriceNegotiationModal from "@/components/modals/SimplifiedPriceNegotiationModal";
import randomImage from "@/assets/noImageAvailable.png";
import ShortletBookingModal from "@/components/shortlet/ShortletBookingModal";

interface EnhancedGlobalPropertyCardProps {
  type: "standard" | "jv";
  tab?: "buy" | "rent" | "shortlet";
  property: any;
  cardData: { header: string; value: string }[];
  images: any[];
  isPremium: boolean;
  onPropertyClick?: () => void;
  onInspectionToggle?: () => void;
  className?: string;
}

const EnhancedGlobalPropertyCard: React.FC<EnhancedGlobalPropertyCardProps> = ({
  type,
  tab = "buy",
  property,
  cardData,
  images,
  isPremium,
  onPropertyClick,
  onInspectionToggle: customInspectionToggle,
  className = "",
}) => {
  const {
    toggleInspectionSelection,
    isSelectedForInspection,
    addNegotiatedPrice,
    removeNegotiatedPrice,
    getNegotiatedPrice,
  } = useGlobalPropertyActions();

  const [priceNegotiationModal, setPriceNegotiationModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null,
  });

  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    mode: "instant" | "request";
  }>({ isOpen: false, mode: "instant" });

  const isSelected = isSelectedForInspection(property._id);
  const negotiatedPrice = getNegotiatedPrice(property._id);

  const isShortlet =
    tab === "shortlet" ||
    property?.briefType === "Shortlet" ||
    property?.propertyType === "Shortlet";

  const handleInspectionToggle = () => {
    if (customInspectionToggle) {
      customInspectionToggle();
    } else {
      const sourceTab = type === "jv" ? "jv" : tab;
      toggleInspectionSelection(property, sourceTab, "global");
    }
  };

  const handlePriceNegotiation = () => {
    setPriceNegotiationModal({ isOpen: true, property });
  };

  const transformImages = (pictures: any[]) => {
    return (pictures || []).map((item, index) => {
      if (typeof item === "string") {
        return { id: index.toString(), url: item, alt: `Property image ${index + 1}` };
      }
      if (item?.url) {
        return { id: item.id || index.toString(), url: item.url, alt: item.alt || `Property image ${index + 1}` };
      }
      return { id: index.toString(), url: randomImage, alt: "Fallback image" };
    });
  };

  const handleNegotiationSubmit = (prop: any, negotiatedPriceValue: number) => {
    const originalPrice = prop.price || prop.rentalPrice || 0;
    addNegotiatedPrice(prop._id, originalPrice, negotiatedPriceValue);

    if (!isSelectedForInspection(prop._id)) {
      const sourceTab = type === "jv" ? "jv" : tab;
      toggleInspectionSelection(prop, sourceTab, "auto-price-negotiation");
    }

    setPriceNegotiationModal({ isOpen: false, property: null });
  };

  const handleRemoveNegotiation = (propertyId: string) => {
    removeNegotiatedPrice(propertyId);
  };

  const transformedImages = transformImages(images);

  if (type === "jv") {
    return (
      <>
        <GlobalJVPropertyCard
          property={property}
          cardData={cardData}
          images={transformedImages}
          isPremium={isPremium}
          onPropertyClick={onPropertyClick}
          onPriceNegotiation={handlePriceNegotiation}
          onInspectionToggle={handleInspectionToggle}
          onRemoveNegotiation={handleRemoveNegotiation}
          isSelected={isSelected}
          negotiatedPrice={negotiatedPrice}
          className={className}
        />

        {priceNegotiationModal.isOpen && (
          <SimplifiedPriceNegotiationModal
            isOpen={priceNegotiationModal.isOpen}
            property={priceNegotiationModal.property}
            onClose={() => setPriceNegotiationModal({ isOpen: false, property: null })}
            onSubmit={handleNegotiationSubmit}
            existingNegotiation={getNegotiatedPrice(priceNegotiationModal.property?._id)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <GlobalPropertyCard
        property={property}
        cardData={cardData}
        images={transformedImages}
        isPremium={isPremium}
        onPropertyClick={onPropertyClick}
        onPriceNegotiation={!isShortlet ? handlePriceNegotiation : undefined}
        onInspectionToggle={!isShortlet ? handleInspectionToggle : undefined}
        onRemoveNegotiation={!isShortlet ? handleRemoveNegotiation : undefined}
        isSelected={isSelected}
        negotiatedPrice={!isShortlet ? negotiatedPrice : null}
        className={className}
        mode={isShortlet ? "shortlet" : "standard"}
        onBookNow={isShortlet ? () => setBookingModal({ isOpen: true, mode: "instant" }) : undefined}
        onRequestToBook={isShortlet ? () => setBookingModal({ isOpen: true, mode: "request" }) : undefined}
      />

      {priceNegotiationModal.isOpen && (
        <SimplifiedPriceNegotiationModal
          isOpen={priceNegotiationModal.isOpen}
          property={priceNegotiationModal.property}
          onClose={() => setPriceNegotiationModal({ isOpen: false, property: null })}
          onSubmit={handleNegotiationSubmit}
          existingNegotiation={getNegotiatedPrice(priceNegotiationModal.property?._id)}
        />
      )}

      {bookingModal.isOpen && (
        <ShortletBookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false, mode: "instant" })}
          property={property}
          mode={bookingModal.mode}
        />
      )}
    </>
  );
};

export default EnhancedGlobalPropertyCard;
