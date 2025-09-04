/** @format */

"use client";
import React, { useState } from "react";
import { 
  Award, 
  CheckCircle, 
  ArrowLeft, 
  CreditCard,
  Star,
  Zap,
  Crown,
  TrendingUp,
  Users,
  Shield,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AgentSubscriptionPlan,
  AGENT_SUBSCRIPTION_PLANS,
} from "@/types/agent-upgrade.types";

interface SubscriptionPlanStepProps {
  data: Partial<AgentSubscriptionPlan>;
  onDataChange: (data: AgentSubscriptionPlan) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SubscriptionPlanStep: React.FC<SubscriptionPlanStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<AgentSubscriptionPlan | null>(
    data.id ? AGENT_SUBSCRIPTION_PLANS.find(plan => plan.id === data.id) || null : null
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "monthly":
        return <Star className="text-blue-500" size={24} />;
      case "quarterly":
        return <Zap className="text-[#8DDB90]" size={24} />;
      case "yearly":
        return <Crown className="text-yellow-500" size={24} />;
      default:
        return <Award className="text-gray-500" size={24} />;
    }
  };

  const handlePlanSelect = (plan: AgentSubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleNext = () => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }

    onDataChange(selectedPlan);
    onNext();
  };

  const calculateMonthlyRate = (plan: AgentSubscriptionPlan) => {
    return Math.round(plan.discountedPrice / plan.duration);
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-[#09391C] mb-4 font-display">
            Choose Your Verification Plan
          </h3>
          <p className="text-[#5A5D63] max-w-2xl mx-auto">
            Select the plan that best fits your business needs. All plans include verified agent status,
            public profile, and unlimited listings with no commission fees.
          </p>
        </div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {AGENT_SUBSCRIPTION_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlanSelect(plan)}
              className={`relative rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedPlan?.id === plan.id
                  ? "border-[#8DDB90] bg-[#8DDB90]/5 shadow-lg"
                  : plan.popular
                    ? "border-[#8DDB90]/50 bg-gradient-to-br from-[#8DDB90]/5 to-white shadow-md"
                    : "border-gray-200 bg-white hover:border-[#8DDB90]/30 hover:shadow-md"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] text-white text-sm font-semibold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Sparkles size={16} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6 pt-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="mb-4">
                    {getPlanIcon(plan.type)}
                  </div>
                  <h4 className="text-xl font-bold text-[#09391C] mb-2 font-display">
                    {plan.name}
                  </h4>
                  <div className="space-y-2">
                    {plan.discount && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(plan.originalPrice)}
                        </span>
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                          Save {plan.discount}%
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-3xl font-bold text-[#8DDB90]">
                        {formatCurrency(plan.discountedPrice)}
                      </span>
                      <span className="text-[#5A5D63] text-sm ml-1">
                        / {plan.duration} month{plan.duration > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-sm text-[#5A5D63]">
                      {formatCurrency(calculateMonthlyRate(plan))} per month
                    </p>
                    {plan.savings && (
                      <p className="text-sm text-green-600 font-medium">
                        Save {formatCurrency(plan.savings)} total
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#5A5D63]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                <div className="text-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mx-auto transition-all ${
                      selectedPlan?.id === plan.id
                        ? "border-[#8DDB90] bg-[#8DDB90]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPlan?.id === plan.id && (
                      <CheckCircle size={14} className="text-white m-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Plan Benefits Comparison */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <TrendingUp size={20} />
            Why Choose a Longer Plan?
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8DDB90]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-[#8DDB90]" size={24} />
              </div>
              <h5 className="font-semibold text-[#09391C] mb-2">Better Value</h5>
              <p className="text-sm text-[#5A5D63]">
                Longer plans offer significant savings and better monthly rates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8DDB90]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#8DDB90]" size={24} />
              </div>
              <h5 className="font-semibold text-[#09391C] mb-2">Consistent Branding</h5>
              <p className="text-sm text-[#5A5D63]">
                Maintain your verified status and public profile consistently
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8DDB90]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-[#8DDB90]" size={24} />
              </div>
              <h5 className="font-semibold text-[#09391C] mb-2">Priority Features</h5>
              <p className="text-sm text-[#5A5D63]">
                Access to premium features and priority customer support
              </p>
            </div>
          </div>
        </div>

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#8DDB90]/10 to-[#09391C]/5 rounded-xl p-6 border border-[#8DDB90]/20"
          >
            <h4 className="text-lg font-semibold text-[#09391C] mb-4 flex items-center gap-2 font-display">
              <Award size={20} />
              Your Selected Plan: {selectedPlan.name}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-[#09391C] mb-3">Plan Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5A5D63]">Duration:</span>
                    <span className="font-medium text-[#09391C]">
                      {selectedPlan.duration} month{selectedPlan.duration > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A5D63]">Total Cost:</span>
                    <span className="font-medium text-[#09391C]">
                      {formatCurrency(selectedPlan.discountedPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A5D63]">Monthly Rate:</span>
                    <span className="font-medium text-[#09391C]">
                      {formatCurrency(calculateMonthlyRate(selectedPlan))}
                    </span>
                  </div>
                  {selectedPlan.savings && (
                    <div className="flex justify-between">
                      <span className="text-[#5A5D63]">You Save:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedPlan.savings)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-[#09391C] mb-3">What You Get</h5>
                <div className="space-y-2">
                  {selectedPlan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-[#8DDB90]" />
                      <span className="text-[#5A5D63]">{feature}</span>
                    </div>
                  ))}
                  {selectedPlan.features.length > 4 && (
                    <p className="text-xs text-[#5A5D63] italic">
                      +{selectedPlan.features.length - 4} more features...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Money Back Guarantee */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-blue-600" size={24} />
            <h4 className="font-medium text-blue-900">7-Day Money Back Guarantee</h4>
          </div>
          <p className="text-sm text-blue-800">
            Not satisfied with your verified agent experience? Get a full refund within 7 days, 
            no questions asked. We're confident you'll love the increased visibility and credibility.
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-medium text-[#09391C] mb-4">Frequently Asked Questions</h4>
          <div className="space-y-4 text-sm">
            <div>
              <h5 className="font-medium text-[#09391C] mb-1">Can I change my plan later?</h5>
              <p className="text-[#5A5D63]">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-[#09391C] mb-1">What happens when my subscription expires?</h5>
              <p className="text-[#5A5D63]">
                Your public profile will be disabled and commission fees will apply again. You can renew anytime to restore benefits.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-[#09391C] mb-1">Are there any hidden fees?</h5>
              <p className="text-[#5A5D63]">
                No hidden fees. The only deduction is ₦1,000 per inspection booking, clearly disclosed upfront.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedPlan}
            className="flex items-center gap-2 px-8 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8DDB90]/50 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
            <CreditCard size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPlanStep;
