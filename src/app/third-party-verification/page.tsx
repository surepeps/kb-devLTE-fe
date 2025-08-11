"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ThirdPartyVerificationRedirect() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      setIsRedirecting(true);
      try {
        // Use window.location for more reliable navigation
        window.location.href = '/third-party-verification/sample-doc-123';
      } catch (error) {
        console.error('Redirect error:', error);
        // Fallback to router
        router.push('/third-party-verification/sample-doc-123');
      }
    };

    // Small delay to prevent immediate redirect issues
    const timer = setTimeout(handleRedirect, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isRedirecting ? 'Redirecting...' : 'Loading...'}
        </h1>
        <p className="text-gray-600">
          Please wait while we redirect you to the verification page.
        </p>
      </div>
    </div>
  );
}
