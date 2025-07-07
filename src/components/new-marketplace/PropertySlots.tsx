/** @format */

"use client";
import React from "react";
import { Plus } from "lucide-react";
import PropertyCard from "./cards/PropertyCard";
import JVPropertyCard from "./cards/JVPropertyCard";

interface PropertySlotsProps {
  selectedProperties: any[];
  maxSlots: number;
  tab: "buy" | "jv" | "rent";
  onRemove: (propertyId: string) => void;
  onClearNegotiatedPrice?: (propertyId: string) => void;
  onClearLOIDocument?: (propertyId: string) => void;
  onAddProperty: () => void;
  negotiatedPrices?: any[];
  loiDocuments?: any[];
}

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
  const slots = Array.from({ length: maxSlots }, (_, index) => {
    const property = selectedProperties[index];
    return { index, property };
  });

  const getPropertyCardData = (property: any) => {
    if (tab === "jv") {
      return [
        { header: "Property Type", value: property.propertyType || "N/A" },
        {
          header: "Investment Amount",
          value: `₦${Number(property.investmentAmount || property.price || 0).toLocaleString()}`,
        },
        { header: "Bedrooms", value: property.noOfBedrooms || "0" },
        {
          header: "Investment Type",
          value: property.investmentType || "Joint Venture",
        },
        { header: "Expected ROI", value: property.expectedROI || "15-20%" },
        {
          header: "Location",
          value: property.location
            ? `${property.location.area || ""}, ${property.location.localGovernment || ""}, ${property.location.state || ""}`.replace(
                /^,\s*|,\s*$/g,
                "",
              )
            : "Location not specified",
        },
      ];
    } else {
      return [
        { header: "Property Type", value: property.propertyType || "N/A" },
        {
          header: "Price",
          value: `₦${Number(property.price || 0).toLocaleString()}`,
        },
        { header: "Bedrooms", value: property.noOfBedrooms || "0" },
        {
          header: "Location",
          value: property.location
            ? `${property.location.area || ""}, ${property.location.localGovernment || ""}, ${property.location.state || ""}`.replace(
                /^,\s*|,\s*$/g,
                "",
              )
            : "Location not specified",
        },
      ];
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {slots.map(({ index, property }) => (
        <div key={index} className="relative max-w-sm mx-auto lg:max-w-none">
          {property ? (
            <div className="relative">
              {tab === "jv" ? (
                <JVPropertyCard
                  property={property.property}
                  cardData={getPropertyCardData(property.property)}
                  images={
                    property.property?.pictures ||
                    property.property?.images ||
                    []
                  }
                  isPremium={property.property?.isPremium || false}
                  onPropertyClick={() => {}} // Disabled in inspection view
                  onInspectionToggle={() => onRemove(property.propertyId)}
                  onLOIUpload={(propertyId: string, document: File) => {
                    // Handle LOI upload in inspection view
                    // You can add context method call here if needed
                  }}
                  onRemoveLOI={onClearLOIDocument || (() => {})}
                  isSelected={true}
                  loiDocument={loiDocuments.find(
                    (doc) => doc.propertyId === property.propertyId,
                  )}
                />
              ) : (
                <PropertyCard
                  tab={tab}
                  property={property.property}
                  cardData={getPropertyCardData(property.property)}
                  images={
                    property.property?.pictures ||
                    property.property?.images ||
                    []
                  }
                  isPremium={property.property?.isPremium || false}
                  onPropertyClick={() => {}} // Disabled in inspection view
                  onInspectionToggle={() => onRemove(property.propertyId)}
                  onPriceNegotiation={(property: any) => {
                    // Handle price negotiation in inspection view
                    // You can add modal state here if needed
                  }}
                  onRemoveNegotiation={onClearNegotiatedPrice || (() => {})}
                  isSelected={true}
                  negotiatedPrice={negotiatedPrices.find(
                    (price) => price.propertyId === property.propertyId,
                  )}
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
              className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-[#8DDB90] transition-colors cursor-pointer min-h-[450px] flex flex-col"
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
                <button
                  type="button"
                  className="px-4 py-3 bg-[#8DDB90] text-white rounded-lg text-sm font-medium hover:bg-[#76c77a] transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PropertySlots;
