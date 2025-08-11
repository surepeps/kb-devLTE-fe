import React from 'react';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

export default function ThirdPartyVerificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <Toaster />
    </div>
  );
}
