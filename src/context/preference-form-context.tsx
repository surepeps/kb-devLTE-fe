/** @format */

"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import {
  PreferenceFormState,
  PreferenceFormAction,
  PreferenceForm,
  ValidationError,
  BudgetThreshold,
  FeatureConfig,
  FeatureDefinition,
  FormStep,
} from "@/types/preference-form";

// Feature configurations with budget requirements
const FEATURE_CONFIGS: Record<string, FeatureConfig> = {
  buy: {
    basic: [
      { name: "Parking", type: "basic" },
      { name: "Borehole", type: "basic" },
      { name: "Security", type: "basic" },
      { name: "Power Supply", type: "basic" },
      { name: "Water Supply", type: "basic" },
    ],
    premium: [
      {
        name: "Swimming Pool",
        type: "premium",
        minBudgetRequired: 30000000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Gym",
        type: "premium",
        minBudgetRequired: 30000000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Walk-in Closet",
        type: "premium",
        minBudgetRequired: 25000000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Smart Home Features",
        type: "premium",
        minBudgetRequired: 40000000,
        tooltip: "This feature requires a higher budget.",
      },
    ],
  },
  rent: {
    basic: [
      { name: "Parking", type: "basic" },
      { name: "Power Supply", type: "basic" },
      { name: "Clean Water", type: "basic" },
      { name: "Security", type: "basic" },
      { name: "Accessibility to Road", type: "basic" },
    ],
    premium: [
      {
        name: "Gated Estate",
        type: "premium",
        minBudgetRequired: 500000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Furnished",
        type: "premium",
        minBudgetRequired: 800000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Serviced Apartment",
        type: "premium",
        minBudgetRequired: 1000000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Backup Generator",
        type: "premium",
        minBudgetRequired: 400000,
        tooltip: "This feature requires a higher budget.",
      },
    ],
  },
  "joint-venture": {
    basic: [
      { name: "Titled Land", type: "basic" },
      { name: "Dry Land", type: "basic" },
      { name: "Accessible Road", type: "basic" },
      { name: "Within Urban Zone", type: "basic" },
    ],
    premium: [
      {
        name: "Existing Drawings",
        type: "premium",
        minBudgetRequired: 10000000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Fenced Land",
        type: "premium",
        minBudgetRequired: 5000000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "High-Demand Area",
        type: "premium",
        minBudgetRequired: 20000000,
        tooltip: "This feature requires a higher budget.",
      },
    ],
  },
  shortlet: {
    basic: [
      { name: "Wi-Fi", type: "basic" },
      { name: "Power Supply", type: "basic" },
      { name: "Clean Bathroom", type: "basic" },
      { name: "AC", type: "basic" },
      { name: "Kitchen", type: "basic" },
    ],
    premium: [
      {
        name: "Smart TV / Netflix",
        type: "premium",
        minBudgetRequired: 50000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Gym",
        type: "premium",
        minBudgetRequired: 80000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Swimming Pool",
        type: "premium",
        minBudgetRequired: 100000,
        tooltip: "This feature requires a higher budget.",
      },
      {
        name: "Housekeeping",
        type: "premium",
        minBudgetRequired: 60000,
        tooltip: "This feature requires a higher budget.",
      },
    ],
  },
};

// Budget thresholds by location and listing type
const DEFAULT_BUDGET_THRESHOLDS: BudgetThreshold[] = [
  // Lagos thresholds
  { location: "Lagos", listingType: "buy", minAmount: 5000000 },
  { location: "Lagos", listingType: "rent", minAmount: 200000 },
  { location: "Lagos", listingType: "joint-venture", minAmount: 10000000 },
  { location: "Lagos", listingType: "shortlet", minAmount: 15000 },

  // Abuja thresholds
  { location: "Abuja", listingType: "buy", minAmount: 8000000 },
  { location: "Abuja", listingType: "rent", minAmount: 300000 },
  { location: "Abuja", listingType: "joint-venture", minAmount: 15000000 },
  { location: "Abuja", listingType: "shortlet", minAmount: 25000 },

  // Default thresholds for other locations
  { location: "default", listingType: "buy", minAmount: 2000000 },
  { location: "default", listingType: "rent", minAmount: 100000 },
  { location: "default", listingType: "joint-venture", minAmount: 5000000 },
  { location: "default", listingType: "shortlet", minAmount: 10000 },
];

// Storage keys
const STORAGE_KEY = "khabi-teq-preference-form";
const STORAGE_STEP_KEY = "khabi-teq-preference-step";

// Helper functions for localStorage
const loadFromStorage = (): Partial<PreferenceFormState> => {
  if (typeof window === "undefined") return {};

  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STORAGE_STEP_KEY);

    return {
      formData: savedData ? JSON.parse(savedData) : {},
      currentStep: savedStep ? parseInt(savedStep, 10) : 0,
    };
  } catch (error) {
    console.warn("Failed to load preference form data from storage:", error);
    return {};
  }
};

const saveToStorage = (formData: any, currentStep: number) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
  } catch (error) {
    console.warn("Failed to save preference form data to storage:", error);
  }
};

const clearStorage = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
  } catch (error) {
    console.warn("Failed to clear preference form data from storage:", error);
  }
};

// Initial state
const createInitialState = (): PreferenceFormState => {
  const savedState = loadFromStorage();

  return {
    currentStep: savedState.currentStep || 0,
    steps: [
      { id: "location", title: "Location", isValid: false, isRequired: true },
      { id: "budget", title: "Budget", isValid: false, isRequired: true },
      { id: "features", title: "Features", isValid: false, isRequired: false },
      { id: "contact", title: "Contact", isValid: false, isRequired: true },
    ],
    formData: savedState.formData || {},
    isSubmitting: false,
    validationErrors: [],
    budgetThresholds: DEFAULT_BUDGET_THRESHOLDS,
    featureConfigs: FEATURE_CONFIGS,
  };
};

const initialState: PreferenceFormState = createInitialState();

// Reducer function
function preferenceFormReducer(
  state: PreferenceFormState,
  action: PreferenceFormAction,
): PreferenceFormState {
  let newState: PreferenceFormState;

  switch (action.type) {
    case "SET_STEP":
      newState = {
        ...state,
        currentStep: action.payload,
      };
      // Save step to storage
      saveToStorage(newState.formData, newState.currentStep);
      return newState;

    case "UPDATE_FORM_DATA":
      newState = {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
      // Save form data to storage
      saveToStorage(newState.formData, newState.currentStep);
      return newState;

    case "SET_VALIDATION_ERRORS":
      return {
        ...state,
        validationErrors: action.payload,
      };

    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case "RESET_FORM":
      // Clear storage when form is reset
      clearStorage();
      return {
        ...createInitialState(),
        formData: {}, // Ensure form data is completely empty
        currentStep: 0,
      };

    case "SET_BUDGET_THRESHOLDS":
      return {
        ...state,
        budgetThresholds: action.payload,
      };

    case "SET_FEATURE_CONFIGS":
      return {
        ...state,
        featureConfigs: action.payload,
      };

    default:
      return state;
  }
}

// Context type
interface PreferenceFormContextType {
  state: PreferenceFormState;
  dispatch: React.Dispatch<PreferenceFormAction>;

  // Helper functions
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateFormData: (data: Partial<PreferenceForm>) => void;
  validateStep: (step: number) => ValidationError[];
  isStepValid: (step: number) => boolean;
  canProceedToNextStep: () => boolean;
  getMinBudgetForLocation: (location: string, listingType: string) => number;
  getAvailableFeatures: (
    preferenceType: string,
    budget?: number,
  ) => {
    basic: FeatureDefinition[];
    premium: FeatureDefinition[];
  };
  isFormValid: () => boolean;
  getValidationErrorsForField: (fieldName: string) => ValidationError[];
  resetForm: () => void;
}

// Create context
const PreferenceFormContext = createContext<
  PreferenceFormContextType | undefined
>(undefined);

// Provider component
export const PreferenceFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    preferenceFormReducer,
    createInitialState(),
  );

  // Helper functions
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < state.steps.length) {
        dispatch({ type: "SET_STEP", payload: step });
      }
    },
    [state.steps.length],
  );

  const goToNextStep = useCallback(() => {
    if (state.currentStep < state.steps.length - 1) {
      dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
    }
  }, [state.currentStep, state.steps.length]);

  const goToPreviousStep = useCallback(() => {
    if (state.currentStep > 0) {
      dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
    }
  }, [state.currentStep]);

  const updateFormData = useCallback((data: Partial<PreferenceForm>) => {
    dispatch({ type: "UPDATE_FORM_DATA", payload: data });
  }, []);

  const getMinBudgetForLocation = useCallback(
    (location: string, listingType: string): number => {
      const threshold = state.budgetThresholds.find(
        (t) =>
          t.location.toLowerCase() === location.toLowerCase() &&
          t.listingType === listingType,
      );

      if (threshold) return threshold.minAmount;

      // Fallback to default
      const defaultThreshold = state.budgetThresholds.find(
        (t) => t.location === "default" && t.listingType === listingType,
      );

      return defaultThreshold?.minAmount || 0;
    },
    [state.budgetThresholds],
  );

  const getAvailableFeatures = useCallback(
    (preferenceType: string, budget?: number) => {
      const config = state.featureConfigs[preferenceType];
      if (!config) {
        return { basic: [], premium: [] };
      }

      if (!budget) {
        return config;
      }

      // Filter premium features based on budget
      const availablePremium = config.premium.filter(
        (feature) =>
          !feature.minBudgetRequired || budget >= feature.minBudgetRequired,
      );

      return {
        basic: config.basic,
        premium: availablePremium,
      };
    },
    [state.featureConfigs],
  );

  const validateStep = useCallback(
    (step: number): ValidationError[] => {
      const errors: ValidationError[] = [];
      const { formData } = state;

      switch (step) {
        case 0: // Location step
          if (!formData.location?.state) {
            errors.push({
              field: "location.state",
              message: "State is required",
            });
          }
          if (!formData.location?.lgas?.length) {
            errors.push({
              field: "location.lgas",
              message: "At least one LGA is required",
            });
          }
          if (
            !formData.location?.areas?.length &&
            !formData.location?.customLocation
          ) {
            errors.push({
              field: "location.areas",
              message: "Please select areas or enter a custom location",
            });
          }
          if (formData.location?.areas && formData.location.areas.length > 3) {
            errors.push({
              field: "location.areas",
              message: "Maximum 3 areas can be selected",
            });
          }
          break;

        case 1: // Budget step
          if (!formData.budget?.minPrice) {
            errors.push({
              field: "budget.minPrice",
              message: "Minimum price is required",
            });
          }
          if (!formData.budget?.maxPrice) {
            errors.push({
              field: "budget.maxPrice",
              message: "Maximum price is required",
            });
          }
          if (formData.budget?.minPrice && formData.budget?.maxPrice) {
            if (formData.budget.minPrice >= formData.budget.maxPrice) {
              errors.push({
                field: "budget.maxPrice",
                message: "Maximum price must be greater than minimum price",
              });
            }

            // Check minimum budget for location
            if (formData.location?.state && formData.preferenceType) {
              const minRequired = getMinBudgetForLocation(
                formData.location.state,
                formData.preferenceType,
              );
              if (formData.budget.minPrice < minRequired) {
                errors.push({
                  field: "budget.minPrice",
                  message: `₦${minRequired.toLocaleString()} is the minimum required for this location.`,
                });
              }
            }
          }
          break;

        case 2: // Features step (optional)
          // No required validations for features step
          break;

        case 3: // Contact step
          if (
            !formData.contactInfo?.fullName &&
            formData.preferenceType !== "joint-venture"
          ) {
            errors.push({
              field: "contactInfo.fullName",
              message: "Full name is required",
            });
          }
          if (!formData.contactInfo?.email) {
            errors.push({
              field: "contactInfo.email",
              message: "Email is required",
            });
          }
          if (!formData.contactInfo?.phoneNumber) {
            errors.push({
              field: "contactInfo.phoneNumber",
              message: "Phone number is required",
            });
          }

          // Joint venture specific validations
          if (formData.preferenceType === "joint-venture") {
            const jvContact = formData.contactInfo as any;
            if (!jvContact?.companyName) {
              errors.push({
                field: "contactInfo.companyName",
                message: "Company name is required",
              });
            }
            if (!jvContact?.contactPerson) {
              errors.push({
                field: "contactInfo.contactPerson",
                message: "Contact person is required",
              });
            }
          }
          break;
      }

      return errors;
    },
    [state.formData, getMinBudgetForLocation],
  );

  const isStepValid = useCallback(
    (step: number): boolean => {
      const errors = validateStep(step);
      return errors.length === 0;
    },
    [validateStep],
  );

  const canProceedToNextStep = useCallback((): boolean => {
    return isStepValid(state.currentStep);
  }, [state.currentStep, isStepValid]);

  const isFormValid = useCallback((): boolean => {
    for (let i = 0; i < state.steps.length; i++) {
      if (!isStepValid(i)) {
        return false;
      }
    }
    return true;
  }, [state.steps.length, isStepValid]);

  const getValidationErrorsForField = useCallback(
    (fieldName: string): ValidationError[] => {
      return state.validationErrors.filter(
        (error) => error.field === fieldName,
      );
    },
    [state.validationErrors],
  );

  const resetForm = useCallback(() => {
    // Show confirmation before clearing form if there's data
    const hasData = Object.keys(state.formData).length > 0;

    if (hasData) {
      if (
        typeof window !== "undefined" &&
        window.confirm("Are you sure you want to clear all form data?")
      ) {
        dispatch({ type: "RESET_FORM" });
        toast.success("Form data cleared successfully");
      }
    } else {
      dispatch({ type: "RESET_FORM" });
    }
  }, [state.formData]);

  // Update validation errors when form data changes
  useEffect(() => {
    const currentErrors = validateStep(state.currentStep);
    dispatch({ type: "SET_VALIDATION_ERRORS", payload: currentErrors });
  }, [state.formData, state.currentStep, validateStep]);

  const contextValue: PreferenceFormContextType = {
    state,
    dispatch,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    validateStep,
    isStepValid,
    canProceedToNextStep,
    getMinBudgetForLocation,
    getAvailableFeatures,
    isFormValid,
    getValidationErrorsForField,
    resetForm,
  };

  return (
    <PreferenceFormContext.Provider value={contextValue}>
      {children}
    </PreferenceFormContext.Provider>
  );
};

// Hook to use the context
export const usePreferenceForm = (): PreferenceFormContextType => {
  const context = useContext(PreferenceFormContext);
  if (context === undefined) {
    throw new Error(
      "usePreferenceForm must be used within a PreferenceFormProvider",
    );
  }
  return context;
};

export default PreferenceFormContext;
