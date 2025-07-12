"use client";

import React, { useState, useEffect } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiAlertTriangle,
  FiUpload,
} from "react-icons/fi";
import StandardPreloader from "@/components/new-marketplace/StandardPreloader";
import DocumentUpload from "../DocumentUpload";

interface LOINegotiationStepProps {
  userType: "seller" | "buyer";
  onActionSelected: (
    action: "accept" | "reject" | "requestChanges",
    newLoiFile?: File,
    changeRequest?: string,
  ) => void;
}

const LOINegotiationStep: React.FC<LOINegotiationStepProps> = ({
  userType,
  onActionSelected,
}) => {
  const {
    state,
    submitNegotiationAction,
    createAcceptPayload,
    createRejectPayload,
    createCounterPayload,
    createRequestChangesPayload,
    uploadFile,
  } = useSecureNegotiation();
  const { details, loadingStates, inspectionId, inspectionType } = state;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [changeRequest, setChangeRequest] = useState("");
  const [newLoiFile, setNewLoiFile] = useState<File | null>(null);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string>("");
  const [isReuploadMode, setIsReuploadMode] = useState(false);

  // Prevent background scroll when modals are open
  useEffect(() => {
    if (showRejectModal || showRequestChangesModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showRejectModal, showRequestChangesModal]);

  // Check if changes were requested and user is buyer
  // Note: In the new API structure, we would check the stage and other indicators
  const hasRequestedChanges =
    details?.stage === "negotiation" &&
    details?.pendingResponseFrom === "buyer";
  const isBuyerWithRequestedChanges =
    userType === "buyer" && hasRequestedChanges;

  useEffect(() => {
    setIsReuploadMode(isBuyerWithRequestedChanges);
  }, [isBuyerWithRequestedChanges]);

  const letterOfIntention = details?.letterOfIntention || "";

  const handleAccept = async () => {
    // Don't submit immediately, proceed to next step
    onActionSelected("accept");
  };

  const handleReject = async () => {
    try {
      const payload = createRejectPayload("LOI");
      await submitNegotiationAction(inspectionId!, userType, payload);
      setShowRejectModal(false);
      onActionSelected("reject");
    } catch (error) {
      console.error("Failed to reject LOI:", error);
    }
  };

  const handleRequestChanges = async () => {
    if (!changeRequest.trim()) {
      alert("Please enter your feedback for the changes");
      return;
    }

    // Pass the change request to proceed to next step
    setShowRequestChangesModal(false);
    onActionSelected("requestChanges", undefined, changeRequest);
    setChangeRequest("");
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    setNewLoiFile(file);
    // Upload the file using the context method
    const url = await uploadFile(file);
    return url;
  };

  const handleUploadComplete = (url: string) => {
    setUploadedDocumentUrl(url);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    alert(error);
  };

  const handleReuploadSubmit = async () => {
    if (!newLoiFile || !uploadedDocumentUrl) {
      alert("Please upload a new LOI file");
      return;
    }

    // Pass the file and URL to the next step
    onActionSelected("accept", newLoiFile);
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
    <div className="space-y-6">
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
                ? "Submitting changes..."
                : "Processing..."
        }
        overlay={true}
      />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#09391C] mb-2">
          Letter of Intention Review
        </h2>
        <p className="text-gray-600">
          {userType === "seller"
            ? "Review the buyer's Letter of Intention. You can accept, request changes, or reject."
            : isBuyerWithRequestedChanges
              ? "Please update your LOI based on the seller's feedback and resubmit."
              : "Your Letter of Intention is being reviewed by the seller."}
        </p>
        <div className="mt-4 p-3 bg-[#EEF1F1] rounded-lg border border-[#C7CAD0]">
          <p className="text-sm font-medium text-[#09391C]">
            Inspection Type: LOI Negotiation
          </p>
        </div>
      </div>

      {/* LOI Document Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 border border-[#C7CAD0]"
      >
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
        <div className="bg-[#EEF1F1] rounded-lg p-4 sm:p-6 max-h-60 sm:max-h-80 overflow-y-auto border border-[#C7CAD0]">
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
      </motion.div>

      {/* Action Buttons for Seller */}
      {userType === "seller" && !isReuploadMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 border border-[#C7CAD0]"
        >
          <h4 className="font-medium text-[#09391C] mb-4">
            Choose Your Response
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Accept Button */}
            <button
              onClick={handleAccept}
              disabled={loadingStates.accepting}
              className="flex items-center justify-center space-x-2 p-4 bg-[#09391C] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiCheckCircle className="w-5 h-5" />
              <span>Accept LOI</span>
            </button>

            {/* Request Changes Button */}
            <button
              onClick={() => setShowRequestChangesModal(true)}
              disabled={loadingStates.submitting}
              className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiEdit3 className="w-5 h-5" />
              <span>Request Changes</span>
            </button>

            {/* Reject Button */}
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={loadingStates.rejecting}
              className="flex items-center justify-center space-x-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiXCircle className="w-5 h-5" />
              <span>Reject LOI</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Reupload Section for Buyer */}
      {isBuyerWithRequestedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 border border-[#C7CAD0]"
        >
          <h4 className="font-medium text-[#09391C] mb-4">
            Update Your Letter of Intention
          </h4>

          <div className="space-y-6">
            <DocumentUpload
              onFileUpload={handleFileUpload}
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
              acceptedTypes={[".docx", ".doc", ".pdf"]}
              maxSizeInMB={10}
              label="Upload Updated LOI Document"
              description="Drag and drop your updated LOI document here, or click to browse"
              required={true}
            />

            <button
              onClick={handleReuploadSubmit}
              disabled={!uploadedDocumentUrl || loadingStates.accepting}
              className="w-full flex items-center justify-center space-x-2 p-4 bg-[#09391C] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiUpload className="w-5 h-5" />
              <span>
                {loadingStates.accepting
                  ? "Submitting..."
                  : "Submit Updated LOI"}
              </span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
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

      {/* Request Changes Modal */}
      {showRequestChangesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-[#C7CAD0]"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Request Changes to LOI
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback for Changes
                  </label>
                  <textarea
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                    placeholder="Describe the changes you'd like to see in the LOI..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#09391C] focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleRequestChanges}
                    disabled={!changeRequest.trim() || loadingStates.submitting}
                    className="flex-1 py-3 bg-[#09391C] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loadingStates.submitting
                      ? "Submitting..."
                      : "Continue to Inspection"}
                  </button>
                  <button
                    onClick={() => {
                      setShowRequestChangesModal(false);
                      setChangeRequest("");
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
    </div>
  );
};

export default LOINegotiationStep;
