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

export interface SearchParams {
  briefType: string;
  page?: number;
  limit?: number;
  location?: string;
  priceRange?: { min?: number; max?: number };
  documentType?: string[];
  bedroom?: number;
  bathroom?: number;
  landSizeType?: string;
  landSize?: number;
  desireFeature?: string[];
  homeCondition?: string;
  tenantCriteria?: string[];
  type?: string;
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

  // Data fetching with search parameters
  fetchInitialData: (briefType: string) => Promise<void>;
  searchProperties: (searchParams: SearchParams) => Promise<void>;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;

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
  >("idle");
  const [errMessage, setErrMessage] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

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

  // API-based search using backend parameters
  const searchProperties = useCallback(
    async (searchParams: SearchParams, retryCount = 0) => {
      const maxRetries = 2;

      if (!isMountedRef.current) return;

      setFormikStatus("pending");
      setErrMessage("");

      try {
        // Check network connectivity first
        if (!navigator.onLine) {
          throw new Error(
            "No internet connection. Please check your network and try again.",
          );
        }

        // Import utilities dynamically to avoid dependency issues
        const { URLS } = await import("@/utils/URLS");
        const { GET_REQUEST } = await import("@/utils/requests");

        // Validate URL construction
        if (!URLS.BASE || URLS.BASE.includes("undefined")) {
          throw new Error(
            "API URL is not properly configured. Please contact support.",
          );
        }

        // Build query parameters according to backend API
        const queryParams = new URLSearchParams();

        // Required parameter
        queryParams.append("briefType", searchParams.briefType);

        // Pagination parameters
        queryParams.append("page", String(searchParams.page || currentPage));
        queryParams.append("limit", String(searchParams.limit || itemsPerPage));

        // Optional filter parameters
        if (searchParams.location) {
          queryParams.append("location", searchParams.location);
        }

        if (searchParams.priceRange) {
          queryParams.append(
            "priceRange",
            JSON.stringify(searchParams.priceRange),
          );
        }

        if (searchParams.documentType && searchParams.documentType.length > 0) {
          queryParams.append(
            "documentType",
            searchParams.documentType.join(","),
          );
        }

        if (searchParams.bedroom) {
          queryParams.append("bedroom", String(searchParams.bedroom));
        }

        if (searchParams.bathroom) {
          queryParams.append("bathroom", String(searchParams.bathroom));
        }

        if (searchParams.landSizeType) {
          queryParams.append("landSizeType", searchParams.landSizeType);
        }

        if (searchParams.landSize) {
          queryParams.append("landSize", String(searchParams.landSize));
        }

        if (
          searchParams.desireFeature &&
          searchParams.desireFeature.length > 0
        ) {
          queryParams.append(
            "desireFeature",
            searchParams.desireFeature.join(","),
          );
        }

        if (searchParams.homeCondition) {
          queryParams.append("homeCondition", searchParams.homeCondition);
        }

        if (
          searchParams.tenantCriteria &&
          searchParams.tenantCriteria.length > 0
        ) {
          queryParams.append(
            "tenantCriteria",
            searchParams.tenantCriteria.join(","),
          );
        }

        if (searchParams.type) {
          queryParams.append("type", searchParams.type);
        }

        const apiUrl = `${URLS.BASE}${URLS.fetchBriefs}?${queryParams.toString()}`;
        console.log("Fetching from:", apiUrl);

        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            setFormikStatus("failed");
            setErrMessage("Request timed out. Please try again.");
            setSearchStatus({
              status: "failed",
              couldNotFindAProperty: true,
            });
          }
        }, 30000); // 30 second timeout

        // Use the GET_REQUEST utility
        console.log("Making API request to:", apiUrl);
        const response = await GET_REQUEST(apiUrl);
        console.log("API response received:", response);

        // Clear timeout if request succeeds
        clearTimeout(timeoutId);

        if (!isMountedRef.current) return;

        // Check for API error response
        if (response?.error || response?.success === false) {
          const errorMessage =
            response?.message || response?.error || "Failed to fetch data";
          console.error("API Error:", errorMessage);

          setErrMessage(errorMessage);
          setFormikStatus("failed");
          setSearchStatus({
            status: "failed",
            couldNotFindAProperty: true,
          });
          return;
        }

        // Handle successful response with pagination
        const responseData = response?.data || [];
        const pagination = response?.pagination || {};

        console.log("Response data structure:", responseData);
        console.log("Pagination data:", pagination);

        // Update properties and pagination state
        setProperties(responseData);
        setTotalPages(pagination.totalPages || 1);
        setTotalItems(pagination.total || responseData.length);
        setCurrentPage(
          pagination.currentPage || searchParams.page || currentPage,
        );

        setSearchStatus({
          status: "success",
          couldNotFindAProperty: responseData.length === 0,
        });

        // Set success status AFTER all data is updated
        setFormikStatus("success");

        console.log(
          `Successfully loaded ${responseData.length} properties. Page ${pagination.currentPage} of ${pagination.totalPages}`,
        );
      } catch (err: any) {
        console.error("Search error (attempt " + (retryCount + 1) + "):", err);

        if (!isMountedRef.current) return;

        // Retry logic for network errors
        if (
          retryCount < maxRetries &&
          (err.message?.includes("Failed to fetch") ||
            err.message?.includes("Network error") ||
            err.name === "TypeError")
        ) {
          console.log(`Retrying request... (${retryCount + 1}/${maxRetries})`);
          setTimeout(
            () => {
              if (isMountedRef.current) {
                searchProperties(searchParams, retryCount + 1);
              }
            },
            1000 * (retryCount + 1),
          );
          return;
        }

        let errorMessage = "An error occurred while searching properties";

        if (err.name === "AbortError") {
          errorMessage =
            "Request timed out. Please check your connection and try again.";
        } else if (err.message?.includes("Failed to fetch")) {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setErrMessage(errorMessage);
        setFormikStatus("failed");
        setSearchStatus({
          status: "failed",
          couldNotFindAProperty: true,
        });
      }
    },
    [isMountedRef],
  );

  // Simple data fetching for initial load (backward compatibility)
  const fetchInitialData = useCallback(
    async (briefType: string) => {
      if (!isMountedRef.current) return;

      console.log("Fetching initial data for briefType:", briefType);
      const searchParams: SearchParams = {
        briefType,
        page: 1,
        limit: itemsPerPage,
      };
      await searchProperties(searchParams);
    },
    [searchProperties, itemsPerPage],
  );

  // Auto-fetch initial data on mount if market type is set
  useEffect(() => {
    if (selectedMarketType && formikStatus === "idle") {
      console.log(
        "Auto-fetching initial data for:",
        selectedMarketType.briefType,
      );
      fetchInitialData(selectedMarketType.briefType);
    }
  }, [selectedMarketType, fetchInitialData, formikStatus]);

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
      searchProperties,

      // Pagination
      currentPage,
      setCurrentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      setItemsPerPage,

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
      searchProperties,
      currentPage,
      setCurrentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      setItemsPerPage,
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
