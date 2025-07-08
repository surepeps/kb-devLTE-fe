"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PropertyImage {
  file: File | null;
  preview: string | null;
  id: string;
}

interface PropertyData {
  propertyType: "sell" | "rent" | "jv" | "shortlet" | "";
  propertyCategory:
    | "Residential"
    | "Commercial"
    | "Land"
    | "Mixed Development"
    | "";
  propertyCondition: string;
  typeOfBuilding: string;
  rentalType: string;
  price: string;
  leaseHold: string;
  holdDuration?: string;
  shortletDuration?: string;
  description: string;
  state: { value: string; label: string } | null;
  lga: { value: string; label: string } | null;
  area: string | { value: string; label: string };
  landSize: string;
  measurementType: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  parkingSpaces: number;
  features: string[];
  tenantCriteria: string[];
  jvConditions: string[];
  documents: string[];
  ownershipDocuments: string[];
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  isLegalOwner: boolean;
  isTenanted: string;
  additionalInfo: string;
}

interface PostPropertyContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  images: PropertyImage[];
  setImages: (images: PropertyImage[]) => void;
  propertyData: PropertyData;
  setPropertyData: (data: PropertyData) => void;
  updatePropertyData: (field: keyof PropertyData, value: any) => void;
  isSubmitting: boolean;
  setIsSubmitting: (loading: boolean) => void;
  validateCurrentStep: () => boolean;
  resetForm: () => void;
  getMinimumRequiredImages: () => number;
  areImagesValid: () => boolean;
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
  description: "",
  state: null,
  lga: null,
  area: "",
  landSize: "",
  measurementType: "",
  bedrooms: 0,
  bathrooms: 0,
  toilets: 0,
  parkingSpaces: 0,
  features: [],
  tenantCriteria: [],
  jvConditions: [],
  documents: [],
  ownershipDocuments: [],
  contactInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  isLegalOwner: false,
  isTenanted: "",
  additionalInfo: "",
};

export function PostPropertyProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [propertyData, setPropertyData] =
    useState<PropertyData>(initialPropertyData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePropertyData = (field: keyof PropertyData, value: any) => {
    setPropertyData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          propertyData.propertyType === "rent" &&
          propertyData.propertyCategory !== "Land"
        ) {
          return (
            basicFieldsValid &&
            !!propertyData.rentalType &&
            !!propertyData.propertyCondition
          );
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
        if (propertyData.propertyType === "rent") {
          return true; // No required fields for rent
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
