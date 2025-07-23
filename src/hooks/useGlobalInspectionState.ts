/** @format */

"use client";
import { useCallback } from "react";
import { useGlobalPropertyActions } from "@/context/global-property-actions-context";

export interface InspectionProperty {
  propertyId: string;
  property: any;
  sourceTab?: "buy" | "jv" | "rent" | "shortlet";
  sourcePage?: string;
}

export interface NegotiatedPrice {
  propertyId: string;
  originalPrice: number;
  negotiatedPrice: number;
}

export interface LOIDocument {
  propertyId: string;
  document: File | null;
  documentUrl?: string;
}

export const useGlobalInspectionState = () => {
  const {
    selectedForInspection,
    negotiatedPrices,
    loiDocuments,
    toggleInspectionSelection,
    removeFromInspection,
    clearInspectionSelection,
    isSelectedForInspection,
    canSelectMoreForInspection,
    addNegotiatedPrice,
    removeNegotiatedPrice,
    getNegotiatedPrice,
    addLOIDocument,
    removeLOIDocument,
    getLOIDocument,
    hasSelectedProperties,
    selectedCount,
  } = useGlobalPropertyActions();

  // Add property to inspection (wrapper around global context)
  const addProperty = useCallback((
    property: any,
    sourceTab?: "buy" | "jv" | "rent" | "shortlet",
    sourcePage?: string
  ) => {
    toggleInspectionSelection(property, sourceTab, sourcePage);
  }, [toggleInspectionSelection]);

  // Remove property from inspection (wrapper around global context)
  const removeProperty = useCallback((propertyId: string) => {
    removeFromInspection(propertyId);
  }, [removeFromInspection]);

  // Toggle property selection (wrapper around global context)
  const toggleProperty = useCallback((
    property: any,
    sourceTab?: "buy" | "jv" | "rent" | "shortlet",
    sourcePage?: string
  ) => {
    toggleInspectionSelection(property, sourceTab, sourcePage);
  }, [toggleInspectionSelection]);

  // Check if property is selected (wrapper around global context)
  const isPropertySelected = useCallback((propertyId: string) => {
    return isSelectedForInspection(propertyId);
  }, [isSelectedForInspection]);

  // Remove negotiated price (wrapper around global context)
  const clearNegotiatedPrice = useCallback((propertyId: string) => {
    removeNegotiatedPrice(propertyId);
  }, [removeNegotiatedPrice]);

  // Remove LOI document (wrapper around global context)
  const clearLOIDocument = useCallback((propertyId: string) => {
    removeLOIDocument(propertyId);
  }, [removeLOIDocument]);

  // Clear all selections (wrapper around global context)
  const clearAllSelections = useCallback(() => {
    clearInspectionSelection();
  }, [clearInspectionSelection]);

  // Get property type for display
  const getPropertyType = useCallback((property: any) => {
    // Check briefType first
    if (property?.briefType) {
      return property.briefType;
    }

    // Check propertyType and map to briefType
    const propertyType = property?.propertyType;
    if (propertyType === "Land" || propertyType === "Commercial") {
      return "Joint Venture";
    }

    // Default based on context or fall back to "Outright Sales"
    return "Outright Sales";
  }, []);

  // Check if can select more properties (wrapper around global context)
  const canSelectMore = useCallback(() => {
    return canSelectMoreForInspection();
  }, [canSelectMoreForInspection]);

  return {
    // State (from global context)
    selectedProperties: selectedForInspection,
    negotiatedPrices,
    loiDocuments,

    // Property selection
    addProperty,
    removeProperty,
    toggleProperty,
    isPropertySelected,
    canSelectMore,

    // Price negotiation
    addNegotiatedPrice,
    clearNegotiatedPrice,
    getNegotiatedPrice,

    // LOI documents
    addLOIDocument,
    clearLOIDocument,
    getLOIDocument,

    // Utilities
    clearAllSelections,
    getPropertyType,

    // Computed values (from global context)
    hasSelectedProperties,
    selectedCount,
    maxReached: selectedCount >= 2,
  };
};
