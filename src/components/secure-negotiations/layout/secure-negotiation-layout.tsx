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

      <div className="w-full min-h-screen flex items-center justify-center flex-col gap-[20px] md:gap-[40px] py-[20px] md:py-[50px] px-[20px] bg-[#EEF1F1]">
        {/* Security Banner */}
        <div className="w-full max-w-[933px] bg-[#09391C] text-white py-3 px-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiShield className="w-5 h-5" />
              <span className="font-medium">Secure Negotiation Portal</span>
            </div>
            <button
              onClick={refreshData}
              disabled={loadingStates.loading}
              className="flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors duration-200 disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${loadingStates.loading ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex gap-[20px] md:gap-[40px] justify-center items-center flex-col">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="font-display text-3xl md:text-4xl text-center font-semibold text-[#09391C]"
          >
            {userType === "seller" ? "Seller Response" : "Buyer Response"}
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-[1px] items-center justify-center"
          >
            <p className="text-center text-base md:text-lg text-black">
              Hello, {getFullName()}
            </p>
            <p className="text-center text-base md:text-lg text-black">
              {getStatusMessage()}
            </p>
            <p className="text-center text-base md:text-lg text-black">
              Please reply within{" "}
              <span className="text-base md:text-lg text-[#FF3D00]">
                48 hours
              </span>{" "}
              — the countdown starts now.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-[933px] flex flex-col gap-[30px] bg-[#FFFFFF] py-[30px] md:py-[50px] px-[20px] md:px-[50px] border-[1px] border-[#C7CAD0] rounded-lg shadow-sm mx-auto">
          {/* Timer */}
          <div className="flex items-center justify-center p-4 bg-[#EEF1F1] rounded-lg border border-[#C7CAD0]">
            <div className="flex items-center space-x-3">
              <FiClock className="w-6 h-6 text-[#09391C]" />
              <div className="text-center">
                <div className="text-sm text-gray-600">
                  Time remaining to respond
                </div>
                <div className="text-lg font-semibold text-[#FF3D00]">
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
