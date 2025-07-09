"use client";

import React, { useState, useEffect } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion, AnimatePresence } from "framer-motion";
import PriceNegotiationStep from "./price-negotiation-step";
import InspectionDateTimeStep from "./inspection-datetime-step";
import AwaitingResponseDisplay from "./awaiting-response-display";
import { FiClock, FiCheckCircle } from "react-icons/fi";

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
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Determine if we need price negotiation step
  const hasPriceNegotiation =
    details?.negotiationPrice > 0 || details?.isNegotiating;

  // Determine if user is waiting for response
  const isAwaitingResponse = details?.pendingResponseFrom !== userType;

  // Determine current stage from backend
  const currentStage = details?.stage || "negotiation";

  useEffect(() => {
    // Skip to inspection step if no price negotiation needed
    if (!hasPriceNegotiation) {
      setCurrentStep("inspection");
    }
  }, [hasPriceNegotiation]);

  useEffect(() => {
    // Calculate time remaining (48 hours from last update)
    if (details?.updatedAt) {
      const updateTime = new Date(details.updatedAt).getTime();
      const now = new Date().getTime();
      const elapsed = now - updateTime;
      const fortyEightHours = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
      const remaining = fortyEightHours - elapsed;

      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remaining % (1000 * 60 * 60)) / (1000 * 60),
        );
        setTimeRemaining(`${hours}h ${minutes}m`);

        // Update every minute
        const interval = setInterval(() => {
          const newNow = new Date().getTime();
          const newElapsed = newNow - updateTime;
          const newRemaining = fortyEightHours - newElapsed;

          if (newRemaining > 0) {
            const newHours = Math.floor(newRemaining / (1000 * 60 * 60));
            const newMinutes = Math.floor(
              (newRemaining % (1000 * 60 * 60)) / (1000 * 60),
            );
            setTimeRemaining(`${newHours}h ${newMinutes}m`);
          } else {
            setTimeRemaining("Expired");
            clearInterval(interval);
          }
        }, 60000);

        return () => clearInterval(interval);
      } else {
        setTimeRemaining("Expired");
      }
    }
  }, [details?.updatedAt]);

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
        timeRemaining={timeRemaining}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Timer Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiClock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Response Timer</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600">
              Time remaining to respond
            </div>
            <div
              className={`font-bold text-lg ${
                timeRemaining === "Expired" ? "text-red-600" : "text-blue-800"
              }`}
            >
              {timeRemaining || "Loading..."}
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 ${
              hasPriceNegotiation ? "opacity-100" : "opacity-50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === "price" && hasPriceNegotiation
                  ? "bg-green-600 text-white"
                  : hasPriceNegotiation && currentStep === "inspection"
                    ? "bg-green-100 text-green-600 border-2 border-green-600"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {hasPriceNegotiation && currentStep === "inspection" ? (
                <FiCheckCircle className="w-4 h-4" />
              ) : (
                "1"
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                hasPriceNegotiation ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Price Negotiation
            </span>
          </div>

          {hasPriceNegotiation && (
            <div className="flex-1 h-0.5 bg-gray-300">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStep === "inspection"
                    ? "w-full bg-green-600"
                    : "w-0 bg-gray-300"
                }`}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === "inspection"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {hasPriceNegotiation ? "2" : "1"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              Inspection Schedule
            </span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === "price" && hasPriceNegotiation && (
          <motion.div
            key="price-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
