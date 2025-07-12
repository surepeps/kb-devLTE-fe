/** @format */

"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  PreferenceFormProvider,
  usePreferenceForm,
} from "@/context/preference-form-context";
import LocationSelection from "@/components/preference-form/LocationSelection";
import BudgetSelection from "@/components/preference-form/BudgetSelection";
import FeatureSelection from "@/components/preference-form/FeatureSelection";
import PropertyDetails from "@/components/preference-form/PropertyDetails";
import DateSelection from "@/components/preference-form/DateSelection";
import ContactInformation from "@/components/preference-form/ContactInformation";
import SubmitButton from "@/components/preference-form/SubmitButton";
import {
  PreferencePayload,
  BuyPreferencePayload,
  RentPreferencePayload,
  JointVenturePreferencePayload,
  ShortletPreferencePayload,
} from "@/types/preference-form";

// Preference type configurations
const PREFERENCE_CONFIGS = {
  buy: {
    label: "Buy a Property",
    shortLabel: "Buy",
    icon: "🏠",
    description: "Find properties to purchase",
    preferenceType: "buy" as const,
    preferenceMode: "buy" as const,
  },
  rent: {
    label: "Rent Property",
    shortLabel: "Rent",
    icon: "🏡",
    description: "Find rental properties",
    preferenceType: "rent" as const,
    preferenceMode: "tenant" as const,
  },
  "joint-venture": {
    label: "Joint Venture",
    shortLabel: "JV",
    icon: "🏗",
    description: "Partner for development",
    preferenceType: "joint-venture" as const,
    preferenceMode: "developer" as const,
  },
  shortlet: {
    label: "Shortlet Guest Stay",
    shortLabel: "Shortlet",
    icon: "🏘",
    description: "Book short-term stays",
    preferenceType: "shortlet" as const,
    preferenceMode: "shortlet" as const,
  },
};

// Form content component
const PreferenceFormContent: React.FC = () => {
  const router = useRouter();
  const { state, updateFormData, resetForm, goToStep, dispatch, isFormValid } =
    usePreferenceForm();

  const [selectedPreferenceType, setSelectedPreferenceType] =
    useState<keyof typeof PREFERENCE_CONFIGS>("buy");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle preference type change
  const handlePreferenceTypeChange = useCallback(
    (preferenceKey: keyof typeof PREFERENCE_CONFIGS) => {
      setSelectedPreferenceType(preferenceKey);
      resetForm();
      updateFormData({
        preferenceType: PREFERENCE_CONFIGS[preferenceKey].preferenceType,
      });
    },
    [resetForm, updateFormData],
  );

  // Generate API payload
  const generatePayload = useCallback((): PreferencePayload => {
    const { formData } = state;
    console.log(formData, "my filled form.....");
    const config = PREFERENCE_CONFIGS[selectedPreferenceType];

    const basePayload = {
      preferenceType: config.preferenceType,
      preferenceMode: config.preferenceMode,
      location: {
        state: formData.location?.state || "",
        localGovernmentAreas: formData.location?.lgas || [],
        selectedAreas: formData.location?.areas || [],
        customLocation: formData.location?.customLocation,
      },
      budget: {
        minPrice: formData.budget?.minPrice || 0,
        maxPrice: formData.budget?.maxPrice || 0,
        currency: "NGN" as const,
      },
      features: {
        baseFeatures: formData.features?.basicFeatures || [],
        premiumFeatures: formData.features?.premiumFeatures || [],
        autoAdjustToFeatures: formData.features?.autoAdjustToBudget || false,
      },
    };

    switch (selectedPreferenceType) {
      case "buy": {
        const buyData = formData as any;
        return {
          ...basePayload,
          preferenceType: "buy",
          preferenceMode: "buy",
          propertyDetails: {
            propertyType: buyData.propertyDetails?.propertyType || "",
            buildingType: buyData.propertyDetails?.buildingType || "",
            minBedrooms: buyData.propertyDetails?.minBedrooms || "",
            minBathrooms: buyData.propertyDetails?.minBathrooms || 0,
            propertyCondition: buyData.propertyDetails?.propertyCondition || "",
            purpose: buyData.propertyDetails?.purpose || "",
          },
          contactInfo: {
            fullName: buyData.contactInfo?.fullName || "",
            email: buyData.contactInfo?.email || "",
            phoneNumber: buyData.contactInfo?.phoneNumber || "",
          },
          nearbyLandmark: buyData.nearbyLandmark,
          additionalNotes: buyData.additionalNotes,
        } as BuyPreferencePayload;
      }

      case "rent": {
        const rentData = formData as any;
        return {
          ...basePayload,
          preferenceType: "rent",
          preferenceMode: "tenant",
          propertyDetails: {
            propertyType: rentData.propertyDetails?.propertyType || "",
            minBedrooms: rentData.propertyDetails?.minBedrooms || "",
            leaseTerm: rentData.propertyDetails?.leaseTerm || "",
            propertyCondition:
              rentData.propertyDetails?.propertyCondition || "",
            purpose: rentData.propertyDetails?.purpose || "",
          },
          contactInfo: {
            fullName: rentData.contactInfo?.fullName || "",
            email: rentData.contactInfo?.email || "",
            phoneNumber: rentData.contactInfo?.phoneNumber || "",
          },
          additionalNotes: rentData.additionalNotes,
        } as RentPreferencePayload;
      }

      case "joint-venture": {
        const jvData = formData as any;
        return {
          ...basePayload,
          preferenceType: "joint-venture",
          preferenceMode: "developer",
          developmentDetails: {
            minLandSize: jvData.developmentDetails?.minLandSize || "",
            jvType: jvData.developmentDetails?.jvType || "",
            propertyType: jvData.developmentDetails?.propertyType || "",
            expectedStructureType:
              jvData.developmentDetails?.expectedStructureType || "",
            timeline: jvData.developmentDetails?.timeline || "",
            budgetRange: jvData.developmentDetails?.budgetRange,
          },
          contactInfo: {
            companyName: jvData.contactInfo?.companyName || "",
            contactPerson: jvData.contactInfo?.contactPerson || "",
            email: jvData.contactInfo?.email || "",
            phoneNumber: jvData.contactInfo?.phoneNumber || "",
            cacRegistrationNumber: jvData.contactInfo?.cacRegistrationNumber,
          },
          partnerExpectations: jvData.partnerExpectations,
        } as JointVenturePreferencePayload;
      }

      case "shortlet": {
        const shortletData = formData as any;
        return {
          ...basePayload,
          preferenceType: "shortlet",
          preferenceMode: "shortlet",
          bookingDetails: {
            propertyType: shortletData.bookingDetails?.propertyType || "",
            minBedrooms: shortletData.bookingDetails?.minBedrooms || "",
            numberOfGuests: shortletData.bookingDetails?.numberOfGuests || 0,
            checkInDate: shortletData.bookingDetails?.checkInDate || "",
            checkOutDate: shortletData.bookingDetails?.checkOutDate || "",
          },
          contactInfo: {
            fullName: shortletData.contactInfo?.fullName || "",
            email: shortletData.contactInfo?.email || "",
            phoneNumber: shortletData.contactInfo?.phoneNumber || "",
          },
          additionalNotes: shortletData.additionalNotes,
        } as ShortletPreferencePayload;
      }

      default:
        throw new Error("Invalid preference type");
    }
  }, [state, selectedPreferenceType]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isFormValid()) {
      toast.error("Please complete all required fields before submitting");
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });

    try {
      const payload = generatePayload();

      // Log payload for debugging (keeping as requested)
      console.log("Generated Payload:", JSON.stringify(payload, null, 2));

      const url = `${process.env.NEXT_PUBLIC_API_URL}/buyers/submit-preference`;

      const response = await axios.post(url, payload);

      if (response.status === 201 || response.status === 200) {
        console.log("Preference submitted successfully:", response);
        toast.success("Preference submitted successfully!");
        // Show success modal instead of redirecting immediately
        setShowSuccessModal(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit preference. Please try again.");
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, [generatePayload, dispatch, isFormValid]);

  // Handle success modal home button click
  const handleGoHome = useCallback(() => {
    setShowSuccessModal(false);
    resetForm();
    router.push("/homepage");
  }, [resetForm, router]);

  // Render preference type selector
  const renderPreferenceTypeSelector = () => (
    <div className="mb-8 sm:mb-12">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Choose Your Preference
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Select the type of property transaction you&apos;re interested in
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(PREFERENCE_CONFIGS).map(([key, config]) => (
          <motion.button
            key={key}
            type="button"
            onClick={() =>
              handlePreferenceTypeChange(key as keyof typeof PREFERENCE_CONFIGS)
            }
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              key === selectedPreferenceType
                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
              {config.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
              <span className="block sm:hidden">{config.shortLabel}</span>
              <span className="hidden sm:block">{config.label}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {config.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Render step progress
  const renderStepProgress = () => (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {state.steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                className={`flex items-center space-x-2 ${
                  index <= state.currentStep
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                } ${
                  index === state.currentStep
                    ? "text-emerald-600"
                    : index < state.currentStep
                      ? "text-emerald-500"
                      : "text-gray-400"
                }`}
                onClick={() => {
                  // Only allow navigation to current step or completed steps
                  if (index <= state.currentStep) {
                    goToStep(index);
                  }
                }}
                whileHover={index <= state.currentStep ? { scale: 1.05 } : {}}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    index < state.currentStep
                      ? "bg-emerald-500 text-white"
                      : index === state.currentStep
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index < state.currentStep ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {step.title}
                </span>
              </motion.div>
              {index < state.steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  // Get step content
  const getStepContent = () => {
    switch (state.currentStep) {
      case 0: // Location
        return <LocationSelection />;
      case 1: // Budget
        return <BudgetSelection preferenceType={selectedPreferenceType} />;
      case 2: // Features + Property Details + Dates (combined)
        return (
          <div className="space-y-8">
            <FeatureSelection preferenceType={selectedPreferenceType} />
            <PropertyDetails preferenceType={selectedPreferenceType} />
            {selectedPreferenceType === "shortlet" && <DateSelection />}
          </div>
        );
      case 3: // Contact
        return <ContactInformation preferenceType={selectedPreferenceType} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Loading Overlay */}
      <AnimatePresence>
        {state.isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl max-w-sm mx-4 text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Animated spinner */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-100"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                </div>

                {/* Loading text */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Submitting Your Preference
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please wait while we process your request...
                  </p>
                </div>

                {/* Progress dots */}
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 sm:mb-6 flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            <span>Back to Marketplace</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Submit Your Property Preference
            </h1>
            <p className="text-base sm:text-xl text-gray-600">
              Tell us what you&apos;re looking for and we&apos;ll help you find
              the perfect match
            </p>
          </div>
        </div>

        {/* Preference Type Selector */}
        {renderPreferenceTypeSelector()}

        {/* Step Progress */}
        {renderStepProgress()}

        {/* Form Content */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedPreferenceType}-${state.currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {getStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <SubmitButton onSubmit={handleSubmit} />
          </div>
        </div>

        {/* Debug Panel - Show current payload */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto">
            <h4 className="text-sm font-semibold mb-2">
              Current Payload (Debug):
            </h4>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(generatePayload(), null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center"
            >
              {/* Success Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Preference Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for submitting your property preference. We'll start
                  matching you with suitable properties right away.
                </p>
              </div>

              {/* Success Details */}
              <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                  What happens next?
                </h4>
                <div className="text-sm text-emerald-700 space-y-1 text-left">
                  <p>• We'll review your preferences within 24 hours</p>
                  <p>• You'll receive property matches via email</p>
                  <p>
                    • Our agents will contact you for personalized assistance
                  </p>
                </div>
              </div>

              {/* Home Button - Only way to close modal */}
              <button
                onClick={handleGoHome}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Go to Home</span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main component with provider
const NewPreferencePage: React.FC = () => {
  return (
    <PreferenceFormProvider>
      <PreferenceFormContent />
    </PreferenceFormProvider>
  );
};

export default NewPreferencePage;
