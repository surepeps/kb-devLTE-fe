"use client"
import React, { useState } from 'react';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { useDocumentVerification } from '@/context/document-verification-context';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const {
    contactInfo,
    documentsMetadata,
    documentFiles,
    setReceiptFile,
    receiptFile,
    setAmountPaid,
    amountPaid,
    reset,
  } = useDocumentVerification();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate dynamic fee
  const documentCount = documentsMetadata.length;
  const fee = documentCount === 1 ? 20000 : 40000;

  // Set default amountPaid if not set
  React.useEffect(() => {
    if (!amountPaid) setAmountPaid(fee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fee]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountPaid(Number(e.target.value));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!receiptFile || !amountPaid) {
      setError('Please upload a receipt and enter the amount paid.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('fullName', contactInfo.fullName);
      formData.append('email', contactInfo.email);
      formData.append('phoneNumber', contactInfo.phoneNumber);
      formData.append('address', contactInfo.address);
      formData.append('amountPaid', amountPaid.toString());
      formData.append('documentsMetadata', JSON.stringify(documentsMetadata));
      formData.append('receipt', receiptFile);
      documentFiles.forEach(file => formData.append('documents', file));
      const res = await fetch('https://khabiteq-realty.onrender.com/api/submit-docs', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(true);
        reset();
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="flex items-center mb-8">
          <ArrowLeft className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-600">document verification</span>
          <span className="text-gray-400 mx-2">•</span>
          <span className="text-gray-800 font-medium">Back</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Details Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Make payment</h2>
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-4">₦{fee.toLocaleString()}</div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Account details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank</span>
                  <span className="text-gray-900 font-medium">FCMB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <span className="text-gray-900 font-medium">2004766765</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name</span>
                  <span className="text-gray-900 font-medium">Khabiteq limited</span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-600 text-sm">
                Note that this process is subject to Approval by khabiteq realty
              </p>
            </div>
          </div>

          {/* Receipt Upload Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Provide receipt Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={amountPaid || ''}
                  onChange={handleAmountChange}
                  placeholder="Enter amount paid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload your receipt
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    id="receipt"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="receipt"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Paperclip className="w-8 h-8 text-green-500 mb-2" />
                    <span className="text-green-600 font-medium">
                      {receiptFile ? receiptFile.name : 'Attach Receipt'}
                    </span>
                    {!receiptFile && (
                      <span className="text-gray-500 text-sm mt-1">
                        Click to upload or drag and drop
                      </span>
                    )}
                  </label>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                onClick={handleSubmit}
                className="w-full bg-green-400 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Documents sent for verification</h2>
            <p className="mb-6">Your documents have been submitted successfully. We will contact you soon.</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md"
              onClick={() => {
                setShowModal(false);
                router.push('/document_verification');
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}