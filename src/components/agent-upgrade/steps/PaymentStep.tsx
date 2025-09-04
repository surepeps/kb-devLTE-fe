/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Lock,
  Building,
  Calendar,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";

interface PaymentStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  submitting: boolean;
  onSubmit: () => void;
  user: any;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
  submitting,
  onSubmit,
  user,
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalAmount = () => {
    const planAmount = data.selectedplan?.discountedPrice || 0;
    return planAmount;
  };

  const handlePayment = async () => {
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    if (processing || submitting) return;

    setProcessing(true);

    try {
      // Prepare payment data
      const paymentData = {
        amount: calculateTotalAmount(),
        planId: data.selectedplan?.id,
        paymentMethod,
        upgradeData: {
          basicProfile: data.basicprofile,
          extendedProfile: data.extendedprofile,
          inspectionFee: data.inspectionfee,
        },
      };

      // Call parent's submit function which will handle the API call
      await onSubmit();
      
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
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
            Complete Your Payment
          </h3>
          <p className="text-[#5A5D63] max-w-2xl mx-auto">
            You're one step away from becoming a verified agent! 
            Complete your payment to unlock all premium features.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-[#8DDB90]/10 to-[#09391C]/5 rounded-xl p-6 border border-[#8DDB90]/20">
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <Building size={20} />
            Order Summary
          </h4>
          
          <div className="space-y-4">
            {/* Plan Details */}
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium text-[#09391C]">
                  {data.selectedplan?.name} Plan
                </h5>
                <p className="text-sm text-[#5A5D63]">
                  {data.selectedplan?.duration} month{data.selectedplan?.duration > 1 ? "s" : ""} subscription
                </p>
                {data.selectedplan?.discount && (
                  <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mt-1">
                    {data.selectedplan.discount}% OFF
                  </span>
                )}
              </div>
              <div className="text-right">
                {data.selectedplan?.discount && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(data.selectedplan.originalPrice)}
                  </p>
                )}
                <p className="text-lg font-semibold text-[#09391C]">
                  {formatCurrency(data.selectedplan?.discountedPrice || 0)}
                </p>
              </div>
            </div>

            {/* Inspection Fee */}
            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-medium text-[#09391C]">Inspection Fee Setup</h5>
                <p className="text-sm text-[#5A5D63]">
                  Your fee: {formatCurrency(data.inspectionfee?.inspectionFee || 0)}
                </p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-600 text-sm px-2 py-1 rounded-full">
                  Included
                </span>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-[#09391C]">Total Amount</h4>
              <h4 className="text-xl font-bold text-[#8DDB90]">
                {formatCurrency(calculateTotalAmount())}
              </h4>
            </div>

            {/* Savings */}
            {data.selectedplan?.savings && (
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-medium">
                  🎉 You're saving {formatCurrency(data.selectedplan.savings)} with this plan!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <CreditCard size={20} />
            Payment Method
          </h4>
          
          <div className="space-y-4">
            <div
              onClick={() => setPaymentMethod("card")}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-[#8DDB90] bg-[#8DDB90]/5"
                  : "border-gray-200 hover:border-[#8DDB90]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "card"
                      ? "border-[#8DDB90] bg-[#8DDB90]"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "card" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <CreditCard className="text-[#8DDB90]" size={20} />
                <div>
                  <h5 className="font-medium text-[#09391C]">Debit/Credit Card</h5>
                  <p className="text-sm text-[#5A5D63]">
                    Pay securely with your debit or credit card
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod("transfer")}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "transfer"
                  ? "border-[#8DDB90] bg-[#8DDB90]/5"
                  : "border-gray-200 hover:border-[#8DDB90]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "transfer"
                      ? "border-[#8DDB90] bg-[#8DDB90]"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "transfer" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <Building className="text-[#8DDB90]" size={20} />
                <div>
                  <h5 className="font-medium text-[#09391C]">Bank Transfer</h5>
                  <p className="text-sm text-[#5A5D63]">
                    Transfer directly from your bank account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-blue-600" size={24} />
            <h4 className="font-medium text-blue-900">Secure Payment</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <Lock size={16} />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>PCI DSS compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Secure payment gateway</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>7-day money back guarantee</span>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-medium text-[#09391C] mb-4 flex items-center gap-2">
            <Calendar size={20} />
            What Happens Next?
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div>
                <h5 className="font-medium text-[#09391C]">Payment Processing</h5>
                <p className="text-[#5A5D63]">Your payment is processed securely</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
              </div>
              <div>
                <h5 className="font-medium text-[#09391C]">Account Verification</h5>
                <p className="text-[#5A5D63]">Your documents are reviewed (usually within 2-4 hours)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium">
                3
              </div>
              <div>
                <h5 className="font-medium text-[#09391C]">Profile Activation</h5>
                <p className="text-[#5A5D63]">Your verified agent profile goes live</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#8DDB90] text-white rounded-full flex items-center justify-center text-xs font-medium">
                4
              </div>
              <div>
                <h5 className="font-medium text-[#09391C]">Start Earning</h5>
                <p className="text-[#5A5D63]">Begin receiving bookings and inspection fees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-5 h-5 text-[#8DDB90] focus:ring-[#8DDB90] rounded mt-0.5"
            />
            <div className="text-sm">
              <span className="text-[#09391C]">
                I agree to the{" "}
                <button type="button" className="text-[#8DDB90] hover:underline">
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button type="button" className="text-[#8DDB90] hover:underline">
                  Privacy Policy
                </button>
              </span>
              <p className="text-[#5A5D63] mt-1">
                By proceeding, you authorize Khabiteq to charge your selected payment method for the subscription amount.
                You can cancel anytime from your dashboard.
              </p>
            </div>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onPrev}
            disabled={processing || submitting}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          
          <button
            type="button"
            onClick={handlePayment}
            disabled={!agreeToTerms || processing || submitting}
            className="flex items-center gap-2 px-8 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8DDB90]/50 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing || submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Complete Payment
                <DollarSign size={16} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentStep;
