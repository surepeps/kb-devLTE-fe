/**
 * @format
 */

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userType = searchParams?.get("type");
    if (userType) {
      // If userType is passed, redirect to register with that info
      router.replace(`/auth/register?type=${userType}`);
    } else {
      // Default redirect to register page
      router.replace("/auth/register");
    }
  }, [router, searchParams]);

  return null;
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
