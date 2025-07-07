/** @format */

"use client";
import React from "react";
import { Plus } from "lucide-react";
import InspectionPropertyCard from "./InspectionPropertyCard";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {slots.map(({ index, property }) => (
        <div key={index} className="relative">
          {property ? (
            <InspectionPropertyCard
              property={property.property}
              tab={tab}
              onRemove={() => onRemove(property.propertyId)}
              onClearNegotiatedPrice={
                onClearNegotiatedPrice
                  ? () => onClearNegotiatedPrice(property.propertyId)
                  : undefined
              }
              onClearLOIDocument={
                onClearLOIDocument
                  ? () => onClearLOIDocument(property.propertyId)
                  : undefined
              }
              negotiatedPrice={negotiatedPrices.find(
                (price) => price.propertyId === property.propertyId,
              )}
              loiDocument={loiDocuments.find(
                (doc) => doc.propertyId === property.propertyId,
              )}
            />
          ) : (
            <div
              onClick={onAddProperty}
              className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-[#8DDB90] transition-colors cursor-pointer"
              style={{ minHeight: "320px" }}
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-[#E4EFE7] rounded-full flex items-center justify-center mb-4">
                  <Plus size={24} className="text-[#8DDB90]" />
                </div>
                <h3 className="text-lg font-semibold text-[#09391C] mb-2">
                  Add Property {index + 1}
                </h3>
                <p className="text-sm text-[#5A5D63] mb-4">
                  Click to select a property for inspection
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#8DDB90] text-white rounded-lg text-sm font-medium hover:bg-[#76c77a] transition-colors"
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
