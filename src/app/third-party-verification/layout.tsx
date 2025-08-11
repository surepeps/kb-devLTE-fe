import React from 'react';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

// Independent Header Component
const ThirdPartyHeader = () => {
  return (
    <header className="bg-white shadow-md border-b-2 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src="/khabi-teq.svg"
              alt="Khabi-Teq"
              className="h-10 w-auto"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Khabi-Teq</h1>
              <p className="text-sm text-blue-600 font-medium">Third Party Document Verification</p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium text-sm">Secure Verification Portal</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Independent Footer Component
const ThirdPartyFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/khabi-teq.svg"
                alt="Khabi-Teq"
                className="h-8 w-auto filter brightness-0 invert"
              />
              <span className="ml-3 text-xl font-bold">Khabi-Teq</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Trusted document verification services. Ensuring authenticity and security
              in real estate transactions across Lagos and Ogun State.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Verification Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Certificate of Occupancy</li>
              <li>Deed of Assignment</li>
              <li>Governor's Consent</li>
              <li>Survey Plan Verification</li>
              <li>Property Title Documents</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>For verification support:</p>
              <p>Email: verification@khabi-teq.com</p>
              <p>Phone: +234 (0) 801 234 5678</p>
              <p className="text-xs text-gray-400 mt-4">
                Available Monday - Friday, 9:00 AM - 6:00 PM WAT
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 Khabi-Teq Realty Limited. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-gray-500">Powered by Khabi-Teq Verification System</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-400">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function ThirdPartyVerificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col fixed inset-0 z-50 overflow-auto">
      {/* Independent Header */}
      <ThirdPartyHeader />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Independent Footer */}
      <ThirdPartyFooter />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          },
        }}
      />
    </div>
  );
}
