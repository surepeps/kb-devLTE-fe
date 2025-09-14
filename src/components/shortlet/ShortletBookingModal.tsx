/** @format */

"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@/components/general-components/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Calendar, Clock, Users } from "lucide-react";

interface ShortletBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  mode: "instant" | "request";
}

const getNightlyRate = (property: any): number => {
  const sd = property?.shortletDetails;
  const nightlyFromDetails = sd?.pricing?.nightly;
  if (typeof nightlyFromDetails === "number" && nightlyFromDetails > 0) return nightlyFromDetails;

  const dailyLegacy = property?.pricing?.daily;
  if (typeof dailyLegacy === "number" && dailyLegacy > 0) return dailyLegacy;

  const weeklyLegacy = property?.pricing?.weekly;
  if (typeof weeklyLegacy === "number" && weeklyLegacy > 0) return Math.round(weeklyLegacy / 7);

  const monthlyLegacy = property?.pricing?.monthly;
  if (typeof monthlyLegacy === "number" && monthlyLegacy > 0) return Math.round(monthlyLegacy / 30);

  const duration = property?.shortletDuration;
  const price = Number(property?.price || 0);
  if (price > 0 && typeof duration === "string") {
    const divisor = duration === "Daily" ? 1 : duration === "Weekly" ? 7 : duration === "Monthly" ? 30 : 0;
    if (divisor > 0) return Math.round(price / divisor);
  }

  return price;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

// Custom input for DatePicker
const DateTimeInput = React.forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; placeholder?: string; error?: string; label: string }>(
  ({ value, onClick, placeholder, error, label }, ref) => (
    <div className="w-full">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        className={`w-full text-left bg-white border ${error ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 flex items-center justify-between hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200`}
      >
        <span className={`flex items-center gap-2 text-sm ${value ? "text-gray-900" : "text-gray-400"}`}>
          <Calendar className="w-4 h-4 text-emerald-600" />
          {value || placeholder}
        </span>
        <Clock className="w-4 h-4 text-gray-400" />
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
);
DateTimeInput.displayName = "DateTimeInput";

const ShortletBookingModal: React.FC<ShortletBookingModalProps> = ({ isOpen, onClose, property, mode }) => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [successOpen, setSuccessOpen] = useState(false);

  const maxGuests = Number(property?.shortletDetails?.maxGuests ?? property?.maxGuests ?? 10);
  const nightly = useMemo(() => getNightlyRate(property), [property]);
  const shortletDuration = property?.shortletDuration;
  const listedPrice = Number(property?.price || 0);
  const cleaningFee = Number(property?.shortletDetails?.pricing?.cleaningFee ?? property?.pricing?.cleaningFee ?? 0);
  const securityDeposit = Number(property?.shortletDetails?.pricing?.securityDeposit ?? property?.pricing?.securityDeposit ?? 0);
  const durationUnit = shortletDuration === "Daily" ? "day" : shortletDuration === "Weekly" ? "week" : shortletDuration === "Monthly" ? "month" : shortletDuration;

  // Validation schemas per step
  const step1Schema = Yup.object({
    checkIn: Yup.date().typeError("Select check-in").required("Check-in is required"),
    checkOut: Yup.date()
      .typeError("Select check-out")
      .required("Check-out is required")
      .when("checkIn", (checkIn: Date, schema: any) => (checkIn ? schema.min(checkIn, "Check-out must be after check-in") : schema)),
    guests: Yup.number().min(1, "Min 1 guest").max(maxGuests, `Max ${maxGuests}`).required("Guests is required"),
    note: Yup.string().max(500, "Note too long").optional(),
  });

  const step2Schema = Yup.object({
    fullName: Yup.string().trim().min(2, "Enter full name").required("Full name is required"),
    email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
    phoneNumber: Yup.string().trim().min(7, "Enter a valid phone").required("Phone is required"),
    whatsAppNumber: Yup.string().trim().optional(),
  });

  const formik = useFormik({
    initialValues: {
      checkIn: null as Date | null,
      checkOut: null as Date | null,
      guests: 1,
      note: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      whatsAppNumber: "",
    },
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      const nights = values.checkIn && values.checkOut ? Math.ceil((values.checkOut.getTime() - values.checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      const total = nights > 0 ? nightly * nights : 0;

      const apiPayload: any = {
        bookedBy: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phoneNumber: values.phoneNumber.trim(),
          ...(values.whatsAppNumber.trim() ? { whatsAppNumber: values.whatsAppNumber.trim() } : {}),
        },
        propertyId: property?._id,
        bookingDetails: {
          checkInDateTime: values.checkIn?.toISOString(),
          checkOutDateTime: values.checkOut?.toISOString(),
          guestNumber: values.guests,
          ...(values.note.trim() ? { note: values.note.trim() } : {}),
        },
        paymentDetails: {
          amountToBePaid: total,
        },
        bookingMode: mode,
      };

      try {
        const token = Cookies.get("token");
        const url = `${URLS.BASE}/inspections/book-request`;
        const response: any = await toast.promise(
          POST_REQUEST(url, apiPayload, token),
          {
            loading: mode === "instant" ? "Initializing payment..." : "Submitting booking request...",
            success: mode === "instant" ? "Payment initialized" : "Request submitted",
            error: "Failed to submit. Please try again.",
          }
        );

        if (mode === "request") {
          setSuccessOpen(true);
          return;
        }

        const payUrl = response?.data?.transaction?.authorizedUrl || response?.transaction?.authorizedUrl;
        if (payUrl) {
          window.location.href = payUrl;
          return;
        }
        const q = new URLSearchParams({ amount: String(total || 0), purpose: "shortlet-booking" });
        router.push(`/payment-details?${q.toString()}`);
      } catch {}
    },
  });

  const nights = useMemo(() => {
    const { checkIn, checkOut } = formik.values;
    if (!checkIn || !checkOut) return 0;
    const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [formik.values.checkIn, formik.values.checkOut]);

  const total = useMemo(() => (nights > 0 ? nightly * nights : 0), [nightly, nights]);

  const proceedNext = async () => {
    try {
      await step1Schema.validate(formik.values, { abortEarly: false });
      setStep(2);
    } catch (err: any) {
      const errors: Record<string, string> = {};
      (err.inner || []).forEach((e: any) => {
        if (e.path) errors[e.path] = e.message;
      });
      formik.setErrors(errors);
      toast.error("Fix the highlighted fields");
    }
  };

  const submitFinal = async () => {
    try {
      await step2Schema.validate(formik.values, { abortEarly: false });
      await formik.handleSubmit();
    } catch (err: any) {
      const errors: Record<string, string> = {};
      (err.inner || []).forEach((e: any) => {
        if (e.path) errors[e.path] = e.message;
      });
      formik.setErrors(errors);
      toast.error("Fix the highlighted fields");
    }
  };

  const resetForm = () => {
    setStep(1);
    formik.resetForm();
  };

  const footerButtonText = step === 1 ? "Next" : mode === "instant" ? "Proceed to Payment" : "Submit Request";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden"
          onClick={onClose}
        >
          {/* Success Modal for Request Mode */}
          <AnimatePresence>
            {successOpen && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
                  <h3 className="text-xl font-semibold text-emerald-700">Booking Request Submitted</h3>
                  <p className="text-sm text-gray-700 mt-2">Your booking request has been submitted successfully. Please await the owner's response.</p>
                  <p className="text-sm text-gray-600 mt-1">Would you like to book more?</p>
                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      onClick={() => {
                        setSuccessOpen(false);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <Button
                      value="Book More"
                      type="button"
                      onClick={() => {
                        setSuccessOpen(false);
                        resetForm();
                      }}
                      className="px-6 bg-[#0B423D] hover:bg-[#09391C] text-white font-bold rounded-lg"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{mode === "instant" ? "Instant Booking" : "Request to Book"}</h2>
              <p className="text-sm text-gray-600 mt-1">Follow the steps to complete your {mode === "instant" ? "instant" : "request"} booking</p>
            </div>

            <div className="p-6">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-3 mb-4">
                {[1, 2].map((s) => (
                  <div key={s} className={`h-2 w-24 rounded-full ${step === s ? "bg-emerald-600" : "bg-gray-200"}`} />
                ))}
              </div>

              {/* Flow instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 text-xs leading-relaxed mb-4">
                {mode === "instant" ? (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Select check-in/out dates and times. Add guests and an optional note.</li>
                    <li>Enter your contact information (used for receipt and support).</li>
                    <li>Proceed to secure payment. Once paid, your booking is confirmed instantly.</li>
                    <li>Notifications are sent to you and the host with full booking details.</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Select preferred check-in/out dates and times. Add guests and an optional note.</li>
                    <li>Enter your contact information (used to contact you about approval).</li>
                    <li>Submit your request. The host has a limited time window to accept.</li>
                    <li>If accepted, you’ll be prompted to complete payment to confirm the booking. If declined/expired, you’ll be notified.</li>
                  </ul>
                )}
              </div>

              {step === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    selected={formik.values.checkIn}
                    onChange={(date) => {
                      formik.setFieldValue("checkIn", date);
                      const co = formik.values.checkOut;
                      if (co && date && co <= date) {
                        const next = new Date(date);
                        next.setDate(next.getDate() + 1);
                        next.setHours(11, 0, 0, 0);
                        formik.setFieldValue("checkOut", next);
                      }
                    }}
                    minDate={new Date()}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="Pp"
                    customInput={
                      <DateTimeInput
                        label="Check-in (Date & Time)"
                        placeholder="Select check-in date & time"
                        error={formik.errors.checkIn as string}
                      />
                    }
                  />

                  <DatePicker
                    selected={formik.values.checkOut}
                    onChange={(date) => formik.setFieldValue("checkOut", date)}
                    minDate={formik.values.checkIn || new Date()}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="Pp"
                    disabled={!formik.values.checkIn}
                    customInput={
                      <DateTimeInput
                        label="Check-out (Date & Time)"
                        placeholder={formik.values.checkIn ? "Select check-out date & time" : "Pick check-in first"}
                        error={formik.errors.checkOut as string}
                      />
                    }
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Guests</label>
                    <div className={`flex items-center bg-white border ${formik.errors.guests ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 gap-2`}>
                      <Users className="w-4 h-4 text-emerald-600" />
                      <input
                        type="number"
                        min={1}
                        max={maxGuests}
                        value={formik.values.guests}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "guests",
                            Math.min(maxGuests, Math.max(1, Number(e.target.value) || 1))
                          )
                        }
                        className="w-full outline-none text-sm"
                      />
                    </div>
                    {formik.errors.guests && (
                      <p className="mt-1 text-xs text-red-500">{formik.errors.guests as string}</p>
                    )}
                    <p className="text-xs text-gray-500">Max {maxGuests} guest(s)</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
                    <textarea
                      value={formik.values.note}
                      onChange={formik.handleChange}
                      name="note"
                      rows={3}
                      placeholder="Any special requests, arrival time info, or questions for the host"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-sm font-semibold">{shortletDuration || "-"}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Listed Price</p>
                      <p className="text-sm font-semibold">{formatCurrency(listedPrice)}{shortletDuration ? ` / ${durationUnit}` : ""}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Nightly</p>
                      <p className="text-sm font-semibold">{formatCurrency(nightly)}</p>
                    </div>
                    {cleaningFee > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Cleaning Fee</p>
                        <p className="text-sm font-semibold">{formatCurrency(cleaningFee)}</p>
                      </div>
                    )}
                    {securityDeposit > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Security Deposit</p>
                        <p className="text-sm font-semibold">{formatCurrency(securityDeposit)}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Nights</p>
                      <p className="text-sm font-semibold">{nights}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Estimated Total</p>
                      <p className="text-base font-bold text-emerald-700">{formatCurrency(total)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      className={`w-full border rounded-lg px-3 py-2 ${formik.errors.fullName ? "border-red-400" : "border-gray-300"}`}
                      placeholder="Enter your full name"
                    />
                    {formik.errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">{formik.errors.fullName as string}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className={`w-full border rounded-lg px-3 py-2 ${formik.errors.email ? "border-red-400" : "border-gray-300"}`}
                      placeholder="you@example.com"
                    />
                    {formik.errors.email && (
                      <p className="mt-1 text-xs text-red-500">{formik.errors.email as string}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      className={`w-full border rounded-lg px-3 py-2 ${formik.errors.phoneNumber ? "border-red-400" : "border-gray-300"}`}
                      placeholder="Primary phone number"
                    />
                    {formik.errors.phoneNumber && (
                      <p className="mt-1 text-xs text-red-500">{formik.errors.phoneNumber as string}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsAppNumber"
                      value={formik.values.whatsAppNumber}
                      onChange={formik.handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Optional WhatsApp number"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (step === 2) setStep(1); else onClose();
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {step === 2 ? "Back" : "Cancel"}
              </button>
              <Button
                value={footerButtonText}
                type="button"
                onClick={step === 1 ? proceedNext : submitFinal}
                className={`px-6 ${mode === "instant" ? "bg-[#0B423D] hover:bg-[#09391C]" : "bg-[#1976D2] hover:bg-[#1565C0]"} text-white font-bold rounded-lg`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShortletBookingModal;
