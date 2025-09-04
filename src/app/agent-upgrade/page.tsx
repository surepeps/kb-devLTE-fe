/** @format */

"use client";
import React from "react";
import { Suspense } from "react";
import AgentUpgradeFlow from "@/components/agent-upgrade/AgentUpgradeFlow";
import CombinedAuthGuard from "@/logic/combinedAuthGuard";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF1F1] to-[#F8FFFE]">
    <div className="text-center">
      <Loader2 size={48} className="animate-spin text-[#8DDB90] mx-auto mb-4" />
      <p className="text-[#5A5D63] font-medium">Loading agent upgrade flow...</p>
    </div>
  </div>
);

export default function AgentUpgradePage() {
  return (
    <CombinedAuthGuard
      requireAuth={true}
      allowedUserTypes={["Agent"]}
      requireAgentOnboarding={true}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <AgentUpgradeFlow />
      </Suspense>
    </CombinedAuthGuard>
  );
}
