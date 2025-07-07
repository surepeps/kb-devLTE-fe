'use client'
import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentVerification } from '@/context/document-verification-context';

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

const ContactInformationPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const router = useRouter();
  const { setContactInfo } = useDocumentVerification();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    // Handle back navigation
    console.log('Navigate back to previous page');
  };

  const handleSubmit = () => {
    setContactInfo(formData);
    router.push('/document_verification/payment_information');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-green-400">Verify</span>{' '}
            <span className="text-gray-800">Your Document</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Need to verify a document? Upload it and we'll handle the verification for you—fast, secure, and independent
          </p>
        </div>

        {/* Contact Information Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Contact information
            </h2>
            <p className="text-gray-600">
              Please provide your contact details so we can get back to you.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Full Name and Phone Number Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name of the buyer"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                  value={formData.fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Active phone number for follow-up"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                  value={formData.phoneNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="for communication"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              />
            </div>
            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                placeholder="Residential or business address"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                value={formData.address}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handleBack}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformationPage;