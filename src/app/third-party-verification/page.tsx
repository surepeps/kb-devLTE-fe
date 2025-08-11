"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ThirdPartyVerificationRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a sample document ID or show an error
    router.push('/third-party-verification/sample-doc-123');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the verification page.</p>
      </div>
    </div>
  );
}
