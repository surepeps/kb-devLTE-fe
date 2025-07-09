"use client";

import React, { useState } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion } from "framer-motion";
import { FiShield, FiRefreshCw, FiClock } from "react-icons/fi";
import ExpiryModal from "../modals/expiry-modal";

interface SecureNegotiationLayoutProps {
  children: React.ReactNode;
  userType: "seller" | "buyer";
}

const SecureNegotiationLayout: React.FC<SecureNegotiationLayoutProps> = ({
  children,
  userType,
}) => {
  const { state, refreshData, reopenInspection } = useSecureNegotiation();
  const { details, loadingStates, isExpired } = state;
  const [isReopening, setIsReopening] = useState(false);

  const getStatusMessage = () => {
    if (!details) return "";

    const pendingResponseFrom = details.pendingResponseFrom;
    const stage = details.stage;

    if (pendingResponseFrom !== userType) {
      return `Awaiting response from ${pendingResponseFrom}...`;
    }

    switch (stage) {
      case "negotiation":
        return details.negotiationPrice > 0 || details.isNegotiating
          ? "Please review and respond to the price negotiation"
          : "Please confirm the inspection date and time";
      case "inspection":
        return "Please confirm the inspection schedule";
      default:
        return "Please review and respond";
    }
  };

  const getFullName = () => {
    if (userType === "seller") {
      return `${details?.owner?.firstName || ""} ${details?.owner?.lastName || ""}`.trim();
    } else {
      return details?.requestedBy?.fullName || "";
    }
  };

  const handleReopenInspection = async () => {
    setIsReopening(true);
    try {
      await reopenInspection();
    } catch (error) {
      console.error("Failed to reopen inspection:", error);
    } finally {
      setIsReopening(false);
    }
  };

  return (
    <>
      {/* Expiry Modal */}
      {isExpired && (
        <ExpiryModal
          onReopen={handleReopenInspection}
          isReopening={isReopening}
        />
      )}

      <div className="w-full min-h-screen flex items-start justify-center flex-col gap-4 sm:gap-6 md:gap-8 py-4 sm:py-6 md:py-12 px-4 sm:px-6 bg-[#EEF1F1]">
        {/* Security Banner */}
        <div className="w-full max-w-4xl bg-[#09391C] text-white py-2 sm:py-3 px-3 sm:px-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiShield className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">
                Secure Negotiation Portal
              </span>
            </div>
            <button
              onClick={refreshData}
              disabled={loadingStates.loading}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors duration-200 disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 ${loadingStates.loading ? "animate-spin" : ""}`}
              />
              <span className="text-xs sm:text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex gap-4 sm:gap-6 md:gap-8 justify-center items-center flex-col px-2">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-semibold text-[#09391C]"
          >
            {userType === "seller" ? "Seller Response" : "Buyer Response"}
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1 items-center justify-center text-center"
          >
            <p className="text-sm sm:text-base md:text-lg text-black">
              Hello, {getFullName()}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-black max-w-2xl">
              {getStatusMessage()}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-black">
              Please reply within{" "}
              <span className="text-sm sm:text-base md:text-lg text-[#FF3D00]">
                48 hours
              </span>{" "}
              — the countdown starts now.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl flex flex-col gap-6 sm:gap-8 bg-[#FFFFFF] py-6 sm:py-8 md:py-10 px-4 sm:px-8 md:px-10 border border-[#C7CAD0] rounded-xl mx-auto">
          {/* Timer */}
          <div className="flex items-center justify-center p-4 sm:p-5 bg-gradient-to-r from-[#EEF1F1] to-[#F8F9FA] rounded-xl border border-[#C7CAD0]">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
              <div className="p-2 bg-white rounded-lg border border-[#C7CAD0]">
                <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-[#09391C]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  Time remaining to respond
                </div>
                <div className="text-lg sm:text-xl font-bold text-[#FF3D00]">
                  {details?.updatedAt
                    ? (() => {
                        const updateTime = new Date(
                          details.updatedAt,
                        ).getTime();
                        const now = new Date().getTime();
                        const elapsed = now - updateTime;
                        const fortyEightHours = 48 * 60 * 60 * 1000;
                        const remaining = fortyEightHours - elapsed;

                        if (remaining > 0) {
                          const hours = Math.floor(
                            remaining / (1000 * 60 * 60),
                          );
                          const minutes = Math.floor(
                            (remaining % (1000 * 60 * 60)) / (1000 * 60),
                          );
                          return `${hours}h ${minutes}m`;
                        } else {
                          return "Expired";
                        }
                      })()
                    : "Loading..."}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="negotiation-content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default SecureNegotiationLayout;
