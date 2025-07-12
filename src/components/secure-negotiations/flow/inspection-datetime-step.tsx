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
  FiChevronDown,
  FiAlertTriangle,
} from "react-icons/fi";
import StandardPreloader from "@/components/new-marketplace/StandardPreloader";

interface InspectionDateTimeStepProps {
  userType: "seller" | "buyer";
  negotiationAction?: {
    type: "accept" | "counter" | "requestChanges";
    counterPrice?: number;
    loiFile?: File;
    changeRequest?: string;
  } | null;
}

const InspectionDateTimeStep: React.FC<InspectionDateTimeStepProps> = ({
  userType,
  negotiationAction,
}) => {
  const {
    state,
    submitNegotiationAction,
    createAcceptPayload,
    createCounterPayload,
    createRequestChangesPayload,
    uploadFile,
  } = useSecureNegotiation();

  const { details, loadingStates, inspectionId, inspectionType } = state;
  const [newDate, setNewDate] = useState(details?.inspectionDate || "");
  const [newTime, setNewTime] = useState(details?.inspectionTime || "");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);

  // Check if inspection date has passed
  const inspectionDatePassed = useMemo(() => {
    if (!details?.inspectionDate) return false;
    const inspectionDate = new Date(details.inspectionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inspectionDate.setHours(0, 0, 0, 0);
    return inspectionDate < today;
  }, [details?.inspectionDate]);

  // Check if inspection date is today
  const inspectionDateIsToday = useMemo(() => {
    if (!details?.inspectionDate) return false;
    const inspectionDate = new Date(details.inspectionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inspectionDate.setHours(0, 0, 0, 0);
    return inspectionDate.getTime() === today.getTime();
  }, [details?.inspectionDate]);

  // Check if inspection date and time has completely passed
  const inspectionDateTimePassed = useMemo(() => {
    if (!details?.inspectionDate || !details?.inspectionTime) return false;

    const inspectionDate = new Date(details.inspectionDate);
    const now = new Date();

    // Parse time and set it on the inspection date
    const timeParts = details.inspectionTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeParts) {
      let hours = parseInt(timeParts[1]);
      const minutes = parseInt(timeParts[2]);
      const ampm = timeParts[3].toUpperCase();

      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      inspectionDate.setHours(hours, minutes, 0, 0);
    }

    return inspectionDate < now;
  }, [details?.inspectionDate, details?.inspectionTime]);

  // Define time object interface
  interface TimeObj {
    value: string;
    display: string;
    isPassed?: boolean;
  }

  // Generate available times (8 AM to 6 PM, hourly only)
  const availableTimes = useMemo(() => {
    const times: TimeObj[] = [];
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

  // Helper function to get valid dates (excluding Sundays)
  const getValidDatesFromDate = (
    startDate: Date,
    count: number,
    direction: "forward" | "backward" = "forward",
  ) => {
    const dates = [];
    const currentDate = new Date(startDate);

    if (direction === "backward") {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (dates.length < count) {
      // Skip Sundays (0 = Sunday)
      if (currentDate.getDay() !== 0) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDateCopy = new Date(currentDate);
        currentDateCopy.setHours(0, 0, 0, 0);
        const isPassed = currentDateCopy < today;

        dates.push({
          date: dateStr,
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
          isPassed,
        });
      }

      if (direction === "backward") {
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return direction === "backward" ? dates.reverse() : dates;
  };

  // Generate available dates with the specified logic - always generate 15 total dates
  const availableDates = useMemo(() => {
    const today = new Date();

    if (!details?.inspectionDate) {
      // No inspection date, start from today and show next 15 days
      return getValidDatesFromDate(today, 15, "forward");
    }

    const inspectionDate = new Date(details.inspectionDate);

    if (inspectionDateIsToday) {
      // Case 1: Inspection date is today (not expired)
      // Start the list from today, and show 15 days total
      return getValidDatesFromDate(today, 15, "forward");
    } else if (!inspectionDatePassed) {
      // Case 2: Inspection date is not today, but still valid (not expired)
      // Show up to 14 valid days before the inspection date, ending with the inspection date
      const datesBeforeInspection = getValidDatesFromDate(
        inspectionDate,
        14,
        "backward",
      );
      const inspectionDateObj = {
        date: inspectionDate.toISOString().split("T")[0],
        displayDate: inspectionDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        fullDate: inspectionDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        isPassed: false,
      };

      return [...datesBeforeInspection, inspectionDateObj];
    } else {
      // Case 3: Inspection date is already expired
      // Do not include it. Start from today and list the next 15 valid upcoming days
      return getValidDatesFromDate(today, 15, "forward");
    }
  }, [details?.inspectionDate, inspectionDatePassed, inspectionDateIsToday]);

  // Filter times based on selected date and current time
  const getAvailableTimesForDate = useMemo(() => {
    return (selectedDate: string) => {
      if (!selectedDate) return availableTimes;

      const selected = new Date(selectedDate);
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);

      // If selected date is today, filter out passed times
      if (selected.getTime() === today.getTime()) {
        const currentHour = now.getHours();
        return availableTimes.map((timeObj) => {
          const timeParts = timeObj.value.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeParts) {
            let hours = parseInt(timeParts[1]);
            const ampm = timeParts[3].toUpperCase();

            if (ampm === "PM" && hours !== 12) hours += 12;
            if (ampm === "AM" && hours === 12) hours = 0;

            return {
              ...timeObj,
              isPassed: hours <= currentHour,
            };
          }
          return timeObj;
        });
      }

      return availableTimes.map((timeObj) => ({ ...timeObj, isPassed: false }));
    };
  }, [availableTimes]);

  // Initialize date and time with defaults - ensure auto-population on mount and navigation
  useEffect(() => {
    // Only initialize if we have available options
    if (validDates.length === 0 || availableTimes.length === 0) {
      return;
    }

    // Set initial date - prioritize inspection date if valid, otherwise first available
    if (details?.inspectionDate && !inspectionDatePassed) {
      const inspectionDateFormatted = new Date(details.inspectionDate)
        .toISOString()
        .split("T")[0];

      // Check if the inspection date exists in our valid dates (non-passed)
      const dateExists = validDates.some(
        (d) => d.date === inspectionDateFormatted,
      );
      if (dateExists && newDate !== inspectionDateFormatted) {
        setNewDate(inspectionDateFormatted);
      } else if (!dateExists && !newDate) {
        // If inspection date is not in valid dates, use first valid available
        setNewDate(validDates[0]?.date || "");
      }
    } else if (!newDate) {
      // No valid inspection date from details, use first valid available
      setNewDate(validDates[0]?.date || "");
    }

    // Set initial time from details or first available
    if (details?.inspectionTime) {
      if (newTime !== details.inspectionTime) {
        setNewTime(details.inspectionTime);
      }
    } else if (!newTime) {
      // No inspection time from details, use first available
      setNewTime(availableTimes[0]?.value || "");
    }
  }, [
    validDates,
    availableTimes,
    details?.inspectionDate,
    details?.inspectionTime,
    newDate,
    newTime,
    inspectionDatePassed,
  ]);

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

  // Filter out passed dates and display logic: show 10 by default, 5 more (total 15) with "view more"
  const validDates = useMemo(() => {
    return availableDates.filter((dateObj) => !dateObj.isPassed);
  }, [availableDates]);

  const displayedDates = useMemo(() => {
    return showAllDays ? validDates.slice(0, 15) : validDates.slice(0, 10);
  }, [validDates, showAllDays]);

  const currentDate = useMemo(() => {
    if (details?.inspectionDate && !inspectionDatePassed) {
      // Convert to our date format
      const formatted = new Date(details.inspectionDate)
        .toISOString()
        .split("T")[0];
      // Check if it's in our valid dates (non-passed), otherwise use newDate or first valid available
      const dateExists = validDates.some((d) => d.date === formatted);
      return dateExists ? formatted : newDate || validDates[0]?.date || "";
    }
    return newDate || validDates[0]?.date || "";
  }, [details?.inspectionDate, newDate, validDates, inspectionDatePassed]);

  const currentTime = useMemo(() => {
    return details?.inspectionTime || newTime || availableTimes[0]?.value || "";
  }, [details?.inspectionTime, newTime, availableTimes]);
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
      const dateTimeCountered: boolean = !!(isDateChanged || isTimeChanged);

      const finalDate = newDate || currentDate;
      const finalTime = newTime || currentTime;

      if (negotiationAction) {
        // Submit final negotiation action with inspection date/time
        if (negotiationAction.type === "accept") {
          let documentUrl: string | undefined;

          // Handle LOI file upload if present
          if (negotiationAction.loiFile && inspectionType === "LOI") {
            documentUrl = await uploadFile(negotiationAction.loiFile);
          }

          const payload =
            inspectionType === "LOI" && documentUrl
              ? createCounterPayload(
                  "LOI",
                  undefined, // counterPrice not needed for LOI
                  documentUrl,
                  isDateChanged ? finalDate : undefined,
                  isTimeChanged ? finalTime : undefined,
                )
              : createAcceptPayload(
                  inspectionType!,
                  isDateChanged ? finalDate : undefined,
                  isTimeChanged ? finalTime : undefined,
                );
          await submitNegotiationAction(inspectionId!, userType, payload);
        } else if (
          negotiationAction.type === "counter" &&
          negotiationAction.counterPrice
        ) {
          const payload = createCounterPayload(
            inspectionType!,
            negotiationAction.counterPrice,
            undefined, // documentUrl not needed for price counter
            isDateChanged ? finalDate : undefined,
            isTimeChanged ? finalTime : undefined,
          );
          await submitNegotiationAction(inspectionId!, userType, payload);
        } else if (
          negotiationAction.type === "requestChanges" &&
          negotiationAction.changeRequest
        ) {
          const payload = createRequestChangesPayload(
            negotiationAction.changeRequest,
            isDateChanged ? finalDate : undefined,
            isTimeChanged ? finalTime : undefined,
          );
          await submitNegotiationAction(inspectionId!, userType, payload);
        }
      } else {
        // Just update the inspection date/time - create an accept payload with only date/time changes
        const payload = createAcceptPayload(
          inspectionType!,
          isDateChanged ? finalDate : undefined,
          isTimeChanged ? finalTime : undefined,
        );
        await submitNegotiationAction(inspectionId!, userType, payload);
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
          let documentUrl: string | undefined;

          // Handle LOI file upload if present
          if (negotiationAction.loiFile && inspectionType === "LOI") {
            documentUrl = await uploadFile(negotiationAction.loiFile);
          }

          const payload =
            inspectionType === "LOI" && documentUrl
              ? createCounterPayload(
                  "LOI",
                  undefined, // counterPrice not needed for LOI
                  documentUrl,
                  newDate,
                  newTime,
                )
              : createAcceptPayload(inspectionType!, newDate, newTime);
          await submitNegotiationAction(inspectionId!, userType, payload);
        } else if (
          negotiationAction.type === "counter" &&
          negotiationAction.counterPrice
        ) {
          const payload = createCounterPayload(
            inspectionType!,
            negotiationAction.counterPrice,
            undefined, // documentUrl not needed for price counter
            newDate,
            newTime,
          );
          await submitNegotiationAction(inspectionId!, userType, payload);
        } else if (
          negotiationAction.type === "requestChanges" &&
          negotiationAction.changeRequest
        ) {
          const payload = createRequestChangesPayload(
            negotiationAction.changeRequest,
            newDate,
            newTime,
          );
          await submitNegotiationAction(inspectionId!, userType, payload);
        }
      } else {
        // Just update the inspection date/time
        const payload = createAcceptPayload(inspectionType!, newDate, newTime);
        await submitNegotiationAction(inspectionId!, userType, payload);
      }

      setShowUpdateForm(false);
      // Don't reset date and time - keep them for next time modal is opened
    } catch (error) {
      console.error("Failed to update inspection date/time:", error);
    }
  };

  const openUpdateModal = () => {
    // Auto-select current inspection details when opening modal
    // If inspection date is valid and exists in valid dates, use it; otherwise use first valid available
    let dateToSelect = validDates[0]?.date || "";

    if (details?.inspectionDate && !inspectionDatePassed) {
      const inspectionDateFormatted = new Date(details.inspectionDate)
        .toISOString()
        .split("T")[0];
      const dateExists = validDates.some(
        (d) => d.date === inspectionDateFormatted,
      );
      if (dateExists) {
        dateToSelect = inspectionDateFormatted;
      }
    }

    const timeToSelect = currentTime || availableTimes[0]?.value || "";

    // Set the modal state to appropriate values
    setNewDate(dateToSelect);
    setNewTime(timeToSelect);
    setShowUpdateForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      <StandardPreloader
        isVisible={
          loadingStates.submitting ||
          loadingStates.accepting ||
          loadingStates.countering
        }
        message={
          loadingStates.accepting
            ? "Accepting offer with inspection schedule..."
            : loadingStates.countering
              ? "Submitting counter offer with inspection schedule..."
              : loadingStates.submitting
                ? "Updating inspection schedule..."
                : "Processing..."
        }
        overlay={true}
      />

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#09391C] mb-2">
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
        {negotiationAction?.type === "requestChanges" &&
          negotiationAction.changeRequest && (
            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-medium">
                Requested Changes: {negotiationAction.changeRequest}
              </p>
            </div>
          )}
        {negotiationAction?.loiFile && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">
              Updated LOI: {negotiationAction.loiFile.name}
            </p>
          </div>
        )}
      </div>

      {/* Date/Time Status Warning */}
      {(inspectionDatePassed || inspectionDateTimePassed) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <FiAlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-medium">
                {inspectionDateTimePassed
                  ? "Inspection Date & Time Has Expired"
                  : "Inspection Date Has Passed"}
              </p>
              <p className="text-red-700 text-sm">
                {inspectionDateTimePassed
                  ? "The scheduled inspection date and time has already passed. Please select a new date and time."
                  : "The scheduled inspection date has passed. Please update the schedule."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
              <div
                className={`p-4 rounded-lg ${inspectionDatePassed ? "bg-red-50" : "bg-blue-50"}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FiCalendar
                    className={`w-5 h-5 ${inspectionDatePassed ? "text-red-600" : "text-blue-600"}`}
                  />
                  <span
                    className={`font-medium ${inspectionDatePassed ? "text-red-800" : "text-blue-800"}`}
                  >
                    Date
                  </span>
                </div>
                <p
                  className={`text-lg ${inspectionDatePassed ? "text-red-700" : "text-blue-700"}`}
                >
                  {formatDate(currentDate)}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${inspectionDateTimePassed ? "bg-red-50" : "bg-green-50"}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FiClock
                    className={`w-5 h-5 ${inspectionDateTimePassed ? "text-red-600" : "text-green-600"}`}
                  />
                  <span
                    className={`font-medium ${inspectionDateTimePassed ? "text-red-800" : "text-green-800"}`}
                  >
                    Time
                  </span>
                </div>
                <p
                  className={`text-lg ${inspectionDateTimePassed ? "text-red-700" : "text-green-700"}`}
                >
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
                loadingStates.countering ||
                inspectionDateTimePassed
              }
              className="flex items-center justify-center space-x-2 p-4 bg-[#09391C] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiCheckCircle className="w-5 h-5" />
              <span>
                {negotiationAction
                  ? `${negotiationAction.type === "accept" ? "Accept" : negotiationAction.type === "counter" ? "Counter" : "Request Changes"} & Confirm`
                  : "Confirm Schedule"}
              </span>
            </button>

            {/* Update Schedule */}
            <button
              onClick={openUpdateModal}
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

              {/* Status warning in modal */}
              {(inspectionDatePassed || inspectionDateTimePassed) && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiAlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-red-800 text-sm font-medium">
                      {inspectionDateTimePassed
                        ? "Current inspection date and time has expired"
                        : "Current inspection date has passed"}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select New Date
                  </label>
                  {/* Show message if initial date has passed */}
                  {inspectionDatePassed && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FiAlertTriangle className="w-4 h-4 text-orange-600" />
                        <p className="text-orange-800 text-sm font-medium">
                          Initial inspection date has passed/expired. Please
                          select a new date from the available options below.
                        </p>
                      </div>
                    </div>
                  )}

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

                  {/* View More Button - Show 5 more dates */}
                  {!showAllDays && validDates.length > 10 && (
                    <button
                      onClick={() => setShowAllDays(true)}
                      className="mt-3 flex items-center space-x-2 text-[#09391C] hover:text-green-700 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">
                        View More Dates ({Math.min(5, validDates.length - 10)}{" "}
                        more)
                      </span>
                      <FiChevronDown className="w-4 h-4" />
                    </button>
                  )}

                  {/* Show Less Button */}
                  {showAllDays && validDates.length > 10 && (
                    <button
                      onClick={() => setShowAllDays(false)}
                      className="mt-3 flex items-center space-x-2 text-[#09391C] hover:text-green-700 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">Show Less</span>
                      <FiChevronDown className="w-4 h-4 transform rotate-180" />
                    </button>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select New Time
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {getAvailableTimesForDate(newDate).map((timeObj) => (
                      <button
                        key={timeObj.value}
                        onClick={() => setNewTime(timeObj.value)}
                        disabled={timeObj.isPassed}
                        className={`p-2 text-center rounded-lg border transition-colors duration-200 ${
                          timeObj.isPassed
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : newTime === timeObj.value
                              ? "border-[#09391C] bg-green-50 text-[#09391C]"
                              : "border-[#C7CAD0] hover:border-[#09391C] hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {timeObj.display}
                        </div>
                        {timeObj.isPassed && (
                          <div className="text-xs text-red-500">Passed</div>
                        )}
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
                        ? `${negotiationAction.type === "accept" ? "Accept" : negotiationAction.type === "counter" ? "Counter" : "Request Changes"} & Update`
                        : "Update Schedule"}
                  </button>
                  <button
                    onClick={() => {
                      setShowUpdateForm(false);
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
