/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModalWrapper from "../general-components/modal-wrapper";
import { archivo } from "@/styles/font";
import { format } from "date-fns";
import {
  useNegotiationActions,
  useNegotiationData,
} from "@/context/negotiation-context";

const SelectPreferableInspectionDate = ({
  closeModal,
}: {
  closeModal: (type: boolean) => void;
}) => {
  const { submitBasedOnStatus } = useNegotiationActions();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    details,
    setInspectionDateStatus,
    inspectionDateStatus,
    inspectionStatus,
    dateTimeObj,
    counterDateTimeObj,
    setCounterDateTimeObj,
  } = useNegotiationData();

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return "";
    if (dateString.match(/^[A-Za-z]{3} \d{1,2}, \d{4}$/)) return dateString;
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split("/");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return format(date, "MMM d, yyyy");
    }
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : format(date, "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const revertFormattedDate = (formatted: string): string => {
    if (!formatted) return "";

    // Try to parse formatted "MMM d, yyyy"
    try {
      const date = new Date(formatted);
      if (isNaN(date.getTime())) return formatted;

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${year}-${month}-${day}`;
    } catch {
      return formatted;
    }
  };

  // Auto-populate with current inspection date when modal opens
  useEffect(() => {
    // If there's an original inspection date, use it as the default
    if (dateTimeObj.selectedDate && !counterDateTimeObj.selectedDate) {
      const originalDate = formatSelectedDate(dateTimeObj.selectedDate);
      const availableDates = getAvailableDates();

      // Check if original date is still available (future date)
      if (availableDates.includes(originalDate)) {
        setCounterDateTimeObj({
          ...counterDateTimeObj,
          selectedDate: revertFormattedDate(originalDate),
        });
      }
    }

    // Auto-populate time if available
    if (dateTimeObj.selectedTime && !counterDateTimeObj.selectedTime) {
      setCounterDateTimeObj({
        ...counterDateTimeObj,
        selectedTime: dateTimeObj.selectedTime,
      });
    }
  }, [dateTimeObj, counterDateTimeObj, setCounterDateTimeObj]);

  const formattedSelectedDate = formatSelectedDate(
    counterDateTimeObj.selectedDate || dateTimeObj.selectedDate || "",
  );
  const selectedTime =
    counterDateTimeObj.selectedTime || dateTimeObj.selectedTime;

  const getAvailableDates = () => {
    const dates: string[] = [];
    const date = new Date();
    date.setDate(date.getDate() + 1);
    while (dates.length < 14) {
      if (date.getDay() !== 0) {
        dates.push(format(date, "MMM d, yyyy"));
      }
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const getAvailableTimesForDate = (selectedDate: string) => {
    if (!selectedDate) return [];
    const today = new Date();
    const selected = new Date(selectedDate);
    const isToday = selected.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    const allTimes = [
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
    if (isToday) {
      return allTimes.filter((time) => {
        const hour = parseInt(time.split(":")[0]);
        const isPM = time.includes("PM");
        const hour24 =
          isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;
        return hour24 > currentHour + 2;
      });
    }
    return allTimes;
  };

  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimesForDate(formattedSelectedDate);

  const handleDateSelect = (date: string) => {
    const isSameDate =
      date === formatSelectedDate(dateTimeObj.selectedDate || "");
    const isSameTime =
      counterDateTimeObj.selectedTime === dateTimeObj.selectedTime;

    setCounterDateTimeObj({
      ...counterDateTimeObj,
      selectedDate: revertFormattedDate(date),
    });

    if (isSameDate && isSameTime) {
      setInspectionDateStatus("none");
    } else {
      setInspectionDateStatus("countered");
    }
  };

  const handleTimeSelect = (time: string) => {
    const isSameTime = time === dateTimeObj.selectedTime;
    const isSameDate =
      counterDateTimeObj.selectedDate === dateTimeObj.selectedDate;

    setCounterDateTimeObj({ ...counterDateTimeObj, selectedTime: time });

    if (isSameDate && isSameTime) {
      setInspectionDateStatus("none");
    } else {
      setInspectionDateStatus("countered");
    }
  };

  const submitAction = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(inspectionDateStatus, inspectionStatus, "dddd");
      await submitBasedOnStatus(details.negotiationID);
      closeModal(false);
    } catch (error: unknown) {
      console.error("Error submitting:", error);
      // Optionally handle or display error to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={true}
      onClose={() => closeModal(false)}
      title="Update Inspection Date & Time"
      size="lg"
      showCloseButton={true}
    >
      <div className="p-4 sm:p-6">
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            closeModal(false);
          }}
          className="w-full flex flex-col gap-[25px]"
        >
          <div className="flex flex-col gap-[5px] md:gap-[18px]">
            <h2 className={`font-bold text-black ${archivo.className} text-xl`}>
              Update Inspection Date & Time
            </h2>

            {/* Show original inspection details */}
            {dateTimeObj.selectedDate && dateTimeObj.selectedTime && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Schedule:</strong>{" "}
                  {formatSelectedDate(dateTimeObj.selectedDate)} at{" "}
                  {dateTimeObj.selectedTime}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Select a new date and time below to update the inspection
                  schedule
                </p>
              </div>
            )}
          </div>

          <div className="overflow-x-auto w-full flex gap-[21px] hide-scrollbar border-b-[1px] border-[#C7CAD0]">
            {availableDates.map((date: string, idx: number) => (
              <button
                type="button"
                onClick={() => handleDateSelect(date)}
                className={`h-[42px] ${
                  formattedSelectedDate === date && "bg-[#8DDB90] text-white"
                } min-w-fit px-[10px] ${
                  archivo.className
                } text-sm font-medium text-[#5A5D63] rounded transition-colors duration-200 hover:bg-[#8DDB90] hover:text-white`}
                key={idx}
              >
                {date}
              </button>
            ))}
          </div>

          <h3 className={`text-xl font-medium ${archivo.className} text-black`}>
            Select preferable inspection time
          </h3>
          <h4 className={`text-lg font-medium ${archivo.className} text-black`}>
            {formattedSelectedDate || "Please select a date"}
          </h4>

          {formattedSelectedDate && (
            <div className="grid grid-cols-3 gap-[14px]">
              {availableTimes.length > 0 ? (
                availableTimes.map((time, idx: number) => (
                  <button
                    onClick={() => handleTimeSelect(time)}
                    className={`border-[1px] border-[#A8ADB7] h-[57px] rounded transition-colors duration-200 ${
                      selectedTime === time
                        ? "bg-[#8DDB90] text-white border-[#8DDB90]"
                        : "hover:bg-[#8DDB90] hover:text-white hover:border-[#8DDB90]"
                    } text-lg font-medium ${archivo.className} text-black`}
                    type="button"
                    key={idx}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500">
                  No available times for this date. Please select another date.
                </div>
              )}
            </div>
          )}

          <div className="h-[103px] py-[28px] w-full bg-[#8DDB90]/[20%] flex justify-center flex-col gap-[5px] px-[28px] rounded">
            <h3
              className={`text-lg font-medium ${archivo.className} text-black font-semibold`}
            >
              Updated Booking Details
            </h3>
            <p
              className={`text-lg font-medium ${archivo.className} text-black`}
            >
              Date: <time>{formattedSelectedDate || "Not selected"}</time> Time:{" "}
              <time>{selectedTime || "Not selected"}</time>
            </p>

            {/* Show comparison with original */}
            {dateTimeObj.selectedDate && dateTimeObj.selectedTime && (
              <p className="text-sm text-gray-600 mt-2">
                Original: {formatSelectedDate(dateTimeObj.selectedDate)} at{" "}
                {dateTimeObj.selectedTime}
              </p>
            )}
          </div>

          <div className="lg:w-[569px] w-full flex gap-[15px] h-[57px]">
            <button
              onClick={submitAction}
              disabled={
                inspectionDateStatus !== "countered" ||
                isLoading ||
                !formattedSelectedDate ||
                !selectedTime
              }
              className={`w-full h-[50px] text-lg font-bold rounded transition-colors duration-200 ${
                inspectionDateStatus !== "countered" ||
                isLoading ||
                !formattedSelectedDate ||
                !selectedTime
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[#71dc75] text-white hover:bg-[#5bc75f]"
              }`}
              type="button"
            >
              {isLoading ? "Updating..." : "Update Schedule"}
            </button>
            <button
              onClick={() => closeModal(false)}
              type="button"
              className={`w-[277px] h-[53px] bg-transparent border-[1px] border-[#5A5D63] text-[#414357] font-medium text-lg ${archivo.className} rounded hover:bg-gray-50 transition-colors duration-200`}
            >
              Cancel
            </button>
          </div>
        </motion.form>
      </div>
    </ModalWrapper>
  );
};

export default SelectPreferableInspectionDate;
