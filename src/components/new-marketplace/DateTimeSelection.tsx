/** @format */

"use client";
import React, { useState } from "react";
import { format, addDays } from "date-fns";
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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

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
      alert("Please select both date and time for inspection.");
      return;
    }
    onProceed();
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
          disabled={!selectedDate || !selectedTime}
          className="flex-1 px-6 py-3 bg-[#8DDB90] text-white rounded-lg font-medium hover:bg-[#76c77a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default DateTimeSelection;
