/** @format */

"use client";
import React from "react";
import { Plus } from "lucide-react";
import { GlobalPropertyCard, GlobalJVPropertyCard, createPropertyCardData } from "@/components/common/property-cards";

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

  // Debug logging to understand property structure
  console.log("Property data for JV detection:", {
    briefType: property.briefType,
    propertyType: property.propertyType,
    propertyCategory: property.propertyCategory,
    category: property.category,
    type: property.type,
    title: property.title
  });

  // Check briefType first (most reliable)
  if (property.briefType === "Joint Venture" ||
      property.briefType === "jv" ||
      property.briefType === "JV") {
    console.log("✓ JV Property detected by briefType:", property.briefType);
    return true;
  }

  // Check category field
  if (property.category === "joint-venture" || property.category === "jv") {
    console.log("✓ JV Property detected by category:", property.category);
    return true;
  }

  // Check propertyType for Land or Commercial (which are typically JV)
  if (property.propertyType === "Land" ||
      property.propertyType === "Commercial" ||
      property.propertyType === "land" ||
      property.propertyType === "commercial") {
    console.log("✓ JV Property detected by propertyType:", property.propertyType);
    return true;
  }

  // Check propertyCategory as fallback
  if (property.propertyCategory === "Land" ||
      property.propertyCategory === "Commercial" ||
      property.propertyCategory === "land" ||
      property.propertyCategory === "commercial") {
    console.log("✓ JV Property detected by propertyCategory:", property.propertyCategory);
    return true;
  }

  // Check type field
  if (property.type === "land" || property.type === "commercial") {
    console.log("✓ JV Property detected by type:", property.type);
    return true;
  }

  console.log("✗ Regular Property - using GlobalPropertyCard");
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

  // Helper function to find negotiated price for a property
  const getNegotiatedPrice = (propertyId: string) => {
    return negotiatedPrices.find(np => np.propertyId === propertyId) || null;
  };

  // Helper function to find LOI document for a property
  const getLOIDocument = (propertyId: string) => {
    return loiDocuments.find(loi => loi.propertyId === propertyId) || null;
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
                  onPropertyClick={() => {}} // Disabled in inspection view
                />
              ) : (
                <GlobalPropertyCard
                  property={property.property}
                  cardData={createPropertyCardData(property.property)}
                  images={
                    property.property?.pictures ||
                    property.property?.images ||
                    []
                  }
                  isPremium={property.property?.isPremium || false}
                  onPropertyClick={() => {}} // Disabled in inspection view
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

    </div>
  );
};

export default PropertySlots;
