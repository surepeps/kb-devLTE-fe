"use client";

import React, { useState, useEffect } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMessageSquare,
  FiArrowRight,
} from "react-icons/fi";

interface EnhancedNormalNegotiationPageProps {
  currentAmount: number;
  buyOffer: number;
  userType: "seller" | "buyer";
}

const EnhancedNormalNegotiationPage: React.FC<
  EnhancedNormalNegotiationPageProps
> = ({ currentAmount, buyOffer, userType }) => {
  const {
    state,
    addActivity,
    setOfferPrice,
    setCounterOffer,
    toggleMessageModal,
  } = useSecureNegotiation();

  const { details, loadingStates, currentUserId } = state;
  const [localCounterOffer, setLocalCounterOffer] = useState<string>("");
  const [negotiationHistory, setNegotiationHistory] = useState<any[]>([]);
  const [showCounterForm, setShowCounterForm] = useState(false);

  useEffect(() => {
    if (details?.negotiationHistory) {
      setNegotiationHistory(details.negotiationHistory);
    }
  }, [details]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDifference = () => {
    const diff = Math.abs(currentAmount - buyOffer);
    const percentage = ((diff / currentAmount) * 100).toFixed(1);
    return { amount: diff, percentage };
  };

  const handleAcceptOffer = async () => {
    try {
      addActivity({
        type: "offer_accepted",
        message: `${userType === "seller" ? "Seller" : "Buyer"} accepted the offer of ${formatCurrency(buyOffer)}`,
        userId: currentUserId!,
        userType,
      });

      // Here you would typically make an API call to accept the offer
      console.log("Accepting offer:", buyOffer);
    } catch (error) {
      console.error("Failed to accept offer:", error);
    }
  };

  const handleRejectOffer = async () => {
    try {
      addActivity({
        type: "offer_rejected",
        message: `${userType === "seller" ? "Seller" : "Buyer"} rejected the offer of ${formatCurrency(buyOffer)}`,
        userId: currentUserId!,
        userType,
      });

      // Here you would typically make an API call to reject the offer
      console.log("Rejecting offer:", buyOffer);
    } catch (error) {
      console.error("Failed to reject offer:", error);
    }
  };

  const handleCounterOffer = async () => {
    const counterAmount = parseFloat(localCounterOffer.replace(/[^\d.-]/g, ""));

    if (!counterAmount || counterAmount <= 0) {
      alert("Please enter a valid counter offer amount");
      return;
    }

    try {
      setCounterOffer(counterAmount);
      addActivity({
        type: "offer_countered",
        message: `${userType === "seller" ? "Seller" : "Buyer"} made a counter offer of ${formatCurrency(counterAmount)}`,
        userId: currentUserId!,
        userType,
      });

      setShowCounterForm(false);
      setLocalCounterOffer("");

      // Here you would typically make an API call to submit the counter offer
      console.log("Counter offer submitted:", counterAmount);
    } catch (error) {
      console.error("Failed to submit counter offer:", error);
    }
  };

  const difference = calculateDifference();
  const isAboveAsk = buyOffer > currentAmount;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userType === "seller" ? "Review Buyer's Offer" : "Your Offer Status"}
        </h1>
        <p className="text-gray-600">
          {userType === "seller"
            ? "A buyer has made an offer on your property. Review and respond below."
            : "Your offer is being reviewed by the seller. See details below."}
        </p>
      </div>

      {/* Offer Comparison Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Listed Price */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Listed Price</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(currentAmount)}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <FiArrowRight className="w-8 h-8 text-gray-400" />
            </div>

            {/* Buyer's Offer */}
            <div
              className={`text-center p-4 rounded-lg ${
                isAboveAsk ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="text-sm text-gray-500 mb-1">
                {userType === "seller" ? "Buyer's Offer" : "Your Offer"}
              </div>
              <div
                className={`text-2xl font-bold ${
                  isAboveAsk ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(buyOffer)}
              </div>
              <div className="flex items-center justify-center mt-2 space-x-1">
                {isAboveAsk ? (
                  <FiTrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm ${
                    isAboveAsk ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isAboveAsk ? "+" : "-"}
                  {difference.percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Difference Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">
                {isAboveAsk ? "Above asking price by" : "Below asking price by"}
              </div>
              <div className="text-xl font-semibold text-blue-600">
                {formatCurrency(difference.amount)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {userType === "seller" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Respond to Offer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Accept Button */}
              <button
                onClick={handleAcceptOffer}
                disabled={loadingStates.accepting}
                className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                <FiCheckCircle className="w-5 h-5" />
                <span>Accept Offer</span>
              </button>

              {/* Counter Offer Button */}
              <button
                onClick={() => setShowCounterForm(true)}
                disabled={loadingStates.countering}
                className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors duration-200"
              >
                <FiDollarSign className="w-5 h-5" />
                <span>Counter Offer</span>
              </button>

              {/* Reject Button */}
              <button
                onClick={handleRejectOffer}
                disabled={loadingStates.rejecting}
                className="flex items-center justify-center space-x-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
              >
                <FiXCircle className="w-5 h-5" />
                <span>Reject Offer</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Counter Offer Form */}
      {showCounterForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                    value={localCounterOffer}
                    onChange={(e) => setLocalCounterOffer(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCounterOffer}
                  disabled={
                    !localCounterOffer.trim() || loadingStates.countering
                  }
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Submit Counter Offer
                </button>
                <button
                  onClick={() => {
                    setShowCounterForm(false);
                    setLocalCounterOffer("");
                  }}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Negotiation History */}
      {negotiationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Negotiation History
            </h3>

            <div className="space-y-3">
              {negotiationHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FiClock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {item.action}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedNormalNegotiationPage;
