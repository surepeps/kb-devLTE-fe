"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import toast from "react-hot-toast";
import Loading from "@/components/loading-component/loading";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Users,
  Home,
  Download,
  Printer,
} from "lucide-react";

interface Property {
  id?: string;
  _id?: string;
  title?: string;
  image?: string;
  price?: number;
  briefType?: string;
}

interface Booking {
  id: string;
  code?: string;
  status: string;
  bookingMode?: string;
  bookedBy?: { fullName?: string; email?: string; phoneNumber?: string };
  bookingDetails?: { checkInDateTime?: string; checkOutDateTime?: string; guestNumber?: number; note?: string };
  paymentDetails?: { amountToBePaid?: number; currency?: string };
  property?: Property | null;
  createdAt?: string;
}

const formatCurrency = (amount?: number, currency = "₦") =>
  typeof amount === "number" && amount > 0
    ? `${currency}${amount.toLocaleString()}`
    : "-";

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "approved") return { label: "Completed", bg: "bg-green-100", text: "text-green-700", Icon: CheckCircle };
  if (s === "pending") return { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-700", Icon: Clock };
  if (s === "cancelled" || s === "rejected") return { label: "Cancelled", bg: "bg-red-100", text: "text-red-700", Icon: XCircle };
  return { label: status || "Unknown", bg: "bg-gray-100", text: "text-gray-700", Icon: Clock };
};

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code || "");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return;
      try {
        setLoading(true);
        const url = `${URLS.BASE}/inspections/bookings/${encodeURIComponent(code)}`;
        const res = await GET_REQUEST<Booking>(url);
        if (!res?.success || !res?.data) throw new Error(res?.message || "Not found");
        // Normalize id/code
        const normalized: Booking = {
          id: (res.data as any).id || (res.data as any)._id || code,
          code: (res.data as any).code || code,
          status: (res.data as any).status || "pending",
          bookingMode: (res.data as any).bookingMode,
          bookedBy: (res.data as any).bookedBy,
          bookingDetails: (res.data as any).bookingDetails,
          paymentDetails: (res.data as any).paymentDetails,
          property: (res.data as any).property || (res.data as any).propertyId || null,
          createdAt: (res.data as any).createdAt,
        };
        setData(normalized);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  const onDownloadJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${data.code || data.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onPrint = () => {
    window.print();
  };

  const badge = statusBadge(data?.status || "");
  const checkIn = data?.bookingDetails?.checkInDateTime ? new Date(data.bookingDetails.checkInDateTime) : null;
  const checkOut = data?.bookingDetails?.checkOutDateTime ? new Date(data.bookingDetails.checkOutDateTime) : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF1F1]">
      <Loading />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF1F1] p-6">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-xl p-8 text-center">
        <XCircle className="mx-auto text-red-500 mb-3" />
        <p className="text-gray-700">Booking not found or code invalid.</p>
        <Link href="/check-booking-details" className="mt-4 inline-block text-[#09391C] font-medium">Try another code</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[#09391C]">
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onPrint} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Printer size={16} /> Print / PDF
            </button>
            <button onClick={onDownloadJson} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download size={16} /> JSON
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {data.property?.image && (
            <div className="w-full h-48 sm:h-64 bg-gray-100 overflow-hidden">
              <img src={data.property.image} alt={data.property.title || "Property"} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-[#09391C]">{data.property?.title || "Property"}</h1>
                <p className="text-sm text-gray-600">Code: <span className="font-mono">{data.code || code}</span></p>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>
                <badge.Icon size={16} /> {badge.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Calendar size={16} /> Dates</div>
                <div className="text-sm"><span className="font-medium">Check-in:</span> {checkIn ? checkIn.toLocaleString() : "-"}</div>
                <div className="text-sm"><span className="font-medium">Check-out:</span> {checkOut ? checkOut.toLocaleString() : "-"}</div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Users size={16} /> Guests & Mode</div>
                <div className="text-sm"><span className="font-medium">Guests:</span> {data.bookingDetails?.guestNumber || 1}</div>
                <div className="text-sm"><span className="font-medium">Mode:</span> {data.bookingMode || "request"}</div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Home size={16} /> Property</div>
                <div className="text-sm"><span className="font-medium">Type:</span> {data.property?.briefType || "Shortlet"}</div>
                <div className="text-sm"><span className="font-medium">Amount:</span> {formatCurrency(data.paymentDetails?.amountToBePaid, data.paymentDetails?.currency || "₦")}</div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><MapPin size={16} /> Contact</div>
                <div className="text-sm"><span className="font-medium">Name:</span> {data.bookedBy?.fullName || "-"}</div>
                <div className="text-sm"><span className="font-medium">Email:</span> {data.bookedBy?.email || "-"}</div>
                <div className="text-sm"><span className="font-medium">Phone:</span> {data.bookedBy?.phoneNumber || "-"}</div>
              </div>
            </div>

            {data.bookingDetails?.note && (
              <div className="mt-4 p-4 border border-gray-100 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Note</div>
                <div className="text-sm text-gray-800">{data.bookingDetails.note}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 print:hidden">Tip: Use the Print button to save a PDF copy of your booking.</div>
      </div>
    </div>
  );
}
