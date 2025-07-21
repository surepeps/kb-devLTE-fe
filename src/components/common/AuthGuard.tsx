"use client";

import React, { ReactNode } from 'react';
import { useUserContext } from '@/context/user-context';
import Loading from '@/components/loading-component/loading';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: string[];
  redirectTo?: string;
}

/**
 * AuthGuard component that ensures user profile is loaded before rendering children
 * Also provides authentication and authorization checks
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false,
  allowedUserTypes = [],
  redirectTo = "/auth/login"
}) => {
  const { user, isLoading, isInitialized } = useUserContext();

  // Show loading while initializing user context
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF1F1]">
        <Loading />
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF1F1]">
        <Loading />
      </div>
    );
  }

  // If specific user types are required
  if (allowedUserTypes.length > 0 && user && !allowedUserTypes.includes(user.userType || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF1F1]">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default AuthGuard;
