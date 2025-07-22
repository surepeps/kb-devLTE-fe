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

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState && savedState.trim()) {
        const parsedState = JSON.parse(savedState);
        // Validate the parsed state structure
        if (parsedState && typeof parsedState === 'object') {
          setState({
            selectedProperties: Array.isArray(parsedState.selectedProperties) ? parsedState.selectedProperties : [],
            negotiatedPrices: Array.isArray(parsedState.negotiatedPrices) ? parsedState.negotiatedPrices : [],
            loiDocuments: Array.isArray(parsedState.loiDocuments) ? parsedState.loiDocuments : [],
          });
        }
      }
    } catch (error) {
      console.error("Failed to parse global inspection state, clearing localStorage:", error);
      localStorage.removeItem(STORAGE_KEY);
      // Also clear other potentially corrupted inspection-related storage
      localStorage.removeItem('selectedBriefs');
      localStorage.removeItem('inspectionSelection');
      localStorage.removeItem('marketplaceState');
    }
  }, []);

  // Save state to localStorage whenever it changes
  const saveState = useCallback((newState: GlobalInspectionState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  // Add property to inspection
  const addProperty = useCallback((
    property: any,
    sourceTab?: "buy" | "jv" | "rent" | "shortlet",
    sourcePage?: string
  ) => {
    const propertyId = property._id;
    
    setState(currentState => {
      // Check if already selected
      if (currentState.selectedProperties.some(p => p.propertyId === propertyId)) {
        return currentState;
      }

      // Check max limit (2 properties)
      if (currentState.selectedProperties.length >= 2) {
        throw new Error("Maximum of 2 properties can be selected for inspection");
      }

      const newState = {
        ...currentState,
        selectedProperties: [
          ...currentState.selectedProperties,
          {
            propertyId,
            property,
            sourceTab,
            sourcePage,
          },
        ],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Remove property from inspection
  const removeProperty = useCallback((propertyId: string) => {
    setState(currentState => {
      const newState = {
        ...currentState,
        selectedProperties: currentState.selectedProperties.filter(
          p => p.propertyId !== propertyId
        ),
        // Also remove associated negotiated prices and LOI documents
        negotiatedPrices: currentState.negotiatedPrices.filter(
          p => p.propertyId !== propertyId
        ),
        loiDocuments: currentState.loiDocuments.filter(
          d => d.propertyId !== propertyId
        ),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Toggle property selection
  const toggleProperty = useCallback((
    property: any,
    sourceTab?: "buy" | "jv" | "rent" | "shortlet",
    sourcePage?: string
  ) => {
    const propertyId = property._id;
    const isSelected = state.selectedProperties.some(p => p.propertyId === propertyId);

    if (isSelected) {
      removeProperty(propertyId);
    } else {
      try {
        addProperty(property, sourceTab, sourcePage);
      } catch (error) {
        throw error;
      }
    }
  }, [state.selectedProperties, addProperty, removeProperty]);

  // Check if property is selected
  const isPropertySelected = useCallback((propertyId: string) => {
    return state.selectedProperties.some(p => p.propertyId === propertyId);
  }, [state.selectedProperties]);

  // Add negotiated price
  const addNegotiatedPrice = useCallback((
    propertyId: string,
    originalPrice: number,
    negotiatedPrice: number
  ) => {
    setState(currentState => {
      const newState = {
        ...currentState,
        negotiatedPrices: [
          ...currentState.negotiatedPrices.filter(p => p.propertyId !== propertyId),
          { propertyId, originalPrice, negotiatedPrice },
        ],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Remove negotiated price
  const clearNegotiatedPrice = useCallback((propertyId: string) => {
    setState(currentState => {
      const newState = {
        ...currentState,
        negotiatedPrices: currentState.negotiatedPrices.filter(
          p => p.propertyId !== propertyId
        ),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Get negotiated price for property
  const getNegotiatedPrice = useCallback((propertyId: string) => {
    return state.negotiatedPrices.find(p => p.propertyId === propertyId) || null;
  }, [state.negotiatedPrices]);

  // Add LOI document
  const addLOIDocument = useCallback((
    propertyId: string,
    document: File,
    documentUrl?: string
  ) => {
    setState(currentState => {
      const newState = {
        ...currentState,
        loiDocuments: [
          ...currentState.loiDocuments.filter(d => d.propertyId !== propertyId),
          { propertyId, document, documentUrl },
        ],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Remove LOI document
  const clearLOIDocument = useCallback((propertyId: string) => {
    setState(currentState => {
      const newState = {
        ...currentState,
        loiDocuments: currentState.loiDocuments.filter(
          d => d.propertyId !== propertyId
        ),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Get LOI document for property
  const getLOIDocument = useCallback((propertyId: string) => {
    return state.loiDocuments.find(d => d.propertyId === propertyId) || null;
  }, [state.loiDocuments]);

  // Clear all selections
  const clearAllSelections = useCallback(() => {
    const newState = {
      selectedProperties: [],
      negotiatedPrices: [],
      loiDocuments: [],
    };

    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

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

  // Check if can select more properties
  const canSelectMore = useCallback(() => {
    return state.selectedProperties.length < 2;
  }, [state.selectedProperties.length]);

  return {
    // State
    selectedProperties: state.selectedProperties,
    negotiatedPrices: state.negotiatedPrices,
    loiDocuments: state.loiDocuments,
    
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
    
    // Computed values
    hasSelectedProperties: state.selectedProperties.length > 0,
    selectedCount: state.selectedProperties.length,
    maxReached: state.selectedProperties.length >= 2,
  };
};
