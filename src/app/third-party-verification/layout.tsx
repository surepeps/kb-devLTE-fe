import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function ThirdPartyVerificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with company logo */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center">
              <img
                src="/khabi-teq.svg"
                alt="Khabi-Teq"
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">
                Khabi-Teq
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Simple footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500">
            © 2024 Khabi-Teq. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
