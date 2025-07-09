"use client";

import React, { useState } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiClock,
  FiUser,
} from "react-icons/fi";

interface EnhancedLOINegotiationPageProps {
  letterOfIntention: string;
  userType: "seller" | "buyer";
}

const EnhancedLOINegotiationPage: React.FC<EnhancedLOINegotiationPageProps> = ({
  letterOfIntention,
  userType,
}) => {
  const { state, toggleMessageModal } = useSecureNegotiation();

  const { details, loadingStates, currentUserId } = state;
  const [response, setResponse] = useState("");
  const [showResponseForm, setShowResponseForm] = useState(false);

  const handleAcceptLOI = async () => {
    try {
      
      console.log("Accepting LOI");
    } catch (error) {
      console.error("Failed to accept LOI:", error);
    }
  };

  const handleRejectLOI = async () => {
    try {
      

      console.log("Rejecting LOI");
    } catch (error) {
      console.error("Failed to reject LOI:", error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      alert("Please enter a response");
      return;
    }

    try {
      
      setShowResponseForm(false);
      setResponse("");

      console.log("LOI response submitted:", response);
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  const downloadLOI = () => {
    const element = document.createElement("a");
    const file = new Blob([letterOfIntention], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `letter-of-intention-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Letter of Intention Review
        </h1>
        <p className="text-gray-600">
          {userType === "seller"
            ? "Review the buyer's Letter of Intention for joint venture partnership."
            : "Your Letter of Intention is being reviewed by the seller."}
        </p>
      </div>

      {/* LOI Document Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FiFileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Letter of Intention Document
              </h3>
            </div>
            <button
              onClick={downloadLOI}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* LOI Content */}
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {letterOfIntention}
            </div>
          </div>

          {/* Document Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-blue-600">
                <FiUser className="w-4 h-4" />
                <span>Joint Venture Proposal</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <FiClock className="w-4 h-4" />
                <span>
                  Submitted:{" "}
                  {details?.createdAt
                    ? new Date(details.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons for Seller */}
      {userType === "seller" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Respond to Letter of Intention
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Accept Button */}
              <button
                onClick={handleAcceptLOI}
                disabled={loadingStates.accepting}
                className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                <FiCheckCircle className="w-5 h-5" />
                <span>Accept LOI</span>
              </button>

              {/* Request Changes Button */}
              <button
                onClick={() => setShowResponseForm(true)}
                disabled={loadingStates.countering}
                className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors duration-200"
              >
                <FiMessageSquare className="w-5 h-5" />
                <span>Request Changes</span>
              </button>

              {/* Reject Button */}
              <button
                onClick={handleRejectLOI}
                disabled={loadingStates.rejecting}
                className="flex items-center justify-center space-x-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
              >
                <FiXCircle className="w-5 h-5" />
                <span>Reject LOI</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Response Form */}
      {showResponseForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Provide Feedback on LOI
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response/Feedback
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Describe any changes you'd like to see in the LOI or provide general feedback..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSubmitResponse}
                  disabled={!response.trim() || loadingStates.submitting}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loadingStates.submitting
                    ? "Submitting..."
                    : "Submit Response"}
                </button>
                <button
                  onClick={() => {
                    setShowResponseForm(false);
                    setResponse("");
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

      {/* Key Terms Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Joint Venture Highlights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800">
                  Partnership Type
                </div>
                <div className="text-sm text-green-600">
                  Joint Venture Development
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">
                  Investment Model
                </div>
                <div className="text-sm text-blue-600">
                  {details?.investmentType || "Land + Capital Partnership"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-800">
                  Profit Sharing
                </div>
                <div className="text-sm text-purple-600">
                  {details?.profitSharing || "As outlined in LOI"}
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-800">
                  Timeline
                </div>
                <div className="text-sm text-orange-600">
                  {details?.projectTimeline || "As specified in LOI"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedLOINegotiationPage;
