"use client";

import React, { useState } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiEdit3,
  FiUser,
  FiPhone,
  FiMail,
} from "react-icons/fi";

interface InspectionDateTimeStepProps {
  userType: "seller" | "buyer";
  onStepComplete: () => void;
}

const InspectionDateTimeStep: React.FC<InspectionDateTimeStepProps> = ({
  userType,
  onStepComplete,
}) => {
  const { state, updateInspectionDateTime } = useSecureNegotiation();

  const { details, loadingStates, inspectionId } = state;
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const currentDate = details?.inspectionDate || "";
  const currentTime = details?.inspectionTime || "";
  const propertyAddress = details?.propertyId?.location
    ? `${details.propertyId.location.area}, ${details.propertyId.location.localGovernment}, ${details.propertyId.location.state}`
    : "Property address not specified";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not specified";
    return timeString;
  };

  const handleConfirmDateTime = async () => {
    try {
      // If no changes needed, just confirm the existing date/time
      await updateInspectionDateTime(
        inspectionId!,
        currentDate,
        currentTime,
        userType,
      );
      onStepComplete();
    } catch (error) {
      console.error("Failed to confirm inspection date/time:", error);
    }
  };

  const handleUpdateDateTime = async () => {
    if (!newDate || !newTime) {
      alert("Please select both date and time");
      return;
    }

    try {
      await updateInspectionDateTime(inspectionId!, newDate, newTime, userType);
      setShowUpdateForm(false);
      setNewDate("");
      setNewTime("");
      onStepComplete();
    } catch (error) {
      console.error("Failed to update inspection date/time:", error);
    }
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Inspection Schedule
        </h2>
        <p className="text-gray-600">
          Review and confirm the inspection date and time
        </p>
      </div>

      {/* Current Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiCalendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Current Inspection Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FiCalendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Date</span>
                </div>
                <p className="text-blue-700 text-lg">
                  {formatDate(currentDate)}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FiClock className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Time</span>
                </div>
                <p className="text-green-700 text-lg">
                  {formatTime(currentTime)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FiMapPin className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">
                  Property Location
                </span>
              </div>
              <p className="text-purple-700">{propertyAddress}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Choose Your Action
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confirm Current Schedule */}
            <button
              onClick={handleConfirmDateTime}
              disabled={loadingStates.submitting}
              className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiCheckCircle className="w-5 h-5" />
              <span>Confirm Schedule</span>
            </button>

            {/* Update Schedule */}
            <button
              onClick={() => setShowUpdateForm(true)}
              disabled={loadingStates.submitting}
              className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiEdit3 className="w-5 h-5" />
              <span>Update Schedule</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FiUser className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">
                  Contact Person
                </span>
              </div>
              <p className="text-gray-700">
                {userType === "seller"
                  ? details?.requestedBy?.fullName || "Buyer Name"
                  : details?.owner?.firstName +
                      " " +
                      details?.owner?.lastName || "Seller Name"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FiPhone className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">Phone</span>
              </div>
              <p className="text-gray-700">
                {userType === "seller"
                  ? details?.requestedBy?.phoneNumber ||
                    "Will be shared upon confirmation"
                  : details?.owner?.phoneNumber ||
                    "Will be shared upon confirmation"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FiMail className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">Email</span>
              </div>
              <p className="text-gray-700">
                {userType === "seller"
                  ? details?.requestedBy?.email ||
                    "Will be shared upon confirmation"
                  : details?.owner?.email || "Will be shared upon confirmation"}
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">
              Important Notes:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Please arrive 10 minutes before the scheduled time</li>
              <li>• Bring a valid ID for verification</li>
              <li>• Contact information will be exchanged upon confirmation</li>
              <li>• Inspection typically takes 30-45 minutes</li>
              <li>• Property owner or representative will be present</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Update Schedule Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Update Inspection Schedule
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={minDate}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateDateTime}
                    disabled={!newDate || !newTime || loadingStates.submitting}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loadingStates.submitting
                      ? "Updating..."
                      : "Update Schedule"}
                  </button>
                  <button
                    onClick={() => {
                      setShowUpdateForm(false);
                      setNewDate("");
                      setNewTime("");
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

export default InspectionDateTimeStep;
