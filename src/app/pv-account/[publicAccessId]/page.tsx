"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <aside className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-emerald-50 overflow-hidden flex items-center justify-center text-3xl font-bold text-emerald-700 mb-4 border border-emerald-100">
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name?.charAt(0) || "A"}</span>
                )}
              </div>

              <h2 className="text-xl font-bold text-[#09391C]">{user.name}</h2>
              <p className="text-sm text-[#5A5D63] mt-1">{agent.agentType || "Agent"}</p>

              <div className="mt-4 flex flex-col gap-2 w-full">
                {verified && (
                  <div className="inline-flex items-center gap-2 justify-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm mx-auto">
                    <CheckCircle2 /> Verified
                  </div>
                )}

                <div className="flex items-center gap-2 justify-center text-sm text-[#5A5D63] mt-2">
                  <Mail size={14} /> <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm text-[#5A5D63]">
                  <Phone size={14} /> <span>{user.phoneNumber}</span>
                </div>

                <div className="mt-4 text-sm text-[#5A5D63] text-center">
                  <div>{agent.address?.street}</div>
                  <div>{agent.address?.localGovtArea}, {agent.address?.state}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-[#09391C]">Languages</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {agent.languagesSpoken?.map((l) => (
                  <span key={l} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-[#09391C]">{l}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-[#09391C]">Services</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {agent.servicesOffered?.map((s) => (
                  <span key={s} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-[#09391C]">{s}</span>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#09391C]">About</h3>
              <p className="text-sm text-[#5A5D63] mt-2">{agent.profileBio}</p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Properties" value={stats.totalProperties} icon={<Home size={20} />} />
                <StatCard label="Active" value={stats.activeProperties} icon={<Star size={20} />} />
                <StatCard label="Inactive" value={stats.inactiveProperties} icon={<Star size={20} />} />
                <StatCard label="Closed" value={stats.closedProperties} icon={<Star size={20} />} />
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-medium text-[#09391C]">Specializations</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {agent.specializations?.map((s) => (
                    <span key={s} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-[#09391C]">{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-medium text-[#09391C]">Regions of Operation</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {agent.regionOfOperation?.map((r) => (
                    <span key={r} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            {agent.featuredListings && agent.featuredListings.length > 0 && (
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#09391C] mb-4">Featured Listings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agent.featuredListings.map((p) => (
                    <div key={p._id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="relative aspect-video bg-gray-100">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-[#09391C] line-clamp-2">{p.title}</h4>
                        <div className="text-[#0B572B] font-bold mt-1">₦{p.price.toLocaleString()}</div>
                        <div className="text-sm text-[#5A5D63] mt-1">{p.location.city}, {p.location.state}</div>
                        <div className="text-xs text-gray-500 mt-2">{new Date(p.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
