/** @format */

"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface NegotiatedPrice {
  propertyId: string;
  originalPrice: number;
  negotiatedPrice: number;
}

interface InspectionProperty {
  propertyId: string;
  property: any;
}

interface MarketplaceContextType {
  // Negotiated prices
  negotiatedPrices: NegotiatedPrice[];
  addNegotiatedPrice: (
    propertyId: string,
    originalPrice: number,
    negotiatedPrice: number,
  ) => void;
  removeNegotiatedPrice: (propertyId: string) => void;
  getNegotiatedPrice: (propertyId: string) => NegotiatedPrice | null;

  // Inspection selection (max 2 properties)
  selectedForInspection: InspectionProperty[];
  toggleInspectionSelection: (property: any) => void;
  removeFromInspection: (propertyId: string) => void;
  clearInspectionSelection: () => void;
  isSelectedForInspection: (propertyId: string) => boolean;
  canSelectMoreForInspection: () => boolean;

  // Filter states
  usageOptions: string[];
  setUsageOptions: (options: string[]) => void;
  rentFilterBy: string[];
  setRentFilterBy: (filters: string[]) => void;
  jvFilterBy: string[];
  setJvFilterBy: (filters: string[]) => void;
  homeCondition: string;
  setHomeCondition: (condition: string) => void;

  // Search and loading states
  searchStatus: {
    status: "pending" | "success" | "failed" | "idle";
    couldNotFindAProperty: boolean;
  };
  setSearchStatus: (status: {
    status: "pending" | "success" | "failed" | "idle";
    couldNotFindAProperty: boolean;
  }) => void;

  properties: any[];
  setProperties: (properties: any[]) => void;

  formikStatus: "idle" | "pending" | "success" | "failed";
  setFormikStatus: (status: "idle" | "pending" | "success" | "failed") => void;

  errMessage: string;
  setErrMessage: (message: string) => void;

  // Clear all filters
  clearAllFilters: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(
  undefined,
);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Negotiated prices state
  const [negotiatedPrices, setNegotiatedPrices] = useState<NegotiatedPrice[]>(
    [],
  );

  // Inspection selection state (max 2 properties)
  const [selectedForInspection, setSelectedForInspection] = useState<
    InspectionProperty[]
  >([]);

  // Filter states
  const [usageOptions, setUsageOptions] = useState<string[]>([]);
  const [rentFilterBy, setRentFilterBy] = useState<string[]>([]);
  const [jvFilterBy, setJvFilterBy] = useState<string[]>(["All"]);
  const [homeCondition, setHomeCondition] = useState<string>("");

  // Search and loading states
  const [searchStatus, setSearchStatus] = useState<{
    status: "pending" | "success" | "failed" | "idle";
    couldNotFindAProperty: boolean;
  }>({
    status: "idle",
    couldNotFindAProperty: false,
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [formikStatus, setFormikStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("success");
  const [errMessage, setErrMessage] = useState<string>("");

  // Negotiated prices methods
  const addNegotiatedPrice = useCallback(
    (propertyId: string, originalPrice: number, negotiatedPrice: number) => {
      setNegotiatedPrices((prev) => {
        const existingIndex = prev.findIndex(
          (p) => p.propertyId === propertyId,
        );
        if (existingIndex >= 0) {
          // Update existing negotiated price
          const updated = [...prev];
          updated[existingIndex] = {
            propertyId,
            originalPrice,
            negotiatedPrice,
          };
          return updated;
        } else {
          // Add new negotiated price
          return [...prev, { propertyId, originalPrice, negotiatedPrice }];
        }
      });
    },
    [],
  );

  const removeNegotiatedPrice = useCallback((propertyId: string) => {
    setNegotiatedPrices((prev) =>
      prev.filter((p) => p.propertyId !== propertyId),
    );
  }, []);

  const getNegotiatedPrice = useCallback(
    (propertyId: string): NegotiatedPrice | null => {
      return negotiatedPrices.find((p) => p.propertyId === propertyId) || null;
    },
    [negotiatedPrices],
  );

  // Inspection selection methods
  const toggleInspectionSelection = useCallback((property: any) => {
    setSelectedForInspection((prev) => {
      const propertyId = property._id;
      const isAlreadySelected = prev.some(
        (item) => item.propertyId === propertyId,
      );

      if (isAlreadySelected) {
        // Remove from selection
        return prev.filter((item) => item.propertyId !== propertyId);
      } else {
        // Check if we can select more (max 2)
        if (prev.length >= 2) {
          // Use setTimeout to avoid setState during render
          setTimeout(() => {
            toast.error(
              "Maximum of 2 properties can be selected for inspection",
            );
          }, 0);
          return prev;
        }

        // Add to selection
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          toast.success("Property selected for inspection");
        }, 0);
        return [...prev, { propertyId, property }];
      }
    });
  }, []);

  const removeFromInspection = useCallback((propertyId: string) => {
    setSelectedForInspection((prev) =>
      prev.filter((item) => item.propertyId !== propertyId),
    );
  }, []);

  const clearInspectionSelection = useCallback(() => {
    setSelectedForInspection([]);
  }, []);

  const isSelectedForInspection = useCallback(
    (propertyId: string): boolean => {
      return selectedForInspection.some(
        (item) => item.propertyId === propertyId,
      );
    },
    [selectedForInspection],
  );

  const canSelectMoreForInspection = useCallback((): boolean => {
    return selectedForInspection.length < 2;
  }, [selectedForInspection]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setUsageOptions(["All"]);
    setRentFilterBy(["All"]);
    setJvFilterBy(["All"]);
    setHomeCondition("All");
  }, []);

  const contextValue: MarketplaceContextType = {
    // Negotiated prices
    negotiatedPrices,
    addNegotiatedPrice,
    removeNegotiatedPrice,
    getNegotiatedPrice,

    // Inspection selection
    selectedForInspection,
    toggleInspectionSelection,
    removeFromInspection,
    clearInspectionSelection,
    isSelectedForInspection,
    canSelectMoreForInspection,

    // Filter states
    usageOptions,
    setUsageOptions,
    rentFilterBy,
    setRentFilterBy,
    jvFilterBy,
    setJvFilterBy,
    homeCondition,
    setHomeCondition,

    // Search and loading states
    searchStatus,
    setSearchStatus,
    properties,
    setProperties,
    formikStatus,
    setFormikStatus,
    errMessage,
    setErrMessage,

    // Clear all filters
    clearAllFilters,
  };

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};
