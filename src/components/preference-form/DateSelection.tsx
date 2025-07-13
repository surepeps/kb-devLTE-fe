/** @format */

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { usePreferenceForm } from "@/context/preference-form-context";

interface DateSelectionProps {
  className?: string;
}

const DateSelection: React.FC<DateSelectionProps> = ({ className = "" }) => {
  const { state, updateFormData, getValidationErrorsForField } =
    usePreferenceForm();

  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  // Get validation errors
  const checkInErrors = getValidationErrorsForField(
    "bookingDetails.checkInDate",
  );
  const checkOutErrors = getValidationErrorsForField(
    "bookingDetails.checkOutDate",
  );

  // Initialize from context data
  useEffect(() => {
    const formData = state.formData as any;
    if (formData.bookingDetails) {
      setCheckInDate(formData.bookingDetails.checkInDate || "");
      setCheckOutDate(formData.bookingDetails.checkOutDate || "");
    }
  }, [state.formData]);

  // Calculate number of nights
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDifference = checkOut.getTime() - checkIn.getTime();
      const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setNumberOfNights(dayDifference > 0 ? dayDifference : 0);
    } else {
      setNumberOfNights(0);
    }
  }, [checkInDate, checkOutDate]);

  // Update context when values change
  useEffect(() => {
    const currentBookingDetails = (state.formData as any).bookingDetails || {};

    updateFormData({
      bookingDetails: {
        ...currentBookingDetails,
        checkInDate,
        checkOutDate,
      },
    });
  }, [checkInDate, checkOutDate]);

  // Get minimum date (today)
  const getMinDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  // Get minimum check-out date (day after check-in)
  const getMinCheckOutDate = useCallback(() => {
    if (!checkInDate) return getMinDate();

    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split("T")[0];
  }, [checkInDate, getMinDate]);

  // Handle check-in date change
  const handleCheckInChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCheckInDate = e.target.value;
      setCheckInDate(newCheckInDate);

      // Auto-adjust check-out date if it's before new check-in date
      if (
        checkOutDate &&
        newCheckInDate &&
        new Date(checkOutDate) <= new Date(newCheckInDate)
      ) {
        const nextDay = new Date(newCheckInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(nextDay.toISOString().split("T")[0]);
      }
    },
    [checkOutDate],
  );

  // Handle check-out date change
  const handleCheckOutChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCheckOutDate(e.target.value);
    },
    [],
  );

  // Quick selection options
  const quickSelections = [
    { label: "1 Night", nights: 1 },
    { label: "2 Nights", nights: 2 },
    { label: "3 Nights", nights: 3 },
    { label: "1 Week", nights: 7 },
    { label: "2 Weeks", nights: 14 },
    { label: "1 Month", nights: 30 },
  ];

  // Handle quick selection
  const handleQuickSelection = useCallback(
    (nights: number) => {
      if (!checkInDate) {
        // Set check-in to today if not set
        const today = new Date();
        const todayString = today.toISOString().split("T")[0];
        setCheckInDate(todayString);

        // Set check-out based on nights
        const checkOut = new Date(today);
        checkOut.setDate(checkOut.getDate() + nights);
        setCheckOutDate(checkOut.toISOString().split("T")[0]);
      } else {
        // Set check-out based on existing check-in
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + nights);
        setCheckOutDate(checkOut.toISOString().split("T")[0]);
      }
    },
    [checkInDate],
  );

  // Format date for display
  const formatDisplayDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Check if dates are valid
  const areDatesValid =
    checkInDate &&
    checkOutDate &&
    new Date(checkOutDate) > new Date(checkInDate);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Your Dates
        </h3>
        <p className="text-sm text-gray-600">
          Choose your check-in and check-out dates
        </p>
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Check-in Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={checkInDate}
              onChange={handleCheckInChange}
              min={getMinDate()}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all duration-200 ${
                checkInErrors.length > 0
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : checkInDate
                    ? "border-emerald-500 focus:border-emerald-500"
                    : "border-gray-200 focus:border-emerald-500"
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          {checkInErrors.length > 0 && (
            <p className="text-sm text-red-500 font-medium">
              {checkInErrors[0].message}
            </p>
          )}
          {checkInDate && (
            <p className="text-sm text-emerald-600">
              {formatDisplayDate(checkInDate)}
            </p>
          )}
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Check-out Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={checkOutDate}
              onChange={handleCheckOutChange}
              min={getMinCheckOutDate()}
              disabled={!checkInDate}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all duration-200 ${
                checkOutErrors.length > 0
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : checkOutDate
                    ? "border-emerald-500 focus:border-emerald-500"
                    : "border-gray-200 focus:border-emerald-500"
              } ${!checkInDate ? "bg-gray-50 cursor-not-allowed" : ""}`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          {checkOutErrors.length > 0 && (
            <p className="text-sm text-red-500 font-medium">
              {checkOutErrors[0].message}
            </p>
          )}
          {checkOutDate && (
            <p className="text-sm text-emerald-600">
              {formatDisplayDate(checkOutDate)}
            </p>
          )}
        </div>
      </div>

      {/* Quick Selection Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-800">Quick Selection</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickSelections.map((option) => (
            <motion.button
              key={option.nights}
              type="button"
              onClick={() => handleQuickSelection(option.nights)}
              className="px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Date Summary */}
      {areDatesValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
        >
          <h4 className="text-sm font-semibold text-emerald-800 mb-2">
            Booking Summary
          </h4>
          <div className="space-y-1 text-sm text-emerald-700">
            <p>
              <span className="font-medium">Check-in:</span>{" "}
              {formatDisplayDate(checkInDate)}
            </p>
            <p>
              <span className="font-medium">Check-out:</span>{" "}
              {formatDisplayDate(checkOutDate)}
            </p>
            <p>
              <span className="font-medium">Duration:</span> {numberOfNights}{" "}
              night{numberOfNights !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>
      )}

      {/* Booking Guidelines */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Booking Guidelines
        </h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p>• Minimum stay: 1 night</p>
          <p>• Check-in time: Usually after 2:00 PM</p>
          <p>• Check-out time: Usually before 11:00 AM</p>
          <p>• Exact times will be confirmed with the property owner</p>
        </div>
      </div>
    </div>
  );
};

export default DateSelection;
