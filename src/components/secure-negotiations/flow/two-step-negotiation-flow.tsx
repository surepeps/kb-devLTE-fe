"use client";

import React, { useState, useEffect } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion, AnimatePresence } from "framer-motion";
import PriceNegotiationStep from "./price-negotiation-step";
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
  const [currentStep, setCurrentStep] = useState<"price" | "inspection">(
    "price",
  );

  // Determine if we need price negotiation step
  const hasPriceNegotiation =
    details?.negotiationPrice > 0 || details?.isNegotiating;

  // Determine if user is waiting for response
  const isAwaitingResponse = details?.pendingResponseFrom !== userType;

  useEffect(() => {
    // Skip to inspection step if no price negotiation needed
    if (!hasPriceNegotiation) {
      setCurrentStep("inspection");
    }
  }, [hasPriceNegotiation]);

  const handleStepComplete = (step: "price" | "inspection") => {
    if (step === "price" && currentStep === "price") {
      setCurrentStep("inspection");
    }
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

  return (
    <div className="space-y-6">
      {/* Step Content */}
      <AnimatePresence mode="wait">
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
              onStepComplete={() => handleStepComplete("price")}
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
              onStepComplete={() => handleStepComplete("inspection")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TwoStepNegotiationFlow;
