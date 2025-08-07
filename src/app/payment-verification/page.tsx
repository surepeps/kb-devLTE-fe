"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';
import { GET_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import toast from 'react-hot-toast';

const PaymentVerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  const reference = searchParams.get('reference');
  const transactionId = searchParams.get('trxref') || searchParams.get('transactionId');

  useEffect(() => {
    if (!reference && !transactionId) {
      toast.error('No payment reference found');
      router.push('/');
      return;
    }

    verifyPayment();
  }, [reference, transactionId]);

  useEffect(() => {
    if (verificationStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verificationStatus === 'success' && countdown === 0) {
      handleRedirect();
    }
  }, [verificationStatus, countdown]);

  const verifyPayment = async () => {
    try {
      setVerificationStatus('verifying');
      
      const paymentReference = reference || transactionId;
      const response = await GET_REQUEST(`${URLS.BASE}${URLS.verifyPayment}?reference=${paymentReference}`);
      
      if (response.success) {
        setVerificationData(response.data);
        setVerificationStatus('success');
        toast.success('Payment verified successfully!');
      } else {
        setVerificationStatus('failed');
        toast.error(response.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('failed');
      toast.error('Failed to verify payment. Please try again.');
    }
  };

  const handleRedirect = () => {
    // Redirect based on transaction type and verification data
    if (verificationData?.redirectUrl) {
      window.location.href = verificationData.redirectUrl;
    } else if (verificationData?.transaction?.transactionType) {
      // Redirect based on transaction type
      switch (verificationData.transaction.transactionType) {
        case 'document-verification':
          router.push('/dashboard');
          break;
        case 'inspection-request':
          router.push('/my-inspection-requests');
          break;
        case 'subscription':
          router.push('/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Verified!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been successfully verified and processed.
            </p>
            {verificationData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 space-y-2">
                  {verificationData.transaction?.reference && (
                    <p><span className="font-medium">Reference:</span> {verificationData.transaction.reference}</p>
                  )}
                  {verificationData.transaction?.amount && (
                    <p><span className="font-medium">Amount:</span> ₦{verificationData.transaction.amount.toLocaleString()}</p>
                  )}
                  {verificationData.transaction?.status && (
                    <p><span className="font-medium">Status:</span> {verificationData.transaction.status}</p>
                  )}

                  {verificationData.transaction?.transactionType && (
                    <p>
                      <span className="font-medium">Type:</span>{' '}
                      {verificationData.transaction.transactionType
                        .replace('-', ' ')
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                  )}
                  {verificationData.typeEffect && (
                    <p><span className="font-medium">Service:</span> {verificationData.typeEffect.status === 'successful' ? 'Processed Successfully' : 'Processing'}</p>
                  )}
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Redirecting in {countdown} seconds...
            </p>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t verify your payment. This could be due to a cancelled transaction or network issue.
            </p>
            <div className="space-y-3">
              <button
                onClick={verifyPayment}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderVerificationStatus()}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationPage;
