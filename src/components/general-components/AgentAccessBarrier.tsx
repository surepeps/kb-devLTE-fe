/** @format */

"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldX, Clock, User } from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/context/user-context";

interface AgentAccessBarrierProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireApproval?: boolean;
  customMessage?: string;
}

const AgentAccessBarrier: React.FC<AgentAccessBarrierProps> = ({
  children,
  requireOnboarding = true,
  requireApproval = true,
  customMessage,
}) => {
  const { user } = useUserContext();

  // Allow access if not an agent
  if (!user || user.userType !== "Agent") {
    return <>{children}</>;
  }

  // Check onboarding requirement
  if (requireOnboarding && !user.agentData?.agentType) {
    return (
      <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#09391C] mb-4">
            Complete Your Onboarding
          </h2>
          <p className="text-[#5A5D63] mb-6">
            {customMessage ||
              "You need to complete your agent onboarding process before accessing this feature."}
          </p>
          <Link
            href="/agent/onboard"
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Complete Onboarding
          </Link>
        </motion.div>
      </div>
    );
  }

  // Check approval requirement
  if (requireApproval && user.accountApproved === false) {
    return (
      <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#09391C] mb-4">
            Approval Pending
          </h2>
          <p className="text-[#5A5D63] mb-6">
            {customMessage ||
              "Your agent application is currently under review. You'll be able to access this feature once approved."}
          </p>
          <Link
            href="/agent/under-review"
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Check Status
          </Link>
        </motion.div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default AgentAccessBarrier;
