/** @format */

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Copy,
  CheckCircle,
  Star,
  Crown,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Facebook,
  Twitter,
  Download,
  QrCode,
  Mail,
  Award,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { useUserContext } from "@/context/user-context";
import AgentVerificationService from "@/services/agentVerificationService";

interface ShareableData {
  profileUrl: string;
  agentName: string;
  agentTitle: string;
  achievements?: string[];
}

interface AgentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareableData: ShareableData;
}

interface SocialShareButtonProps {
  platform: "whatsapp" | "linkedin" | "facebook" | "twitter" | "email";
  url: string;
  title: string;
  description: string;
  className?: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  url,
  title,
  description,
  className = "",
}) => {
  const getShareUrl = () => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    switch (platform) {
      case "whatsapp":
        return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedDescription}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      case "email":
        return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`;
      default:
        return "";
    }
  };

  const getPlatformConfig = () => {
    switch (platform) {
      case "whatsapp":
        return {
          icon: MessageCircle,
          label: "WhatsApp",
          color: "bg-green-500 hover:bg-green-600",
          textColor: "text-white",
        };
      case "linkedin":
        return {
          icon: Linkedin,
          label: "LinkedIn",
          color: "bg-blue-600 hover:bg-blue-700",
          textColor: "text-white",
        };
      case "facebook":
        return {
          icon: Facebook,
          label: "Facebook",
          color: "bg-blue-500 hover:bg-blue-600",
          textColor: "text-white",
        };
      case "twitter":
        return {
          icon: Twitter,
          label: "Twitter",
          color: "bg-black hover:bg-gray-800",
          textColor: "text-white",
        };
      case "email":
        return {
          icon: Mail,
          label: "Email",
          color: "bg-gray-600 hover:bg-gray-700",
          textColor: "text-white",
        };
    }
  };

  const config = getPlatformConfig();

  const handleShare = () => {
    const shareUrl = getShareUrl();
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${config.color} ${config.textColor} ${className}`}
    >
      <config.icon size={18} />
      <span>{config.label}</span>
    </motion.button>
  );
};

const AgentSuccessModal: React.FC<AgentSuccessModalProps> = ({
  isOpen,
  onClose,
  shareableData,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableData.profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `${shareableData.agentName}-profile-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const shareData = {
    title: `${shareableData.agentName} - Verified Real Estate Agent`,
    description: `I'm excited to announce that I'm now a verified agent on Khabiteq Realty! Check out my professional profile and connect with me for all your real estate needs.`,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="relative mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[#8DDB90] to-[#7BC87F] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Crown size={48} className="text-white" />
                </div>
                
                {/* Sparkles Animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles size={24} className="text-yellow-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -bottom-2 -left-2"
                >
                  <Star size={20} className="text-yellow-400" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-[#09391C] mb-4 font-display">
                  🎉 Congratulations!
                </h2>
                <h3 className="text-xl font-semibold text-[#8DDB90] mb-2">
                  You're Now a Verified Agent!
                </h3>
                <p className="text-[#5A5D63] leading-relaxed">
                  Share your success with your network and let them know about your verified agent status!
                </p>
              </motion.div>
            </div>

            {/* Profile Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#8DDB90]/10 to-[#09391C]/5 rounded-xl p-6 mb-8 border border-[#8DDB90]/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8DDB90]/20 to-[#09391C]/20 rounded-full flex items-center justify-center">
                  <div className="text-[#8DDB90] text-xl font-bold">
                    {shareableData.agentName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#09391C] flex items-center gap-2">
                    {shareableData.agentName}
                    <CheckCircle size={18} className="text-[#8DDB90]" />
                  </h4>
                  <p className="text-[#5A5D63]">{shareableData.agentTitle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-[#5A5D63]">
                <ExternalLink size={14} />
                <span className="truncate">{shareableData.profileUrl}</span>
              </div>
            </motion.div>

            {/* Social Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h4 className="text-lg font-semibold text-[#09391C] mb-4 flex items-center gap-2 font-display">
                <Share2 size={20} />
                Share Your Success
              </h4>
              
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <SocialShareButton
                  platform="whatsapp"
                  url={shareableData.profileUrl}
                  title={shareData.title}
                  description={shareData.description}
                />
                <SocialShareButton
                  platform="linkedin"
                  url={shareableData.profileUrl}
                  title={shareData.title}
                  description={shareData.description}
                />
                <SocialShareButton
                  platform="facebook"
                  url={shareableData.profileUrl}
                  title={shareData.title}
                  description={shareData.description}
                />
                <SocialShareButton
                  platform="twitter"
                  url={shareableData.profileUrl}
                  title={shareData.title}
                  description={shareData.description}
                />
                <SocialShareButton
                  platform="email"
                  url={shareableData.profileUrl}
                  title={shareData.title}
                  description={shareData.description}
                  className="lg:col-span-1 col-span-2"
                />
              </div>
            </motion.div>

            {/* Copy Link & QR Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
            >
              {/* Copy Link */}
              <div className="space-y-3">
                <h5 className="font-medium text-[#09391C]">Direct Link</h5>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareableData.profileUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors"
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="space-y-3">
                <h5 className="font-medium text-[#09391C]">QR Code</h5>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#8DDB90] text-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/5 transition-colors"
                  >
                    <QrCode size={16} />
                    {showQR ? "Hide QR" : "Show QR"}
                  </button>
                  
                  {showQR && (
                    <button
                      onClick={handleDownloadQR}
                      className="flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  )}
                </div>
                
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg"
                  >
                    <QRCodeSVG
                      id="qr-code"
                      value={shareableData.profileUrl}
                      size={120}
                      level="M"
                      includeMargin
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Achievement Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8 border border-blue-100"
            >
              <h4 className="font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                <Award size={20} />
                You've Unlocked
              </h4>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-[#8DDB90]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={24} className="text-[#8DDB90]" />
                  </div>
                  <p className="text-sm font-medium text-[#09391C]">Verified Badge</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-[#09391C]">Public Profile</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-[#09391C]">No Commission</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star size={24} className="text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-[#09391C]">Premium Features</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => window.open(shareableData.profileUrl, "_blank")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors font-medium"
              >
                <ExternalLink size={18} />
                View Your Profile
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Compact Success Banner Component
export const AgentSuccessBanner: React.FC<{
  agentName: string;
  onShare: () => void;
  onDismiss: () => void;
}> = ({ agentName, onShare, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] text-white p-4 rounded-lg shadow-lg border border-[#8DDB90]/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Crown size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold">
              🎉 Congratulations, {agentName}!
            </h4>
            <p className="text-white/90 text-sm">
              You're now a verified agent. Share your success!
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            onClick={onDismiss}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Profile Share Widget
export const ProfileShareWidget: React.FC<{
  profileUrl: string;
  agentName: string;
  compact?: boolean;
}> = ({ profileUrl, agentName, compact = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareData = {
    title: `${agentName} - Verified Real Estate Agent`,
    description: `Check out my verified agent profile on Khabiteq Realty!`,
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1 px-3 py-2 bg-[#8DDB90]/10 text-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/20 transition-colors text-sm"
        >
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
        
        <SocialShareButton
          platform="whatsapp"
          url={profileUrl}
          title={shareData.title}
          description={shareData.description}
          className="!px-3 !py-2 !text-sm"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h4 className="font-semibold text-[#09391C] mb-4 flex items-center gap-2">
        <Share2 size={18} />
        Share Your Profile
      </h4>
      
      <div className="space-y-4">
        {/* Copy Link */}
        <div className="flex gap-2">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors"
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <SocialShareButton
            platform="whatsapp"
            url={profileUrl}
            title={shareData.title}
            description={shareData.description}
            className="!text-sm !px-3 !py-2"
          />
          <SocialShareButton
            platform="linkedin"
            url={profileUrl}
            title={shareData.title}
            description={shareData.description}
            className="!text-sm !px-3 !py-2"
          />
          <SocialShareButton
            platform="facebook"
            url={profileUrl}
            title={shareData.title}
            description={shareData.description}
            className="!text-sm !px-3 !py-2"
          />
          <SocialShareButton
            platform="twitter"
            url={profileUrl}
            title={shareData.title}
            description={shareData.description}
            className="!text-sm !px-3 !py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default AgentSuccessModal;
