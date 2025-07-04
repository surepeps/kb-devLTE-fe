/** @format */

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
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

export interface MarketTypeSelection {
  name: string;
  briefType: string;
  subValue: string;
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

  // Search filters
  searchLocation: {
    state: string;
    localGovernment: string;
    area?: string;
  } | null;
  setSearchLocation: (
    location: {
      state: string;
      localGovernment: string;
      area?: string;
    } | null,
  ) => void;

  priceRange: {
    min: number;
    max: number;
  } | null;
  setPriceRange: (range: { min: number; max: number } | null) => void;

  selectedMarketType: MarketTypeSelection | null;
  setSelectedMarketType: (market: MarketTypeSelection) => void;

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

  // Data fetching
  fetchInitialData: (briefType: string) => Promise<void>;

  // Clear all filters
  clearAllFilters: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(
  undefined,
);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Track if component is mounted to prevent setState on unmounted component
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [selectedMarketType, setSelectedMarketType] =
    useState<MarketTypeSelection | null>({
      name: "Buy a property",
      briefType: "buy",
      subValue: "Outright Sales",
    });

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
    const propertyId = property._id;

    setSelectedForInspection((prev) => {
      const isAlreadySelected = prev.some(
        (item) => item.propertyId === propertyId,
      );

      if (isAlreadySelected) {
        // Remove from selection (no notification needed for removal)
        return prev.filter((item) => item.propertyId !== propertyId);
      } else {
        // Check if we can select more (max 2)
        if (prev.length >= 2) {
          // Schedule toast for next tick to avoid setState during render
          setTimeout(() => {
            toast.error(
              "Maximum of 2 properties can be selected for inspection",
            );
          }, 0);
          return prev;
        }

        // Show success notification only once when adding
        setTimeout(() => {
          toast.success("Property selected for inspection");
        }, 0);

        // Add to selection
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

  // Data fetching
  const fetchInitialData = useCallback(async (briefToFetch: string) => {
    // Don't proceed if briefToFetch is empty or invalid
    if (!briefToFetch || typeof briefToFetch !== "string") {
      console.warn("Invalid briefToFetch parameter:", briefToFetch);
      return;
    }

    setFormikStatus("pending");
    setErrMessage("");

    try {
      // Import URLS and shuffleArray dynamically to avoid dependency issues
      const { URLS } = await import("@/utils/URLS");
      const { shuffleArray } = await import("@/utils/shuffleArray");

      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(URLS.BASE + briefToFetch, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (isMountedRef.current) {
          setErrMessage(errorMessage);
          setFormikStatus("failed");
        }
        return;
      }

      const data = await response.json();

      if (isMountedRef.current) {
        setFormikStatus("success");

        // Handle different response structures
        const responseData = data?.data || data || [];
        const approvedData = Array.isArray(responseData)
          ? responseData.filter((item: any) => item?.isApproved === true)
          : [];

        const shuffledData = shuffleArray(approvedData);
        setProperties(shuffledData);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);

      let errorMessage = "An error occurred while fetching data";

      if (err.name === "AbortError") {
        errorMessage =
          "Request timed out. Please check your connection and try again.";
      } else if (err.message?.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      if (isMountedRef.current) {
        setErrMessage(errorMessage);
        setFormikStatus("failed");
      }
    }
  }, []);

  // Search filters state
  const [searchLocation, setSearchLocation] = useState<{
    state: string;
    localGovernment: string;
    area?: string;
  } | null>(null);

  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setUsageOptions(["All"]);
    setRentFilterBy(["All"]);
    setJvFilterBy(["All"]);
    setHomeCondition("All");
    setSearchLocation(null);
    setPriceRange(null);
  }, []);

  const contextValue: MarketplaceContextType = useMemo(
    () => ({
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

      selectedMarketType,
      setSelectedMarketType,

      // Filter states
      usageOptions,
      setUsageOptions,
      rentFilterBy,
      setRentFilterBy,
      jvFilterBy,
      setJvFilterBy,
      homeCondition,
      setHomeCondition,

      // Search filters
      searchLocation,
      setSearchLocation,
      priceRange,
      setPriceRange,

      // Search and loading states
      searchStatus,
      setSearchStatus,
      properties,
      setProperties,
      formikStatus,
      setFormikStatus,
      errMessage,
      setErrMessage,

      // Data fetching
      fetchInitialData,

      // Clear all filters
      clearAllFilters,
    }),
    [
      negotiatedPrices,
      addNegotiatedPrice,
      removeNegotiatedPrice,
      getNegotiatedPrice,
      selectedForInspection,
      toggleInspectionSelection,
      removeFromInspection,
      clearInspectionSelection,
      isSelectedForInspection,
      canSelectMoreForInspection,
      selectedMarketType,
      setSelectedMarketType,
      usageOptions,
      setUsageOptions,
      rentFilterBy,
      setRentFilterBy,
      jvFilterBy,
      setJvFilterBy,
      homeCondition,
      setHomeCondition,
      searchLocation,
      setSearchLocation,
      priceRange,
      setPriceRange,
      searchStatus,
      setSearchStatus,
      properties,
      setProperties,
      formikStatus,
      setFormikStatus,
      errMessage,
      setErrMessage,
      fetchInitialData,
      clearAllFilters,
    ],
  );

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
