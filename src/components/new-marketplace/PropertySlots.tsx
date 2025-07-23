/** @format */

"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { EnhancedGlobalPropertyCard, createPropertyCardData } from "@/components/common/property-cards";
import { useGlobalInspectionState } from "@/hooks/useGlobalInspectionState";

interface PropertySlotsProps {
  selectedProperties: any[];
  maxSlots: number;
  tab: "buy" | "jv" | "rent" | "shortlet";
  onRemove: (propertyId: string) => void;
  onClearNegotiatedPrice?: (propertyId: string) => void;
  onClearLOIDocument?: (propertyId: string) => void;
  onAddProperty: () => void;
  negotiatedPrices?: any[];
  loiDocuments?: any[];
}

// Helper function to determine if a property is a Joint Venture property
const isJVProperty = (property: any): boolean => {
  if (!property) return false;

  // Check briefType first (most reliable)
  if (property.briefType === "Joint Venture" ||
      property.briefType === "jv" ||
      property.briefType === "JV") {
    return true;
  }

  // Check category field
  if (property.category === "joint-venture" || property.category === "jv") {
    return true;
  }

  // Check propertyType for Land or Commercial (which are typically JV)
  if (property.propertyType === "Land" ||
      property.propertyType === "Commercial" ||
      property.propertyType === "land" ||
      property.propertyType === "commercial") {
    return true;
  }

  // Check propertyCategory as fallback
  if (property.propertyCategory === "Land" ||
      property.propertyCategory === "Commercial" ||
      property.propertyCategory === "land" ||
      property.propertyCategory === "commercial") {
    return true;
  }

  // Check type field
  if (property.type === "land" || property.type === "commercial") {
    return true;
  }

  return false;
};

const PropertySlots: React.FC<PropertySlotsProps> = ({
  selectedProperties,
  maxSlots,
  tab,
  onRemove,
  onClearNegotiatedPrice,
  onClearLOIDocument,
  onAddProperty,
  negotiatedPrices = [],
  loiDocuments = [],
}) => {

  // Global inspection state for modal submissions
  const { addNegotiatedPrice, addLOIDocument } = useGlobalInspectionState();

  // Modal state management
  const [priceNegotiationModal, setPriceNegotiationModal] = useState({
    isOpen: false,
    property: null,
  });

  const [loiUploadModal, setLoiUploadModal] = useState({
    isOpen: false,
    property: null,
  });

  // Helper function to find negotiated price for a property
  const getNegotiatedPrice = (propertyId: string) => {
    return negotiatedPrices.find(np => np.propertyId === propertyId) || null;
  };

  // Helper function to find LOI document for a property
  const getLOIDocument = (propertyId: string) => {
    return loiDocuments.find(loi => loi.propertyId === propertyId) || null;
  };

  // Modal handlers
  const handlePriceNegotiation = (property: any) => {
    setPriceNegotiationModal({
      isOpen: true,
      property,
    });
  };

  const handleLOIUpload = (property: any) => {
    setLoiUploadModal({
      isOpen: true,
      property,
    });
  };

  const handleNegotiationSubmit = (property: any, negotiatedPriceValue: number) => {
    const originalPrice = property.price || property.rentalPrice || 0;
    addNegotiatedPrice(property._id || property.id, originalPrice, negotiatedPriceValue);
    setPriceNegotiationModal({ isOpen: false, property: null });
  };

  const handleLOISubmit = (property: any, document: File, documentUrl: string) => {
    addLOIDocument(property._id || property.id, document, documentUrl);
    setLoiUploadModal({ isOpen: false, property: null });
  };

  const slots = Array.from({ length: maxSlots }, (_, index) => {
    const property = selectedProperties[index];
    return { index, property };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {slots.map(({ index, property }) => (
        <div
          key={index}
          className="relative w-full flex justify-center max-w-sm mx-auto lg:max-w-none"
        >
          {property ? (
            <div className="relative w-full flex justify-end">
              {isJVProperty(property.property) ? (
                <GlobalJVPropertyCard
                  property={property.property}
                  cardData={createPropertyCardData(property.property, "Joint Venture")}
                  images={
                    property.property?.pictures ||
                    property.property?.images ||
                    []
                  }
                  isPremium={property.property?.isPremium || false}
                  isSelected={true} // Property is selected for inspection
                  loiDocument={getLOIDocument(property.propertyId)}
                  onPropertyClick={() => {}} // Disabled in inspection view
                  onInspectionToggle={() => onRemove(property.propertyId)} // Remove from inspection
                  onLOIUpload={() => handleLOIUpload(property.property)} // Open LOI upload modal
                  onUpdateLOI={() => handleLOIUpload(property.property)} // Open LOI update modal
                  onRemoveLOI={() => onClearLOIDocument && onClearLOIDocument(property.propertyId)}
                />
              ) : (
                <GlobalPropertyCard
                  tab={tab === "jv" ? "buy" : tab}
                  property={property.property}
                  cardData={createPropertyCardData(property.property)}
                  images={
                    property.property?.pictures ||
                    property.property?.images ||
                    []
                  }
                  isPremium={property.property?.isPremium || false}
                  isSelected={true} // Property is selected for inspection
                  negotiatedPrice={getNegotiatedPrice(property.propertyId)}
                  onPropertyClick={() => {}} // Disabled in inspection view
                  onInspectionToggle={() => onRemove(property.propertyId)} // Remove from inspection
                  onPriceNegotiation={() => handlePriceNegotiation(property.property)} // Open price negotiation modal
                  onEditPrice={() => handlePriceNegotiation(property.property)} // Open price edit modal
                  onRemoveNegotiation={() => onClearNegotiatedPrice && onClearNegotiatedPrice(property.propertyId)}
                />
              )}
              {/* Remove Button Overlay */}
              <button
                onClick={() => onRemove(property.propertyId)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                title="Remove from inspection"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              onClick={onAddProperty}
              className="bg-white rounded-lg flex justify-center items-center border-2 border-dashed border-gray-300 hover:border-[#8DDB90] transition-colors cursor-pointer w-full max-w-[320px] md:w-[280px] lg:w-[285px] xl:w-[280px] min-h-[400px] flex-col mx-auto"
            >
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-20 h-20 bg-[#E4EFE7] rounded-full flex items-center justify-center mb-4">
                  <Plus size={32} className="text-[#8DDB90]" />
                </div>
                <h3 className="text-lg font-semibold text-[#09391C] mb-3">
                  Property Slot {index + 1}
                </h3>
                <p className="text-sm text-[#5A5D63] mb-4">
                  Click to browse and add a property for inspection
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Price Negotiation Modal */}
      {priceNegotiationModal.isOpen && (
        <PriceNegotiationModal
          property={priceNegotiationModal.property}
          onClose={() => setPriceNegotiationModal({ isOpen: false, property: null })}
          onSubmit={handleNegotiationSubmit}
          existingNegotiation={getNegotiatedPrice(
            priceNegotiationModal.property?._id || priceNegotiationModal.property?.id
          )}
        />
      )}

      {/* LOI Upload Modal */}
      {loiUploadModal.isOpen && (
        <LOIUploadModal
          property={loiUploadModal.property}
          onClose={() => setLoiUploadModal({ isOpen: false, property: null })}
          onSubmit={handleLOISubmit}
          existingDocument={getLOIDocument(
            loiUploadModal.property?._id || loiUploadModal.property?.id
          )}
        />
      )}

    </div>
  );
};

export default PropertySlots;
