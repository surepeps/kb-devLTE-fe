"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  FiChevronDown,
} from "react-icons/fi";

interface InspectionDateTimeStepProps {
  userType: "seller" | "buyer";
  negotiationAction?: {
    type: "accept" | "counter";
    counterPrice?: number;
  } | null;
}

const InspectionDateTimeStep: React.FC<InspectionDateTimeStepProps> = ({
  userType,
  negotiationAction,
}) => {
  const { state, acceptOffer, submitCounterOffer, updateInspectionDateTime } =
    useSecureNegotiation();

  const { details, loadingStates, inspectionId } = state;
  const [newDate, setNewDate] = useState(details?.inspectionDate || "");
  const [newTime, setNewTime] = useState(details?.inspectionTime || "");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showUpdateForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showUpdateForm]);

  // Generate available dates (next 15 days excluding Sundays)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + 1); // Start from tomorrow

    while (dates.length < 15) {
      // Skip Sundays (0 = Sunday)
      if (currentDate.getDay() !== 0) {
        dates.push({
          date: currentDate.toISOString().split("T")[0],
          displayDate: currentDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          fullDate: currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }, []);

  // Generate available times (8 AM to 6 PM, hourly only)
  const availableTimes = useMemo(() => {
    const times = [];
    for (let hour = 8; hour <= 18; hour++) {
      const time12 =
        hour <= 12
          ? `${hour}:00 ${hour === 12 ? "PM" : "AM"}`
          : `${hour - 12}:00 PM`;

      times.push({
        value: time12,
        display: time12,
      });
    }
    return times;
  }, []);

  const displayedDates = showAllDays
    ? availableDates
    : availableDates.slice(0, 10);

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
      // Detect if date or time was changed
      const isDateChanged = newDate && newDate !== currentDate;
      const isTimeChanged = newTime && newTime !== currentTime;
      const dateTimeCountered = isDateChanged || isTimeChanged;

      const finalDate = newDate || currentDate;
      const finalTime = newTime || currentTime;

      if (negotiationAction) {
        // Submit final negotiation action with inspection date/time and change detection
        if (negotiationAction.type === "accept") {
          await acceptOffer(
            inspectionId!,
            userType,
            finalDate,
            finalTime,
            dateTimeCountered,
          );
        } else if (
          negotiationAction.type === "counter" &&
          negotiationAction.counterPrice
        ) {
          await submitCounterOffer(
            inspectionId!,
            negotiationAction.counterPrice,
            userType,
            finalDate,
            finalTime,
            dateTimeCountered,
          );
        }
      } else {
        // Just update the inspection date/time
        await updateInspectionDateTime(
          inspectionId!,
          finalDate,
          finalTime,
          userType,
          dateTimeCountered,
        );
      }
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
      // Always true when updating since user explicitly changed values
      const dateTimeCountered = true;

      if (negotiationAction) {
        // Submit final negotiation action with new inspection date/time
        if (negotiationAction.type === "accept") {
          await acceptOffer(
            inspectionId!,
            userType,
            newDate,
            newTime,
            dateTimeCountered,
          );
        } else if (
          negotiationAction.type === "counter" &&
          negotiationAction.counterPrice
        ) {
          await submitCounterOffer(
            inspectionId!,
            negotiationAction.counterPrice,
            userType,
            newDate,
            newTime,
            dateTimeCountered,
          );
        }
      } else {
        // Just update the inspection date/time
        await updateInspectionDateTime(
          inspectionId!,
          newDate,
          newTime,
          userType,
          dateTimeCountered,
        );
      }

      setShowUpdateForm(false);
      setNewDate("");
      setNewTime("");
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
          {negotiationAction
            ? `You've chosen to ${negotiationAction.type} the offer. Now confirm the inspection date and time.`
            : "Review and confirm the inspection date and time"}
        </p>
        {negotiationAction?.type === "counter" &&
          negotiationAction.counterPrice && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                Counter Offer: ₦
                {negotiationAction.counterPrice.toLocaleString()}
              </p>
            </div>
          )}
      </div>

      {/* Current Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#C7CAD0]"
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
        className="bg-white rounded-xl border border-[#C7CAD0]"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {negotiationAction ? "Submit Your Response" : "Choose Your Action"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confirm Current Schedule */}
            <button
              onClick={handleConfirmDateTime}
              disabled={
                loadingStates.submitting ||
                loadingStates.accepting ||
                loadingStates.countering
              }
              className="flex items-center justify-center space-x-2 p-4 bg-[#09391C] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiCheckCircle className="w-5 h-5" />
              <span>
                {negotiationAction
                  ? `${negotiationAction.type === "accept" ? "Accept" : "Counter"} & Confirm`
                  : "Confirm Schedule"}
              </span>
            </button>

            {/* Update Schedule */}
            <button
              onClick={() => setShowUpdateForm(true)}
              disabled={
                loadingStates.submitting ||
                loadingStates.accepting ||
                loadingStates.countering
              }
              className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiEdit3 className="w-5 h-5" />
              <span>Update Schedule</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Update Schedule Modal */}
      {showUpdateForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: "hidden",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#C7CAD0]"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#09391C] mb-6">
                Update Inspection Schedule
              </h3>

              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select New Date
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {displayedDates.map((dateObj) => (
                      <button
                        key={dateObj.date}
                        onClick={() => setNewDate(dateObj.date)}
                        className={`p-3 text-left rounded-lg border transition-colors duration-200 ${
                          newDate === dateObj.date
                            ? "border-[#09391C] bg-green-50 text-[#09391C]"
                            : "border-[#C7CAD0] hover:border-[#09391C] hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{dateObj.displayDate}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dateObj.fullDate}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* View More Button */}
                  {!showAllDays && availableDates.length > 10 && (
                    <button
                      onClick={() => setShowAllDays(true)}
                      className="mt-3 flex items-center space-x-2 text-[#09391C] hover:text-green-700 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">
                        View More Dates
                      </span>
                      <FiChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select New Time
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {availableTimes.map((timeObj) => (
                      <button
                        key={timeObj.value}
                        onClick={() => setNewTime(timeObj.value)}
                        className={`p-2 text-center rounded-lg border transition-colors duration-200 ${
                          newTime === timeObj.value
                            ? "border-[#09391C] bg-green-50 text-[#09391C]"
                            : "border-[#C7CAD0] hover:border-[#09391C] hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {timeObj.display}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Summary */}
                {newDate && newTime && (
                  <div className="p-4 bg-[#EEF1F1] rounded-lg border border-[#C7CAD0]">
                    <h4 className="font-medium text-[#09391C] mb-2">
                      Selected Schedule:
                    </h4>
                    <div className="text-sm text-gray-700">
                      <div>
                        Date:{" "}
                        {
                          availableDates.find((d) => d.date === newDate)
                            ?.fullDate
                        }
                      </div>
                      <div>Time: {newTime}</div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateDateTime}
                    disabled={
                      !newDate ||
                      !newTime ||
                      loadingStates.submitting ||
                      loadingStates.accepting ||
                      loadingStates.countering
                    }
                    className="flex-1 py-3 bg-[#09391C] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loadingStates.submitting ||
                    loadingStates.accepting ||
                    loadingStates.countering
                      ? "Submitting..."
                      : negotiationAction
                        ? `${negotiationAction.type === "accept" ? "Accept" : "Counter"} & Update`
                        : "Update Schedule"}
                  </button>
                  <button
                    onClick={() => {
                      setShowUpdateForm(false);
                      setNewDate("");
                      setNewTime("");
                      setShowAllDays(false);
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
