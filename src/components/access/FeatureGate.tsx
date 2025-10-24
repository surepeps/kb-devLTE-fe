"use client";
import React from 'react';
import Link from 'next/link';
import { useFeatureGate } from '@/hooks/useFeatureGate';

interface FeatureGateProps {
  featureKeys: string[]; // All must be allowed
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
 
const DefaultFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center p-6">
    <div className="max-w-md w-full border border-gray-200 rounded-xl bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-[#0C1E1B] mb-3">Feature Not Available</h2>
      <p className="text-gray-600 mb-6">Your current plan does not include access to this feature. Upgrade to continue.</p>
      <Link href="/agent-subscriptions" className="bg-[#0B572B] hover:bg-[#094C25] text-white px-6 py-3 rounded-lg font-medium inline-block">View Plans</Link>
    </div>
  </div>
);

export default function FeatureGate({ featureKeys, children, fallback }: FeatureGateProps) {
  const checks = featureKeys.map(k => useFeatureGate(k));
  const allowed = checks.every(c => c.allowed);
  if (!allowed) return <>{fallback ?? <DefaultFallback />}</>;
  return <>{children}</>;
}
