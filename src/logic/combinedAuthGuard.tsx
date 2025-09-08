"use client";

import React, { ReactNode } from "react";
import { useUserContext } from "@/context/user-context";
import Loading from "@/components/loading-component/loading";
import { motion } from "framer-motion";
import { Clock, User, Star, Shield, CreditCard, Crown } from "lucide-react";
import Link from "next/link";
import { AgentState } from "@/types/agent-upgrade.types";

interface CombinedAuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: string[];
  redirectTo?: string;
  requireAgentOnboarding?: boolean;
  requireAgentApproval?: boolean;
  // New props for agent verification
  requireVerifiedAgent?: boolean;
  allowFreeAgents?: boolean;
  allowExpiredAgents?: boolean;
  requireActiveSubscription?: boolean;
  agentCustomMessage?: string;
}

/**
 * CombinedAuthGuard component that provides comprehensive authentication,
 * authorization, and agent-specific access control.
 */
export const CombinedAuthGuard: React.FC<CombinedAuthGuardProps> = ({
  children,
  requireAuth = false,
  allowedUserTypes = [],
  redirectTo = "/auth/login",
  requireAgentOnboarding = false,
  requireAgentApproval = false,
  // New props with defaults
  requireVerifiedAgent = false,
  allowFreeAgents = true,
  allowExpiredAgents = true,
  requireActiveSubscription = false,
  agentCustomMessage,
}) => {
  const { user, isLoading, isInitialized } = useUserContext();

  // Helper function to determine agent state
  const getAgentState = (): AgentState => {
    if (!user || user.userType !== "Agent") return "free";

    // Check if user has agent data with subscription info
    const agentData = user.agentData || (user as any).agentState;

    // If user has active subscription and completed verification
    if (user?.activeSubscription && agentData?.kycStatus == "none") {
      return "verified";
    }

    // If user had subscription but it expired
    if (!user?.activeSubscription === false && agentData?.kycStatus == "none") {
      return "expired";
    }

    // Default to free agent
    return "free";
  };

  const agentState = getAgentState();

  // --- AuthGuard Logic ---

  // ⏳ While loading user context
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F8F8] to-[#E8EEEE]">
        <Loading />
      </div>
    );
  }

  // 🔒 User not logged in but required
  if (requireAuth && !user) {
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF1F1]">
        <Loading />
      </div>
    );
  }

  // ❌ User type is not allowed (only if user exists and allowedUserTypes are specified)
  if (
    requireAuth && // Only apply this check if authentication is required
    user && // And a user exists
    allowedUserTypes.length > 0 &&
    !allowedUserTypes.includes(user.userType || "")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFA] to-[#E5EAEA] p-4">
        <div className="max-w-md w-full border border-red-100 rounded-xl bg-white p-10 text-center">
          <h2 className="text-2xl font-semibold text-[#BF0A30] mb-3">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to view this page with your current
            account type.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-md bg-[#0B572B] hover:bg-[#094C25] text-white font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- AgentAccessBarrier Logic (applied only if the user is an 'Agent') ---

  const Container = ({
    icon,
    title,
    message,
    actionLabel,
    actionHref,
    bgColor,
    iconColor,
  }: {
    icon: React.ReactNode;
    title: string;
    message: string;
    actionLabel: string;
    actionHref: string;
    bgColor: string;
    iconColor: string;
  }) => (
    <div className="min-h-screen bg-[#F6F8F8] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border ${bgColor} border-gray-200 p-10 max-w-md w-full text-center`}
      >
        <div
          className={`w-16 h-16 ${iconColor} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          {icon}
        </div>
        <h2 className="text-2xl font-semibold text-[#0C1E1B] mb-4">
          {title}
        </h2>
        <p className="text-[#4F5B57] mb-6">{message}</p>
        <Link
          href={actionHref}
          className="bg-[#0B572B] hover:bg-[#094C25] text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
        >
          {actionLabel}
        </Link>
      </motion.div>
    </div>
  );

  // Apply agent-specific checks only if the user is an Agent
  if (user && user.userType === "Agent") {
    // 🧾 Block if onboarding not complete
    if (requireAgentOnboarding && !user.agentData?.agentType) {
      return (
        <Container
          icon={<User size={32} className="text-[#FF6B00]" />}
          title="Complete Your Onboarding"
          message={
            agentCustomMessage ||
            "You need to complete your agent onboarding process before accessing this feature."
          }
          actionLabel="Complete Onboarding"
          actionHref="/agent-kyc"
          bgColor="bg-white"
          iconColor="bg-orange-50"
        />
      );
    }

    // ⏳ Block if approval is pending
    if (requireAgentApproval && user.accountApproved === false) {
      return (
        <Container
          icon={<Clock size={32} className="text-[#D97706]" />}
          title="Approval Pending"
          message={
            agentCustomMessage ||
            "Your agent application is currently under review. You'll be able to access this feature once approved."
          }
          actionLabel="Check Status"
          actionHref="/agent-under-review"
          bgColor="bg-white"
          iconColor="bg-yellow-50"
        />
      );
    }

    // --- New Agent Verification State Checks ---

    // 🏆 Block if verified agent is required but user is not verified
    if (requireVerifiedAgent && agentState !== "verified") {
      if (agentState === "free") {
        return (
          <Container
            icon={<Star size={32} className="text-[#8DDB90]" />}
            title="Verification Required"
            message={
              agentCustomMessage ||
              "This feature is only available to verified agents. Upgrade your account to unlock premium features."
            }
            actionLabel="Upgrade to Verified Agent"
            actionHref="/agent-kyc"
            bgColor="bg-white"
            iconColor="bg-green-50"
          />
        );
      } else if (agentState === "expired") {
        return (
          <Container
            icon={<CreditCard size={32} className="text-[#F59E0B]" />}
            title="Subscription Expired"
            message={
              agentCustomMessage ||
              "Your verified agent subscription has expired. Renew your subscription to continue accessing premium features."
            }
            actionLabel="Renew Subscription"
            actionHref="/agent-subscriptions"
            bgColor="bg-white"
            iconColor="bg-amber-50"
          />
        );
      }
    }

    // 🚫 Block free agents if not allowed
    if (!allowFreeAgents && agentState === "free") {
      return (
        <Container
          icon={<Shield size={32} className="text-[#8DDB90]" />}
          title="Premium Feature"
          message={
            agentCustomMessage ||
            "This feature is only available to verified agents. Upgrade your account to access this feature."
          }
          actionLabel="Upgrade Account"
          actionHref="/agent-kyc"
          bgColor="bg-white"
          iconColor="bg-green-50"
        />
      );
    }

    // 🚫 Block expired agents if not allowed
    if (!allowExpiredAgents && agentState === "expired") {
      return (
        <Container
          icon={<Crown size={32} className="text-[#F59E0B]" />}
          title="Renew Your Subscription"
          message={
            agentCustomMessage ||
            "Your subscription has expired. Renew your subscription to continue accessing this feature."
          }
          actionLabel="Renew Now"
          actionHref="/agent-subscriptions"
          bgColor="bg-white"
          iconColor="bg-amber-50"
        />
      );
    }

    // 💳 Block if active subscription is required
    if (requireActiveSubscription && agentState !== "verified") {
      return (
        <Container
          icon={<CreditCard size={32} className="text-[#EF4444]" />}
          title="Active Subscription Required"
          message={
            agentCustomMessage ||
            "This feature requires an active verified agent subscription. Please upgrade or renew your subscription."
          }
          actionLabel={agentState === "free" ? "Upgrade Account" : "Renew Subscription"}
          actionHref={agentState === "free" ? "/agent-kyc" : "/agent-subscriptions"}
          bgColor="bg-white"
          iconColor="bg-red-50"
        />
      );
    }
  }

  // ✅ Access granted if all checks pass
  return <>{children}</>;
};

export default CombinedAuthGuard;
