"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useUserContext } from "@/context/user-context";
import { usePostPropertyContext } from "@/context/post-property-context";
import { getPostPropertyValidationSchema } from "@/utils/validation/post-property-validation";
import { useAgentAccess } from "@/hooks/useAgentAccess";
import AgentAccessBarrier from "@/components/general-components/AgentAccessBarrier";
import { POST_REQUEST, POST_REQUEST_FILE_UPLOAD } from "@/utils/requests";
import { extractNumericValue } from "@/utils/price-helpers";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Components
import Stepper from "@/components/post-property-components/Stepper";
import Step0PropertyTypeSelection from "@/components/post-property-components/Step0PropertyTypeSelection";
import Step1BasicDetails from "@/components/post-property-components/Step1BasicDetails";
import Step3ImageUpload from "@/components/post-property-components/Step3ImageUpload";
import PropertyPreview from "@/components/post-property-components/PropertyPreview";
import EnhancedPropertySummary from "@/components/post-property-components/EnhancedPropertySummary";
import CommissionModal from "@/components/post-property-components/CommissionModal";
import SuccessModal from "@/components/post-property-components/SuccessModal";
import Button from "@/components/general-components/button";
import Loading from "@/components/loading-component/loading";
import Preloader from "@/components/general-components/preloader";

// Import additional step components
import Step2FeaturesConditions from "@/components/post-property-components/Step2FeaturesConditions";
import Step4OwnershipDeclaration from "@/components/post-property-components/Step4OwnershipDeclaration";

// Import configuration helpers
import { briefTypeConfig } from "@/data/comprehensive-post-property-config";

// Import step-specific validation schemas
import {
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
  step4ValidationSchema,
} from "@/utils/validation/post-property-validation";

// Simplified validation schemas for each step - only validate basic fields to avoid cross-step validation
const getValidationSchema = (currentStep: number, propertyData: any) => {
  switch (currentStep) {
    case 0:
      return Yup.object({
        propertyType: Yup.string().required("Property type is required"),
      });

    case 1:
      // Only validate basic step 1 fields to avoid validating other steps
      return Yup.object({
        propertyCategory: Yup.string().required(
          "Property category is required",
        ),
        state: Yup.object({
          value: Yup.string().required(),
          label: Yup.string().required(),
        }).required("State is required"),
        lga: Yup.object({
          value: Yup.string().required(),
          label: Yup.string().required(),
        }).required("Local Government is required"),
        area: Yup.string().required("Area is required"),
        price: Yup.string().required("Price is required"),
      });

    case 2:
      // Only validate step 2 specific fields
      return step2ValidationSchema(propertyData.propertyType);

    case 3:
      // No validation needed - handled by component
      return Yup.object({});

    case 4:
      // Only validate step 4 fields
      return step4ValidationSchema();

    default:
      return Yup.object({});
  }
};

// Helper function to check if current step is valid using Formik validation
const isStepValid = (
  step: number,
  propertyData: any,
  areImagesValid: () => boolean,
  formikErrors: any,
  formikTouched: any,
) => {
  switch (step) {
    case 0:
      return !!propertyData.propertyType;
    case 1:
      // Step 1: Check basic required fields
      return checkStep1RequiredFields(propertyData);
    case 2:
      // Step 2: Check step 2 requirements
      return checkStep2RequiredFields(propertyData);
    case 3:
      // Step 3: Image validation
      return areImagesValid();
    case 4:
      // Step 4: Check step 4 requirements
      return checkStep4RequiredFields(propertyData);
    default:
      return true;
  }
};

// Helper function to check step 1 required fields
const checkStep1RequiredFields = (propertyData: any) => {
  // Basic required fields for all property types
  const requiredFields = ["propertyCategory", "state", "lga", "area", "price"];

  // Add conditional required fields based on property type and category
  if (propertyData.propertyType === "rent") {
    requiredFields.push("rentalType");
    if (propertyData.propertyCategory !== "Land") {
      requiredFields.push("propertyCondition", "typeOfBuilding", "bedrooms");
    }
    // Commercial rent needs land size
    if (propertyData.propertyCategory === "Commercial") {
      requiredFields.push("measurementType", "landSize");
    }
  }

  if (propertyData.propertyType === "shortlet") {
    requiredFields.push(
      "shortletDuration",
      "propertyCondition",
      "typeOfBuilding",
      "bedrooms",
      "streetAddress",
      "maxGuests",
    );
  }

  if (propertyData.propertyType === "jv") {
    requiredFields.push("holdDuration");
    if (propertyData.propertyCategory !== "Land") {
      requiredFields.push("propertyCondition", "typeOfBuilding", "bedrooms");
    }
    // JV ALWAYS requires land size for ALL property categories
    requiredFields.push("measurementType", "landSize");
  }

  if (propertyData.propertyType === "sell") {
    if (propertyData.propertyCategory !== "Land") {
      requiredFields.push("propertyCondition", "typeOfBuilding", "bedrooms");
    }
    requiredFields.push("measurementType", "landSize");
  }

  // Additional validation: Land size is required for:
  // - All Sell properties
  // - All JV properties (already handled above)
  // - Commercial Rent properties (already handled above)
  // - Land category for all property types
  if (propertyData.propertyCategory === "Land") {
    if (!requiredFields.includes("measurementType"))
      requiredFields.push("measurementType");
    if (!requiredFields.includes("landSize")) requiredFields.push("landSize");
  }

  return requiredFields.every((field) => {
    const value = propertyData[field];
    if (field === "state" || field === "lga") {
      return value && value.value && value.value !== "";
    }
    return value && value !== "" && value !== 0;
  });
};

// Helper function to check step 2 required fields
const checkStep2RequiredFields = (propertyData: any) => {
  // isTenanted is required for all property types
  if (!propertyData.isTenanted || propertyData.isTenanted === "") {
    return false;
  }

  // Documents are required for sell and jv types
  if (
    propertyData.propertyType === "sell" ||
    propertyData.propertyType === "jv"
  ) {
    const hasDocuments =
      propertyData.documents && propertyData.documents.length > 0;
    if (!hasDocuments) return false;
  }

  // JV conditions are required for joint venture
  if (propertyData.propertyType === "jv") {
    const hasJvConditions =
      propertyData.jvConditions && propertyData.jvConditions.length > 0;
    if (!hasJvConditions) return false;
  }

  // For shortlet, check required pricing and house rules
  if (propertyData.propertyType === "shortlet") {
    const pricing = propertyData.pricing;
    const houseRules = propertyData.houseRules;
    const availability = propertyData.availability;

    // Check required shortlet fields
    if (!availability?.minStay || availability.minStay < 1) return false;
    if (!pricing?.nightly || pricing.nightly <= 0) return false;
    if (!houseRules?.checkIn || houseRules.checkIn === "") return false;
    if (!houseRules?.checkOut || houseRules.checkOut === "") return false;
  }

  return true;
};

// Helper function to check step 4 required fields
const checkStep4RequiredFields = (propertyData: any) => {
  const contactInfo = propertyData.contactInfo;
  return (
    !!(
      contactInfo.firstName &&
      contactInfo.lastName &&
      contactInfo.email &&
      contactInfo.phone
    ) && propertyData.isLegalOwner !== undefined
  );
};

const PostProperty = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const {
    currentStep,
    setCurrentStep,
    propertyData,
    images,
    isSubmitting,
    setIsSubmitting,
    isLoading,
    validateCurrentStep,
    resetForm,
    areImagesValid,
    showCommissionModal,
    setShowCommissionModal,
    showPropertySummary,
    setShowPropertySummary,
    getUserCommissionRate,
    getUserType,
  } = usePostPropertyContext();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Allow Landowners to access directly
    if (user.userType === "Landowners") {
      return;
    }

    // For Agents, the AgentAccessBarrier will handle the onboarding and approval checks
    if (user.userType === "Agent") {
      return;
    }

    // User is neither landowner nor agent
    toast.error("You need to be a landowner or agent to post properties");
    router.push("/dashboard");
  }, [user, router]);

  const steps = [
    {
      label: "Property Type",
      status:
        currentStep > 0
          ? "completed"
          : currentStep === 0
            ? "active"
            : "pending",
    },
    {
      label: "Basic Details",
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
            ? "active"
            : "pending",
    },
    {
      label: "Features & Conditions",
      status:
        currentStep > 2
          ? "completed"
          : currentStep === 2
            ? "active"
            : "pending",
    },
    {
      label: "Upload Images",
      status:
        currentStep > 3
          ? "completed"
          : currentStep === 3
            ? "active"
            : "pending",
    },
    {
      label: "Owner Declaration",
      status:
        currentStep > 4
          ? "completed"
          : currentStep === 4
            ? "active"
            : "pending",
    },
  ] as { label: string; status: "completed" | "active" | "pending" }[];

  const handleNext = async (
    validateForm: () => Promise<any>,
    errors: any,
    setFieldTouched: (field: string, isTouched: boolean) => void,
  ) => {
    // Use step-specific validation instead of full form validation
    let isCurrentStepValid = false;

    switch (currentStep) {
      case 0:
        isCurrentStepValid = !!propertyData.propertyType;
        break;
      case 1:
        isCurrentStepValid = checkStep1RequiredFields(propertyData);
        break;
      case 2:
        isCurrentStepValid = checkStep2RequiredFields(propertyData);
        break;
      case 3:
        isCurrentStepValid = areImagesValid();
        break;
      case 4:
        isCurrentStepValid = checkStep4RequiredFields(propertyData);
        break;
      default:
        isCurrentStepValid = true;
    }

    if (!isCurrentStepValid) {
      // Mark relevant fields as touched to show validation errors
      if (currentStep === 1) {
        const step1Fields = [
          "propertyCategory",
          "state",
          "lga",
          "area",
          "price",
        ];
        step1Fields.forEach((field) => setFieldTouched(field, true));
      } else if (currentStep === 2) {
        setFieldTouched("isTenanted", true);
        if (
          propertyData.propertyType === "sell" ||
          propertyData.propertyType === "jv"
        ) {
          setFieldTouched("documents", true);
        }
        if (propertyData.propertyType === "jv") {
          setFieldTouched("jvConditions", true);
        }
      } else if (currentStep === 4) {
        setFieldTouched("contactInfo.firstName", true);
        setFieldTouched("contactInfo.lastName", true);
        setFieldTouched("contactInfo.email", true);
        setFieldTouched("contactInfo.phone", true);
        setFieldTouched("isLegalOwner", true);
      }
      return; // Don't proceed if validation fails
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPropertySummary(true);
    }
  };

  const handlePrevious = () => {
    if (showPropertySummary) {
      setShowPropertySummary(false);
    } else if (showCommissionModal) {
      setShowCommissionModal(false);
      setShowPropertySummary(true);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCommissionAccept = () => {
    setShowCommissionModal(false);
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // 1. Collect uploaded image URLs (images are auto-uploaded)
      const uploadedImageUrls: string[] = images
        .filter((img) => img.url)
        .map((img) => img.url!);

      // 2. Collect uploaded video URLs
      const uploadedVideoUrls: string[] = [];
      if (propertyData.videos && propertyData.videos.length > 0) {
        const video = propertyData.videos[0];
        if (video.url) {
          uploadedVideoUrls.push(video.url);
        }
      }

      // 3. Determine brief type
      let briefType = "";
      if (propertyData.propertyType === "sell") briefType = "Outright Sales";
      else if (propertyData.propertyType === "rent") briefType = "Rent";
      else if (propertyData.propertyType === "shortlet") briefType = "Shortlet";
      else if (propertyData.propertyType === "jv") briefType = "Joint Venture";

      // 4. Prepare property payload
      const payload = {
        propertyType: propertyData.propertyType,
        propertyCategory: propertyData.propertyCategory,
        propertyCondition: propertyData.propertyCondition,
        typeOfBuilding: propertyData.typeOfBuilding,
        rentalType: propertyData.rentalType,
        features: propertyData.features,
        docOnProperty: propertyData.documents.map((doc) => ({
          docName: doc,
          isProvided: true,
        })),
        location: {
          state: propertyData.state?.value || "",
          localGovernment: propertyData.lga?.value || "",
          area: propertyData.area,
          streetAddress: propertyData.streetAddress,
        },
        price: extractNumericValue(propertyData.price),
        leaseHold: propertyData.leaseHold,
        shortletDuration: propertyData.shortletDuration,
        owner: {
          fullName: `${propertyData.contactInfo.firstName} ${propertyData.contactInfo.lastName}`,
          phoneNumber: propertyData.contactInfo.phone,
          email: propertyData.contactInfo.email,
        },
        areYouTheOwner: propertyData.isLegalOwner,
        ownershipDocuments: propertyData.ownershipDocuments || [],
        landSize: {
          measurementType: propertyData.measurementType,
          size: propertyData.landSize,
        },
        briefType: briefType,
        additionalFeatures: {
          noOfBedroom: propertyData.bedrooms.toString(),
          noOfBathroom: propertyData.bathrooms.toString(),
          noOfToilet: propertyData.toilets.toString(),
          noOfCarPark: propertyData.parkingSpaces.toString(),
          maxGuests: propertyData.maxGuests?.toString(),
        },
        tenantCriteria: propertyData.tenantCriteria,
        jvConditions: propertyData.jvConditions,
        description: propertyData.description,
        addtionalInfo: propertyData.additionalInfo,
        pictures: uploadedImageUrls,
        videos: uploadedVideoUrls,
        isTenanted: propertyData.isTenanted,
        holdDuration: propertyData.holdDuration,
        // Shortlet specific fields
        availability: propertyData.availability
          ? {
              minStay: propertyData.availability.minStay,
              maxStay: propertyData.availability.maxStay,
              calendar: propertyData.availability.calendar,
            }
          : undefined,
        pricing: propertyData.pricing
          ? {
              nightly: propertyData.pricing.nightly,
              weeklyDiscount: propertyData.pricing.weeklyDiscount,
              monthlyDiscount: propertyData.pricing.monthlyDiscount,
              cleaningFee: propertyData.pricing.cleaningFee,
              securityDeposit: propertyData.pricing.securityDeposit,
              cancellationPolicy: propertyData.pricing.cancellationPolicy,
            }
          : undefined,
        houseRules: propertyData.houseRules
          ? {
              checkIn: propertyData.houseRules.checkIn,
              checkOut: propertyData.houseRules.checkOut,
              smoking: propertyData.houseRules.smoking,
              pets: propertyData.houseRules.pets,
              parties: propertyData.houseRules.parties,
              otherRules: propertyData.houseRules.otherRules,
            }
          : undefined,
      };

      // 5. Submit to API
      const response = await POST_REQUEST(
        `${URLS.BASE}${URLS.listNewProperty}`,
        payload,
        Cookies.get("token"),
      );

            if (response && (response as any).success && (response as any).data) {
        toast.success("Property created successfully!");
        resetForm();
        setShowSuccessModal(true);
      } else {
        const errorMessage =
          (response as any)?.error || "Failed to submit property";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("An error occurred while submitting the property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    if (showPropertySummary) {
      return <EnhancedPropertySummary />;
    }

    switch (currentStep) {
      case 0:
        return <Step0PropertyTypeSelection />;
      case 1:
        return <Step1BasicDetails />;
      case 2:
        return <Step2FeaturesConditions />;
      case 3:
        return <Step3ImageUpload />;
      case 4:
        return <Step4OwnershipDeclaration />;
      default:
        return <Step0PropertyTypeSelection />;
    }
  };

  const getStepTitle = () => {
    if (showPropertySummary) return "Property Summary";
    if (showCommissionModal) return "Commission Agreement";
    return steps[currentStep]?.label || "Post Property";
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <AgentAccessBarrier
      requireOnboarding={true}
      requireApproval={true}
      customMessage="You must complete onboarding and be approved before you can post properties."
    >
      <Preloader isVisible={isSubmitting} message="Submitting Property..." />
      <div className="min-h-screen bg-[#EEF1F1] py-4 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-[#5A5D63] mb-4 md:mb-6">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Post Property</span>
            <span className="mx-2">›</span>
            <span className="text-[#09391C] font-medium">{getStepTitle()}</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#09391C] font-display mb-4">
              List Your Property
            </h1>
            <p className="text-[#5A5D63] text-sm md:text-lg max-w-2xl mx-auto px-4">
              {showPropertySummary
                ? "Review your property listing before submission"
                : showCommissionModal
                  ? "Review and accept the commission terms"
                  : "Follow these simple steps to list your property and connect with potential buyers or tenants"}
            </p>
          </div>

          {/* Stepper */}
          {!showPropertySummary && !showCommissionModal && (
            <div className="mb-6 md:mb-8 overflow-x-auto">
              <Stepper steps={steps} />
            </div>
          )}

          {/* Main Content with Formik */}
          <Formik
            initialValues={propertyData}
            validationSchema={getValidationSchema(currentStep, propertyData)}
            onSubmit={() => {}}
            enableReinitialize
          >
            {({
              errors,
              touched,
              validateForm,
              setFieldTouched,
              isValid,
              isSubmitting: formikSubmitting,
            }) => (
              <Form>
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-6 md:mb-8">
                  {renderCurrentStep()}
                </div>

                {/* Navigation Buttons */}
                {!showCommissionModal && !showPropertySummary && (
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto">
                    <Button
                      type="button"
                      value={currentStep === 0 ? "Cancel" : "Previous"}
                      onClick={
                        currentStep === 0
                          ? () => router.push("/")
                          : handlePrevious
                      }
                      className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors"
                      isDisabled={isSubmitting}
                    />

                    {/* Step indicator - centered */}
                    <div className="flex md:hidden justify-center">
                      <span className="text-sm text-[#5A5D63] font-medium">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                      {/* Desktop step indicator */}
                      <div className="hidden md:block">
                        <span className="text-sm text-[#5A5D63] font-medium">
                          Step {currentStep + 1} of {steps.length}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {currentStep === 4 && (
                          <Button
                            type="button"
                            value="Review Property"
                            onClick={() => setShowPropertySummary(true)}
                            className="w-full md:w-auto border-2 border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors"
                            isDisabled={isSubmitting}
                          />
                        )}
                        <Button
                          type="button"
                          value={currentStep === 4 ? "Complete" : "Next"}
                          onClick={() =>
                            handleNext(validateForm, errors, setFieldTouched)
                          }
                          className="w-full md:w-auto bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          isDisabled={
                            isSubmitting ||
                            isLoading ||
                            images.some((img) => img.isUploading) ||
                            (propertyData.videos &&
                              propertyData.videos.some(
                                (video) => video.isUploading,
                              )) ||
                            !isStepValid(
                              currentStep,
                              propertyData,
                              areImagesValid,
                              errors,
                              touched,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>

          {/* Commission Modal */}
          <CommissionModal
            open={showCommissionModal}
            onClose={() => setShowCommissionModal(false)}
            onAccept={handleCommissionAccept}
            commission={`${getUserCommissionRate()}%`}
            userName={
              `${propertyData.contactInfo.firstName} ${propertyData.contactInfo.lastName}`.trim() ||
              user?.firstName ||
              "User"
            }
            userType={user?.userType === "Agent" ? "agent" : "landowner"}
            briefType={
              briefTypeConfig[
                propertyData.propertyType as keyof typeof briefTypeConfig
              ]?.label
            }
          />

          {/* Debug Section - only show in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Debug - Payload Preview
              </h3>
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-gray-600 hover:text-gray-800">
                  Click to view current form data
                </summary>
                <div className="mt-4 bg-white rounded border p-4 max-h-96 overflow-auto">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Property Data:
                  </h4>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap mb-4">
                    {JSON.stringify(propertyData, null, 2)}
                  </pre>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Images ({images.length}):
                  </h4>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap mb-4">
                    {JSON.stringify(
                      images.map((img) => ({
                        hasFile: !!img.file,
                        preview: img.preview?.substring(0, 50) + "...",
                      })),
                      null,
                      2,
                    )}
                  </pre>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Expected Payload Structure:
                  </h4>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        propertyType: propertyData.propertyCategory,
                        propertyCondition: propertyData.propertyCondition,
                        typeOfBuilding: propertyData.typeOfBuilding,
                        rentalType: propertyData.rentalType,
                        features: propertyData.features,
                        docOnProperty: propertyData.documents.map((doc) => ({
                          docName: doc,
                          isProvided: true,
                        })),
                        location: {
                          state: propertyData.state?.value || "",
                          localGovernment: propertyData.lga?.value || "",
                          area: propertyData.area,
                        },
                        price: propertyData.price,
                        leaseHold: propertyData.leaseHold,
                        shortletDuration: propertyData.shortletDuration,
                        owner: {
                          fullName: `${propertyData.contactInfo.firstName} ${propertyData.contactInfo.lastName}`,
                          phoneNumber: propertyData.contactInfo.phone,
                          email: propertyData.contactInfo.email,
                        },
                        areYouTheOwner: propertyData.isLegalOwner,
                        ownershipDocuments:
                          propertyData.ownershipDocuments || [],
                        landSize: {
                          measurementType: propertyData.measurementType,
                          size: propertyData.landSize,
                        },
                        briefType:
                          propertyData.propertyType === "sell"
                            ? "Outright Sales"
                            : propertyData.propertyType === "rent"
                              ? "Rent"
                              : propertyData.propertyType === "shortlet"
                                ? "Shortlet"
                                : propertyData.propertyType === "jv"
                                  ? "Joint Venture"
                                  : "",
                        additionalFeatures: {
                          noOfBedroom: propertyData.bedrooms.toString(),
                          noOfBathroom: propertyData.bathrooms.toString(),
                          noOfToilet: propertyData.toilets.toString(),
                          noOfCarPark: propertyData.parkingSpaces.toString(),
                        },
                        tenantCriteria: propertyData.tenantCriteria,
                        jvConditions: propertyData.jvConditions,
                        description: propertyData.description,
                        addtionalInfo: propertyData.additionalInfo,
                        pictures: "[Will be uploaded image URLs]",
                        isTenanted: propertyData.isTenanted,
                        holdDuration: propertyData.holdDuration,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </details>
                        </div>
          )}

          {/* Success Modal */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            propertyData={{
              propertyType: propertyData.propertyType,
              price: propertyData.price,
              location: `${propertyData.area}, ${propertyData.lga?.label}, ${propertyData.state?.label}`
            }}
          />
        </div>
      </div>
    </AgentAccessBarrier>
  );
};

export default PostProperty;
