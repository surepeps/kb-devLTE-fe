"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useUserContext } from "@/context/user-context";
import { usePostPropertyContext } from "@/context/post-property-context";
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
import { getBriefTypeConfig } from "@/data/post-property-form-config";

// Validation schemas for each step
const getValidationSchema = (currentStep: number, propertyData: any) => {
  switch (currentStep) {
    case 0:
      return Yup.object({
        propertyType: Yup.string().required("Property type is required"),
      });

    case 1:
      let basicSchema = Yup.object({
        propertyCategory: Yup.string().required(
          "Property category is required",
        ),
        price: Yup.string().required("Price is required"),
        state: Yup.object().nullable().required("State is required"),
        lga: Yup.object()
          .nullable()
          .required("Local Government Area is required"),
        area: Yup.string().required("Area/Neighborhood is required"),
      });

      // Additional validations based on property type
      if (
        propertyData.propertyType === "rent" &&
        propertyData.propertyCategory !== "Land"
      ) {
        basicSchema = basicSchema.concat(
          Yup.object({
            rentalType: Yup.string().required("Rental type is required"),
            propertyCondition: Yup.string().required(
              "Property condition is required",
            ),
          }),
        );
      }

      if (propertyData.propertyCategory !== "Land") {
        basicSchema = basicSchema.concat(
          Yup.object({
            typeOfBuilding: Yup.string().required(
              "Type of building is required",
            ),
            bedrooms: Yup.number().min(1, "At least 1 bedroom is required"),
          }),
        );
      }

      return basicSchema;

    case 2:
      if (propertyData.propertyType === "sell") {
        return Yup.object({
          documents: Yup.array().min(1, "At least one document is required"),
        });
      }
      if (propertyData.propertyType === "jv") {
        return Yup.object({
          jvConditions: Yup.array().min(
            1,
            "At least one JV condition is required",
          ),
        });
      }
      return Yup.object({}); // No validation for rent

    case 3:
      return Yup.object({}); // Image validation handled separately

    case 4:
      return Yup.object({
        contactInfo: Yup.object({
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          phone: Yup.string().required("Phone number is required"),
        }),
      });

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

    // For Agents, check requirements
    if (user.userType === "Agent") {
      // Check if agent has completed onboarding
      if (!user.agentData?.agentType) {
        toast.error("You need to complete onboarding to post properties");
        router.push("/agent/onboard");
        return;
      }

      // Check if agent is approved
      if (user.accountApproved === false) {
        toast.error("Your account needs to be approved to post properties");
        router.push("/agent/under-review");
        return;
      }

      // Agent is onboarded and approved, allow access
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
    // Validate current step
    const stepErrors = await validateForm();

    if (Object.keys(stepErrors).length > 0) {
      // Show toast for first error found
      const firstError = Object.values(stepErrors)[0];
      if (typeof firstError === "string") {
        toast.error(firstError);
      } else if (typeof firstError === "object" && firstError !== null) {
        const nestedError = Object.values(firstError)[0];
        if (typeof nestedError === "string") {
          toast.error(nestedError);
        }
      }
      return;
    }

    if (currentStep === 3 && !areImagesValid()) {
      toast.error("Please upload at least 4 images to continue");
      return;
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

      // 1. Upload images first and collect URLs
      const uploadedImageUrls: string[] = [];
      const validImages = images.filter((img) => img.file !== null);

      if (validImages.length > 0) {
        toast.loading("Uploading images...", { id: "upload" });
      }

      for (const image of validImages) {
        if (image.file) {
          const formData = new FormData();
          formData.append("file", image.file);

          try {
            const uploadResponse = await POST_REQUEST_FILE_UPLOAD(
              `${URLS.BASE}${URLS.uploadImg}`,
              formData,
              Cookies.get("token"),
            );

            if (uploadResponse?.url) {
              uploadedImageUrls.push(uploadResponse.url);
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(`Failed to upload image: ${image.file.name}`);
          }
        }
      }

      if (validImages.length > 0) {
        toast.success("Images uploaded successfully!", { id: "upload" });
      }

      // 2. Determine brief type
      let briefType = "";
      if (propertyData.propertyType === "sell") briefType = "Outright Sales";
      else if (propertyData.propertyType === "rent") briefType = "Rent";
      else if (propertyData.propertyType === "shortlet") briefType = "Shortlet";
      else if (propertyData.propertyType === "jv") briefType = "Joint Venture";

      // 3. Prepare property payload
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
        owner: {
          fullName: `${propertyData.contactInfo.firstName} ${propertyData.contactInfo.lastName}`,
          phoneNumber: propertyData.contactInfo.phone,
          email: propertyData.contactInfo.email,
        },
        areYouTheOwner: propertyData.isLegalOwner,
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
        addtionalInfo: propertyData.additionalInfo,
        pictures: uploadedImageUrls,
        isTenanted: propertyData.isTenanted,
        holdDuration: propertyData.holdDuration,
      };

      // 4. Submit to API
      const response = await POST_REQUEST(
        `${URLS.BASE}${URLS.listNewProperty}`,
        payload,
        Cookies.get("token"),
      );

      if (response && (response as any).owner) {
        toast.success("Property listed successfully!");
        resetForm();

        router.push("/my-listings");
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

  const renderCurrentStep = (errors: any, touched: any) => {
    if (showPreview) {
      return <PropertyPreview />;
    }

    switch (currentStep) {
      case 0:
        return <Step0PropertyTypeSelection errors={errors} touched={touched} />;
      case 1:
        return <Step1BasicDetails errors={errors} touched={touched} />;
      case 2:
        return <Step2FeaturesConditions errors={errors} touched={touched} />;
      case 3:
        return <Step3ImageUpload errors={errors} touched={touched} />;
      case 4:
        return <Step4OwnershipDeclaration errors={errors} touched={touched} />;
      default:
        return <Step0PropertyTypeSelection errors={errors} touched={touched} />;
    }
  };

  const getStepTitle = () => {
    if (showPreview) return "Property Preview";
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
              {showPreview
                ? "Review your property listing before submission"
                : "Follow these simple steps to list your property and connect with potential buyers or tenants"}
            </p>
          </div>

          {/* Stepper */}
          {!showPreview && (
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto">
                  <Button
                    type="button"
                    value={
                      showPreview
                        ? "Edit Property"
                        : currentStep === 0
                          ? "Cancel"
                          : "Previous"
                    }
                    onClick={
                      showPreview
                        ? () => setShowPreview(false)
                        : currentStep === 0
                          ? () => router.push("/")
                          : handlePrevious
                    }
                    className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors"
                    isDisabled={isSubmitting}
                  />

                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {showPreview ? (
                      <div className="relative w-full md:w-auto">
                        <Button
                          type="button"
                          value={
                            isSubmitting ? "Submitting..." : "Submit Property"
                          }
                          onClick={handleSubmit}
                          className="w-full md:w-auto bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors"
                          isDisabled={isSubmitting}
                        />
                        {isSubmitting && (
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    ) : (
                      <>
                        {currentStep === 4 && (
                          <Button
                            type="button"
                            value="Preview"
                            onClick={() => setShowPreview(true)}
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
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Indicator */}
                {!showPreview && (
                  <div className="text-center mt-6">
                    <span className="text-sm text-[#5A5D63]">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </AgentAccessBarrier>
  );
};

export default PostProperty;
