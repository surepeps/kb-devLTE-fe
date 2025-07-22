/** @format */

"use client";
import React, { useState } from "react";
import { useGlobalPropertyActions } from "@/context/global-property-actions-context";
import GlobalPropertyCard from "./GlobalPropertyCard";
import GlobalJVPropertyCard from "./GlobalJVPropertyCard";
import GlobalPriceNegotiationModal from "@/components/modals/GlobalPriceNegotiationModal";
import GlobalLOIUploadModal from "@/components/modals/GlobalLOIUploadModal";

interface EnhancedGlobalPropertyCardProps {
  type: "standard" | "jv";
  tab?: "buy" | "rent" | "shortlet";
  property: any;
  cardData: { header: string; value: string }[];
  images: any[];
  isPremium: boolean;
  onPropertyClick?: () => void;
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
  className = "",
}) => {
  const {
    toggleInspectionSelection,
    isSelectedForInspection,
    addNegotiatedPrice,
    removeNegotiatedPrice,
    getNegotiatedPrice,
    addLOIDocument,
    removeLOIDocument,
    getLOIDocument,
  } = useGlobalPropertyActions();

  const [priceNegotiationModal, setPriceNegotiationModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null,
  });

  const [loiUploadModal, setLoiUploadModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null,
  });

  const isSelected = isSelectedForInspection(property._id);
  const negotiatedPrice = type === "standard" ? getNegotiatedPrice(property._id) : null;
  const loiDocument = type === "jv" ? getLOIDocument(property._id) : null;

  const handleInspectionToggle = () => {
    const sourceTab = type === "jv" ? "jv" : tab;
    toggleInspectionSelection(property, sourceTab, "global");
  };

  const handlePriceNegotiation = () => {
    setPriceNegotiationModal({
      isOpen: true,
      property,
    });
  };

  const handleNegotiationSubmit = (property: any, negotiatedPriceValue: number) => {
    const originalPrice = property.price || property.rentalPrice || 0;
    addNegotiatedPrice(property._id, originalPrice, negotiatedPriceValue);
    setPriceNegotiationModal({ isOpen: false, property: null });
  };

  const handleRemoveNegotiation = (propertyId: string) => {
    removeNegotiatedPrice(propertyId);
  };

  const handleLOIUpload = () => {
    setLoiUploadModal({
      isOpen: true,
      property,
    });
  };

  const handleLOISubmit = (property: any, document: File, documentUrl?: string) => {
    addLOIDocument(property._id, document, documentUrl);
    setLoiUploadModal({ isOpen: false, property: null });
  };

  const handleRemoveLOI = (propertyId: string) => {
    removeLOIDocument(propertyId);
  };

  if (type === "jv") {
    return (
      <>
        <GlobalJVPropertyCard
          property={property}
          cardData={cardData}
          images={images}
          isPremium={isPremium}
          onPropertyClick={onPropertyClick}
          onLOIUpload={handleLOIUpload}
          onInspectionToggle={handleInspectionToggle}
          onRemoveLOI={handleRemoveLOI}
          isSelected={isSelected}
          loiDocument={loiDocument}
          className={className}
        />

        {/* LOI Upload Modal */}
        {loiUploadModal.isOpen && (
          <GlobalLOIUploadModal
            isOpen={loiUploadModal.isOpen}
            property={loiUploadModal.property}
            onClose={() => setLoiUploadModal({ isOpen: false, property: null })}
            onSubmit={handleLOISubmit}
            existingDocument={getLOIDocument(loiUploadModal.property?._id)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <GlobalPropertyCard
        tab={tab}
        property={property}
        cardData={cardData}
        images={images}
        isPremium={isPremium}
        onPropertyClick={onPropertyClick}
        onPriceNegotiation={handlePriceNegotiation}
        onInspectionToggle={handleInspectionToggle}
        onRemoveNegotiation={handleRemoveNegotiation}
        isSelected={isSelected}
        negotiatedPrice={negotiatedPrice}
        className={className}
      />

      {/* Price Negotiation Modal */}
      {priceNegotiationModal.isOpen && (
        <GlobalPriceNegotiationModal
          isOpen={priceNegotiationModal.isOpen}
          property={priceNegotiationModal.property}
          onClose={() =>
            setPriceNegotiationModal({ isOpen: false, property: null })
          }
          onSubmit={handleNegotiationSubmit}
          existingNegotiation={getNegotiatedPrice(
            priceNegotiationModal.property?._id
          )}
        />
      )}
    </>
  );
};

export default EnhancedGlobalPropertyCard;
