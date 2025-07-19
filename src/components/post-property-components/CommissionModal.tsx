import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/general-components/button";
import { getCommissionText } from "@/data/comprehensive-post-property-config";
import Green from "@/assets/green.png";

interface CommissionModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  commission?: string;
  userName?: string;
  userType?: "landowner" | "agent";
  briefType?: string;
}

const CommissionModal: React.FC<CommissionModalProps> = ({
  open,
  onClose,
  onAccept,
  commission = "10%",
  userName = "User",
  userType = "landowner",
  briefType = "",
}) => {
  const getUserTypeText = () => {
    return userType === "agent" ? "Agent" : "Property Owner";
  };

  const getCommissionDescription = () => {
    const config = briefType
      ? getCommissionText(briefType, userType, userName)
      : "";
    if (config) {
      return config;
    }

    if (userType === "agent") {
      return `As an agent, you earn ${commission} commission on successful transactions.`;
    }
    return `As a property owner, ${commission} commission applies when we close the deal.`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white shadow-xl rounded-lg p-6 md:p-8 w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#09391C] font-display mb-2">
                Commission Details
              </h2>
              <p className="text-[#5A5D63] text-sm md:text-base">
                {getCommissionDescription()}
              </p>
            </div>

            {/* Commission Card */}
            <div className="bg-[#F4FFF4] border border-[#8DDB90] rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#8DDB90] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {commission}
                  </span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
                  <p className="text-[#09391C] font-medium text-sm">
                    User Type:{" "}
                    <span className="font-bold">{getUserTypeText()}</span>
                  </p>
                  {briefType && (
                    <p className="text-[#5A5D63] text-xs mt-1">
                      Brief Type: {briefType}
                    </p>
                  )}
                </div>

                <p className="text-[#1E1E1E] text-sm leading-relaxed italic">
                  {getCommissionText(briefType || "", userType, userName)}
                </p>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="bg-[#FFF8E1] border border-[#FFB74D] rounded-lg p-4 mb-6">
              <p className="text-[#F57F17] text-xs text-center leading-relaxed">
                <span className="font-medium">Legal Notice:</span> By accepting,
                you agree to the commission terms. This fee is only charged upon
                successful completion of the transaction.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                value="Decline"
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-[#E5E7EB] text-[#5A5D63] hover:bg-[#F9FAFB] text-base font-semibold min-h-[50px] py-3 px-6 rounded-lg transition-colors"
              />
              <Button
                value="Accept & Continue"
                type="button"
                onClick={onAccept}
                className="flex-1 bg-[#8DDB90] hover:bg-[#7BC87F] text-white text-base font-semibold min-h-[50px] py-3 px-6 rounded-lg transition-colors"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommissionModal;
