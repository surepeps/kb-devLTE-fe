"use client";

import React, { useEffect } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/loading-component/loading";
import SecureNegotiationLayout from "../layout/secure-negotiation-layout";
import EnhancedNormalNegotiationPage from "../pages/enhanced-normal-negotiation-page";
import EnhancedLOINegotiationPage from "../pages/enhanced-loi-negotiation-page";
import EnhancedInspectionDateConfirmation from "../pages/enhanced-inspection-date-confirmation";
import EnhancedNegotiationSummary from "../pages/enhanced-negotiation-summary";
import EnhancedNegotiationCancelledSummary from "../pages/enhanced-negotiation-cancelled-summary";
import ActivityFeed from "../interactive/activity-feed";
import { FiActivity, FiBell, FiMessageSquare } from "react-icons/fi";

interface SecureBuyerResponseIndexProps {
  userId: string;
  inspectionId: string;
}

const SecureBuyerResponseIndex: React.FC<SecureBuyerResponseIndexProps> = ({
  userId,
  inspectionId,
}) => {
  const {
    state,
    fetchNegotiationDetails,
    goToNextPage,
    setInspectionStatus,
    toggleActivityFeed,
    markActivitiesAsRead,
    enableRealTime,
    addActivity,
  } = useSecureNegotiation();

  const {
    formStatus,
    details,
    negotiationType,
    contentTracker,
    showActivityFeed,
    unreadActivities,
    isRealTimeEnabled,
  } = state;

  useEffect(() => {
    if (userId && inspectionId) {
      fetchNegotiationDetails(userId, inspectionId, "buyer");
      enableRealTime();

      // Add initial activity
      addActivity({
        type: "message_sent",
        message: "Buyer accessed the negotiation page",
        userId,
        userType: "buyer",
      });
    }
  }, [
    userId,
    inspectionId,
    fetchNegotiationDetails,
    enableRealTime,
    addActivity,
  ]);

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
        goToNextPage("Cancelled");
      } else if (negotiationStatus === "completed") {
        goToNextPage("Summary");
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

    switch (contentTracker) {
      case "Negotiation":
        if (negotiationType === "LOI") {
          return (
            <EnhancedLOINegotiationPage
              letterOfIntention={details.letterOfIntention}
              userType="buyer"
            />
          );
        }
        return (
          <EnhancedNormalNegotiationPage
            currentAmount={details.currentAmount}
            buyOffer={details.buyOffer}
            userType="buyer"
          />
        );

      case "Confirm Inspection Date":
        return <EnhancedInspectionDateConfirmation userType="buyer" />;

      case "Summary":
        return <EnhancedNegotiationSummary userType="buyer" />;

      case "Cancelled":
        return <EnhancedNegotiationCancelledSummary userType="buyer" />;

      default:
        return null;
    }
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
      <div className="relative">
        {/* Interactive Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Buyer Response Portal
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Secure negotiation for User: {userId.substring(0, 8)}***
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Real-time indicator */}
              {isRealTimeEnabled && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live</span>
                </div>
              )}

              {/* Activity feed toggle */}
              <button
                onClick={() => {
                  toggleActivityFeed();
                  if (unreadActivities > 0) {
                    markActivitiesAsRead();
                  }
                }}
                className="relative p-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
              >
                <FiActivity className="w-5 h-5" />
                {unreadActivities > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadActivities > 9 ? "9+" : unreadActivities}
                  </span>
                )}
              </button>

              {/* Notifications bell */}
              <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
                <FiBell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Main content */}
          <div
            className={`flex-1 transition-all duration-300 ${showActivityFeed ? "mr-80" : ""}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={contentTracker}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Activity Feed Sidebar */}
          <AnimatePresence>
            {showActivityFeed && (
              <motion.div
                initial={{ opacity: 0, x: 320 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 320 }}
                transition={{ duration: 0.3 }}
                className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50"
              >
                <ActivityFeed />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SecureNegotiationLayout>
  );
};

export default SecureBuyerResponseIndex;
