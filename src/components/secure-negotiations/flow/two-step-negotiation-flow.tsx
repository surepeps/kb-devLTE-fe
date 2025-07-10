"use client";

import React, { useState, useEffect } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion, AnimatePresence } from "framer-motion";
import PriceNegotiationStep from "./price-negotiation-step";
import LOINegotiationStep from "./loi-negotiation-step";
import InspectionDateTimeStep from "./inspection-datetime-step";
import AwaitingResponseDisplay from "./awaiting-response-display";

interface TwoStepNegotiationFlowProps {
  userType: "seller" | "buyer";
}

const TwoStepNegotiationFlow: React.FC<TwoStepNegotiationFlowProps> = ({
  userType,
}) => {
  const { state } = useSecureNegotiation();
  const { details } = state;
  const [currentStep, setCurrentStep] = useState<
    "loi" | "price" | "inspection"
  >("loi");
  const [negotiationAction, setNegotiationAction] = useState<{
    type: "accept" | "counter" | "requestChanges";
    counterPrice?: number;
    loiFile?: File;
  } | null>(null);

  // Determine which steps are needed
  const hasLOI =
    details?.letterOfIntention && details.letterOfIntention.trim().length > 0;
  const hasPriceNegotiation =
    details?.negotiationPrice > 0 || details?.isNegotiating;

  // Determine if user is waiting for response
  const isAwaitingResponse = details?.pendingResponseFrom !== userType;

  useEffect(() => {
    // Determine starting step based on available data
    if (hasLOI) {
      setCurrentStep("loi");
    } else if (hasPriceNegotiation) {
      setCurrentStep("price");
    } else {
      setCurrentStep("inspection");
    }
  }, [hasLOI, hasPriceNegotiation]);

  const handleLOIComplete = (
    action: "accept" | "reject" | "requestChanges",
    newLoiFile?: File,
  ) => {
    if (action === "reject") {
      // End the flow for rejection
      setNegotiationAction({ type: action });
      return;
    }

    setNegotiationAction({ type: action, loiFile: newLoiFile });

    // Move to price negotiation if available, otherwise inspection
    if (hasPriceNegotiation) {
      setCurrentStep("price");
    } else {
      setCurrentStep("inspection");
    }
  };

  const handlePriceNegotiationComplete = (
    action: "accept" | "counter",
    counterPrice?: number,
  ) => {
    setNegotiationAction({ type: action, counterPrice });
    setCurrentStep("inspection");
  };

  // Show awaiting response if it's not user's turn
  if (isAwaitingResponse) {
    return (
      <AwaitingResponseDisplay
        userType={userType}
        pendingResponseFrom={details?.pendingResponseFrom}
        timeRemaining=""
      />
    );
  }

  const canGoBackToPrice =
    currentStep === "inspection" &&
    details?.counterOffer &&
    details.counterOffer > 0;

  const canGoBackToLOI =
    (currentStep === "price" || currentStep === "inspection") &&
    hasLOI &&
    details?.loiStatus !== "rejected";

  const handleGoBackToPrice = () => {
    if (canGoBackToPrice) {
      setCurrentStep("price");
      setNegotiationAction(null);
    }
  };

  const handleGoBackToLOI = () => {
    if (canGoBackToLOI) {
      setCurrentStep("loi");
      setNegotiationAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      {canGoBackToLOI &&
        (currentStep === "price" || currentStep === "inspection") && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-yellow-700">
                <span className="font-medium">LOI Review in progress.</span> You
                can go back to review the Letter of Intention.
              </div>
              <button
                onClick={handleGoBackToLOI}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm"
              >
                ← Back to LOI Review
              </button>
            </div>
          </motion.div>
        )}

      {currentStep === "inspection" && canGoBackToPrice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-blue-700">
              <span className="font-medium">Price was countered.</span> You can
              go back to review the price negotiation.
            </div>
            <button
              onClick={handleGoBackToPrice}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              ← Back to Price Negotiation
            </button>
          </div>
        </motion.div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === "loi" && hasLOI && (
          <motion.div
            key="loi-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LOINegotiationStep
              userType={userType}
              onActionSelected={handleLOIComplete}
            />
          </motion.div>
        )}

        {currentStep === "price" && hasPriceNegotiation && (
          <motion.div
            key="price-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PriceNegotiationStep
              userType={userType}
              onActionSelected={handlePriceNegotiationComplete}
            />
          </motion.div>
        )}

        {currentStep === "inspection" && (
          <motion.div
            key="inspection-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <InspectionDateTimeStep
              userType={userType}
              negotiationAction={negotiationAction}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TwoStepNegotiationFlow;
