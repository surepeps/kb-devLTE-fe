/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  AlertCircle, 
  Calculator, 
  TrendingUp, 
  Users,
  ArrowLeft,
  Building
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  InspectionFeeSetup,
  AGENT_UPGRADE_CONSTANTS,
} from "@/types/agent-upgrade.types";

interface InspectionFeeStepProps {
  data: Partial<InspectionFeeSetup>;
  onDataChange: (data: InspectionFeeSetup) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SUGGESTED_FEES = [
  { amount: 5000, label: "Starter", description: "Good for new agents" },
  { amount: 10000, label: "Standard", description: "Most popular choice", popular: true },
  { amount: 15000, label: "Premium", description: "For experienced agents" },
  { amount: 20000, label: "Luxury", description: "High-end properties" },
];

const InspectionFeeStep: React.FC<InspectionFeeStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
}) => {
  const [formData, setFormData] = useState<Partial<InspectionFeeSetup>>({
    inspectionFee: 10000,
    currency: "NGN",
    description: "",
    terms: "",
    ...data,
  });
  const [customAmount, setCustomAmount] = useState(false);

  useEffect(() => {
    // Check if current amount is not in suggested fees
    const isCustom = !SUGGESTED_FEES.some(fee => fee.amount === formData.inspectionFee);
    setCustomAmount(isCustom && formData.inspectionFee !== 10000); // 10000 is default
  }, [formData.inspectionFee]);

  const handleFeeChange = (amount: number) => {
    setFormData(prev => ({ ...prev, inspectionFee: amount }));
    setCustomAmount(false);
  };

  const handleCustomAmountChange = (value: string) => {
    const amount = parseInt(value.replace(/,/g, "")) || 0;
    setFormData(prev => ({ ...prev, inspectionFee: amount }));
  };

  const handleInputChange = (field: keyof InspectionFeeSetup, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEarnings = () => {
    const fee = formData.inspectionFee || 0;
    const khabiteqDeduction = AGENT_UPGRADE_CONSTANTS.KHABITEQ_INSPECTION_DEDUCTION;
    const agentEarning = Math.max(0, fee - khabiteqDeduction);
    return { fee, khabiteqDeduction, agentEarning };
  };

  const handleNext = () => {
    // Validate inspection fee
    if (!formData.inspectionFee) {
      toast.error("Please set your inspection fee");
      return;
    }

    if (formData.inspectionFee < AGENT_UPGRADE_CONSTANTS.MIN_INSPECTION_FEE) {
      toast.error(`Minimum inspection fee is ${formatCurrency(AGENT_UPGRADE_CONSTANTS.MIN_INSPECTION_FEE)}`);
      return;
    }

    if (formData.inspectionFee > AGENT_UPGRADE_CONSTANTS.MAX_INSPECTION_FEE) {
      toast.error(`Maximum inspection fee is ${formatCurrency(AGENT_UPGRADE_CONSTANTS.MAX_INSPECTION_FEE)}`);
      return;
    }

    // Create complete inspection fee setup
    const completeData: InspectionFeeSetup = {
      inspectionFee: formData.inspectionFee,
      currency: "NGN",
      description: formData.description || "",
      terms: formData.terms || "",
    };

    onDataChange(completeData);
    onNext();
  };

  const { fee, khabiteqDeduction, agentEarning } = calculateEarnings();

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
            Set Your Inspection Fee
          </h3>
          <p className="text-[#5A5D63] max-w-2xl mx-auto">
            Set the fee clients will pay when booking property inspections with you. 
            This helps ensure serious buyers and compensates you for your time.
          </p>
        </div>

        {/* Fee Calculator Card */}
        <div className="bg-gradient-to-br from-[#8DDB90]/10 to-[#09391C]/5 rounded-xl p-6 border border-[#8DDB90]/20">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="text-[#8DDB90]" size={24} />
            <h4 className="text-lg font-semibold text-[#09391C] font-display">
              Fee Breakdown
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-[#5A5D63] mb-1">Client Pays</p>
              <p className="text-2xl font-bold text-[#09391C]">
                {formatCurrency(fee)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-[#5A5D63] mb-1">Khabiteq Fee</p>
              <p className="text-2xl font-bold text-orange-600">
                -{formatCurrency(khabiteqDeduction)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-[#5A5D63] mb-1">You Earn</p>
              <p className="text-2xl font-bold text-[#8DDB90]">
                {formatCurrency(agentEarning)}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <AlertCircle size={16} />
              Khabiteq deducts ₦{khabiteqDeduction.toLocaleString()} per booking for platform services
            </p>
          </div>
        </div>

        {/* Suggested Fees */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <TrendingUp size={20} />
            Suggested Inspection Fees
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {SUGGESTED_FEES.map((suggestionFee) => (
              <motion.div
                key={suggestionFee.amount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFeeChange(suggestionFee.amount)}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.inspectionFee === suggestionFee.amount && !customAmount
                    ? "border-[#8DDB90] bg-[#8DDB90]/5"
                    : "border-gray-200 hover:border-[#8DDB90]/50 hover:bg-gray-50"
                }`}
              >
                {suggestionFee.popular && (
                  <div className="absolute -top-2 -right-2 bg-[#8DDB90] text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                
                <div className="text-center">
                  <h5 className="font-semibold text-[#09391C] mb-2">
                    {suggestionFee.label}
                  </h5>
                  <p className="text-2xl font-bold text-[#8DDB90] mb-2">
                    {formatCurrency(suggestionFee.amount)}
                  </p>
                  <p className="text-sm text-[#5A5D63]">
                    {suggestionFee.description}
                  </p>
                  <p className="text-xs text-[#5A5D63] mt-2">
                    You earn: {formatCurrency(Math.max(0, suggestionFee.amount - khabiteqDeduction))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="radio"
                id="custom-amount"
                checked={customAmount}
                onChange={(e) => setCustomAmount(e.target.checked)}
                className="w-4 h-4 text-[#8DDB90] focus:ring-[#8DDB90]"
              />
              <label htmlFor="custom-amount" className="font-medium text-[#09391C]">
                Set Custom Amount
              </label>
            </div>
            
            {customAmount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#09391C] mb-2">
                    Custom Inspection Fee (₦) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A5D63]" size={18} />
                    <input
                      type="text"
                      value={formData.inspectionFee?.toLocaleString() || ""}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                      placeholder="Enter custom amount"
                    />
                  </div>
                  <p className="text-xs text-[#5A5D63] mt-1">
                    Range: {formatCurrency(AGENT_UPGRADE_CONSTANTS.MIN_INSPECTION_FEE)} - {formatCurrency(AGENT_UPGRADE_CONSTANTS.MAX_INSPECTION_FEE)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <Users size={20} />
            Additional Details (Optional)
          </h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Fee Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors resize-none"
                rows={3}
                placeholder="Explain what's included in your inspection fee (e.g., detailed report, photos, consultation)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Terms & Conditions
              </label>
              <textarea
                value={formData.terms || ""}
                onChange={(e) => handleInputChange("terms", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors resize-none"
                rows={3}
                placeholder="Add any specific terms for your inspection service (e.g., refund policy, rescheduling rules)"
              />
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-medium text-[#09391C] mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Why Inspection Fees Work
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-[#5A5D63]">Filters out non-serious buyers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-[#5A5D63]">Compensates your time and expertise</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-[#5A5D63]">Increases conversion rates</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-[#5A5D63]">Professional service positioning</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-[#5A5D63]">Additional revenue stream</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-[#5A5D63]">Quality client interactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-medium text-[#09391C] mb-4 flex items-center gap-2">
            <Building size={20} />
            Market Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#8DDB90] mb-1">₦8K-₦15K</p>
              <p className="text-[#5A5D63]">Average fee range</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#8DDB90] mb-1">85%</p>
              <p className="text-[#5A5D63]">Agents using fees</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#8DDB90] mb-1">3x</p>
              <p className="text-[#5A5D63]">Higher conversion</p>
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
            className="flex items-center gap-2 px-8 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8DDB90]/50 focus:ring-offset-2 font-medium"
          >
            Continue to Subscription
            <Building size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InspectionFeeStep;
