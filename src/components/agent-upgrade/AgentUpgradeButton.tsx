/** @format */

"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Crown,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";

interface AgentUpgradeButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "floating";
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
  showText?: boolean;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AgentUpgradeButton: React.FC<AgentUpgradeButtonProps> = ({
  variant = "primary",
  size = "medium",
  showIcon = true,
  showText = true,
  animated = true,
  className = "",
  children,
}) => {
  const router = useRouter();
  const { user } = useUserContext();

  const handleClick = () => {
    if (user?.userType === "Agent") {
      router.push("/agent-upgrade");
    } else {
      router.push("/auth/register?type=agent");
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-white border border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90]/5";
      case "outline":
        return "bg-transparent border border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white";
      case "ghost":
        return "bg-transparent text-[#8DDB90] hover:bg-[#8DDB90]/10";
      case "floating":
        return "bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] text-white shadow-lg hover:shadow-xl fixed bottom-6 right-6 z-50 rounded-full";
      default: // primary
        return "bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] text-white hover:from-[#7BC87F] hover:to-[#6BC76E] shadow-md hover:shadow-lg";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return variant === "floating" ? "w-12 h-12" : "px-3 py-2 text-sm";
      case "large":
        return variant === "floating" ? "w-16 h-16" : "px-8 py-4 text-lg";
      default: // medium
        return variant === "floating" ? "w-14 h-14" : "px-6 py-3 text-base";
    }
  };

  const getIcon = () => {
    if (variant === "floating") {
      return size === "small" ? <Plus size={20} /> : <Crown size={24} />;
    }
    return <Star size={size === "small" ? 16 : size === "large" ? 24 : 20} />;
  };

  const getText = () => {
    if (variant === "floating") return null;
    
    if (children) return children;
    
    if (user?.userType === "Agent") {
      return size === "small" ? "Upgrade" : "Upgrade to Verified";
    }
    return size === "small" ? "Join as Agent" : "Become an Agent";
  };

  const ButtonContent = () => (
    <>
      {showIcon && (
        <motion.div
          animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        >
          {getIcon()}
        </motion.div>
      )}
      {showText && variant !== "floating" && (
        <span className="font-semibold">{getText()}</span>
      )}
      {showText && variant !== "floating" && !children && (
        <ArrowRight size={size === "small" ? 14 : 16} />
      )}
    </>
  );

  if (variant === "floating") {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`${getVariantStyles()} ${getSizeStyles()} ${className} flex items-center justify-center transition-all duration-200`}
        title="Upgrade to Verified Agent"
      >
        <ButtonContent />
        
        {/* Floating button pulse effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#8DDB90] opacity-20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`${getVariantStyles()} ${getSizeStyles()} ${className} flex items-center gap-2 rounded-lg font-medium transition-all duration-200 relative overflow-hidden`}
    >
      {/* Shimmer effect for primary variant */}
      {variant === "primary" && animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}
      
      <ButtonContent />
      
      {/* Sparkle effect */}
      {animated && variant === "primary" && (
        <motion.div
          className="absolute top-1 right-1"
          animate={{ 
            scale: [0, 1, 0], 
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 4 
          }}
        >
          <Sparkles size={12} className="text-yellow-200" />
        </motion.div>
      )}
    </motion.button>
  );
};

// Specialized upgrade buttons for different contexts
export const NavUpgradeButton: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => (
  <AgentUpgradeButton
    variant="primary"
    size={mobile ? "small" : "medium"}
    className={mobile ? "w-full" : ""}
  />
);

export const DashboardUpgradeButton: React.FC = () => (
  <AgentUpgradeButton
    variant="primary"
    size="large"
    className="w-full"
  >
    <Crown size={24} />
    <span>Upgrade to Verified Agent</span>
    <Zap size={20} className="text-yellow-200" />
  </AgentUpgradeButton>
);

export const SidebarUpgradeButton: React.FC = () => (
  <AgentUpgradeButton
    variant="outline"
    size="small"
    showText={false}
    className="rounded-full w-10 h-10"
  />
);

export const FloatingUpgradeButton: React.FC<{ show?: boolean }> = ({ show = true }) => {
  if (!show) return null;
  
  return (
    <AgentUpgradeButton
      variant="floating"
      size="medium"
      showText={false}
    />
  );
};

export const ListingUpgradeButton: React.FC = () => (
  <AgentUpgradeButton
    variant="secondary"
    size="small"
  >
    <Shield size={16} />
    Get Verified Badge
  </AgentUpgradeButton>
);

export default AgentUpgradeButton;
