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
import Button from "@/components/general-components/button";
import Loading from "@/components/loading-component/loading";
import Preloader from "@/components/general-components/preloader";

// Import additional step components
import Step2FeaturesConditions from "@/components/post-property-components/Step2FeaturesConditions";
import Step4OwnershipDeclaration from "@/components/post-property-components/Step4OwnershipDeclaration";

// Import configuration helpers
import { briefTypeConfig } from "@/data/comprehensive-post-property-config";

// Validation schemas for each step - now using comprehensive validation
const getValidationSchema = (currentStep: number, propertyData: any) => {
  switch (currentStep) {
    case 0:
      return Yup.object({
        propertyType: Yup.string().required("Property type is required"),
      });

    case 1:
    case 2:
    case 3:
    case 4:
      // Use comprehensive validation schema for all steps
      return getPostPropertyValidationSchema(propertyData.propertyType);

    default:
      return Yup.object({});
  }
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

  const handleNext = async (validateForm: () => Promise<any>, errors: any) => {
    // Step 3 (images) validation is handled separately by the component
    if (currentStep === 3 && !areImagesValid()) {
      return; // Component will show validation messages
    }

    // For other steps, validation is handled by each component internally
    // No need to validate here as components use red border validation

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
        },
        tenantCriteria: propertyData.tenantCriteria,
        jvConditions: propertyData.jvConditions,
        description: propertyData.description,
        addtionalInfo: propertyData.additionalInfo,
        pictures: uploadedImageUrls,
        videos: uploadedVideoUrls,
        isTenanted: propertyData.isTenanted,
        holdDuration: propertyData.holdDuration,
      };

      // 5. Submit to API
      const response = await POST_REQUEST(
        `${URLS.BASE}${URLS.listNewProperty}`,
        payload,
        Cookies.get("token"),
      );

      if (response && (response as any).owner) {
        toast.success("Property listed successfully!");
        resetForm();

        // Redirect based on user type
        if (user?.userType === "Agent") {
          router.push("/agent");
        } else {
          router.push("/my-listings");
        }
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
            {({ errors, touched, validateForm }) => (
              <Form>
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-6 md:mb-8">
                  {renderCurrentStep(errors, touched)}
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
                            isDisabled={!validateCurrentStep() || isSubmitting}
                          />
                        )}
                        <Button
                          type="button"
                          value={currentStep === 4 ? "Complete" : "Next"}
                          onClick={() => handleNext(validateForm, errors)}
                          className="w-full md:w-auto bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors"
                          isDisabled={isSubmitting}
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
        </div>
      </div>
    </AgentAccessBarrier>
  );
};

export default PostProperty;
