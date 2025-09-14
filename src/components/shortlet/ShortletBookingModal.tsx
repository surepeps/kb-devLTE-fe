/** @format */

"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@/components/general-components/button";
import { useRouter } from "next/navigation";

interface ShortletBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  mode: "instant" | "request";
}

const getNightlyRate = (property: any): number => {
  // Try structured pricing first
  const daily = property?.pricing?.daily;
  if (typeof daily === "number" && daily > 0) return daily;

  // If only weekly/monthly provided, estimate per-night
  const weekly = property?.pricing?.weekly;
  const monthly = property?.pricing?.monthly;
  if (typeof weekly === "number" && weekly > 0) return Math.round(weekly / 7);
  if (typeof monthly === "number" && monthly > 0) return Math.round(monthly / 30);

  // Fallback to property.price as nightly
  return Number(property?.price || 0);
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

const ShortletBookingModal: React.FC<ShortletBookingModalProps> = ({ isOpen, onClose, property, mode }) => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [checkIn, checkOut]);

  const nightly = useMemo(() => getNightlyRate(property), [property]);
  const total = useMemo(() => (nights > 0 ? nightly * nights : 0), [nightly, nights]);

  const canSubmit = checkIn && checkOut && nights > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    const payload = {
      propertyId: property?._id,
      title: property?.propertyType || "Shortlet",
      location: property?.location,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      guests,
      nights,
      nightly,
      total,
      mode,
    };

    try {
      // Persist booking draft for the payment/details page
      if (typeof window !== "undefined") {
        localStorage.setItem("shortletBookingDraft", JSON.stringify(payload));
      }

      if (mode === "instant") {
        // Redirect to payment page with amount
        const q = new URLSearchParams({ amount: String(total || 0), purpose: "shortlet-booking" });
        router.push(`/payment-details?${q.toString()}`);
      } else {
        // For request-to-book, just save draft and close; backend approval flow is required
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {mode === "instant" ? "Instant Booking" : "Request to Book"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Select your dates and confirm {mode === "instant" ? "payment" : "your request"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={(date) => {
                    setCheckIn(date);
                    if (checkOut && date && checkOut <= date) {
                      const next = new Date(date);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next);
                    }
                  }}
                  minDate={new Date()}
                  placeholderText="Select check-in date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <DatePicker
                  selected={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  minDate={checkIn ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                  disabled={!checkIn}
                  placeholderText={checkIn ? "Select check-out date" : "Pick check-in first"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-600">Nightly</p>
                <p className="text-lg font-semibold">{formatCurrency(nightly)}</p>
                <p className="text-xs text-gray-500 mt-1">{nights} night(s)</p>
                <p className="text-sm font-bold text-emerald-700 mt-1">Total: {formatCurrency(total)}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <Button
                value={mode === "instant" ? "Book Now" : "Submit Request"}
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
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
