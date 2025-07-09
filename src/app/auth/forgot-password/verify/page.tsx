/**
 * @format
 */

/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Loading from "@/components/loading-component/loading";
import { useLoading } from "@/hooks/useLoading";
import React, { useEffect, useState } from "react";
import Button from "@/components/general-components/button";
import Link from "next/link";
import { usePageContext } from "@/context/page-context";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const VerifyResetRequest = () => {
  const isLoading = useLoading();
  const { isContactUsClicked } = usePageContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const resetEmail = localStorage.getItem("resetEmail");
    if (!resetEmail) {
      router.push("/auth/forgot-password");
      return;
    }
    setEmail(resetEmail);
  }, [router]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const url = URLS.BASE + URLS.user + URLS.requestPasswordReset;

      await toast.promise(
        POST_REQUEST(url, { email }).then((response) => {
          if (response.success) {
            return "Password reset link sent again";
          } else {
            throw new Error((response as any).error || "An error occurred");
          }
        }),
        {
          loading: "Resending link...",
          success: "Password reset link sent again",
          error: (error: { message: any }) => {
            return error.message || "Failed to resend link";
          },
        },
      );
    } catch (error) {
      console.log("Unexpected error:", error);
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <section
      className={`flex items-center justify-center bg-[#EEF1F1] w-full ${
        isContactUsClicked && "filter brightness-[30%]"
      } transition-all duration-500`}
    >
      <div className="container flex items-center justify-center py-[30px] mt-[60px] px-[25px] lg:px-0">
        <div className="lg:w-[600px] w-full min-h-[500px] flex flex-col items-center gap-[20px] text-center">
          <h2 className="text-[24px] font-display leading-[38.4px] font-semibold text-[#09391C]">
            Check Your Email
          </h2>
          <div className="w-16 h-16 bg-[#8DDB90] rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 max-w-md">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
            Click the link in the email to reset your password.
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try resending.
          </p>

          <div className="flex flex-col gap-4 w-full lg:px-[60px] mt-6">
            <Button
              value={isResending ? "Resending..." : "Resend Email"}
              className="min-h-[50px] w-full py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold"
              onClick={handleResendEmail}
              isDisabled={isResending}
              green={true}
            />

            <Button
              value="Back to Login"
              className="min-h-[50px] w-full py-[12px] px-[24px] bg-gray-500 text-[#FAFAFA] text-base leading-[25.6px] font-bold"
              onClick={() => router.push("/auth/login")}
            />
          </div>

          <p className="text-base leading-[25.6px] font-normal">
            Remember your password?{" "}
            <Link className="font-semibold text-[#09391C]" href="/auth/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerifyResetRequest;
