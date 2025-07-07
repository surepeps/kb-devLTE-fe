/** @format */

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useNewMarketplace } from "@/context/new-marketplace-context";
import { IsMobile } from "@/hooks/isMobile";
import InspectionPropertyCard from "./InspectionPropertyCard";
import PropertySlots from "./PropertySlots";
import DateTimeSelection from "./DateTimeSelection";
import PaymentUpload from "./PaymentUpload";
import Button from "@/components/general-components/button";

const AddForInspection = () => {
  const router = useRouter();
  const isMobile = IsMobile();

  const {
    activeTab,
    getCurrentTabState,
    setIsAddForInspectionOpen,
    removeFromInspection,
    clearInspectionSelection,
    removeNegotiatedPrice,
    removeLOIDocument,
  } = useNewMarketplace();

  const [currentStep, setCurrentStep] = useState<
    "selection" | "datetime" | "payment"
  >("selection");

  const tabState = getCurrentTabState();
  const selectedProperties = tabState.selectedForInspection;
  const negotiatedPrices = activeTab !== "jv" ? tabState.negotiatedPrices : [];
  const loiDocuments = activeTab === "jv" ? tabState.loiDocuments : [];

  // Auto-return to marketplace when 2 properties selected
  useEffect(() => {
    if (selectedProperties.length === 2 && currentStep === "selection") {
      setTimeout(() => {
        setIsAddForInspectionOpen(false);
      }, 1000); // Small delay to show the selection
    }
  }, [selectedProperties.length, currentStep, setIsAddForInspectionOpen]);

  // Calculate inspection fee
  const inspectionFee = useMemo(() => {
    const baseAmount = 10000;
    const additionalAmount = 5000;

    if (selectedProperties.length === 1) {
      return baseAmount;
    }

    if (selectedProperties.length === 2) {
      const [propertyA, propertyB] = selectedProperties;
      const lgaA = propertyA.property?.location?.localGovernment;
      const lgaB = propertyB.property?.location?.localGovernment;
      const uniqueLGAs = new Set([lgaA, lgaB]);

      return uniqueLGAs.size === 1 ? baseAmount : baseAmount + additionalAmount;
    }

    return baseAmount;
  }, [selectedProperties]);

  const handleBack = () => {
    if (currentStep === "selection") {
      setIsAddForInspectionOpen(false);
    } else if (currentStep === "datetime") {
      setCurrentStep("selection");
    } else if (currentStep === "payment") {
      setCurrentStep("datetime");
    }
  };

  const handleRemoveProperty = (propertyId: string) => {
    removeFromInspection(activeTab, propertyId);

    // Also remove associated negotiated price or LOI document
    if (activeTab === "buy" || activeTab === "rent") {
      removeNegotiatedPrice(activeTab, propertyId);
    } else if (activeTab === "jv") {
      removeLOIDocument(propertyId);
    }
  };

  const handleClearNegotiatedPrice = (propertyId: string) => {
    if (activeTab === "buy" || activeTab === "rent") {
      removeNegotiatedPrice(activeTab, propertyId);
    }
  };

  const handleClearLOIDocument = (propertyId: string) => {
    if (activeTab === "jv") {
      removeLOIDocument(propertyId);
    }
  };

  const handleProceedToDateTime = () => {
    if (selectedProperties.length === 0) {
      alert("Please select at least one property for inspection.");
      return;
    }
    setCurrentStep("datetime");
  };

  const handleProceedToPayment = () => {
    setCurrentStep("payment");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "selection":
        return "Selected Properties for Inspection";
      case "datetime":
        return "Select Inspection Date & Time";
      case "payment":
        return "Upload Payment Proof";
      default:
        return "Add for Inspection";
    }
  };

  const getTabDisplayName = () => {
    switch (activeTab) {
      case "buy":
        return "Buy";
      case "jv":
        return "Joint Venture";
      case "rent":
        return "Rent/Lease";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 mt-1"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-[#09391C] text-sm sm:text-base"
            />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#09391C] font-display leading-tight">
              {getStepTitle()}
            </h1>
            <p className="text-[#5A5D63] mt-1 text-sm sm:text-base">
              {getTabDisplayName()} Properties • Maximum 2 properties allowed
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {["selection", "datetime", "payment"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === step
                      ? "bg-[#8DDB90] text-white"
                      : index <
                          ["selection", "datetime", "payment"].indexOf(
                            currentStep,
                          )
                        ? "bg-[#09391C] text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index <
                      ["selection", "datetime", "payment"].indexOf(currentStep)
                        ? "bg-[#09391C]"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-12 mt-2">
            <span className="text-xs text-[#5A5D63]">Selection</span>
            <span className="text-xs text-[#5A5D63]">Date & Time</span>
            <span className="text-xs text-[#5A5D63]">Payment</span>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Inspection Fee Info */}
              <div className="bg-[#E4EFE7] border border-[#8DDB90] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#09391C]">
                      Inspection Fee
                    </h3>
                    <p className="text-sm text-[#5A5D63]">
                      {selectedProperties.length === 2
                        ? inspectionFee > 10000
                          ? "Two properties in different areas"
                          : "Two properties in same area"
                        : "Single property inspection"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#09391C]">
                      ₦{inspectionFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Slots */}
              <PropertySlots
                selectedProperties={selectedProperties}
                maxSlots={2}
                tab={activeTab}
                onRemove={handleRemoveProperty}
                onClearNegotiatedPrice={handleClearNegotiatedPrice}
                onClearLOIDocument={handleClearLOIDocument}
                onAddProperty={() => setIsAddForInspectionOpen(false)}
                negotiatedPrices={negotiatedPrices}
                loiDocuments={loiDocuments}
              />

              {/* Action Buttons */}
              {selectedProperties.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <button
                    onClick={() => setIsAddForInspectionOpen(false)}
                    className="px-6 py-3 border border-[#E9EBEB] text-[#5A5D63] rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back to Marketplace
                  </button>
                  <Button
                    onClick={handleProceedToDateTime}
                    value="Proceed to Date Selection"
                    className="px-6 py-3 bg-[#8DDB90] text-white rounded-lg font-medium hover:bg-[#76c77a] transition-colors"
                  />
                </div>
              )}
            </motion.div>
          )}

          {currentStep === "datetime" && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DateTimeSelection
                selectedProperties={selectedProperties}
                inspectionFee={inspectionFee}
                onProceed={handleProceedToPayment}
                onBack={() => setCurrentStep("selection")}
              />
            </motion.div>
          )}

          {currentStep === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <PaymentUpload
                selectedProperties={selectedProperties}
                inspectionFee={inspectionFee}
                onBack={() => setCurrentStep("datetime")}
                onComplete={() => {
                  // Clear selection and go back to marketplace
                  clearInspectionSelection(activeTab);
                  setIsAddForInspectionOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddForInspection;
