"use client";

import React, { useEffect } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/loading-component/loading";
import SecureNegotiationLayout from "../layout/secure-negotiation-layout";
import TwoStepNegotiationFlow from "../flow/two-step-negotiation-flow";
import EnhancedLOINegotiationPage from "../pages/enhanced-loi-negotiation-page";
import EnhancedNegotiationSummary from "../pages/enhanced-negotiation-summary";
import EnhancedNegotiationCancelledSummary from "../pages/enhanced-negotiation-cancelled-summary";
import PropertyDetails from "../property/property-details";

interface SecureBuyerResponseIndexProps {
  userId: string;
  inspectionId: string;
}

const SecureBuyerResponseIndex: React.FC<SecureBuyerResponseIndexProps> = ({
  userId,
  inspectionId,
}) => {
  const { state, fetchNegotiationDetails, setInspectionStatus, goToNextPage } =
    useSecureNegotiation();

  const { formStatus, details, negotiationType } = state;

  useEffect(() => {
    if (userId && inspectionId) {
      fetchNegotiationDetails(userId, inspectionId, "buyer");
      // Removed auto-loading and real-time updates
    }
  }, [userId, inspectionId, fetchNegotiationDetails]);

  useEffect(() => {
    if (details && formStatus === "success") {
      const {
        negotiationStatus,
        buyOffer,
        letterOfIntention,
        inspectionDate,
        counterOffer,
      } = details;

      if (
        negotiationStatus === "negotiation_accepted" ||
        negotiationStatus === "pending_inspection"
      ) {
        setInspectionStatus("accept");
        goToNextPage("Confirm Inspection Date");
      } else if (negotiationStatus === "offer_rejected") {
        setInspectionStatus("reject");
        goToNextPage("Confirm Inspection Date");
      } else if (negotiationStatus === "negotiation_countered") {
        setInspectionStatus("countered");
        goToNextPage("Negotiation");
      } else if (negotiationStatus === "cancelled") {
        // Status will be handled by renderContent logic
      } else if (negotiationStatus === "completed") {
        // Status will be handled by renderContent logic
      } else if (negotiationStatus === "awaiting_seller_response") {
        goToNextPage("Negotiation");
      } else if (letterOfIntention && letterOfIntention !== "") {
        goToNextPage("Negotiation");
      } else if (buyOffer > 0 || counterOffer > 0) {
        goToNextPage("Negotiation");
      } else {
        goToNextPage("Negotiation");
      }
    }
  }, [details, formStatus, goToNextPage, setInspectionStatus]);

  const renderContent = () => {
    if (!details) return null;

    // Handle different statuses
    const status = details.status;

    if (status === "cancelled" || status === "rejected") {
      return <EnhancedNegotiationCancelledSummary userType="buyer" />;
    }

    if (status === "completed") {
      return <EnhancedNegotiationSummary userType="buyer" />;
    }

    // Handle LOI flow
    if (negotiationType === "LOI") {
      return (
        <EnhancedLOINegotiationPage
          letterOfIntention={details.letterOfIntention}
          userType="buyer"
        />
      );
    }

    // Handle two-step negotiation flow for normal properties
    return <TwoStepNegotiationFlow userType="buyer" />;
  };

  if (formStatus === "pending") {
    return <Loading />;
  }

  if (formStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Failed to Load
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to load negotiation details. Please check your connection and
            try again.
          </p>
          <button
            onClick={() =>
              fetchNegotiationDetails(userId, inspectionId, "buyer")
            }
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <SecureNegotiationLayout userType="buyer">
      <div className="space-y-8">
        {/* Property Details */}
        {details && <PropertyDetails propertyData={details} />}

        {/* Negotiation Content */}
        {renderContent()}
      </div>
    </SecureNegotiationLayout>
  );
};

export default SecureBuyerResponseIndex;
