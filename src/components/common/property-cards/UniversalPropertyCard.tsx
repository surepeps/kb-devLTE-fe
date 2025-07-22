/** @format */

"use client";
import React from "react";
import { usePathname } from "next/navigation";
import StandardPropertyCard, { StandardPropertyCardProps } from "./StandardPropertyCard";
import JVPropertyCard, { JVPropertyCardProps } from "./JVPropertyCard";
import { useGlobalInspectionState } from "@/hooks/useGlobalInspectionState";
import toast from "react-hot-toast";

// Combined props interface
export interface UniversalPropertyCardProps {
  property: any;
  cardData: { header: string; value: string }[];
  images: any[];
  isPremium: boolean;
  onPropertyClick: () => void;
  onInspectionToggle: () => void;
  isSelected: boolean;
  
  // Standard property card props (for Outright Sales, Rent, Shortlet)
  onPriceNegotiation?: () => void;
  onRemoveNegotiation?: (propertyId: string) => void;
  negotiatedPrice?: {
    propertyId: string;
    originalPrice: number;
    negotiatedPrice: number;
  } | null;
  
  // JV property card props (for Joint Venture)
  onLOIUpload?: () => void;
  onRemoveLOI?: (propertyId: string) => void;
  loiDocument?: {
    propertyId: string;
    document: File | null;
    documentUrl?: string;
  } | null;
  
  // Common optional props
  showPriceNegotiation?: boolean;
  showInspectionToggle?: boolean;
  showLOIUpload?: boolean;
  className?: string;
  maxSelections?: number;
  currentSelections?: number;
  
  // Property type override (if you want to force a specific card type)
  forceCardType?: "standard" | "jv";

  // Global inspection integration
  useGlobalInspection?: boolean;
  sourceTab?: "buy" | "jv" | "rent" | "shortlet";
  sourcePage?: string;
}

/**
 * UniversalPropertyCard - Automatically selects the appropriate property card
 * based on the property type or briefType
 * 
 * For "Joint Venture" properties: Uses JVPropertyCard
 * For "Outright Sales", "Rent", "Shortlet": Uses StandardPropertyCard
 */
const UniversalPropertyCard: React.FC<UniversalPropertyCardProps> = (props) => {
  const {
    property,
    cardData,
    forceCardType,
    onPriceNegotiation = () => {},
    onRemoveNegotiation = () => {},
    onLOIUpload = () => {},
    onRemoveLOI = () => {},
    ...commonProps
  } = props;

  // Determine card type based on property
  const getCardType = (): "standard" | "jv" => {
    if (forceCardType) return forceCardType;
    
    // Check property briefType first
    if (property?.briefType === "Joint Venture") return "jv";
    
    // Check property type in cardData
    const propertyTypeData = cardData.find(item => item.header === "Property Type");
    if (propertyTypeData?.value === "Joint Venture") return "jv";
    
    // Check investment type (JV specific field)
    const hasInvestmentType = cardData.some(item => item.header === "Investment Type");
    const hasExpectedROI = cardData.some(item => item.header === "Expected ROI");
    const hasInvestmentAmount = cardData.some(item => item.header === "Investment Amount");
    
    if (hasInvestmentType || hasExpectedROI || hasInvestmentAmount) return "jv";
    
    // Default to standard card
    return "standard";
  };

  const cardType = getCardType();

  if (cardType === "jv") {
    const jvProps: JVPropertyCardProps = {
      ...commonProps,
      property,
      cardData,
      onLOIUpload,
      onRemoveLOI,
      loiDocument: props.loiDocument,
      showLOIUpload: props.showLOIUpload,
    };
    
    return <JVPropertyCard {...jvProps} />;
  }

  // Standard property card for Outright Sales, Rent, Shortlet
  const standardProps: StandardPropertyCardProps = {
    ...commonProps,
    property,
    cardData,
    onPriceNegotiation,
    onRemoveNegotiation,
    negotiatedPrice: props.negotiatedPrice,
    showPriceNegotiation: props.showPriceNegotiation,
  };

  return <StandardPropertyCard {...standardProps} />;
};

// Helper function to create card data for different property types
export const createPropertyCardData = (property: any, propertyType?: string): { header: string; value: string }[] => {
  const type = propertyType || property?.briefType || property?.propertyType || "Unknown";
  
  if (type === "Joint Venture") {
    return [
      { header: "Property Type", value: property.propertyType || "N/A" },
      { header: "Investment Amount", value: `₦${Number(property.investmentAmount || property.price || 0).toLocaleString()}` },
      { header: "Expected ROI", value: property.expectedROI || "N/A" },
      { header: "Investment Type", value: property.investmentType || "Joint Venture" },
      { header: "Bedrooms", value: property.additionalFeatures?.noOfBedrooms || property.noOfBedrooms || "0" },
      {
        header: "Location",
        value: property.location
          ? `${property.location.area || ""}, ${property.location.localGovernment || ""}, ${property.location.state || ""}`.replace(/^,\s*|,\s*$/g, "")
          : "Location not specified",
      },
    ];
  }

  // Standard property card data (for Outright Sales, Rent, Shortlet)
  return [
    { header: "Property Type", value: property.propertyType || "N/A" },
    { header: "Price", value: `₦${Number(property.price || 0).toLocaleString()}` },
    { header: "Bedrooms", value: property.additionalFeatures?.noOfBedrooms || property.noOfBedrooms || "0" },
    { header: "Bathrooms", value: property.additionalFeatures?.noOfBathrooms || property.noOfBathrooms || "0" },
    { header: "Toilets", value: property.additionalFeatures?.noOfToilets || property.noOfToilets || "0" },
    { header: "CarParks", value: property.additionalFeatures?.noOfCarParks || property.noOfCarParks || "0" },
    {
      header: "Location",
      value: property.location
        ? `${property.location.area || ""}, ${property.location.localGovernment || ""}, ${property.location.state || ""}`.replace(/^,\s*|,\s*$/g, "")
        : "Location not specified",
    },
  ];
};

export default UniversalPropertyCard;
