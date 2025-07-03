"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserContext } from "@/context/user-context";
import { usePostPropertyContext } from "@/context/post-property-context";
import { POST_REQUEST_FILE_UPLOAD } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Components
import Stepper from "@/components/post-property-components/Stepper";
import Step0PropertyTypeSelection from "@/components/post-property-components/Step0PropertyTypeSelection";
import Step1BasicDetails from "@/components/post-property-components/Step1BasicDetails";
import Step3ImageUpload from "@/components/post-property-components/Step3ImageUpload";
import PropertyPreview from "@/components/post-property-components/PropertyPreview";
import Button from "@/components/general-components/button";
import Loading from "@/components/loading-component/loading";
import BreadcrumbNav from "@/components/general-components/BreadcrumbNav";

// Import additional step components
import Step2FeaturesConditions from "@/components/post-property-components/Step2FeaturesConditions";
import Step4OwnershipDeclaration from "@/components/post-property-components/Step4OwnershipDeclaration";

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
  } = usePostPropertyContext();

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.userType !== "Landowners" && !user.agentData) {
      toast.error("You need to be a landowner or agent to post properties");
      router.push("/");
      return;
    }
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

  const handleNext = () => {
    if (!validateCurrentStep()) {
      if (currentStep === 3 && !areImagesValid()) {
        toast.error("Please upload at least 4 images to continue");
        return;
      }
      toast.error("Please fill in all required fields");
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handlePrevious = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare form data
      const formData = new FormData();

      // Add property data
      formData.append("propertyType", propertyData.propertyType);
      formData.append("price", propertyData.price);
      if (propertyData.holdDuration) {
        formData.append("holdDuration", propertyData.holdDuration);
      }
      formData.append("description", propertyData.description);
      formData.append("state", propertyData.state?.value || "");
      formData.append("lga", propertyData.lga?.value || "");
      formData.append("area", propertyData.area);
      formData.append("bedrooms", propertyData.bedrooms.toString());
      formData.append("bathrooms", propertyData.bathrooms.toString());
      formData.append("toilets", propertyData.toilets.toString());
      formData.append("parkingSpaces", propertyData.parkingSpaces.toString());
      formData.append("features", JSON.stringify(propertyData.features));
      formData.append(
        "tenantCriteria",
        JSON.stringify(propertyData.tenantCriteria),
      );
      formData.append(
        "jvConditions",
        JSON.stringify(propertyData.jvConditions),
      );
      formData.append("documents", JSON.stringify(propertyData.documents));
      formData.append(
        "ownershipDocuments",
        JSON.stringify(propertyData.ownershipDocuments),
      );
      formData.append("contactInfo", JSON.stringify(propertyData.contactInfo));
      formData.append("isLegalOwner", propertyData.isLegalOwner.toString());

      // Add images
      const validImages = images.filter((img) => img.file !== null);
      validImages.forEach((image, index) => {
        if (image.file) {
          formData.append(`image${index}`, image.file);
        }
      });

      // Submit to API
      const response = await POST_REQUEST_FILE_UPLOAD(
        `${URLS.BASE}${URLS.postProperty}`,
        formData,
        Cookies.get("token"),
      );

      if (response.success) {
        toast.success("Property listed successfully!");
        resetForm();
        router.push("/my_listing");
      } else {
        toast.error(response.message || "Failed to submit property");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("An error occurred while submitting the property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    if (showPreview) {
      return <PropertyPreview />;
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
    if (showPreview) return "Property Preview";
    return steps[currentStep]?.label || "Post Property";
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Post Property", href: "/post_property" },
            { label: getStepTitle() },
          ]}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#09391C] font-display mb-4">
            List Your Property
          </h1>
          <p className="text-[#5A5D63] text-lg max-w-2xl mx-auto">
            {showPreview
              ? "Review your property listing before submission"
              : "Follow these simple steps to list your property and connect with potential buyers or tenants"}
          </p>
        </div>

        {/* Stepper */}
        {!showPreview && (
          <div className="mb-8">
            <Stepper steps={steps} />
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
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
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            disabled={isSubmitting}
          />

          <div className="flex gap-4">
            {showPreview ? (
              <Button
                type="button"
                value={isSubmitting ? "Submitting..." : "Submit Property"}
                onClick={handleSubmit}
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </Button>
            ) : (
              <>
                {currentStep === 4 && (
                  <Button
                    type="button"
                    value="Preview"
                    onClick={() => setShowPreview(true)}
                    className="border-2 border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    disabled={!validateCurrentStep() || isSubmitting}
                  />
                )}
                <Button
                  type="button"
                  value={currentStep === 4 ? "Complete" : "Next"}
                  onClick={handleNext}
                  className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  disabled={isSubmitting}
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
      </div>
    </div>
  );
};

export default PostProperty;
