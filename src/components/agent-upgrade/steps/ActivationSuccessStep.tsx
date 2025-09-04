/** @format */

"use client";
import React, { useState } from "react";
import { 
  CheckCircle, 
  Star, 
  Share2, 
  Copy, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  Award,
  Globe,
  Smartphone,
  Heart,
  Users,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ActivationSuccessStepProps {
  data: any;
  user: any;
}

const ActivationSuccessStep: React.FC<ActivationSuccessStepProps> = ({
  data,
  user,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Generate public profile URL (this would come from the API in real implementation)
  const profileUrl = `${window.location.origin}/agent-profile/${user?.id || user?._id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShareWhatsApp = () => {
    const message = `🏠 Check out my verified agent profile on Khabiteq Realty! I'm now a verified agent offering professional real estate services. View my profile: ${profileUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareLinkedIn = () => {
    const message = `I'm excited to announce that I'm now a verified agent on Khabiteq Realty! Check out my professional profile and connect with me for all your real estate needs.`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}&summary=${encodeURIComponent(message)}`;
    window.open(linkedinUrl, "_blank");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleViewProfile = () => {
    window.open(profileUrl, "_blank");
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Success Animation */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.2
            }}
            className="relative"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#8DDB90] to-[#7BC87F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <CheckCircle size={64} className="text-white" />
              </motion.div>
            </div>
            
            {/* Sparkles Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-4 -left-4"
            >
              <Sparkles size={24} className="text-yellow-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-8 right-8"
            >
              <Star size={20} className="text-yellow-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-2 -right-6"
            >
              <Award size={28} className="text-[#8DDB90]" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-[#09391C] mb-4 font-display">
              🎉 Congratulations!
            </h1>
            <h2 className="text-2xl font-semibold text-[#8DDB90] mb-6">
              You're Now a Verified Agent!
            </h2>
            <p className="text-[#5A5D63] text-lg max-w-2xl mx-auto leading-relaxed">
              Your public agent profile is now live and ready to attract clients. 
              You've unlocked all premium features and can start earning without commission fees!
            </p>
          </motion.div>
        </div>

        {/* Profile Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#8DDB90]/10 to-[#09391C]/5 rounded-2xl p-8 border border-[#8DDB90]/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#09391C] flex items-center gap-2 font-display">
              <Globe size={24} />
              Your Public Profile is Live!
            </h3>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8DDB90]/20 to-[#09391C]/20 rounded-full flex items-center justify-center overflow-hidden">
                  {data.basicprofile?.profilePicture ? (
                    <img
                      src={data.basicprofile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-[#8DDB90] text-2xl font-bold">
                      {data.basicprofile?.firstName?.[0]}{data.basicprofile?.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#09391C] flex items-center gap-2">
                    {data.basicprofile?.firstName} {data.basicprofile?.lastName}
                    <div className="w-6 h-6 bg-[#8DDB90] rounded-full flex items-center justify-center">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                  </h4>
                  <p className="text-[#5A5D63]">Verified Real Estate Agent</p>
                  <p className="text-sm text-[#5A5D63]">
                    {data.basicprofile?.address?.state}, Nigeria
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy size={16} className="text-[#8DDB90]" />
                  <span className="text-[#5A5D63]">
                    Specializes in: {data.extendedprofile?.specializations?.slice(0, 2).join(", ") || "Real Estate"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-[#5A5D63]">
                    Inspection Fee: ₦{data.inspectionfee?.inspectionFee?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-[#8DDB90]" />
                  <span className="text-[#5A5D63]">
                    Languages: {data.extendedprofile?.languagesSpoken?.slice(0, 2).join(", ") || "English"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <button
                onClick={handleViewProfile}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors font-medium"
              >
                <ExternalLink size={16} />
                View Your Profile
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#8DDB90] text-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/5 transition-colors text-sm font-medium"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  <Smartphone size={16} />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-[#09391C] mb-6 text-center font-display">
            ✨ Features Unlocked
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle,
                title: "Verified Badge",
                description: "Display verified status on all listings",
                color: "text-[#8DDB90]"
              },
              {
                icon: Globe,
                title: "Public Profile",
                description: "Shareable professional profile page",
                color: "text-blue-500"
              },
              {
                icon: Trophy,
                title: "No Commission",
                description: "Keep 100% of your listing earnings",
                color: "text-yellow-500"
              },
              {
                icon: Star,
                title: "Inspection Fees",
                description: "Earn from property inspections",
                color: "text-orange-500"
              },
              {
                icon: Heart,
                title: "Unlimited Listings",
                description: "Post as many properties as you want",
                color: "text-pink-500"
              },
              {
                icon: Users,
                title: "Priority Support",
                description: "Get faster customer service",
                color: "text-purple-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${feature.color.replace('text-', 'bg-')}/10`}>
                    <feature.icon size={24} className={feature.color} />
                  </div>
                  <h4 className="font-semibold text-[#09391C]">{feature.title}</h4>
                </div>
                <p className="text-sm text-[#5A5D63]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-[#09391C] mb-4 flex items-center gap-2 font-display">
            <ArrowRight size={20} />
            What's Next?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-[#09391C]">Share Your Profile</h4>
                  <p className="text-sm text-[#5A5D63]">Share your verified profile on social media and with clients</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-[#09391C]">Start Listing Properties</h4>
                  <p className="text-sm text-[#5A5D63]">Post unlimited properties with no commission fees</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-[#09391C]">Set Up Inspections</h4>
                  <p className="text-sm text-[#5A5D63]">Start receiving and earning from inspection bookings</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-[#09391C]">Track Your Success</h4>
                  <p className="text-sm text-[#5A5D63]">Monitor your performance through the agent dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-[#09391C] mb-4 font-display">
            Share Your Success! 🎉
          </h3>
          <p className="text-[#5A5D63] mb-6">
            Let your network know about your verified agent status
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <Smartphone size={16} />
              Share on WhatsApp
            </button>
            
            <button
              onClick={handleShareLinkedIn}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Share2 size={16} />
              Share on LinkedIn
            </button>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-center pt-8"
        >
          <button
            onClick={handleGoToDashboard}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] text-white rounded-xl hover:from-[#7BC87F] hover:to-[#6BC76E] transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Go to Agent Dashboard
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ActivationSuccessStep;
