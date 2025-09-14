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

interface ShortletBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  mode: "instant" | "request";
}

const getNightlyRate = (property: any): number => {
  const daily = property?.pricing?.daily;
  if (typeof daily === "number" && daily > 0) return daily;
  const weekly = property?.pricing?.weekly;
  const monthly = property?.pricing?.monthly;
  if (typeof weekly === "number" && weekly > 0) return Math.round(weekly / 7);
  if (typeof monthly === "number" && monthly > 0) return Math.round(monthly / 30);
  return Number(property?.price || 0);
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

const StepIndicator: React.FC<{ step: 1 | 2 }> = ({ step }) => (
  <div className="flex items-center justify-center gap-3 mb-4">
    {[1, 2].map((s) => (
      <div key={s} className={`h-2 w-24 rounded-full ${step === s ? "bg-emerald-600" : "bg-gray-200"}`} />
    ))}
  </div>
);

const InfoBox: React.FC<{ mode: "instant" | "request" }> = ({ mode }) => (
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
);

const ShortletBookingModal: React.FC<ShortletBookingModalProps> = ({ isOpen, onClose, property, mode }) => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [note, setNote] = useState<string>("");

  // Step 2
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [checkIn, checkOut]);

  const nightly = useMemo(() => getNightlyRate(property), [property]);
  const total = useMemo(() => (nights > 0 ? nightly * nights : 0), [nightly, nights]);

  const maxGuests = Number(property?.maxGuests || 10);

  const validStep1 = !!checkIn && !!checkOut && checkOut > checkIn && guests >= 1 && guests <= maxGuests;
  const validStep2 = fullName.trim().length > 1 && /.+@.+\..+/.test(email) && phoneNumber.trim().length >= 7;

  const saveDraft = (status: "draft" | "request" | "instant") => {
    const payload = {
      status,
      mode,
      propertyId: property?._id,
      title: property?.propertyType || "Shortlet",
      location: property?.location,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      guests,
      note: note.trim(),
      nights,
      nightly,
      total,
      contact: { fullName: fullName.trim(), email: email.trim(), phoneNumber: phoneNumber.trim(), whatsAppNumber: whatsAppNumber.trim() },
    };
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("shortletBookingDraft", JSON.stringify(payload));
      }
    } catch {}
    return payload;
  };

  const [successOpen, setSuccessOpen] = useState(false);

  const resetForm = () => {
    setStep(1);
    setCheckIn(null);
    setCheckOut(null);
    setGuests(1);
    setNote("");
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setWhatsAppNumber("");
  };

  const handlePrimary = async () => {
    if (step === 1) {
      if (!validStep1) {
        toast.error("Enter valid dates, times and guest count");
        return;
      }
      setStep(2);
      return;
    }

    if (!validStep2) {
      toast.error("Fill in your contact information correctly");
      return;
    }

    const token = Cookies.get("token");

    const apiPayload: any = {
      bookedBy: {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        ...(whatsAppNumber.trim() ? { whatsAppNumber: whatsAppNumber.trim() } : {}),
      },
      propertyId: property?._id,
      bookingDetails: {
        checkInDateTime: checkIn?.toISOString(),
        checkOutDateTime: checkOut?.toISOString(),
        guestNumber: guests,
        ...(note.trim() ? { note: note.trim() } : {}),
      },
      paymentDetails: {
        amountToBePaid: total,
      },
      bookingMode: mode,
    };

    try {
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
    } catch (e) {
      // Error handled by toast
    }
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
              <StepIndicator step={step} />
              <InfoBox mode={mode} />

              {step === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Check-in (Date & Time)</label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => {
                        setCheckIn(date);
                        if (checkOut && date && checkOut <= date) {
                          const next = new Date(date);
                          next.setDate(next.getDate() + 1);
                          next.setHours(11, 0, 0, 0);
                          setCheckOut(next);
                        }
                      }}
                      minDate={new Date()}
                      showTimeSelect
                      timeIntervals={30}
                      dateFormat="Pp"
                      placeholderText="Select check-in date & time"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Check-out (Date & Time)</label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      minDate={checkIn || new Date()}
                      showTimeSelect
                      timeIntervals={30}
                      dateFormat="Pp"
                      disabled={!checkIn}
                      placeholderText={checkIn ? "Select check-out date & time" : "Pick check-in first"}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={maxGuests}
                      value={guests}
                      onChange={(e) => setGuests(Math.min(maxGuests, Math.max(1, Number(e.target.value) || 1)))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <p className="text-xs text-gray-500">Max {maxGuests} guest(s)</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Any special requests, arrival time info, or questions for the host"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Nightly</p>
                      <p className="text-sm font-semibold">{formatCurrency(nightly)}</p>
                    </div>
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
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Primary phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
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
                onClick={handlePrimary}
                disabled={step === 1 ? !validStep1 : !validStep2}
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
