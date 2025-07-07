/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import toast from "react-hot-toast";
import Button from "@/components/general-components/button";

interface DateTimeSelectionProps {
  selectedProperties: any[];
  inspectionFee: number;
  onProceed: () => void;
  onBack: () => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedProperties,
  inspectionFee,
  onProceed,
  onBack,
}) => {
  // Auto-select current date (or next available date if today is Sunday)
  const getInitialDate = () => {
    let date = new Date();
    date.setDate(date.getDate() + 3); // Start from 3 days from now

    // Skip Sundays
    while (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    }

    return format(date, "MMM d, yyyy");
  };

  // Auto-select next available hour
  const getInitialTime = () => {
    const currentHour = new Date().getHours();
    const nextHour = currentHour + 1;

    const availableTimes = [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
    ];

    // Find the next available time slot
    const hourMap: { [key: number]: string } = {
      8: "8:00 AM",
      9: "9:00 AM",
      10: "10:00 AM",
      11: "11:00 AM",
      12: "12:00 PM",
      13: "1:00 PM",
      14: "2:00 PM",
      15: "3:00 PM",
      16: "4:00 PM",
      17: "5:00 PM",
      18: "6:00 PM",
    };

    // If next hour is within business hours, select it; otherwise select first available time
    if (nextHour >= 8 && nextHour <= 18 && hourMap[nextHour]) {
      return hourMap[nextHour];
    }

    return availableTimes[0]; // Default to first available time
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState(getInitialTime());

  // Buyer information form state
  const [buyerInfo, setBuyerInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const [showMoreDates, setShowMoreDates] = useState(false);

  // Generate available dates (at least 10 weekdays, excluding Sundays)
  const getAvailableDates = (count: number = 10) => {
    const dates = [];
    let date = new Date();
    date.setDate(date.getDate() + 3); // Start from 3 days from now

    while (dates.length < count) {
      if (date.getDay() !== 0) {
        // Exclude Sundays
        dates.push(format(date, "MMM d, yyyy"));
      }
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const availableTimes = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];

  const availableDates = getAvailableDates(showMoreDates ? 20 : 10);

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time for inspection.");
      return;
    }

    if (
      !buyerInfo.fullName.trim() ||
      !buyerInfo.phoneNumber.trim() ||
      !buyerInfo.email.trim()
    ) {
      toast.error(
        "Please fill in all buyer information fields (Full Name, Phone Number, and Email).",
      );
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerInfo.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Basic phone number validation (should contain only numbers, spaces, +, -, ())
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(buyerInfo.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    onProceed();
  };

  const handleBuyerInfoChange = (field: string, value: string) => {
    setBuyerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Inspection Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Inspection Summary
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#5A5D63]">Properties Selected:</span>
            <span className="font-medium text-[#24272C]">
              {selectedProperties.length}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5A5D63]">Inspection Fee:</span>
            <span className="font-semibold text-[#09391C] text-lg">
              ₦{inspectionFee.toLocaleString()}
            </span>
          </div>

          <div className="border-t pt-3">
            <div className="text-sm text-[#5A5D63] mb-2">Properties:</div>
            {selectedProperties.map((item, index) => (
              <div
                key={item.propertyId}
                className="text-sm text-[#24272C] mb-1"
              >
                {index + 1}. {item.property?.propertyType || "Property"} -{" "}
                {item.property?.location?.area},{" "}
                {item.property?.location?.localGovernment}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Select Inspection Date
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableDates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                selectedDate === date
                  ? "border-[#8DDB90] bg-[#E4EFE7] text-[#09391C]"
                  : "border-gray-200 hover:border-[#8DDB90] text-[#24272C]"
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Show More Dates Button */}
        {!showMoreDates && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowMoreDates(true)}
              className="text-[#8DDB90] hover:text-[#76c77a] font-medium text-sm"
            >
              Show More Dates →
            </button>
          </div>
        )}
      </div>

      {/* Time Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Select Inspection Time
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                selectedTime === time
                  ? "border-[#8DDB90] bg-[#E4EFE7] text-[#09391C]"
                  : "border-gray-200 hover:border-[#8DDB90] text-[#24272C]"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Buyer Information Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Buyer Information <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-[#5A5D63] mb-6">
          Please provide your contact information for the inspection
          appointment.
        </p>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#24272C] mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={buyerInfo.fullName}
              onChange={(e) =>
                handleBuyerInfoChange("fullName", e.target.value)
              }
              placeholder="Enter your full name"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#24272C] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={buyerInfo.phoneNumber}
              onChange={(e) =>
                handleBuyerInfoChange("phoneNumber", e.target.value)
              }
              placeholder="Enter your phone number"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-[#24272C] mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={buyerInfo.email}
              onChange={(e) => handleBuyerInfoChange("email", e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-[#FFF3E0] border border-[#FFB74D] rounded-lg p-4">
        <h4 className="font-semibold text-[#E65100] mb-2">Important Notes:</h4>
        <ul className="text-sm text-[#E65100] space-y-1">
          <li>
            • Inspections are available Monday to Saturday (excluding Sundays)
          </li>
          <li>• Please arrive 15 minutes before your scheduled time</li>
          <li>• Bring a valid form of identification</li>
          <li>• Payment confirmation is required before inspection</li>
          <li>• Confirmation details will be sent to your provided email</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-[#E9EBEB] text-[#5A5D63] rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Selection
        </button>

        <Button
          onClick={handleProceed}
          value="Proceed to Payment"
          disabled={
            !selectedDate ||
            !selectedTime ||
            !buyerInfo.fullName.trim() ||
            !buyerInfo.phoneNumber.trim() ||
            !buyerInfo.email.trim()
          }
          className="flex-1 px-6 py-3 bg-[#8DDB90] text-white rounded-lg font-medium hover:bg-[#76c77a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default DateTimeSelection;
