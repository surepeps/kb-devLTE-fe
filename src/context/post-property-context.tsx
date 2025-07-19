"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PropertyImage {
  file: File | null;
  preview: string | null;
  id: string;
  url?: string | null;
  isUploading?: boolean;
}

interface PropertyVideo {
  file: File | null;
  preview: string | null;
  id: string;
  url?: string | null;
  isUploading?: boolean;
}

interface PropertyData {
  // Step 1: Brief Type Selection
  propertyType: "sell" | "rent" | "jv" | "shortlet" | "";

  // Step 2: Property Category and Basic Info
  propertyCategory:
    | "Residential"
    | "Commercial"
    | "Land"
    | "Mixed Development"
    | "";
  propertyCondition: string;
  typeOfBuilding: string;
  rentalType: string; // For rent: "Rent" | "Lease"
  leaseHold: string;
  holdDuration?: string;
  shortletDuration?: string;

  // Step 3: Location
  state: { value: string; label: string } | null;
  lga: { value: string; label: string } | null;
  area: string;
  streetAddress?: string; // For shortlet

  // Step 4: Size and Pricing
  landSize: string;
  measurementType: string;
  price: string;

  // Step 5: Room Details (for Residential/Commercial)
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  parkingSpaces: number;
  maxGuests?: number; // For shortlet

  // Step 6: Documents and Features
  documents: string[];
  features: string[];

  // Step 7: Rental/Sale Specific Fields
  tenantCriteria: string[];
  rentalConditions: string[];
  employmentType: string;
  tenantGenderPreference: string;
  jvConditions: string[];

  // Step 8: Ownership Declaration
  isLegalOwner: boolean;
  ownershipDocuments: string[];
  isTenanted: string;

  // Additional Fields
  description: string;
  additionalInfo: string;

  // Shortlet specific fields
  availability?: {
    minStay: number;
    maxStay?: number;
    calendar?: string;
  };
  pricing?: {
    nightly?: number;
    weeklyDiscount?: number;
    monthlyDiscount?: number;
    cleaningFee?: number;
    securityDeposit?: number;
    cancellationPolicy?: string;
  };
  houseRules?: {
    checkIn: string;
    checkOut: string;
    smoking: boolean;
    pets: boolean;
    parties: boolean;
    otherRules?: string;
  };

  // Contact info
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  // Media
  videos?: PropertyVideo[];
}

interface PostPropertyContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  images: PropertyImage[];
  setImages: (images: PropertyImage[]) => void;
  propertyData: PropertyData;
  setPropertyData: (data: PropertyData) => void;
  updatePropertyData: (
    field: keyof PropertyData | "resetFormExcept" | "resetFieldsAfterCategory",
    value: any,
  ) => void;
  isSubmitting: boolean;
  setIsSubmitting: (loading: boolean) => void;
  validateCurrentStep: () => boolean;
  resetForm: () => void;
  getMinimumRequiredImages: () => number;
  areImagesValid: () => boolean;
  showCommissionModal: boolean;
  setShowCommissionModal: (show: boolean) => void;
  showPropertySummary: boolean;
  setShowPropertySummary: (show: boolean) => void;
  getUserCommissionRate: () => number;
  getUserType: () => "landowner" | "agent";
}

const PostPropertyContext = createContext<PostPropertyContextType | undefined>(
  undefined,
);

const initialPropertyData: PropertyData = {
  propertyType: "",
  propertyCategory: "",
  propertyCondition: "",
  typeOfBuilding: "",
  rentalType: "",
  price: "",
  leaseHold: "",
  holdDuration: "",
  shortletDuration: "",
  state: null,
  lga: null,
  area: "",
  streetAddress: "",
  landSize: "",
  measurementType: "",
  bedrooms: 0,
  bathrooms: 0,
  toilets: 0,
  parkingSpaces: 0,
  maxGuests: 0,
  features: [],
  tenantCriteria: [],
  rentalConditions: [],
  employmentType: "",
  tenantGenderPreference: "",
  jvConditions: [],
  documents: [],
  contactInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  isLegalOwner: false,
  ownershipDocuments: [],
  isTenanted: "",
  description: "",
  additionalInfo: "",
  videos: [],
  availability: {
    minStay: 1,
    maxStay: undefined,
    calendar: "",
  },
  pricing: {
    nightly: 0,
    weeklyDiscount: 0,
    monthlyDiscount: 0,
    cleaningFee: 0,
    securityDeposit: 0,
    cancellationPolicy: "flexible",
  },
  houseRules: {
    checkIn: "15:00",
    checkOut: "11:00",
    smoking: false,
    pets: false,
    parties: false,
    otherRules: "",
  },
  video: {
    file: undefined,
    url: "",
  },
};

export function PostPropertyProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [propertyData, setPropertyData] =
    useState<PropertyData>(initialPropertyData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showPropertySummary, setShowPropertySummary] = useState(false);

  const updatePropertyData = (
    field: keyof PropertyData | "resetFormExcept" | "resetFieldsAfterCategory",
    value: any,
  ) => {
    if (field === "resetFormExcept") {
      // Reset all fields except the ones specified in value array
      const fieldsToPreserve = value as string[];
      const newData = { ...initialPropertyData };

      fieldsToPreserve.forEach((fieldName) => {
        if (fieldName in propertyData) {
          (newData as any)[fieldName] = (propertyData as any)[fieldName];
        }
      });

      setPropertyData(newData);
      // Reset images and go back to step 0 when brief type changes
      setImages([]);
      setCurrentStep(0);
    } else if (field === "resetFieldsAfterCategory") {
      // Reset specific fields after property category change
      const fieldsToReset = value as string[];
      const newData = { ...propertyData };

      fieldsToReset.forEach((fieldName) => {
        if (fieldName in initialPropertyData) {
          (newData as any)[fieldName] = (initialPropertyData as any)[fieldName];
        }
      });

      setPropertyData(newData);
      // Reset images when property category changes
      setImages([]);
    } else {
      setPropertyData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const getMinimumRequiredImages = () => 4;

  const areImagesValid = () => {
    const validImages = images.filter((img) => img.file !== null);
    return validImages.length >= getMinimumRequiredImages();
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Property type selection
        return propertyData.propertyType !== "";
      case 1: // Basic details
        const basicFieldsValid = !!(
          propertyData.propertyCategory &&
          propertyData.price &&
          propertyData.state &&
          propertyData.lga &&
          propertyData.area
        );

        // Additional validations based on property type
        if (
          (propertyData.propertyType === "rent" ||
            propertyData.propertyType === "shortlet") &&
          propertyData.propertyCategory !== "Land"
        ) {
          let additionalValid = !!propertyData.propertyCondition;

          if (propertyData.propertyType === "rent") {
            additionalValid = additionalValid && !!propertyData.rentalType;
          }

          if (propertyData.propertyType === "shortlet") {
            additionalValid =
              additionalValid && !!propertyData.shortletDuration;
          }

          return basicFieldsValid && additionalValid;
        }

        if (propertyData.propertyCategory !== "Land") {
          return (
            basicFieldsValid &&
            !!propertyData.typeOfBuilding &&
            propertyData.bedrooms > 0
          );
        }

        return basicFieldsValid;

      case 2: // Features and conditions
        if (
          propertyData.propertyType === "rent" ||
          propertyData.propertyType === "shortlet"
        ) {
          return true; // No required fields for rent/shortlet
        }
        if (propertyData.propertyType === "jv") {
          return propertyData.jvConditions.length > 0;
        }
        // For sell
        return propertyData.documents.length > 0;

      case 3: // Image upload
        return areImagesValid();

      case 4: // Ownership and contact
        return !!(
          propertyData.contactInfo.firstName &&
          propertyData.contactInfo.lastName &&
          propertyData.contactInfo.email &&
          propertyData.contactInfo.phone
        );

      default:
        return true;
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setImages([]);
    setPropertyData(initialPropertyData);
    setIsSubmitting(false);
    setShowCommissionModal(false);
    setShowPropertySummary(false);
  };

  const getUserType = (): "landowner" | "agent" => {
    // Import useUserContext here to avoid circular dependencies
    if (typeof window !== "undefined") {
      try {
        // Try to get from global context first
        const userContextString = localStorage.getItem("user");
        if (userContextString) {
          const userData = JSON.parse(userContextString);
          return userData.userType === "Agent" ? "agent" : "landowner";
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
    // Default to landowner for property owners/individuals
    return "landowner";
  };

  const getUserCommissionRate = (): number => {
    // Import moved to top of file to avoid require() in component
    return 50; // Default commission rate - should be imported from config
  };

  const contextValue: PostPropertyContextType = {
    currentStep,
    setCurrentStep,
    images,
    setImages,
    propertyData,
    setPropertyData,
    updatePropertyData,
    isSubmitting,
    setIsSubmitting,
    validateCurrentStep,
    resetForm,
    getMinimumRequiredImages,
    areImagesValid,
    showCommissionModal,
    setShowCommissionModal,
    showPropertySummary,
    setShowPropertySummary,
    getUserCommissionRate,
    getUserType,
  };

  return (
    <PostPropertyContext.Provider value={contextValue}>
      {children}
    </PostPropertyContext.Provider>
  );
}

export function usePostPropertyContext() {
  const context = useContext(PostPropertyContext);
  if (context === undefined) {
    throw new Error(
      "usePostPropertyContext must be used within a PostPropertyProvider",
    );
  }
  return context;
}
