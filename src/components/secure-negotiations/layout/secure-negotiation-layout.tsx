"use client";

import React from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import {
  FiShield,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

interface SecureNegotiationLayoutProps {
  children: React.ReactNode;
  userType: "seller" | "buyer";
}

const SecureNegotiationLayout: React.FC<SecureNegotiationLayoutProps> = ({
  children,
  userType,
}) => {
  const { state } = useSecureNegotiation();
  const { details, createdAt, inspectionStatus, isRealTimeEnabled } = state;

  const getStatusColor = () => {
    switch (inspectionStatus) {
      case "accept":
        return "text-green-600 bg-green-50 border-green-200";
      case "reject":
        return "text-red-600 bg-red-50 border-red-200";
      case "countered":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "pending":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (inspectionStatus) {
      case "accept":
        return <FiCheckCircle className="w-4 h-4" />;
      case "reject":
        return <FiAlertCircle className="w-4 h-4" />;
      case "countered":
        return <FiClock className="w-4 h-4" />;
      case "pending":
        return <FiClock className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Security Banner */}
      <div className="bg-green-600 text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <FiShield className="w-4 h-4" />
            <span>Secure Negotiation Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FiUser className="w-4 h-4" />
              <span className="capitalize">{userType}</span>
            </div>
            {isRealTimeEnabled && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Info Bar */}
      {details && (
        <div className="bg-white border-b border-gray-200 py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {details.propertyTitle || "Property Negotiation"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {details.propertyLocation || "Location not specified"}
                  </p>
                </div>
                {details.propertyPrice && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Listed Price</p>
                    <p className="font-semibold text-green-600">
                      ₦{details.propertyPrice.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {inspectionStatus && (
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm ${getStatusColor()}`}
                  >
                    {getStatusIcon()}
                    <span className="capitalize">{inspectionStatus}</span>
                  </div>
                )}
                {createdAt && (
                  <div className="text-sm text-gray-500">
                    <p>Started</p>
                    <p>{new Date(createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">{children}</div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>Secure negotiations powered by Khabiteq</p>
          <p className="mt-1">
            All communications are encrypted and logged for security purposes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SecureNegotiationLayout;
