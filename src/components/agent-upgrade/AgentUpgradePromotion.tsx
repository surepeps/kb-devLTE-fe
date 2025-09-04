/** @format */

"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  CheckCircle,
  Crown,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";

interface AgentUpgradePromotionProps {
  variant?: "card" | "banner" | "modal" | "sidebar";
  size?: "small" | "medium" | "large";
  showFeatures?: boolean;
  customMessage?: string;
  className?: string;
}

const AgentUpgradePromotion: React.FC<AgentUpgradePromotionProps> = ({
  variant = "card",
  size = "medium",
  showFeatures = true,
  customMessage,
  className = "",
}) => {
  const router = useRouter();
  const { user } = useUserContext();

  const handleUpgradeClick = () => {
    router.push("/agent-upgrade");
  };

  const features = [
    {
      icon: CheckCircle,
      text: "Verified agent badge",
      color: "text-[#8DDB90]",
    },
    {
      icon: Star,
      text: "Public agent profile",
      color: "text-yellow-500",
    },
    {
      icon: Crown,
      text: "Unlimited listings",
      color: "text-purple-500",
    },
    {
      icon: DollarSign,
      text: "No commission fees",
      color: "text-green-500",
    },
    {
      icon: TrendingUp,
      text: "Inspection fee setup",
      color: "text-blue-500",
    },
    {
      icon: Shield,
      text: "Priority support",
      color: "text-orange-500",
    },
  ];

  const getVariantStyles = () => {
    switch (variant) {
      case "banner":
        return "w-full bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] text-white p-4 rounded-lg";
      case "modal":
        return "bg-white rounded-xl p-8 border border-gray-200 shadow-lg max-w-md w-full";
      case "sidebar":
        return "bg-gradient-to-br from-[#8DDB90]/10 to-[#09391C]/5 rounded-xl p-6 border border-[#8DDB90]/20";
      default: // card
        return "bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default: // medium
        return "text-base";
    }
  };

  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${getVariantStyles()} ${getSizeStyles()} ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Star className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold">
                {customMessage || "Upgrade to Verified Agent"}
              </h3>
              <p className="text-white/90 text-sm">
                Unlock premium features and boost your credibility
              </p>
            </div>
          </div>
          
          <button
            onClick={handleUpgradeClick}
            className="bg-white text-[#8DDB90] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            Upgrade Now
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8DDB90] to-[#7BC87F] rounded-full flex items-center justify-center mx-auto mb-2">
            <Crown size={32} className="text-white" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles size={20} className="text-yellow-400" />
          </motion.div>
        </div>

        <h3 className="text-xl font-bold text-[#09391C] mb-2 font-display">
          {customMessage || "Become a Verified Agent"}
        </h3>
        <p className="text-[#5A5D63] leading-relaxed">
          Join thousands of verified agents earning more with premium features and verified status.
        </p>
      </div>

      {/* Features */}
      {showFeatures && (
        <div className="space-y-3 mb-6">
          {features.slice(0, size === "small" ? 3 : 6).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3"
            >
              <feature.icon size={16} className={feature.color} />
              <span className="text-[#5A5D63] text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pricing Highlight */}
      <div className="bg-gradient-to-r from-[#8DDB90]/10 to-[#09391C]/5 rounded-lg p-4 mb-6 text-center">
        <div className="text-sm text-[#5A5D63] mb-1">Starting from</div>
        <div className="text-2xl font-bold text-[#8DDB90]">₦25,000</div>
        <div className="text-sm text-[#5A5D63]">per month</div>
        <div className="mt-2">
          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
            Save 20% with yearly plan
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleUpgradeClick}
        className="w-full bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#7BC87F] hover:to-[#6BC76E] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <Star size={18} />
        Start Your Upgrade
        <ArrowRight size={18} />
      </button>

      {/* Trust indicators */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-[#5A5D63]">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>5000+ verified agents</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={12} />
            <span>7-day money back</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Utility component for upgrade prompt in different contexts
export const AgentUpgradePrompt: React.FC<{
  context: "dashboard" | "listings" | "profile" | "navigation";
  compact?: boolean;
}> = ({ context, compact = false }) => {
  const contextMessages = {
    dashboard: "Ready to unlock your full potential? Upgrade to verified agent status!",
    listings: "Get more visibility for your listings with verified agent status",
    profile: "Complete your professional profile with verified status",
    navigation: "Upgrade to Verified Agent",
  };

  const variants = {
    dashboard: "card" as const,
    listings: "banner" as const,
    profile: "sidebar" as const,
    navigation: "banner" as const,
  };

  return (
    <AgentUpgradePromotion
      variant={variants[context]}
      size={compact ? "small" : "medium"}
      showFeatures={!compact}
      customMessage={contextMessages[context]}
    />
  );
};

export default AgentUpgradePromotion;
