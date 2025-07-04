/** @format */

"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faClose,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { archivo } from "@/styles/font"; // Assuming this is a font import
import Input from "@/components/general-components/Input"; // Assuming this is a custom Input component
import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import { SubmitInspectionPayloadProp } from "../types/payload"; // Adjust path as needed
import { format } from "date-fns";
import { useMarketplace } from "@/context/marketplace-context"; // Adjust path as needed

type NegotiationModalProps = {
  id: string | null;
  isOpened: boolean;
  askingPrice: number | string | undefined;
  yourPrice: number | string | undefined;
};

// Reusable Input component for Formik forms
type InputProps = {
  id: string; // Made more general for reuse
  placeholder?: string;
  type: "email" | "number" | "text" | "tel"; // Added 'tel' for phone numbers
  name: string;
  heading: string;
  isDisabled?: boolean;
  formikType: FormikProps<any>; // Use any or a specific type for better flexibility
  className?: string;
};

const Input2: React.FC<InputProps> = ({
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
    <label htmlFor={id} className={`w-full flex flex-col gap-[4px] ${className}`}>
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
        className={`px-[12px] h-[50px] bg-[#FFFFFF] border-[1px] border-[#E9EBEB] w-full text-base placeholder:text-[#A7A9AD] text-black ${archivo.className} rounded-[5px] outline-none disabled:bg-[#FAFAFA]`}
      />
      {(formikType.errors[id] && formikType.touched[id]) && (
        <span className={`${archivo.className} text-xs text-red-500 mt-1`}>
          {formikType.errors[id] as string} {/* Explicitly cast to string */}
        </span>
      )}
    </label>
  );
};


const NegiotiatePrice = ({
  allNegotiation,
  setAllNegotiation,
  getID,
  currentIndex,
  setCurrentIndex,
  setSelectPreferableInspectionDateModalOpened, // Not used in this component, consider removing or using
  submitInspectionPayload,
  setSubmitInspectionPayload,
}: {
  getID: string | null;
  allNegotiation: NegotiationModalProps[];
  setAllNegotiation: (type: NegotiationModalProps[]) => void;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectPreferableInspectionDateModalOpened: (type: boolean) => void;
  submitInspectionPayload: SubmitInspectionPayloadProp;
  setSubmitInspectionPayload: React.Dispatch<
    React.SetStateAction<SubmitInspectionPayloadProp>
  >;
}): React.JSX.Element => {
  const { addNegotiatedPrice } = useMarketplace();

  const [selectedProperty, setSelectedProperty] =
    useState<NegotiationModalProps>({
      id: null,
      yourPrice: undefined,
      askingPrice: undefined,
      isOpened: false,
    });
  const [yourPriceInput, setYourPriceInput] = useState<string>(""); // Renamed to avoid conflict

  // Helper to format number with commas
  const formatNumber = useCallback((val: string) => {
    const numericValue = val.replace(/[^0-9.]/g, ""); // Allow only numbers and a single decimal point
    if (numericValue === "") return "";
    return Number(numericValue).toLocaleString();
  }, []); // Memoize formatNumber

  useEffect(() => {
    const findSelectedCard = allNegotiation.find((item) => item.id === getID);

    if (findSelectedCard) {
      setSelectedProperty((prev) => {
        const newId = findSelectedCard.id;
        const newAskingPrice = findSelectedCard.askingPrice;
        const newYourPrice = findSelectedCard.yourPrice;

        // Only update if something relevant has changed to prevent unnecessary re-renders
        if (prev.id !== newId || prev.askingPrice !== newAskingPrice || prev.yourPrice !== newYourPrice) {
          return {
            id: newId,
            askingPrice: newAskingPrice,
            yourPrice: newYourPrice,
            isOpened: findSelectedCard.isOpened,
          };
        }
        return prev;
      });

      // Initialize yourPriceInput if a previous price exists
      if (findSelectedCard.yourPrice !== undefined) {
        setYourPriceInput(formatNumber(String(findSelectedCard.yourPrice)));
      } else {
        setYourPriceInput(""); // Clear if no price exists
      }
    } else {
      // Clear selected property and input if no card is found
      setSelectedProperty({
        id: null,
        yourPrice: undefined,
        askingPrice: undefined,
        isOpened: false,
      });
      setYourPriceInput("");
    }
  }, [allNegotiation, getID, formatNumber]); // Add formatNumber to dependencies

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    if (!getID) return;

    // Get the numeric value of the proposed price
    const proposedNumericPrice = Number(yourPriceInput.replace(/,/g, ""));

    // Basic validation: ensure a number is entered and it's not higher than asking price
    if (isNaN(proposedNumericPrice) || proposedNumericPrice <= 0) {
      alert("Please enter a valid price."); // Simple alert, consider better UX
      return;
    }
    
    // Using selectedProperty.askingPrice from state, which is updated via useEffect
    if (
      typeof selectedProperty.askingPrice === "number" &&
      proposedNumericPrice > selectedProperty.askingPrice
    ) {
      alert("Your proposed price cannot exceed the asking price."); // Simple alert
      return;
    }

    // Update selectedProperty with the validated numeric price locally
    // This state update is primarily for this component's rendering logic.
    setSelectedProperty((prev) => ({
      ...prev,
      yourPrice: proposedNumericPrice,
    }));

    // Save negotiated price to marketplace context
    if (
      typeof selectedProperty.askingPrice === "number" &&
      getID
    ) {
      addNegotiatedPrice(
        getID,
        selectedProperty.askingPrice,
        proposedNumericPrice,
      );
    }

    // Update the payload
    setSubmitInspectionPayload((prev) => {
      const updatedProperties =
        prev.properties?.map((prop) =>
          prop.propertyId === getID
            ? {
                ...prop,
                negotiationPrice: proposedNumericPrice, // Use the validated numeric price
              }
            : prop,
        ) || [];

      // Check if any property has a negotiation price set (and is valid)
      const isAnyNegotiated = updatedProperties.some(
        (p) =>
          typeof p.negotiationPrice === "number" && p.negotiationPrice > 0, // Check for positive value
      );

      return {
        ...prev,
        properties: updatedProperties,
        isNegotiating: isAnyNegotiated,
      };
    });

    // Move to the next index or complete the flow
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePriceInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = event.target.value;
    const formatted = formatNumber(rawValue);
    setYourPriceInput(formatted);

    // Update the selected property's local state and payload directly
    const numericValue = Number(rawValue.replace(/,/g, ""));
    setSelectedProperty((prev) => ({
      ...prev,
      yourPrice: numericValue, // Store numeric value
    }));

    setSubmitInspectionPayload((prev) => {
      // Find the property to update or add it if it doesn't exist
      let updatedProperties = prev.properties ? [...prev.properties] : [];
      const existingPropertyIndex = updatedProperties.findIndex(item => item.propertyId === selectedProperty.id);

      if (selectedProperty.id) { // Ensure id exists before attempting to update/add
        if (existingPropertyIndex > -1) {
          updatedProperties[existingPropertyIndex] = {
            ...updatedProperties[existingPropertyIndex],
            negotiationPrice: numericValue,
          };
        } else {
          // If property not found, add it to the list
          updatedProperties.push({
            propertyId: selectedProperty.id,
            negotiationPrice: numericValue,
          });
        }
      }

      const anyNegotiation = updatedProperties.some(
        (item) => Number(item.negotiationPrice) > 0,
      );

      return {
        ...prev,
        properties: updatedProperties,
        isNegotiating: anyNegotiation,
      };
    });
  }, [formatNumber, selectedProperty.id, setSubmitInspectionPayload]);


  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }} // Changed from whileInView to animate for smoother immediate appearance
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.1 }}
      className="w-full max-w-[615px] mx-auto p-4 sm:p-6 md:p-8" // Added padding to the container
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full flex flex-col gap-6"> {/* Increased gap for better spacing */}
          <div className="flex flex-col gap-2"> {/* Increased gap for better spacing */}
            <p
              className={`${archivo.className} text-[#515B6F] text-lg text-center`}
            >
              You&apos;re welcome to negotiate the price directly with the
              seller even before arranging an inspection. Please enter your
              proposed offer below.
            </p>
          </div>
          {/**Asking Price */}
          <Input
            label="Asking Price"
            name="asking_price"
            type="text"
            isDisabled
            value={Number(selectedProperty.askingPrice).toLocaleString()}
            onChange={() => {
              // This onChange is empty as the input is disabled.
              // It's fine, but if you need to pass it, ensure it's handled.
            }}
          />
          {/**Enter your price */}
          <Input
            label="Enter your price"
            name="enter_your_price"
            type="text" // Keep as text to allow flexible formatting
            placeholder="Enter amount"
            value={yourPriceInput}
            onChange={handlePriceInputChange}
          />
          {yourPriceInput &&
            Number(yourPriceInput.replace(/,/g, "")) >
              Number(selectedProperty.askingPrice) && (
              <p className="text-red-500 text-sm mt-1">
                Your price cannot exceed the asking price of ₦
                {Number(selectedProperty.askingPrice).toLocaleString()}
              </p>
            )}

          {/** Submit and Cancel buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-4 mt-4"> {/* Responsive buttons */}
            

            <button
                type="submit"
                disabled={Number(yourPriceInput.replace(/,/g, "")) > Number(selectedProperty.askingPrice) || Number(yourPriceInput.replace(/,/g, "")) <= 0} // Disable if form is not valid or price is invalid
                className={`w-full sm:w-1/2 h-[57px] rounded-md font-bold text-lg ${archivo.className} transition-colors duration-200
                  ${
                    Number(yourPriceInput.replace(/,/g, "")) <= Number(selectedProperty.askingPrice) && Number(yourPriceInput.replace(/,/g, "")) > 0
                      ? "bg-[#8DDB90] text-white hover:bg-[#7bc47d]"
                      : "bg-[#E0E0E0] text-[#A7A9AD] cursor-not-allowed" // Greyed out for disabled state
                  }`}
              >
                Submit
              </button>
            <button
              onClick={() => setCurrentIndex(allNegotiation.length + 1)} // Assuming this means skipping to end
              className={`h-[57px] bg-white border-[1px] border-[#5A5D63] flex-1 text-lg text-[#5A5D63] font-bold ${archivo.className} rounded-md transition-colors duration-200 hover:bg-gray-50`}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

/**
 * second negotiate price with seller
 */

type NegotiateWithSellerProps = {
  closeModal?: (type: boolean) => void;
  allNegotiation: any[]; // Consider a more specific type if possible
  getID: string | null;
  closeSelectPreferableModal: (type: boolean) => void;
  setIsProvideTransactionDetails: (type: boolean) => void;
  actionTracker: { lastPage: "SelectPreferableInspectionDate" | "" }[];
  setActionTracker: React.Dispatch<
    React.SetStateAction<{ lastPage: "SelectPreferableInspectionDate" | "" }[]>
  >;
  submitInspectionPayload: SubmitInspectionPayloadProp;
  setSubmitInspectionPayload: React.Dispatch<
    React.SetStateAction<SubmitInspectionPayloadProp>
  >;
};

type DetailsProps = {
  selectedDate: string;
  selectedTime: string;
};

type ContactProps = {
  fullName: string;
  phoneNumber: string;
  email: string;
};

const NegiotiatePriceWithSellerModal: React.FC<NegotiateWithSellerProps> = ({
  closeModal,
  allNegotiation,
  getID,
  setIsProvideTransactionDetails,
  setActionTracker,
  actionTracker,
  closeSelectPreferableModal,
  submitInspectionPayload,
  setSubmitInspectionPayload,
}): React.JSX.Element => {
  const { addNegotiatedPrice } = useMarketplace();

  const [selectedProperty, setSelectedProperty] =
    useState<NegotiationModalProps>({
      id: null,
      yourPrice: undefined,
      askingPrice: undefined,
      isOpened: false,
    });

  const getAvailableDates = useCallback(() => {
    const dates: string[] = [];
    let date = new Date();
    date.setDate(date.getDate() + 3); // start from 3 days from now

    // Get the last day of the next month
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const lastDayOfNextMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth() + 1,
      0,
    );

    while (date <= lastDayOfNextMonth) {
      // Exclude Sundays (getDay() === 0)
      if (date.getDay() !== 0) {
        dates.push(format(date, "MMM d, yyyy")); // Changed to yyyy for full year
      }
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }, []); // No dependencies, so memoize this function

  const availableDates = useMemo(() => getAvailableDates(), [getAvailableDates]); // Memoize the result

  const [details, setDetails] = useState<DetailsProps>({
    selectedDate: availableDates[0] || "", // Ensure initial value exists
    selectedTime: "9:00 AM",
  });

  // Effect to set initial inspection date and time in payload
  useEffect(() => {
    if (availableDates.length > 0) {
      setSubmitInspectionPayload((prev) => {
        // Only update if values are different to prevent infinite loop
        if (prev.inspectionDate !== availableDates[0] || prev.inspectionTime !== "9:00 AM") {
          return {
            ...prev,
            inspectionDate: availableDates[0],
            inspectionTime: "9:00 AM",
          };
        }
        return prev;
      });
    }
  }, [availableDates, setSubmitInspectionPayload]); // setSubmitInspectionPayload is stable


  // Helper to format number with commas
  const formatNumber = useCallback((val: string) => {
    const numericValue = val.replace(/[^0-9.]/g, ""); // Allow only numbers and a single decimal point
    if (numericValue === "") return "";
    return Number(numericValue).toLocaleString();
  }, []); // Memoize formatNumber

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email address").optional(), // Email is optional
  });

  const [formattedYourPrice, setFormattedYourPrice] = useState<string>(""); // State for formatted input value

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema,
    onSubmit: (values: ContactProps) => {
      // Get the numeric value of the proposed price from the formatted input state
      const proposedNumericPrice = Number(formattedYourPrice.replace(/,/g, ""));
      const askingPrice = Number(selectedProperty.askingPrice);

      // Validate proposed price against asking price
      if (isNaN(proposedNumericPrice) || proposedNumericPrice <= 0) {
        alert("Please enter a valid negotiation price.");
        return;
      }
      if (proposedNumericPrice > askingPrice) {
        alert("Your proposed price cannot exceed the asking price.");
        return;
      }

      // Save negotiated price to marketplace context if available
      if (
        typeof selectedProperty.askingPrice === "number" &&
        getID
      ) {
        addNegotiatedPrice(
          getID,
          selectedProperty.askingPrice,
          proposedNumericPrice, // Use the value from the input field
        );
      }

      setActionTracker((prev) => [
        ...prev,
        { lastPage: "SelectPreferableInspectionDate" },
      ]);

      setSubmitInspectionPayload((prev) => {
        // Ensure properties array is initialized
        const updatedProperties = prev.properties ? [...prev.properties] : [];

        // Find or add the current property to the payload's properties array
        const existingPropertyIndex = updatedProperties.findIndex(
          (p) => p.propertyId === selectedProperty.id,
        );

        if (existingPropertyIndex > -1) {
          // Update existing property's negotiation price
          updatedProperties[existingPropertyIndex] = {
            ...updatedProperties[existingPropertyIndex],
            negotiationPrice: proposedNumericPrice,
          };
        } else if (selectedProperty.id) {
          // Add new property if not found
          updatedProperties.push({
            propertyId: selectedProperty.id,
            negotiationPrice: proposedNumericPrice,
          });
        }

        const isAnyNegotiated = updatedProperties.some(
          (p) => typeof p.negotiationPrice === "number" && p.negotiationPrice > 0,
        );

        return {
          ...prev,
          requestedBy: {
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
          },
          inspectionDate: details.selectedDate,
          inspectionTime: details.selectedTime,
          properties: updatedProperties, // Ensure this is the updated array
          isNegotiating: isAnyNegotiated,
        };
      });

      setIsProvideTransactionDetails(true);
      closeSelectPreferableModal(false);
      closeModal?.(false);
    },
  });

  const [isModalOpened, setIsModalOpened] = useState<boolean>(true); // Keep accordion open by default

  // Check if all *required* fields are filled for form submission
  // Memoize this to prevent unnecessary re-calculations
  const isFormValid = useMemo(() => {
    return formik.isValid && formik.dirty && Object.values(formik.errors).length === 0;
  }, [formik.isValid, formik.dirty, formik.errors]);


  useEffect(() => {
    const findSelectedCard = allNegotiation.find((item) => item.id === getID);

    if (findSelectedCard) {
      const askingPriceVal = findSelectedCard?.price ?? findSelectedCard?.rentalPrice;
      setSelectedProperty(prev => {
        // Only update if values are different to prevent infinite loop
        if (prev.id !== findSelectedCard._id || prev.askingPrice !== askingPriceVal) {
          return {
            id: findSelectedCard._id,
            askingPrice: askingPriceVal,
            yourPrice: undefined, // Reset yourPrice for new negotiation
            isOpened: false,
          };
        }
        return prev;
      });
      setFormattedYourPrice(""); // Clear previous input on new selection
    } else {
      // Handle case where property is not found or getID is null
      setSelectedProperty(prev => {
        if (prev.id !== null) { // Only clear if it's not already null
          return {
            id: null,
            askingPrice: undefined,
            yourPrice: undefined,
            isOpened: false,
          };
        }
        return prev;
      });
      setFormattedYourPrice("");
    }
  }, [allNegotiation, getID]); // Dependencies are allNegotiation and getID. Ensure they are stable.

  // Callback for handling the "Enter your price" input change
  const handleNegotiationPriceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const numericValue = Number(rawValue.replace(/,/g, ""));
    const askingPrice = Number(selectedProperty.askingPrice);

    // Update the display value immediately
    const formatted = formatNumber(rawValue);
    setFormattedYourPrice(formatted);

    // Only update state if the value is not higher than asking price or if it's empty/invalid
    if (numericValue <= askingPrice || rawValue === "" || isNaN(numericValue)) {
      setSelectedProperty((prev) => ({
        ...prev,
        yourPrice: numericValue, // Store numeric value
      }));

      setSubmitInspectionPayload((prev) => {
        let updatedProperties = prev.properties ? [...prev.properties] : [];
        const existingPropertyIndex = updatedProperties.findIndex(item => item.propertyId === selectedProperty.id);

        if (selectedProperty.id) { // Ensure id exists before attempting to update/add
          if (existingPropertyIndex > -1) {
            updatedProperties[existingPropertyIndex] = {
              ...updatedProperties[existingPropertyIndex],
              negotiationPrice: numericValue,
            };
          } else {
            // If property not found, add it to the list
            updatedProperties.push({
              propertyId: selectedProperty.id,
              negotiationPrice: numericValue,
            });
          }
        }

        const anyNegotiation = updatedProperties.some(
          (item) => Number(item.negotiationPrice) > 0,
        );

        return {
          ...prev,
          properties: updatedProperties,
          isNegotiating: anyNegotiation,
        };
      });
    }
  }, [formatNumber, selectedProperty.askingPrice, selectedProperty.id, setSubmitInspectionPayload]);


  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.1 }}
      className="w-full mx-auto relative" // Added relative for absolute positioning of arrow
    >
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white h-[600px] overflow-y-auto w-full py-[36px] px-4 sm:px-[32px] flex flex-col gap-[25px] hide-scrollbar"
      >
        <div className="w-full flex flex-col gap-6"> {/* Increased general gap */}
          <div className="flex flex-col gap-2"> {/* Increased gap for text */}
            <p
              className={`${archivo.className} text-[#515B6F] text-lg text-center`}
            >
              You&apos;re welcome to negotiate the price directly with the
              seller even before arranging an inspection. Please enter your
              proposed offer below.
            </p>
          </div>
          {/**Asking Price */}
          <Input
            label="Asking Price"
            name="asking_price"
            type="text"
            isDisabled
            value={Number(selectedProperty.askingPrice).toLocaleString()}
            onChange={() => {}} // Disabled input, no change needed
          />
          {/**Enter your price */}
          <Input
            label="Enter your price"
            name="enter_your_price"
            type="text" // Keep as text for formatting
            placeholder="Enter amount"
            value={formattedYourPrice} // Use formatted value for display
            onChange={handleNegotiationPriceChange}
          />

          {formattedYourPrice &&
            Number(formattedYourPrice.replace(/,/g, "")) >
              Number(selectedProperty.askingPrice) && (
              <p className="text-red-500 text-sm mt-1">
                Your price cannot exceed the asking price of ₦
                {Number(selectedProperty.askingPrice).toLocaleString()}
              </p>
            )}

          <p className="text-[#1976D2] font-medium text-lg mt-2">
            A fee of ₦10,000 will be charged for inspection and negotiation
            before your request is sent to the seller.
          </p>

          <div className="flex flex-col gap-6"> {/* Increased gap */}
            {/**First div - Select preferable inspection Date (Accordion Header) */}
            <div
              className="flex justify-between items-center gap-[18px] border-b-[1px] pb-[10px] border-black cursor-pointer"
              onClick={() => setIsModalOpened(!isModalOpened)}
              aria-expanded={isModalOpened}
              aria-controls="inspection-details"
            >
              <h2
                className={`font-bold text-black ${archivo.className} text-xl`}
              >
                Select preferable inspection Date
              </h2>
              <FontAwesomeIcon
                icon={isModalOpened ? faCaretUp : faCaretDown}
                size="sm"
                width={24}
                height={24}
                className="w-6 h-6 transition-transform duration-300"
              />
            </div>
            <AnimatePresence>
              {isModalOpened && (
                <motion.section
                  id="inspection-details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-5 overflow-hidden" // Added overflow-hidden for smooth height animation
                >
                  {/**Second div - Available Dates */}
                  <div className="overflow-x-auto w-full flex gap-4 pb-2 hide-scrollbar border-b-[1px] border-[#C7CAD0]">
                    {availableDates.map((date: string, idx: number) => (
                      <button
                        type="button"
                        onClick={() => {
                          setDetails((prev) => {
                            if (prev.selectedDate !== date) {
                              return { ...prev, selectedDate: date };
                            }
                            return prev;
                          });
                          setSubmitInspectionPayload((prev) => {
                            if (prev.inspectionDate !== date) {
                              return { ...prev, inspectionDate: date };
                            }
                            return prev;
                          });
                        }}
                        className={`h-[42px] min-w-fit px-3 rounded-md ${
                          details.selectedDate === date
                            ? "bg-[#8DDB90] text-white"
                            : "bg-gray-100 text-[#5A5D63] hover:bg-gray-200"
                        } ${archivo.className} text-sm font-medium transition-colors duration-200`}
                        key={idx}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                  <h3
                    className={`text-xl font-medium ${archivo.className} text-black mt-2`}
                  >
                    Select preferable inspection time
                  </h3>
                  <h4
                    className={`text-lg font-medium ${archivo.className} text-black`}
                  >
                    {details.selectedDate}
                  </h4>
                  {/**third div - Available Times */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3"> {/* Responsive grid */}
                    {[
                      "9:00 AM",
                      "11:00 AM",
                      "1:00 PM",
                      "3:00 PM",
                      "5:00 PM",
                      "7:00 PM",
                      "9:00 PM",
                      "11:00 PM",
                      "1:00 AM",
                    ].map((time, idx: number) => (
                      <button
                        onClick={() => {
                          setDetails((prev) => {
                            if (prev.selectedTime !== time) {
                              return { ...prev, selectedTime: time };
                            }
                            return prev;
                          });
                          setSubmitInspectionPayload((prev) => {
                            if (prev.inspectionTime !== time) {
                              return { ...prev, inspectionTime: time };
                            }
                            return prev;
                          });
                        }}
                        className={`border-[1px] border-[#A8ADB7] h-[57px] rounded-md ${
                          details.selectedTime === time
                            ? "bg-[#8DDB90] text-white"
                            : "bg-white text-black hover:bg-gray-100"
                        } text-lg font-medium ${archivo.className} transition-colors duration-200`}
                        type="button"
                        key={idx}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {/**fourth div - Booking details summary */}
                  <div className="p-4 bg-[#8DDB90]/[20%] rounded-md flex flex-col gap-2"> {/* Adjusted padding and gap */}
                    <h3
                      className={`text-lg font-semibold ${archivo.className} text-black`}
                    >
                      Booking details
                    </h3>
                    <p
                      className={`text-lg font-medium ${archivo.className} text-black`}
                    >
                      Date:{" "}
                      <time dateTime={details.selectedDate}>
                        {details.selectedDate}
                      </time>{" "}
                      Time:{" "}
                      <time dateTime={details.selectedTime}>
                        {details.selectedTime}
                      </time>
                    </p>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
            {/**fifth div - Contact Information */}
            <div className="p-5 bg-[#EEF1F1] rounded-md flex flex-col gap-6"> {/* Adjusted padding and gap */}
              <div className="flex flex-col gap-1">
                <h3 className="text-[#0B0D0C] text-xl font-bold">
                  Contact information
                </h3>
                <span className="text-base text-[#515B6F]">
                  Provide your contact information to schedule an inspection and
                  take the next step toward your dream property.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive grid */}
                <Input2
                  id="fullName"
                  name="fullName"
                  placeholder="Full name of the buyer"
                  type="text"
                  heading="Full Name"
                  formikType={formik}
                />
                <Input2
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Active phone number for follow-up"
                  type="tel" // Use 'tel' for phone numbers
                  heading="Phone Number"
                  formikType={formik}
                />
                <Input2
                  id="email"
                  name="email"
                  placeholder="Optional, for communication"
                  type="email"
                  heading="Email"
                  formikType={formik}
                  className="col-span-1 sm:col-span-2" // Span full width on small screens and up
                />
              </div>
            </div>
            {/**buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-4 h-[57px] mt-4"> {/* Responsive buttons, increased gap */}
              <button
                type="submit"
                disabled={!isFormValid || Number(formattedYourPrice.replace(/,/g, "")) > Number(selectedProperty.askingPrice) || Number(formattedYourPrice.replace(/,/g, "")) <= 0} // Disable if form is not valid or price is invalid
                className={`w-full sm:w-1/2 h-full rounded-md font-bold text-lg ${archivo.className} transition-colors duration-200
                  ${
                    isFormValid && Number(formattedYourPrice.replace(/,/g, "")) <= Number(selectedProperty.askingPrice) && Number(formattedYourPrice.replace(/,/g, "")) > 0
                      ? "bg-[#8DDB90] text-white hover:bg-[#7bc47d]"
                      : "bg-[#E0E0E0] text-[#A7A9AD] cursor-not-allowed" // Greyed out for disabled state
                  }`}
              >
                Submit
              </button>
              <button
                onClick={() => closeModal?.(false)} // Use optional chaining
                type="button"
                className={`w-full sm:w-1/2 h-full rounded-md bg-transparent border-[1px] border-[#5A5D63] text-[#414357] font-medium text-lg ${archivo.className} transition-colors duration-200 hover:bg-gray-100`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
        {/* Arrow down indicator for scrollable content */}
        <div className="absolute right-6 bottom-6 z-10 hidden sm:block"> {/* Hidden on small screens if not needed */}
          <div className="w-12 h-12 rounded-full bg-[#8DDB90] flex items-center justify-center animate-bounce shadow-lg">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-white"
              size="lg"
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export { NegiotiatePrice, NegiotiatePriceWithSellerModal };