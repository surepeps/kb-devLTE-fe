"use client";

import React, { useState } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";

interface PriceNegotiationStepProps {
  userType: "seller" | "buyer";
  onActionSelected: (
    action: "accept" | "counter",
    counterPrice?: number,
  ) => void;
}

const PriceNegotiationStep: React.FC<PriceNegotiationStepProps> = ({
  userType,
  onActionSelected,
}) => {
  const { state, rejectOffer } = useSecureNegotiation();

  const { details, loadingStates, inspectionId } = state;
  const [counterPrice, setCounterPrice] = useState<string>("");
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const propertyPrice = details?.propertyId?.price || 0;
  const negotiationPrice = details?.negotiationPrice || 0;
  const sellerCounterOffer = details?.sellerCounterOffer || 0;

  // Determine current offer based on user type and available data
  const getCurrentOffer = () => {
    if (userType === "seller") {
      // Seller sees buyer's offer or negotiation price
      return negotiationPrice > 0 ? negotiationPrice : propertyPrice;
    } else {
      // Buyer sees seller's counter offer or their own negotiation price
      return sellerCounterOffer > 0 ? sellerCounterOffer : negotiationPrice;
    }
  };

  const currentOffer = getCurrentOffer();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDifference = () => {
    const diff = Math.abs(propertyPrice - currentOffer);
    const percentage =
      propertyPrice > 0 ? ((diff / propertyPrice) * 100).toFixed(1) : "0";
    return { amount: diff, percentage };
  };

  const isAboveAsk = currentOffer > propertyPrice;
  const difference = calculateDifference();

  const handleAccept = () => {
    onActionSelected("accept");
  };

  const handleReject = async () => {
    try {
      await rejectOffer(inspectionId!, userType);
      setShowRejectModal(false);
    } catch (error) {
      console.error("Failed to reject offer:", error);
    }
  };

  const handleCounterSubmit = () => {
    const counterAmount = parseFloat(counterPrice.replace(/[^\d.-]/g, ""));

    if (!counterAmount || counterAmount <= 0) {
      alert("Please enter a valid counter offer amount");
      return;
    }

    onActionSelected("counter", counterAmount);
    setShowCounterModal(false);
    setCounterPrice("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#09391C] mb-2">
          Price Negotiation
        </h2>
        <p className="text-gray-600">
          Review the offer and choose your response. You&apos;ll select
          inspection date/time on the next step.
        </p>
      </div>

      {/* Price Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#EEF1F1] rounded-lg p-6 border border-[#C7CAD0]"
      >
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Price Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Price */}
          <div className="bg-white p-4 rounded-lg border border-[#C7CAD0]">
            <div className="text-sm text-gray-600 mb-1">Original Price</div>
            <div className="text-2xl font-bold text-[#09391C]">
              {formatCurrency(propertyPrice)}
            </div>
          </div>

          {/* Current Offer */}
          <div
            className={`p-4 rounded-lg border ${
              isAboveAsk
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="text-sm text-gray-600 mb-1">
              {userType === "seller" ? "Buyer's Offer" : "Current Offer"}
            </div>
            <div
              className={`text-2xl font-bold ${
                isAboveAsk ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(currentOffer)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {isAboveAsk ? "+" : "-"}
              {difference.percentage}% from original
            </div>
          </div>
        </div>

        {/* Difference Summary */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-[#C7CAD0]">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">
              {isAboveAsk
                ? "Above original price by"
                : "Below original price by"}
            </div>
            <div className="text-xl font-semibold text-[#09391C]">
              {formatCurrency(difference.amount)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#EEF1F1] rounded-lg p-6 border border-[#C7CAD0]"
      >
        <h4 className="font-medium text-[#09391C] mb-4">
          Choose Your Response
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Accept Button */}
          <button
            onClick={handleAccept}
            className="flex items-center justify-center space-x-2 p-4 bg-[#09391C] text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FiCheckCircle className="w-5 h-5" />
            <span>Accept Offer</span>
          </button>

          {/* Counter Offer Button */}
          <button
            onClick={() => setShowCounterModal(true)}
            className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
          >
            <FiDollarSign className="w-5 h-5" />
            <span>Counter Offer</span>
          </button>

          {/* Reject Button */}
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loadingStates.rejecting}
            className="flex items-center justify-center space-x-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
          >
            <FiXCircle className="w-5 h-5" />
            <span>Reject Offer</span>
          </button>
        </div>
      </motion.div>

      {/* Counter Offer Modal */}
      {showCounterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-[#C7CAD0]"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Make Counter Offer
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Counter Offer Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <input
                      type="text"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#09391C] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleCounterSubmit}
                    disabled={!counterPrice.trim()}
                    className="flex-1 py-3 bg-[#09391C] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    Continue to Inspection
                  </button>
                  <button
                    onClick={() => {
                      setShowCounterModal(false);
                      setCounterPrice("");
                    }}
                    className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-[#C7CAD0]"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FiAlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-[#09391C]">
                  Confirm Rejection
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to reject this offer? This will terminate
                the negotiation and inspection process.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={handleReject}
                  disabled={loadingStates.rejecting}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loadingStates.rejecting ? "Rejecting..." : "Yes, Reject"}
                </button>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PriceNegotiationStep;
