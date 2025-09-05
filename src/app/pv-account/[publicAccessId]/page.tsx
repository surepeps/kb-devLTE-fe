"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import { CheckCircle2, MapPin, Phone, Mail, Star, Crown, Home, Loader2 } from "lucide-react";

interface PublicListing {
  _id: string;
  title: string;
  price: number;
  status: string;
  location: { state: string; city: string; address: string };
  images: string[];
  createdAt: string;
}

interface PublicAgentResponse {
  success: boolean;
  message: string;
  data?: {
    user: { id: string; name: string; email: string; phoneNumber: string; profile_picture?: string; publicUrl?: string };
    agent: {
      address: { street: string; homeNo: string; state: string; localGovtArea: string };
      regionOfOperation: string[];
      agentType: string;
      companyAgent?: string | null;
      profileBio: string;
      specializations: string[];
      languagesSpoken: string[];
      servicesOffered: string[];
      achievements?: { title: string; description: string; fileUrl?: string; dateAwarded?: string }[];
      featuredListings?: PublicListing[];
    };
    stats: { totalProperties: number; activeProperties: number; inactiveProperties: number; closedProperties: number };
    activeSubscription?: { _id: string; plan: string; status: "active" | "inactive" | string; startDate: string; endDate: string };
  };
}

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3">
    <div className="text-[#0B572B]">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-[#09391C]">{value}</div>
      <div className="text-sm text-[#5A5D63]">{label}</div>
    </div>
  </div>
);

export default function PublicAgentPage() {
  const params = useParams();
  const router = useRouter();
  const publicAccessId = params?.publicAccessId as string;

  const [loading, setLoading] = useState(true);
  const [resp, setResp] = useState<PublicAgentResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!publicAccessId) return;
      setLoading(true);
      const res = await GET_REQUEST<PublicAgentResponse>(`${URLS.BASE}/pv-account/${publicAccessId}`);
      setResp(res as any);
      setLoading(false);
    };
    fetchData();
  }, [publicAccessId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8DDB90]" size={36} />
      </div>
    );
  }

  if (!resp?.success || !resp.data) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-[#09391C] mb-2">Profile Unavailable</h1>
          <p className="text-[#5A5D63]">{resp?.message || "This agent profile is not available. They may not have public access enabled."}</p>
        </div>
      </div>
    );
  }

  const { user, agent, stats, activeSubscription } = resp.data;
  const verified = activeSubscription?.status === "active";

  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B572B] to-[#8DDB90]">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 overflow-hidden border-2 border-white">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0) || "A"}
              </div>
            )}
          </div>
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              {verified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <CheckCircle2 size={16} className="text-white" /> Verified Agent
                </span>
              )}
              {activeSubscription?.plan && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Crown size={16} /> {activeSubscription.plan}
                </span>
              )}
            </div>
            <p className="mt-2 text-white/90 max-w-3xl">{agent.profileBio}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-white/90">
              <span className="inline-flex items-center gap-2"><Mail size={16}/> {user.email}</span>
              <span className="inline-flex items-center gap-2"><Phone size={16}/> {user.phoneNumber}</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16}/> {agent.address.state}, {agent.address.localGovtArea}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Properties" value={stats.totalProperties} icon={<Home size={20} />} />
          <StatCard label="Active" value={stats.activeProperties} icon={<Star size={20} />} />
          <StatCard label="Inactive" value={stats.inactiveProperties} icon={<Star size={20} />} />
          <StatCard label="Closed" value={stats.closedProperties} icon={<Star size={20} />} />
        </div>

        {/* Specializations & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-3">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {agent.specializations.map((s) => (
                <span key={s} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-[#09391C]">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-3">Services</h2>
            <div className="flex flex-wrap gap-2">
              {agent.servicesOffered.map((s) => (
                <span key={s} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-[#09391C]">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Regions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#09391C] mb-3">Regions of Operation</h2>
          <div className="flex flex-wrap gap-2">
            {agent.regionOfOperation.map((r) => (
              <span key={r} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm">{r}</span>
            ))}
          </div>
        </div>

        {/* Featured Listings */}
        {agent.featuredListings && agent.featuredListings.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#09391C]">Featured Listings</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agent.featuredListings.map((p) => (
                <div key={p._id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-gray-100">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#09391C] line-clamp-2">{p.title}</h3>
                    <div className="text-[#0B572B] font-bold mt-1">₦{p.price.toLocaleString()}</div>
                    <div className="text-sm text-[#5A5D63] mt-1">{p.location.city}, {p.location.state}</div>
                    <div className="text-xs text-gray-500 mt-2">{new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
