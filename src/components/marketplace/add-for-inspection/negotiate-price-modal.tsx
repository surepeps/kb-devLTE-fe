/** @format */

"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faClose,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { archivo } from "@/styles/font";
import Input from "@/components/general-components/Input";
import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import { SubmitInspectionPayloadProp } from "../types/payload";
import { format } from "date-fns";
import { useMarketplace } from "@/context/marketplace-context";

// --- Reusable Modal Wrapper Component ---
type ModalWrapperProps = {
  isOpened: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Optional for additional styling
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpened,
  onClose,
  children,
  className,
}) => {
  useEffect(() => {
    // Prevent scrolling on the body when the modal is open
    if (isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset"; // Clean up on unmount
    };
  }, [isOpened]);

  if (!isOpened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/[30%] transition-opacity duration-300">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`relative w-[95%] md:w-full max-w-lg lg:max-w-xl mx-auto rounded-[4px] bg-[#FFFFFF] shadow-lg py-10 px-5 md:px-10 flex flex-col gap-6 ${className}`}
      >
        <div className="absolute top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
          >
            <FontAwesomeIcon icon={faClose} width={20} height={20} color="#181336" />
          </motion.button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};
// --- End Reusable Modal Wrapper Component ---

type NegotiationModalProps = {
  id: string | null;
  isOpened: boolean;
  askingPrice: number | string | undefined;
  yourPrice: number | string | undefined;
};

const NegiotiatePrice = ({
  allNegotiation,
  setAllNegotiation,
  getID,
  currentIndex,
  setCurrentIndex,
  setSelectPreferableInspectionDateModalOpened, // This might not be needed directly here anymore if flow changes
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
  const [yourPriceInput, setYourPriceInput] = useState<string>(""); // Use a distinct state for input formatting

  const formatNumber = useCallback((val: string) => {
    const containsLetters = /[A-Za-z]/.test(val);
    if (containsLetters) {
      return "";
    }
    const numericValue = val.replace(/,/g, "");
    return numericValue ? Number(numericValue).toLocaleString() : "";
  }, []);

  useEffect(() => {
    const findSelectedCard = allNegotiation.find((item) => item.id === getID);

    if (findSelectedCard) {
      setSelectedProperty({
        id: findSelectedCard.id,
        askingPrice: findSelectedCard.askingPrice,
        yourPrice: findSelectedCard.yourPrice,
        isOpened: findSelectedCard.isOpened,
      });
      // Initialize the input field with the existing negotiated price, if any
      if (findSelectedCard.yourPrice) {
        setYourPriceInput(formatNumber(String(findSelectedCard.yourPrice)));
      }
    }
  }, [allNegotiation, getID, formatNumber]);

  const handleSubmit = () => {
    if (!getID || !selectedProperty.yourPrice) return;

    const numericYourPrice = Number(
      String(selectedProperty.yourPrice).replace(/,/g, ""),
    ); // Ensure it's a number for context

    // Save negotiated price to marketplace context
    if (
      typeof selectedProperty.askingPrice === "number" &&
      getID
    ) {
      addNegotiatedPrice(
        getID,
        selectedProperty.askingPrice,
        numericYourPrice,
      );
    }

    // Update the payload
    setSubmitInspectionPayload((prev) => {
      const updatedProperties =
        prev.properties?.map((prop) =>
          prop.propertyId === getID
            ? {
                ...prop,
                negotiationPrice: numericYourPrice,
              }
            : prop,
        ) || [];

      // Check if any property has a negotiation price set
      const isAnyNegotiated = updatedProperties.some(
        (p) =>
          typeof p.negotiationPrice === "number" && !isNaN(p.negotiationPrice),
      );

      return {
        ...prev,
        properties: updatedProperties,
        isNegotiating: isAnyNegotiated,
      };
    });

    // Move to the next index or close if it's the last one
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setCurrentIndex(allNegotiation.length + 1); // This will effectively close the modal
  };

  const isModalOpen = currentIndex < allNegotiation.length && allNegotiation[currentIndex]?.id === getID;


  return (
    <ModalWrapper isOpened={isModalOpen} onClose={handleCloseModal}>
      <form
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="w-full flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <h2 className={`${archivo.className} font-bold text-2xl text-black text-center`}>
            Negotiate price with the seller
          </h2>
          <p className={`${archivo.className} text-[#515B6F] text-lg text-center`}>
            You&apos;re welcome to negotiate the price directly with the seller even
            before arranging an inspection. Please enter your proposed offer below
          </p>
        </div>
        <Input
          label="Asking Price"
          name="asking_price"
          type="text"
          isDisabled
          value={Number(selectedProperty.askingPrice).toLocaleString()}
          onChange={() => {}} // No change allowed for asking price
        />
        <Input
          label="Enter your price"
          name="your_price"
          type="text"
          placeholder="Enter amount"
          value={yourPriceInput}
          onChange={(event) => {
            const rawValue = (
              event.target as HTMLInputElement | HTMLTextAreaElement
            ).value;
            const formatted = formatNumber(rawValue);
            setYourPriceInput(formatted);

            const numericValue = Number(rawValue.replace(/,/g, ""));

            setSelectedProperty((prev) => ({
              ...prev,
              yourPrice: numericValue.toString(), // Store as string to avoid precision issues
            }));
          }}
        />

        <div className="w-full flex gap-4 mt-4">
          <button
            className={`h-14 bg-[#8DDB90] flex-1 text-lg text-white font-bold ${archivo.className}`}
            type="submit"
          >
            Submit
          </button>
          <button
            onClick={handleCloseModal}
            className={`h-14 bg-white border border-[#5A5D63] flex-1 text-lg text-[#5A5D63] font-bold ${archivo.className}`}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// --- Second Negotiation Modal ---

type NegotiateWithSellerProps = {
  isOpened: boolean; // Control visibility via prop
  onClose: () => void; // Standard close handler
  allNegotiation: any[];
  getID: string | null;
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
  isOpened,
  onClose,
  allNegotiation,
  getID,
  setIsProvideTransactionDetails,
  setActionTracker,
  actionTracker,
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
      if (date.getDay() !== 0) {
        dates.push(format(date, "MMM d, yyyy"));
      }
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }, []);

  const availableDates = getAvailableDates();

  const [details, setDetails] = useState<DetailsProps>({
    selectedDate: availableDates[0],
    selectedTime: "9:00 AM",
  });

  useEffect(() => {
    if (availableDates.length > 0) {
      setSubmitInspectionPayload((prev) => ({
        ...prev,
        inspectionDate: availableDates[0],
        inspectionTime: "9:00 AM",
      }));
    }
  }, [availableDates, setSubmitInspectionPayload]);

  const formatNumber = useCallback((val: string) => {
    const containsLetters = /[A-Za-z]/.test(val);
    if (containsLetters) {
      return "";
    }
    const numericValue = val.replace(/,/g, "");
    return numericValue ? Number(numericValue).toLocaleString() : "";
  }, []);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email format"), // Email can be optional if not required
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema,
    onSubmit: (values: ContactProps) => {
      // Save negotiated price to marketplace context if available
      if (
        selectedProperty.yourPrice &&
        typeof selectedProperty.askingPrice === "number" &&
        getID
      ) {
        addNegotiatedPrice(
          getID,
          selectedProperty.askingPrice,
          Number(selectedProperty.yourPrice),
        );
      }

      setActionTracker([
        ...actionTracker,
        { lastPage: "SelectPreferableInspectionDate" },
      ]);
      setSubmitInspectionPayload((prev) => ({
        ...prev,
        requestedBy: {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
        },
        inspectionDate: details.selectedDate,
        inspectionTime: details.selectedTime,
        isNegotiating: prev.properties.some(
          (p) => p.negotiationPrice !== undefined,
        ),
      }));

      setIsProvideTransactionDetails(true);
      onClose(); // Close the modal
    },
  });

  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(true); // For inspection details toggle
  const [formattedYourPrice, setFormattedYourPrice] = useState<string>("");

  useEffect(() => {
    const findSelectedCard = allNegotiation.find((item) => item.id === getID);
    if (!findSelectedCard) return;

    // Add or update the property in the payload
    setSubmitInspectionPayload((prev) => {
      const existingProps = [...(prev.properties || [])];
      const exists = existingProps.find(
        (p) => p.propertyId === findSelectedCard._id,
      );

      if (!exists) {
        existingProps.push({
          propertyId: findSelectedCard._id,
          negotiationPrice: undefined,
        });
      }

      return {
        ...prev,
        properties: existingProps,
      };
    });

    // Update UI state
    setSelectedProperty({
      id: findSelectedCard._id,
      askingPrice: findSelectedCard?.price ?? findSelectedCard?.rentalPrice,
      yourPrice: "",
      isOpened: false,
    });

    // Reset formatted value
    setFormattedYourPrice("");
  }, [allNegotiation, getID, setSubmitInspectionPayload]);


  const isYourPriceHigherThanAsking =
    formattedYourPrice &&
    Number(formattedYourPrice.replace(/,/g, "")) >
      Number(selectedProperty.askingPrice);

  const areAllContactFieldsFilled =
    formik.values.fullName !== "" &&
    formik.values.phoneNumber !== "";


  return (
    <ModalWrapper isOpened={isOpened} onClose={onClose} className="max-h-[90vh] overflow-y-auto">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className={`${archivo.className} font-bold text-2xl text-black text-center`}>
            Negotiate price with the seller
          </h2>
          <p className={`${archivo.className} text-[#515B6F] text-lg text-center`}>
            You&apos;re welcome to negotiate the price directly with the seller even
            before arranging an inspection. Please enter your proposed offer below
          </p>
        </div>
        <Input
          label="Asking Price"
          name="asking_price"
          type="text"
          isDisabled
          value={Number(selectedProperty.askingPrice).toLocaleString()}
          onChange={() => {}}
        />
        <Input
          label="Enter your price"
          name="enter_your_price"
          type="text"
          placeholder="Enter amount"
          value={formattedYourPrice}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = event.target.value;
            const numericValue = Number(rawValue.replace(/,/g, ""));
            const askingPrice = Number(selectedProperty.askingPrice);

            if (numericValue > askingPrice && askingPrice > 0) {
              // Optionally provide feedback to the user, but don't update state
            }

            const formatted = formatNumber(rawValue);
            setFormattedYourPrice(formatted);

            setSelectedProperty((prev) => ({
              ...prev,
              yourPrice: numericValue,
            }));

            setSubmitInspectionPayload((prev) => {
              const updatedProperties = prev.properties.map((item) => {
                if (item.propertyId === selectedProperty.id) {
                  return {
                    ...item,
                    negotiationPrice: numericValue,
                  };
                }
                return item;
              });

              const anyNegotiation = updatedProperties.some(
                (item) => Number(item.negotiationPrice) > 0,
              );

              return {
                ...prev,
                properties: updatedProperties,
                isNegotiating: anyNegotiation,
              };
            });
          }}
        />

        {isYourPriceHigherThanAsking && (
          <p className="text-red-500 text-sm mt-1">
            Your price cannot exceed the asking price of ₦
            {Number(selectedProperty.askingPrice).toLocaleString()}
          </p>
        )}

        <p className="text-[#1976D2] font-medium text-lg">
          A fee of ₦10,000 will be charged for inspection and negotiation
          before your request is sent to the seller.
        </p>

        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center gap-4 border-b border-black pb-2">
            <h2 className={`font-bold text-black ${archivo.className} text-xl`}>
              Select preferable inspection Date
            </h2>
            <FontAwesomeIcon
              icon={isSectionOpen ? faCaretUp : faCaretDown}
              onClick={() => setIsSectionOpen(!isSectionOpen)}
              size="sm"
              width={24}
              height={24}
              className="w-6 h-6 cursor-pointer transition-all duration-300"
            />
          </div>
          <AnimatePresence>
            {isSectionOpen && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5 overflow-hidden"
              >
                <div className="overflow-x-auto w-full flex gap-4 pb-2 hide-scrollbar border-b border-[#C7CAD0]">
                  {availableDates.map((date: string, idx: number) => (
                    <button
                      type="button"
                      onClick={() => {
                        setDetails({
                          ...details,
                          selectedDate: date,
                        });
                        setSubmitInspectionPayload((prev) => ({
                          ...prev,
                          inspectionDate: date,
                        }));
                      }}
                      className={`h-10 ${
                        details.selectedDate === date
                          ? "bg-[#8DDB90] text-white"
                          : "bg-transparent text-[#5A5D63]"
                      } min-w-fit px-3 text-sm font-medium ${archivo.className} rounded`}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                        setDetails({
                          ...details,
                          selectedTime: time,
                        });
                        setSubmitInspectionPayload((prev) => ({
                          ...prev,
                          inspectionTime: time,
                        }));
                      }}
                      className={`border border-[#A8ADB7] h-14 ${
                        details.selectedTime === time
                          ? "bg-[#8DDB90] text-white"
                          : "bg-transparent text-black"
                      } text-lg font-medium ${archivo.className} rounded`}
                      type="button"
                      key={idx}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-[#8DDB90]/[20%] flex flex-col gap-1 rounded">
                  <h3 className={`text-lg font-semibold ${archivo.className} text-black`}>
                    Booking details
                  </h3>
                  <p className={`text-lg font-medium ${archivo.className} text-black`}>
                    Date: <time>{details.selectedDate}</time> Time:{" "}
                    <time>{details.selectedTime}</time>
                  </p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="p-5 bg-[#EEF1F1] flex flex-col gap-6 rounded">
            <div className="flex flex-col gap-1">
              <h3 className="text-[#0B0D0C] text-xl font-bold">
                Contact information
              </h3>
              <span className="text-base text-[#515B6F]">
                Provide your contact information to schedule an inspection and take
                the next step toward your dream property
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                type="text"
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
                className="col-span-1 sm:col-span-2"
              />
            </div>
          </div>
          <div className="w-full flex gap-4 h-14">
            <button
              type="submit"
              disabled={!areAllContactFieldsFilled || isYourPriceHigherThanAsking}
              className={`flex-1 h-full ${
                areAllContactFieldsFilled && !isYourPriceHigherThanAsking
                  ? "bg-[#8DDB90]"
                  : "bg-[#5A5D63]"
              } text-white font-bold text-lg ${archivo.className} rounded`}
            >
              Submit
            </button>
            <button
              onClick={onClose}
              type="button"
              className={`flex-1 h-full bg-transparent border border-[#5A5D63] text-[#414357] font-medium text-lg ${archivo.className} rounded`}
            >
              Close
            </button>
          </div>
        </div>
      </form>
      {/* Removed the arrow down indicator as scrolling is now handled by modal overflow */}
    </ModalWrapper>
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
    <label htmlFor={id} className={`w-full flex flex-col gap-1 ${className}`}>
      <span className={`text-base text-[#24272C] ${archivo.className} font-medium`}>
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
        className={`px-3 h-12 bg-white border border-[#E9EBEB] w-full text-base placeholder:text-[#A7A9AD] text-black ${archivo.className} rounded outline-none disabled:bg-[#FAFAFA]`}
      />
      {formikType.errors[id] && formikType.touched[id] && (
        <span className={`${archivo.className} text-xs text-red-500`}>
          {formikType.errors[id]}
        </span>
      )}
    </label>
  );
};

export { NegiotiatePrice, NegiotiatePriceWithSellerModal };