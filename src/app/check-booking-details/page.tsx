"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import toast from "react-hot-toast";
import Loading from "@/components/loading-component/loading";
import { Search, ShieldCheck, ArrowRight } from "lucide-react";

export default function CheckBookingDetailsPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Enter your booking code");
      return;
    }

    try {
      setLoading(true);
      const url = `${URLS.BASE}/inspections/bookings/verify-code`;
      const res: any = await POST_REQUEST(url, { code: trimmed });
      if (res?.success === false) throw new Error(res?.message || "Invalid code");
      toast.success("Booking code verified");
      router.push(`/booking-details/${encodeURIComponent(trimmed)}`);
    } catch (err: any) {
      toast.error(err?.message || "Unable to verify code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-emerald-600" />
          <h1 className="text-xl font-bold text-[#09391C]">Check Booking Details</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">Enter the booking code you received to view your booking information.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Code</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. KB-9F2A7C"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent text-base"
                autoComplete="off"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#09391C] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0B423D] disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 inline-block border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              <>
                Verify Code
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">Your code is case-insensitive. Keep it private.</p>
        </form>
      </div>
    </div>
  );
}
