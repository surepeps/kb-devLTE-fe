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

const VerificationSent = () => {
  const isLoading = useLoading();
  const { isContactUsClicked } = usePageContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      router.push("/auth/register");
      return;
    }
    setEmail(userEmail);
  }, [router]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const url = URLS.BASE + URLS.user + URLS.resendVerification; // Adjust URL as needed

      await toast.promise(
        POST_REQUEST(url, { email }).then((response) => {
          if (response.success) {
            return "Verification email sent again";
          } else {
            throw new Error((response as any).error || "An error occurred");
          }
        }),
        {
          loading: "Resending verification...",
          success: "Verification email sent again",
          error: (error: { message: any }) => {
            return error.message || "Failed to resend verification";
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
        <div className="lg:w-[600px] w-full min-h-[600px] flex flex-col items-center gap-[20px] text-center">
          <h2 className="text-[24px] font-display leading-[38.4px] font-semibold text-[#09391C]">
            Verification Email Sent!
          </h2>

          <div className="w-20 h-20 bg-[#8DDB90] rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-gray-600">
              Congratulations! Your agent registration was successful.
            </p>
            <p className="text-gray-600">
              We&apos;ve sent a verification email to <strong>{email}</strong>.
              Please check your email and click the verification link to
              activate your account.
            </p>
            <p className="text-sm text-gray-500">
              Once verified, you&apos;ll be able to access all agent features
              and start connecting with potential clients.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
            <h3 className="font-semibold text-blue-800 mb-2">
              What&apos;s Next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Click the verification link in the email</li>
              <li>• Complete your agent profile setup</li>
              <li>• Start browsing client briefs</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 w-full lg:px-[60px] mt-6">
            <Button
              value={isResending ? "Resending..." : "Resend Verification Email"}
              className="min-h-[50px] w-full py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold"
              onClick={handleResendVerification}
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
            Already verified?{" "}
            <Link className="font-semibold text-[#09391C]" href="/auth/login">
              Sign in to your account
            </Link>
          </p>

          <div className="text-sm text-gray-500 max-w-md">
            <p>
              <strong>Didn&apos;t receive the email?</strong> Check your
              spam/junk folder or contact support if you continue to have
              issues.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationSent;
