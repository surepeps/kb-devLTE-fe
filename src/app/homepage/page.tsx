/** @format */

"use client";

export default function Homepage({ isComingSoon }: { isComingSoon?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Khabi-Teq Real Estate
        </h1>
        <p className="text-gray-600 mb-8">
          Your trusted partner in real estate transactions
        </p>
        <div className="space-y-4">
          <div>Status: {isComingSoon ? "Coming Soon" : "Live"}</div>
          <div>Server is working correctly!</div>
        </div>
      </div>
    </div>
  );
}
