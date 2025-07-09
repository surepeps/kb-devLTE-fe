"use client";

import React, { useState } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion } from "framer-motion";
import {
  FiXCircle,
  FiRefreshCw,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiMail,
  FiPhone,
} from "react-icons/fi";

interface EnhancedNegotiationCancelledSummaryProps {
  userType: "seller" | "buyer";
}

const EnhancedNegotiationCancelledSummary: React.FC<
  EnhancedNegotiationCancelledSummaryProps
> = ({ userType }) => {
  const { state, addActivity } = useSecureNegotiation();
  const { details, negotiationType, currentUserId } = state;
  const [feedback, setFeedback] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      alert("Please provide feedback before submitting");
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      addActivity({
        type: "message_sent",
        message: `${userType === "seller" ? "Seller" : "Buyer"} provided feedback: ${feedback}`,
        userId: currentUserId!,
        userType,
      });

      setShowFeedbackForm(false);
      setFeedback("");

      console.log("Feedback submitted:", feedback);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleRestartNegotiation = () => {
    // This would typically redirect to a new negotiation flow
    console.log("Restarting negotiation process");
    window.location.reload();
  };

  const cancellationReason =
    details?.cancellationReason || "No specific reason provided";
  const cancelledBy = details?.cancelledBy || "Unknown";
  const cancelledAt = details?.cancelledAt || new Date().toISOString();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
        >
          <FiXCircle className="w-8 h-8 text-red-600" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Negotiation Cancelled
        </h1>
        <p className="text-gray-600">
          This negotiation has been cancelled. See details below.
        </p>
      </div>

      {/* Cancellation Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Cancellation Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-800 mb-1">
                  Cancelled By
                </div>
                <div className="text-red-700 capitalize">{cancelledBy}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800 mb-1">
                  Cancellation Date
                </div>
                <div className="text-gray-700">
                  {new Date(cancelledAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm font-medium text-yellow-800 mb-2">
                Reason for Cancellation
              </div>
              <div className="text-yellow-700">{cancellationReason}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Property Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Property & Negotiation Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiFileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Property</div>
                  <div className="font-medium text-gray-800">
                    {details?.propertyTitle || "Property Name"}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiDollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">
                    {negotiationType === "LOI" ? "Type" : "Last Offer"}
                  </div>
                  <div className="font-medium text-gray-800">
                    {negotiationType === "LOI"
                      ? "Joint Venture"
                      : formatCurrency(
                          details?.lastOffer || details?.buyOffer || 0,
                        )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiCalendar className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-sm text-gray-500">Started</div>
                  <div className="font-medium text-gray-800">
                    {details?.createdAt
                      ? new Date(details.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiMessageSquare className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-sm text-gray-500">
                    Messages Exchanged
                  </div>
                  <div className="font-medium text-gray-800">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            What's Next?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleRestartNegotiation}
              className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <FiRefreshCw className="w-5 h-5" />
              <span>Start New Negotiation</span>
            </button>

            <button
              onClick={() => setShowFeedbackForm(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FiMessageSquare className="w-5 h-5" />
              <span>Provide Feedback</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Feedback Form */}
      {showFeedbackForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Share Your Feedback
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How was your experience? What could be improved?
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Your feedback helps us improve the negotiation process..."
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim() || isSubmittingFeedback}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackForm(false);
                    setFeedback("");
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

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-50 rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Need Help or Have Questions?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-gray-200">
            <FiMail className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">support@khabiteq.com</span>
          </div>

          <div className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-gray-200">
            <FiPhone className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">+234 (0) 123 456 7890</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Our support team is available 24/7 to assist you with any questions or
          concerns.
        </p>
      </motion.div>
    </div>
  );
};

export default EnhancedNegotiationCancelledSummary;
