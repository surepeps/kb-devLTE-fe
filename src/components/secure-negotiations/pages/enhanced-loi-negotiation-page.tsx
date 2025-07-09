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
  FiAlertTriangle,
} from "react-icons/fi";
import StandardPreloader from "@/components/new-marketplace/StandardPreloader";

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
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const handleAcceptLOI = async () => {
    try {
      setShowAcceptConfirm(false);
      // Navigate to inspection date and time selection
      // This would typically trigger a navigation or step change
      console.log("Accepting LOI - navigating to inspection date/time");
      // Add actual navigation logic here
    } catch (error) {
      console.error("Failed to accept LOI:", error);
    }
  };

  const handleRejectLOI = async () => {
    try {
      setShowRejectConfirm(false);
      // End the flow - show confirmation and terminate
      console.log("Rejecting LOI - ending negotiation flow");
      // Add actual rejection logic here
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
    try {
      const element = document.createElement("a");
      const file = new Blob([letterOfIntention], { type: "application/pdf" });
      element.href = URL.createObjectURL(file);
      element.download = `letter-of-intention-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const viewFullLOI = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Letter of Intention</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Letter of Intention</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">${letterOfIntention}</div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Loading Overlay */}
      <StandardPreloader
        isVisible={
          loadingStates.accepting ||
          loadingStates.rejecting ||
          loadingStates.submitting
        }
        message={
          loadingStates.accepting
            ? "Accepting LOI..."
            : loadingStates.rejecting
              ? "Rejecting LOI..."
              : loadingStates.submitting
                ? "Submitting response..."
                : "Processing..."
        }
        overlay={true}
      />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] mb-2">
          Letter of Intention Review
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {userType === "seller"
            ? "Review the buyer's Letter of Intention for joint venture partnership."
            : "Your Letter of Intention is being reviewed by the seller."}
        </p>
      </div>

      {/* LOI Document Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#C7CAD0] mb-6 sm:mb-8"
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Letter of Intention Document
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={viewFullLOI}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
              >
                <FiFileText className="w-4 h-4" />
                <span>View Full</span>
              </button>

              <button
                onClick={downloadLOI}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#09391C] text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* LOI Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6 max-h-60 sm:max-h-80 overflow-y-auto border border-gray-200">
            <div className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 leading-relaxed">
              {letterOfIntention.length > 500
                ? `${letterOfIntention.substring(0, 500)}...`
                : letterOfIntention}
            </div>
            {letterOfIntention.length > 500 && (
              <div className="mt-4 text-center">
                <button
                  onClick={viewFullLOI}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Read Full Document →
                </button>
              </div>
            )}
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
          className="bg-white rounded-xl border border-[#C7CAD0] mb-8"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Respond to Letter of Intention
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Accept Button */}
              <button
                onClick={() => setShowAcceptConfirm(true)}
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
                onClick={() => setShowRejectConfirm(true)}
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
          className="bg-white rounded-xl border border-[#C7CAD0] mb-8"
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

      {/* Accept Confirmation Modal */}
      {showAcceptConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-[#C7CAD0]"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-[#09391C]">
                  Accept Letter of Intention
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                By accepting this LOI, you agree to proceed with the joint
                venture partnership. You will be taken to schedule an inspection
                date and time.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={handleAcceptLOI}
                  disabled={loadingStates.accepting}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loadingStates.accepting
                    ? "Accepting..."
                    : "Yes, Accept & Continue"}
                </button>
                <button
                  onClick={() => setShowAcceptConfirm(false)}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectConfirm && (
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
                  Reject Letter of Intention
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to reject this Letter of Intention? This
                will terminate the joint venture negotiation process.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={handleRejectLOI}
                  disabled={loadingStates.rejecting}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loadingStates.rejecting ? "Rejecting..." : "Yes, Reject"}
                </button>
                <button
                  onClick={() => setShowRejectConfirm(false)}
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

export default EnhancedLOINegotiationPage;
