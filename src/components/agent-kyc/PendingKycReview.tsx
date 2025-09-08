"use client";
import React from "react";
import { useUserContext } from "@/context/user-context";
import { CheckCircle2, Clock, FileText, MapPin, Briefcase, Award } from "lucide-react";

const Section: React.FC<{ title: string; children: React.ReactNode }>
  = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-[#0C1E1B] flex items-center gap-2">
      {title}
    </h3>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      {children}
    </div>
  </div>
);

const List: React.FC<{ items?: (string | undefined)[] }>
  = ({ items }) => (
  <ul className="list-disc ml-5 text-sm text-[#3A3F3D]">
    {(items || []).filter(Boolean).map((it, idx) => (
      <li key={idx}>{it}</li>
    ))}
  </ul>
);

const PendingKycReview: React.FC = () => {
  const { user } = useUserContext();
  const status = (user as any)?.agentData?.kycStatus as string | undefined;
  const kycData = (user as any)?.agentData?.kycData as any;

  const statusLabel = status === "in_review"
    ? "Your KYC is currently being reviewed"
    : "Your KYC has been submitted and is pending review";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="shrink-0">
              {status === "in_review" ? (
                <Clock className="text-[#8DDB90]" size={40} />
              ) : (
                <CheckCircle2 className="text-[#8DDB90]" size={40} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#0C1E1B]">KYC Pending Review</h2>
              <p className="text-[#4F5B57] mt-1">{statusLabel}.</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <h3 className="text-lg font-semibold text-[#0C1E1B]">Preview of Submitted Details</h3>

            <Section title={<span className="inline-flex items-center gap-2"><FileText size={18} className="text-[#0B572B]"/> Identity Documents</span> as any}>
              <div className="space-y-3">
                {(kycData?.meansOfId || []).map((doc: any, idx: number) => (
                  <div key={idx} className="bg-white border rounded-lg p-3 space-y-2">
                    <div className="text-sm font-medium text-[#0C1E1B]">{doc?.name || `Document ${idx + 1}`}</div>
                    <div className="flex flex-wrap gap-3">
                      {(doc?.docImg || []).map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="block w-28 h-20 border rounded overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`doc-${idx}-${i}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title={<span className="inline-flex items-center gap-2"><Briefcase size={18} className="text-[#0B572B]"/> Professional Information</span> as any}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#3A3F3D]">
                <div><span className="font-medium text-[#0C1E1B]">Agent Type:</span> {kycData?.agentType || "-"}</div>
                <div><span className="font-medium text-[#0C1E1B]">License No.:</span> {kycData?.agentLicenseNumber || "-"}</div>
                <div className="md:col-span-2">
                  <span className="block font-medium text-[#0C1E1B] mb-1">Bio</span>
                  <p className="whitespace-pre-wrap">{kycData?.profileBio || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-[#0C1E1B]">Specializations</span>
                  <List items={kycData?.specializations} />
                </div>
                <div>
                  <span className="font-medium text-[#0C1E1B]">Languages Spoken</span>
                  <List items={kycData?.languagesSpoken} />
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-[#0C1E1B]">Services Offered</span>
                  <List items={kycData?.servicesOffered} />
                </div>
              </div>
            </Section>

            <Section title={<span className="inline-flex items-center gap-2"><MapPin size={18} className="text-[#0B572B]"/> Address & Regions</span> as any}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#3A3F3D]">
                <div><span className="font-medium text-[#0C1E1B]">Street:</span> {kycData?.address?.street || "-"}</div>
                <div><span className="font-medium text-[#0C1E1B]">House No.:</span> {kycData?.address?.homeNo || "-"}</div>
                <div><span className="font-medium text-[#0C1E1B]">State:</span> {kycData?.address?.state || "-"}</div>
                <div><span className="font-medium text-[#0C1E1B]">LGA:</span> {kycData?.address?.localGovtArea || "-"}</div>
                <div className="md:col-span-2">
                  <span className="font-medium text-[#0C1E1B]">Regions of Operation</span>
                  <List items={kycData?.regionOfOperation} />
                </div>
              </div>
            </Section>

            {(kycData?.achievements?.length || 0) > 0 && (
              <Section title={<span className="inline-flex items-center gap-2"><Award size={18} className="text-[#0B572B]"/> Achievements</span> as any}>
                <div className="space-y-3">
                  {kycData.achievements.map((a: any, idx: number) => (
                    <div key={idx} className="bg-white border rounded-lg p-3 text-sm text-[#3A3F3D]">
                      <div className="font-medium text-[#0C1E1B]">{a.title || `Achievement ${idx + 1}`}</div>
                      <div className="text-xs text-gray-500">{a.dateAwarded || ""}</div>
                      <p className="mt-1">{a.description || ""}</p>
                      {a.fileUrl && (
                        <a href={a.fileUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-[#0B572B] underline text-sm">View file</a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingKycReview;
