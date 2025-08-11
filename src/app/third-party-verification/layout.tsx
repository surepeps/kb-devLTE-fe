'use client';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

// Verification Portal Header Component
const VerificationHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <img
                src="/khabi-teq.svg"
                alt="Khabi-Teq"
                className="h-8 w-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Document Verification Portal</h1>
              <p className="text-blue-200 font-medium">Secure • Trusted • Verified</p>
            </div>
          </div>

          {/* Security Indicators */}
          <div className="flex items-center space-x-6">
            {/* SSL Indicator */}
            <div className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">SSL Secured</span>
            </div>

            {/* Real-time Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-200">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Verification Portal Footer Component
const VerificationFooter = () => {
  return (
    <footer className="bg-gray-900 text-white border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <img
                  src="/khabi-teq.svg"
                  alt="Khabi-Teq"
                  className="h-6 w-auto filter brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Khabi-Teq</h3>
                <p className="text-blue-400 font-medium">Document Verification Services</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-lg">
              Nigeria's leading document verification platform. We provide secure, fast, and reliable
              verification services for real estate documents across Lagos and Ogun State.
              Your trusted partner in property transactions.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-300">Verified Platform</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-300">Bank Grade Security</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-300">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-blue-400">Verification Services</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Certificate of Occupancy</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Deed of Assignment</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Governor's Consent</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Survey Plan Documents</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Property Title Verification</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-blue-400">Verification Support</h4>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="space-y-2">
                <p className="font-medium text-white">24/7 Verification Hotline</p>
                <p className="text-blue-300">+234 (0) 801 234 5678</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-white">Email Support</p>
                <p className="text-blue-300">verification@khabi-teq.com</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-white">Emergency Line</p>
                <p className="text-red-300">+234 (0) 800 URGENT 1</p>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg mt-4">
                <p className="text-xs text-gray-400">Business Hours</p>
                <p className="text-sm font-medium">Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p className="text-sm font-medium">Saturday: 9:00 AM - 5:00 PM</p>
                <p className="text-xs text-gray-400 mt-1">Emergency support available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-400">
              <p>© 2024 Khabi-Teq Realty Limited. All rights reserved.</p>
              <p className="mt-1">Licensed Document Verification Provider • Registration No: RC-1234567</p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Powered by Khabi-Teq Verification Engine v2.0</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function ThirdPartyVerificationLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Completely hide the main application layout
    const hideMainLayout = () => {
      // Hide the main app header
      const mainHeader = document.querySelector('body > div:first-child header');
      if (mainHeader) {
        (mainHeader as HTMLElement).style.display = 'none';
      }

      // Hide the main app footer
      const mainFooter = document.querySelector('body > div:first-child footer');
      if (mainFooter) {
        (mainFooter as HTMLElement).style.display = 'none';
      }

      // Hide any navigation elements
      const navElements = document.querySelectorAll('body > div:first-child nav');
      navElements.forEach(nav => {
        (nav as HTMLElement).style.display = 'none';
      });

      // Set body styles for the verification portal
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'auto';
      document.body.style.background = '#f9fafb';
    };

    // Apply immediately and also after a short delay to catch dynamic content
    hideMainLayout();
    const timer = setTimeout(hideMainLayout, 100);

    return () => {
      clearTimeout(timer);
      // Restore body styles on cleanup
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col z-[9999] overflow-auto">
      {/* Verification Portal Header */}
      <VerificationHeader />

      {/* Main Content Area */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Verification Portal Footer */}
      <VerificationFooter />

      {/* Enhanced Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #374151',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            style: {
              background: '#059669',
              color: '#ffffff',
            },
          },
          error: {
            style: {
              background: '#dc2626',
              color: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}
