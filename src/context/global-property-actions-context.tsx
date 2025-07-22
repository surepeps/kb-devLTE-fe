/** @format */

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import toast from "react-hot-toast";

// Types
interface InspectionProperty {
  propertyId: string;
  property: any;
  sourceTab?: "buy" | "jv" | "rent" | "shortlet";
  sourcePage?: string;
}

interface NegotiatedPrice {
  propertyId: string;
  originalPrice: number;
  negotiatedPrice: number;
}

interface LOIDocument {
  propertyId: string;
  document: File | null;
  documentUrl?: string;
}

interface GlobalPropertyActionsContextType {
  // Inspection selection (max 2 properties)
  selectedForInspection: InspectionProperty[];
  toggleInspectionSelection: (
    property: any,
    sourceTab?: "buy" | "jv" | "rent" | "shortlet",
    sourcePage?: string
  ) => void;
  removeFromInspection: (propertyId: string) => void;
  clearInspectionSelection: () => void;
  isSelectedForInspection: (propertyId: string) => boolean;
  canSelectMoreForInspection: () => boolean;

  // Price negotiation
  negotiatedPrices: NegotiatedPrice[];
  addNegotiatedPrice: (
    propertyId: string,
    originalPrice: number,
    negotiatedPrice: number
  ) => void;
  removeNegotiatedPrice: (propertyId: string) => void;
  getNegotiatedPrice: (propertyId: string) => NegotiatedPrice | null;

  // LOI documents
  loiDocuments: LOIDocument[];
  addLOIDocument: (
    propertyId: string,
    document: File,
    documentUrl?: string
  ) => void;
  removeLOIDocument: (propertyId: string) => void;
  getLOIDocument: (propertyId: string) => LOIDocument | null;

  // Computed values
  hasSelectedProperties: boolean;
  selectedCount: number;
}

const GlobalPropertyActionsContext = createContext<
  GlobalPropertyActionsContextType | undefined
>(undefined);

const STORAGE_KEY = "globalPropertyActionsState";

interface StorageState {
  selectedForInspection: InspectionProperty[];
  negotiatedPrices: NegotiatedPrice[];
  loiDocuments: LOIDocument[];
}

export const GlobalPropertyActionsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedForInspection, setSelectedForInspection] = useState<
    InspectionProperty[]
  >([]);
  const [negotiatedPrices, setNegotiatedPrices] = useState<NegotiatedPrice[]>(
    []
  );
  const [loiDocuments, setLoiDocuments] = useState<LOIDocument[]>([]);

  // Sync state to localStorage whenever any state changes
  useEffect(() => {
    saveToStorage(selectedForInspection, negotiatedPrices, loiDocuments);
  }, [selectedForInspection, negotiatedPrices, loiDocuments, saveToStorage]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState && savedState.trim()) {
        const parsedState: StorageState = JSON.parse(savedState);
        if (parsedState && typeof parsedState === "object") {
          setSelectedForInspection(
            Array.isArray(parsedState.selectedForInspection)
              ? parsedState.selectedForInspection
              : []
          );
          setNegotiatedPrices(
            Array.isArray(parsedState.negotiatedPrices)
              ? parsedState.negotiatedPrices
              : []
          );
          setLoiDocuments(
            Array.isArray(parsedState.loiDocuments)
              ? parsedState.loiDocuments
              : []
          );
        }
      }
    } catch (error) {
      console.error("Failed to parse global property actions state:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save state to localStorage whenever it changes
  const saveToStorage = useCallback(
    (
      inspections: InspectionProperty[],
      prices: NegotiatedPrice[],
      documents: LOIDocument[]
    ) => {
      try {
        const state: StorageState = {
          selectedForInspection: inspections,
          negotiatedPrices: prices,
          loiDocuments: documents,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save global property actions state:", error);
      }
    },
    []
  );

  // Inspection selection methods
  const toggleInspectionSelection = useCallback(
    (
      property: any,
      sourceTab?: "buy" | "jv" | "rent" | "shortlet",
      sourcePage?: string
    ) => {
      const propertyId = property._id;

      setSelectedForInspection((current) => {
        const isAlreadySelected = current.some(
          (item) => item.propertyId === propertyId
        );

        let newSelection: InspectionProperty[];
        let toastMessage = "";
        let toastType: "success" | "error" = "success";

        if (isAlreadySelected) {
          newSelection = current.filter(
            (item) => item.propertyId !== propertyId
          );
          toastMessage = "Property removed from inspection";
        } else {
          if (current.length >= 2) {
            toastMessage = "Maximum of 2 properties can be selected for inspection";
            toastType = "error";
            return current;
          }

          newSelection = [
            ...current,
            { propertyId, property, sourceTab, sourcePage },
          ];
          toastMessage = "Property selected for inspection";
        }

        // Schedule toast notification to run after state update
        setTimeout(() => {
          if (toastType === "error") {
            toast.error(toastMessage);
          } else {
            toast.success(toastMessage);
          }
        }, 0);

        return newSelection;
      });
    },
    [negotiatedPrices, loiDocuments, saveToStorage]
  );

  const removeFromInspection = useCallback(
    (propertyId: string) => {
      // Calculate new states outside of setState
      const newSelection = selectedForInspection.filter(
        (item) => item.propertyId !== propertyId
      );

      // Also remove associated negotiated prices and LOI documents
      const newPrices = negotiatedPrices.filter(
        (price) => price.propertyId !== propertyId
      );
      const newDocuments = loiDocuments.filter(
        (doc) => doc.propertyId !== propertyId
      );

      // Update all states
      setSelectedForInspection(newSelection);
      setNegotiatedPrices(newPrices);
      setLoiDocuments(newDocuments);
    },
    [selectedForInspection, negotiatedPrices, loiDocuments, saveToStorage]
  );

  const clearInspectionSelection = useCallback(() => {
    setSelectedForInspection([]);
    setNegotiatedPrices([]);
    setLoiDocuments([]);
  }, []);

  const isSelectedForInspection = useCallback(
    (propertyId: string): boolean => {
      return selectedForInspection.some(
        (item) => item.propertyId === propertyId
      );
    },
    [selectedForInspection]
  );

  const canSelectMoreForInspection = useCallback((): boolean => {
    return selectedForInspection.length < 2;
  }, [selectedForInspection.length]);

  // Price negotiation methods
  const addNegotiatedPrice = useCallback(
    (propertyId: string, originalPrice: number, negotiatedPrice: number) => {
      setNegotiatedPrices((current) => {
        const existingIndex = current.findIndex(
          (p) => p.propertyId === propertyId
        );

        let newPrices: NegotiatedPrice[];
        if (existingIndex >= 0) {
          newPrices = [...current];
          newPrices[existingIndex] = {
            propertyId,
            originalPrice,
            negotiatedPrice,
          };
        } else {
          newPrices = [
            ...current,
            { propertyId, originalPrice, negotiatedPrice },
          ];
        }

        return newPrices;
      });
    },
    []
  );

  const removeNegotiatedPrice = useCallback(
    (propertyId: string) => {
      setNegotiatedPrices((current) => {
        const newPrices = current.filter((p) => p.propertyId !== propertyId);

        // Schedule storage save after state update
        setTimeout(() => {
          saveToStorage(selectedForInspection, newPrices, loiDocuments);
        }, 0);

        return newPrices;
      });
    },
    [selectedForInspection, loiDocuments, saveToStorage]
  );

  const getNegotiatedPrice = useCallback(
    (propertyId: string): NegotiatedPrice | null => {
      return (
        negotiatedPrices.find((p) => p.propertyId === propertyId) || null
      );
    },
    [negotiatedPrices]
  );

  // LOI document methods
  const addLOIDocument = useCallback(
    (propertyId: string, document: File, documentUrl?: string) => {
      setLoiDocuments((current) => {
        const existingIndex = current.findIndex(
          (doc) => doc.propertyId === propertyId
        );

        let newDocuments: LOIDocument[];
        if (existingIndex >= 0) {
          newDocuments = [...current];
          newDocuments[existingIndex] = { propertyId, document, documentUrl };
        } else {
          newDocuments = [
            ...current,
            { propertyId, document, documentUrl },
          ];
        }

        // Schedule storage save after state update
        setTimeout(() => {
          saveToStorage(selectedForInspection, negotiatedPrices, newDocuments);
        }, 0);

        return newDocuments;
      });
    },
    [selectedForInspection, negotiatedPrices, saveToStorage]
  );

  const removeLOIDocument = useCallback(
    (propertyId: string) => {
      setLoiDocuments((current) => {
        const newDocuments = current.filter(
          (doc) => doc.propertyId !== propertyId
        );

        // Schedule storage save after state update
        setTimeout(() => {
          saveToStorage(selectedForInspection, negotiatedPrices, newDocuments);
        }, 0);

        return newDocuments;
      });
    },
    [selectedForInspection, negotiatedPrices, saveToStorage]
  );

  const getLOIDocument = useCallback(
    (propertyId: string): LOIDocument | null => {
      return loiDocuments.find((doc) => doc.propertyId === propertyId) || null;
    },
    [loiDocuments]
  );

  const contextValue: GlobalPropertyActionsContextType = useMemo(
    () => ({
      // Inspection selection
      selectedForInspection,
      toggleInspectionSelection,
      removeFromInspection,
      clearInspectionSelection,
      isSelectedForInspection,
      canSelectMoreForInspection,

      // Price negotiation
      negotiatedPrices,
      addNegotiatedPrice,
      removeNegotiatedPrice,
      getNegotiatedPrice,

      // LOI documents
      loiDocuments,
      addLOIDocument,
      removeLOIDocument,
      getLOIDocument,

      // Computed values
      hasSelectedProperties: selectedForInspection.length > 0,
      selectedCount: selectedForInspection.length,
    }),
    [
      selectedForInspection,
      toggleInspectionSelection,
      removeFromInspection,
      clearInspectionSelection,
      isSelectedForInspection,
      canSelectMoreForInspection,
      negotiatedPrices,
      addNegotiatedPrice,
      removeNegotiatedPrice,
      getNegotiatedPrice,
      loiDocuments,
      addLOIDocument,
      removeLOIDocument,
      getLOIDocument,
    ]
  );

  return (
    <GlobalPropertyActionsContext.Provider value={contextValue}>
      {children}
    </GlobalPropertyActionsContext.Provider>
  );
};

export const useGlobalPropertyActions = (): GlobalPropertyActionsContextType => {
  const context = useContext(GlobalPropertyActionsContext);
  if (!context) {
    throw new Error(
      "useGlobalPropertyActions must be used within a GlobalPropertyActionsProvider"
    );
  }
  return context;
};
