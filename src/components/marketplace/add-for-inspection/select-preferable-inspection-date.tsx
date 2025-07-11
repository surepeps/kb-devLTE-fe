"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { archivo } from "@/styles/font";
import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import { SubmitInspectionPayloadProp } from "../types/payload";
import { format } from "date-fns";

type DetailsProps = {
  selectedDate: string;
  selectedTime: string;
};

type ContactProps = {
  fullName: string;
  phoneNumber: string;
  email: string;
};

const SelectPreferableInspectionDate = ({
  closeModal,
  setIsProvideTransactionDetails,
  setActionTracker,
  actionTracker,
  submitInspectionPayload,
  setSubmitInspectionPayload,
}: {
  closeModal: (type: boolean) => void;
  setIsProvideTransactionDetails: (type: boolean) => void;
  actionTracker: { lastPage: "SelectPreferableInspectionDate" | "" }[];
  setActionTracker: React.Dispatch<
    React.SetStateAction<{ lastPage: "SelectPreferableInspectionDate" | "" }[]>
  >;
  submitInspectionPayload: SubmitInspectionPayloadProp;
  setSubmitInspectionPayload: React.Dispatch<
    React.SetStateAction<SubmitInspectionPayloadProp>
  >;
}) => {
  const getAvailableDates = () => {
    const dates: string[] = [];
    const date = new Date();
    date.setDate(date.getDate() + 3);

    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const lastDayOfNextMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth() + 1,
      0,
    );

    while (date <= lastDayOfNextMonth) {
      if (date.getDay() !== 0) {
        dates.push(format(date, "MMM d,yyyy")); // Changed format for consistency and common usage
      }
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const [details, setDetails] = useState<DetailsProps>({
    selectedDate: availableDates[0],
    selectedTime: "9:00 AM",
  });

  useEffect(() => {
    setSubmitInspectionPayload({
      ...submitInspectionPayload,
      inspectionDate: availableDates[0],
      inspectionTime: "9:00 AM",
    });
  }, []);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email format"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema,
    onSubmit: (values: ContactProps) => {
      console.log(values);
      setActionTracker([
        ...actionTracker,
        { lastPage: "SelectPreferableInspectionDate" },
      ]);
      setSubmitInspectionPayload({
        ...submitInspectionPayload,
        requestedBy: {
          fullName: formik.values.fullName,
          email: formik.values.email,
          phoneNumber: formik.values.phoneNumber,
        },
      });
      setIsProvideTransactionDetails(true);
      closeModal(false);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      // Adjusted padding for mobile responsiveness
      className="bg-white h-[600px] overflow-y-auto w-full py-[36px] px-4 sm:px-[32px] flex flex-col gap-[25px] hide-scrollbar"
    >
      {/* Date selection: added responsive scrolling and styling */}
      <div className="overflow-x-auto pb-[58px] overflow-y-hidden w-full flex gap-[21px] hide-scrollbar border-b-[1px] border-[#C7CAD0] snap-x snap-mandatory">
        {/* The pb-[58px] has been removed from this div */}
        {availableDates.map((date: string, idx: number) => (
          <button
            type="button"
            onClick={() => {
              setDetails({
                ...details,
                selectedDate: date,
              });
              setSubmitInspectionPayload({
                ...submitInspectionPayload,
                inspectionDate: date,
              });
            }}
            className={`h-[42px] ${
              details.selectedDate === date ? "bg-[#8DDB90] text-white" : ""
            } min-w-[120px] px-[10px] ${
              archivo.className
            } text-sm font-medium text-[#5A5D63] rounded-md flex-shrink-0 snap-center`}
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
        {details.selectedDate}
      </h4>
      {/* Time selection: grid columns adjust based on screen size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[14px]">
        {[
          "9:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "1:00 PM",
          "2:00 PM",
          "3:00 PM",
          "4:00 PM",
          "5:00 PM",
        ].map((time, idx: number) => (
          <button
            onClick={() => {
              setDetails({
                ...details,
                selectedTime: time,
              });
              setSubmitInspectionPayload({
                ...submitInspectionPayload,
                inspectionTime: time,
              });
            }}
            className={`border-[1px] border-[#A8ADB7] h-[57px] ${
              details.selectedTime === time ? "bg-[#8DDB90]" : ""
            } text-lg font-medium ${archivo.className} text-black rounded-md`}
            type="button"
            key={idx}
          >
            {time}
          </button>
        ))}
      </div>
      {/* Booking details section: adjusted text size */}
      <div className="h-auto py-[28px] w-full bg-[#8DDBDB]/[20%] flex flex-col gap-[5px] px-[28px] rounded-md">
        <h3
          className={`text-lg font-medium ${archivo.className} text-black font-semibold`}
        >
          Booking details
        </h3>
        <p
          className={`text-base sm:text-lg font-medium ${archivo.className} text-black`}
        >
          Date:{" "}
          <time
            className={`text-base sm:text-lg font-medium ${archivo.className} text-black`}
          >
            {details.selectedDate}
          </time>{" "}
          Time:{" "}
          <time
            className={`text-base sm:text-lg font-medium ${archivo.className} text-black`}
          >
            {details.selectedTime}
          </time>
        </p>
      </div>
      {/* Contact information section: adjusted description text size */}
      <div className="p-[20px] bg-[#EEF1F1] flex flex-col gap-[25px] rounded-md">
        <div className="flex flex-col gap-[4px]">
          <h3 className="text-[#0B0D0C] text-xl font-bold">
            Contact information
          </h3>
          <span className="text-sm text-[#515B6F]">
            Provide your contact information to schedule an inspection and take
            the next step toward your dream property
          </span>
        </div>
        {/* Input fields: stack on small screens, side-by-side on larger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
          <Input
            id="fullName"
            name="fullName"
            placeholder="Full name of the buyer"
            type="text"
            heading="Full Name"
            formikType={formik}
          />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Active phone number for follow-up"
            type="text"
            heading="Phone Number"
            formikType={formik}
          />
          <Input
            id="email"
            name="email"
            placeholder="Optional, for communication"
            type="email"
            heading="Email"
            formikType={formik}
            className="col-span-1 sm:col-span-2" // Email always takes full width of its row
          />
        </div>
      </div>
      {/* Action buttons: stack on small screens, side-by-side on larger */}
      <div className="w-full flex flex-col sm:flex-row gap-[15px] h-auto sm:h-[57px]">
        <button
          type="submit"
          className={`w-full sm:w-[277px] h-[57px] bg-[#8DDB90] text-[#FFFFFF] font-bold text-lg ${
            archivo.className
          } ${
            !(formik.isValid && formik.dirty)
              ? "opacity-50 cursor-not-allowed"
              : ""
          } rounded-md`}
          disabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </button>
        <button
          onClick={() => closeModal(false)}
          type="button"
          className={`w-full sm:w-[277px] h-[57px] bg-transparent border-[1px] border-[#5A5D63] text-[#414357] font-medium text-lg ${archivo.className} rounded-md`}
        >
          Close
        </button>
      </div>
      {/* Arrow down indicator: hidden on small screens */}
      <div className="absolute right-6 bottom-6 z-10 hidden sm:block">
        <div className="w-12 h-12 rounded-full bg-[#8DDB90] flex items-center justify-center animate-bounce shadow-lg">
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-white"
            size="lg"
          />
        </div>
      </div>
    </form>
  );
};

type InputProps = {
  id: "fullName" | "email" | "phoneNumber";
  placeholder?: string;
  type: "email" | "number" | "text";
  name: string;
  heading: string;
  isDisabled?: boolean;
  formikType: FormikProps<ContactProps>;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  id,
  heading,
  type,
  placeholder,
  name,
  isDisabled,
  formikType,
  className,
}) => {
  return (
    <label
      htmlFor={id}
      className={`w-full flex flex-col gap-[4px] ${className}`}
    >
      <span
        className={`text-base text-[#24272C] ${archivo.className} font-medium`}
      >
        {heading}
      </span>
      <input
        name={name}
        onChange={formikType.handleChange}
        id={id}
        type={type}
        onBlur={formikType.handleBlur}
        value={formikType.values[id]}
        disabled={isDisabled}
        placeholder={placeholder ?? "This is a placeholder"}
        className={`px-[12px] h-[50px] bg-[#FFFFFF] border-[1px] border-[#E9EBEB] w-full text-base placeholder:text-[#A7A9AD] text-black ${archivo.className} rounded-[5px] outline-none`}
      />
      {(formikType.errors[id] || formikType.touched[id]) && (
        <span className={`${archivo.className} text-xs text-red-500`}>
          {formikType.errors[id] as string}
        </span>
      )}
    </label>
  );
};

export default SelectPreferableInspectionDate;
