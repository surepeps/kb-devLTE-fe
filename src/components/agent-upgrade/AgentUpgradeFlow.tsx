/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building,
  DollarSign,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Shield,
  Award,
} from "lucide-react";
import { useUserContext } from "@/context/user-context";
import { POST_REQUEST, PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";

// Import types
import {
  AgentUpgradeFormData,
  AgentUpgradeStep,
  AgentKYCData,
  InspectionFeeSetup,
  AgentSubscriptionPlan,
  AGENT_SUBSCRIPTION_PLANS,
  AGENT_UPGRADE_CONSTANTS,
} from "@/types/agent-upgrade.types";

// Import step components
import BasicProfileStep from "./steps/BasicProfileStep";
import ExtendedProfileStep from "./steps/ExtendedProfileStep";
import InspectionFeeStep from "./steps/InspectionFeeStep";
import SubscriptionPlanStep from "./steps/SubscriptionPlanStep";
import PaymentStep from "./steps/PaymentStep";
import ActivationSuccessStep from "./steps/ActivationSuccessStep";

interface StepConfig {
  id: AgentUpgradeStep;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const UPGRADE_STEPS: StepConfig[] = [
  {
    id: "basic_profile",
    title: "Basic Profile",
    description: "Verify your basic information",
    icon: User,
    component: BasicProfileStep,
  },
  {
    id: "extended_profile",
    title: "Professional Profile",
    description: "Complete your KYC and branding details",
    icon: Building,
    component: ExtendedProfileStep,
  },
  {
    id: "inspection_fee",
    title: "Inspection Fee",
    description: "Set your property inspection fee",
    icon: DollarSign,
    component: InspectionFeeStep,
  },
  {
    id: "subscription_plan",
    title: "Subscription Plan",
    description: "Choose your verification plan",
    icon: Award,
    component: SubscriptionPlanStep,
  },
  {
    id: "payment",
    title: "Payment",
    description: "Complete your payment",
    icon: CreditCard,
    component: PaymentStep,
  },
  {
    id: "activation",
    title: "Activation",
    description: "Your verified agent profile is ready",
    icon: CheckCircle,
    component: ActivationSuccessStep,
  },
];

interface StepIndicatorProps {
  currentStepIndex: number;
  steps: StepConfig[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStepIndex, steps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8 px-4 overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              index < currentStepIndex
                ? "bg-[#8DDB90] text-white"
                : index === currentStepIndex
                  ? "bg-[#8DDB90] text-white ring-4 ring-[#8DDB90]/20"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {index < currentStepIndex ? (
              <CheckCircle size={20} />
            ) : (
              React.createElement(step.icon, { size: 20 })
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`hidden sm:block h-1 w-16 transition-all duration-300 rounded-full ${
                index < currentStepIndex ? "bg-[#8DDB90]" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const AgentUpgradeFlow: React.FC = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<AgentUpgradeFormData>>({});

  // Initialize form data with user info
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        basicProfile: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          profilePicture: user.profile_picture || "",
          address: {
            street: user.address?.street || "",
            localGovtArea: user.address?.localGovtArea || "",
            state: user.address?.state || "",
          },
        },
      }));
    }
  }, [user]);

  // Check if user is eligible for upgrade
  useEffect(() => {
    if (user && user.userType !== "Agent") {
      toast.error("Only agents can access the upgrade flow");
      router.push("/dashboard");
    }
  }, [user, router]);

  const currentStep = UPGRADE_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === UPGRADE_STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleStepData = (stepId: AgentUpgradeStep, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId.replace('_', '')]: data, // Remove underscore for object property
    }));
  };

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmitUpgrade = async () => {
    if (submitting) return;
    
    setSubmitting(true);

    try {
      // Prepare the upgrade payload
      const upgradePayload = {
        basicProfile: formData.basicProfile,
        extendedProfile: formData.extendedProfile,
        inspectionFee: formData.inspectionFee,
        selectedPlan: formData.selectedPlan,
      };

      // Submit to backend
      const response = await toast.promise(
        POST_REQUEST(
          `${URLS.BASE}/agent/upgrade`,
          upgradePayload,
          Cookies.get("token")
        ),
        {
          loading: "Processing your upgrade...",
          success: "Upgrade initiated successfully!",
          error: (error: any) => error.message || "Upgrade failed",
        }
      );

      if (response.success) {
        // If payment is required, redirect to payment gateway
        if (response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          // Move to success step
          setCurrentStepIndex(UPGRADE_STEPS.length - 1);
        }
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast.error(error.message || "Failed to process upgrade");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF1F1] to-[#F8FFFE] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-gradient-to-r from-[#09391C] to-[#8DDB90] bg-clip-text text-transparent">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Upgrade to Verified Agent
            </h1>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Shield className="text-[#8DDB90]" size={24} />
              <Star className="text-yellow-500" size={24} />
              <Award className="text-[#8DDB90]" size={24} />
            </div>
            <p className="text-[#5A5D63] text-lg leading-relaxed">
              <strong className="text-[#09391C]">Unlock exclusive features:</strong>
              <br />
              ✅ Verified badge & public profile • ✅ Unlimited listings • ✅ No commission fees
              <br />
              ✅ Inspection fee setup • ✅ Priority support
            </p>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStepIndex={currentStepIndex} steps={UPGRADE_STEPS} />

        {/* Current Step Info */}
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 mb-8 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#8DDB90]/10 rounded-lg">
              {React.createElement(currentStep.icon, {
                size: 24,
                className: "text-[#8DDB90]",
              })}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#09391C] font-display">
                {currentStep.title}
              </h2>
              <p className="text-[#5A5D63]">{currentStep.description}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#8DDB90] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / UPGRADE_STEPS.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm text-[#5A5D63] mt-2 text-center">
            Step {currentStepIndex + 1} of {UPGRADE_STEPS.length}
          </p>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8"
          >
            {React.createElement(currentStep.component, {
              data: formData[currentStep.id.replace('_', '')] || {},
              onDataChange: (data: any) => handleStepData(currentStep.id, data),
              onNext: nextStep,
              onPrev: prevStep,
              isFirstStep,
              isLastStep,
              submitting,
              onSubmit: handleSubmitUpgrade,
              user,
            })}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStepIndex < UPGRADE_STEPS.length - 1 && (
          <div className="flex justify-between">
            {!isFirstStep ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8DDB90]/50 focus:ring-offset-2"
            >
              Next Step
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Benefits Sidebar - hidden on mobile */}
        <div className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 w-80">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
            <h3 className="text-lg font-semibold text-[#09391C] mb-4 font-display">
              ✨ Verified Agent Benefits
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0" />
                <span className="text-[#5A5D63]">Verified badge on all listings</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0" />
                <span className="text-[#5A5D63]">Public agent profile page</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0" />
                <span className="text-[#5A5D63]">Unlimited property listings</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0" />
                <span className="text-[#5A5D63]">Commission fees removed</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0" />
                <span className="text-[#5A5D63]">Set inspection fees</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0" />
                <span className="text-[#5A5D63]">Priority customer support</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[#8DDB90]/5 rounded-lg border border-[#8DDB90]/20">
              <p className="text-xs text-[#09391C] font-medium">
                💡 <strong>Money Back Guarantee:</strong> Not satisfied? Get full refund within 7 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentUpgradeFlow;
