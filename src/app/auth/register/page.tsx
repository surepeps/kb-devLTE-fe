/**
 * eslint-disable react-hooks/exhaustive-deps
 *
 * @format
 */

/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Loading from "@/components/loading-component/loading";
import { useLoading } from "@/hooks/useLoading";
import Image from "next/image";
import React, { FC, Suspense, useEffect, useState } from "react";
import mailIcon from "@/svgs/envelope.svg";
import phoneIcon from "@/svgs/phone.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@/components/general-components/button";
import RadioCheck from "@/components/general-components/radioCheck";
import { RegisterWith } from "@/components/general-components/registerWith";
import googleIcon from "@/svgs/googleIcon.svg";
import facebookIcon from "@/svgs/facebookIcon.svg";
import Link from "next/link";
import { usePageContext } from "@/context/page-context";
import { useUserContext } from "@/context/user-context";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import CustomToast from "@/components/general-components/CustomToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowLeft,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const Register = () => {
  const isLoading = useLoading();
  const { setUser, user } = useUserContext();
  const { isContactUsClicked } = usePageContext();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Enter email"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(
        /^(?=(?:.*[\W_]){2,}).*$/,
        "Password must contain at least two special character",
      )
      .required("Password is required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), undefined],
      "Passwords must match",
    ),
    firstName: Yup.string()
      .matches(/^[a-zA-Z]+$/, "First name must only contain letters")
      .required("Firstname is required"),
    lastName: Yup.string()
      .matches(/^[a-zA-Z]+$/, "Last name must only contain letters")
      .required("Lastname is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must only contain digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .required("Phone number is required"),
    userType: Yup.string().required("Please select account type"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      confirmPassword: "",
      userType: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsDisabled(true);
      try {
        const url = URLS.BASE + URLS.userSignup;
        const { phone, confirmPassword, ...payload } = values;
        await toast.promise(
          POST_REQUEST(url, {
            ...payload,
            phoneNumber: String(values.phone),
            userType: values.userType,
          }).then((response) => {
            if ((response as any).success) {
              localStorage.setItem(
                "fullname",
                `${formik.values.firstName} ${formik.values.lastName}`,
              );
              localStorage.setItem("email", `${formik.values.email}`);
              localStorage.setItem(
                "phoneNumber",
                `${String(formik.values.phone)}`,
              );
              localStorage.setItem("token", (response as any).token);

              setIsDisabled(false);
              formik.resetForm();
              setAgreed(false);

              if (values.userType === "Agent") {
                // For agents, show verification email success page
                setTimeout(() => {
                  toast.custom(
                    <CustomToast
                      title="Registration successful"
                      subtitle="A Verification has been sent to your email. Please verify your email to continue"
                    />,
                  );
                }, 2000);
                router.push("/auth/verification-sent");
              } else {
                // For landlords, auto login them
                toast.success("Registration successful");
                Cookies.set("token", (response as any).token);
                setUser((response as any).user);
                router.push("/my_listing");
              }

              return "Registration successful";
            } else {
              const errorMessage =
                (response as any).error || "Registration failed";
              toast.error(errorMessage);
              setIsDisabled(false);
              throw new Error(errorMessage);
            }
          }),
          {
            loading: "Signing up...",
          },
        );
      } catch (error) {
        console.log(error);
        setIsDisabled(false);
      }
    },
  });

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse: any) => {
      if (!formik.values.userType) {
        toast.error("Please select account type first");
        return;
      }

      const url = URLS.BASE + URLS.user + URLS.googleSignup;

      await POST_REQUEST(url, {
        code: codeResponse.code,
        userType: formik.values.userType,
      }).then(async (response) => {
        if ((response as any).id) {
          Cookies.set("token", (response as any).token);
          setUser((response as any).user);

          localStorage.setItem("email", (response as any).user?.email || "");

          toast.success("Registration successful");

          if ((response as any).user?.userType === "Agent") {
            router.push("/agent/onboard");
          } else {
            router.push("/my_listing");
          }
        }
        if (response.error) {
          toast.error(response.error);
        }
      });
    },
    onError: (errorResponse: any) => toast.error(errorResponse.message),
  });

  // Initialize Facebook SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "123456789",
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleFacebookSignup = () => {
    if (!formik.values.userType) {
      toast.error("Please select account type first");
      return;
    }

    if (typeof window !== "undefined" && window.FB) {
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            window.FB.api(
              "/me",
              { fields: "name,email,first_name,last_name" },
              async (userInfo: any) => {
                try {
                  const url = URLS.BASE + URLS.user + URLS.facebookSignup;
                  const payload = {
                    accessToken: response.authResponse.accessToken,
                    userID: response.authResponse.userID,
                    email: userInfo.email,
                    firstName: userInfo.first_name,
                    lastName: userInfo.last_name,
                    userType: formik.values.userType,
                  };

                  const result = await POST_REQUEST(url, payload);
                  if (result.user?.id) {
                    toast.success("Registration successful");
                    Cookies.set("token", result.token);
                    setUser(result.user);
                    localStorage.setItem("email", result.user.email || "");

                    if (result.user.userType === "Agent") {
                      router.push("/agent/onboard");
                    } else {
                      router.push("/my_listing");
                    }
                  } else {
                    toast.error(result.error || "Facebook registration failed");
                  }
                } catch (error) {
                  console.error("Facebook signup error:", error);
                  toast.error(
                    "Facebook registration failed, please try again!",
                  );
                }
              },
            );
          } else {
            toast.error("Facebook login was cancelled");
          }
        },
        { scope: "email,public_profile" },
      );
    } else {
      toast.error("Facebook SDK not loaded");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl"></div>
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e0e7ff" fill-opacity="0.3"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-40'
        }
      ></div>

      <div className="relative w-full max-w-2xl mx-auto">
        {/* Back to home button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Registration Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8DDB90] to-[#09391C] rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join Khabi-Teq and start your real estate journey
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Account Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                I am a <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("userType", "Landlord")}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    formik.values.userType === "Landlord"
                      ? "border-[#8DDB90] bg-[#8DDB90]/10 text-[#09391C]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
                    <span className="font-medium">Landlord</span>
                    <span className="text-xs text-gray-500">
                      Property Owner
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("userType", "Agent")}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    formik.values.userType === "Agent"
                      ? "border-[#8DDB90] bg-[#8DDB90]/10 text-[#09391C]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FontAwesomeIcon icon={faUserTie} className="w-6 h-6" />
                    <span className="font-medium">Agent</span>
                    <span className="text-xs text-gray-500">
                      Real Estate Professional
                    </span>
                  </div>
                </button>
              </div>
              {formik.touched.userType && formik.errors.userType && (
                <p className="text-sm text-red-600">{formik.errors.userType}</p>
              )}
            </div>

            {/* Social Registration */}
            {formik.values.userType && (
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Quick signup with
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={googleLogin}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    <Image
                      src={googleIcon}
                      alt="Google"
                      width={18}
                      height={18}
                    />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleFacebookSignup}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    <Image
                      src={facebookIcon}
                      alt="Facebook"
                      width={18}
                      height={18}
                    />
                    Facebook
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  type="text"
                  value={formik.values.firstName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  type="text"
                  value={formik.values.lastName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Image
                    src={mailIcon}
                    alt=""
                    width={18}
                    height={18}
                    className="opacity-40"
                  />
                </div>
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="phone"
                  type="tel"
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Image
                    src={phoneIcon}
                    alt=""
                    width={18}
                    height={18}
                    className="opacity-40"
                  />
                </div>
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    disabled={isDisabled}
                    placeholder="Create password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    disabled={isDisabled}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                      className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                disabled={isDisabled}
                className="mt-1 w-4 h-4 text-[#8DDB90] bg-gray-100 border-gray-300 rounded focus:ring-[#8DDB90] focus:ring-2"
              />
              <label htmlFor="agree" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/policies_page"
                  className="text-[#09391C] hover:text-[#8DDB90] font-medium"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/policies_page"
                  className="text-[#09391C] hover:text-[#8DDB90] font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isDisabled ||
                !agreed ||
                !formik.values.email ||
                !formik.values.password ||
                !formik.values.firstName ||
                !formik.values.lastName ||
                !formik.values.phone ||
                !formik.values.userType
              }
              className="w-full bg-gradient-to-r from-[#8DDB90] to-[#09391C] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#7BC97E] hover:to-[#083018] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isDisabled ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#09391C] hover:text-[#8DDB90] font-semibold transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Khabi-Teq. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
