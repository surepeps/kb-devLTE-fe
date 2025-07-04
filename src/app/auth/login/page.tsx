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
import React, { FC, useEffect, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const Login = () => {
  const isLoading = useLoading();
  const { isContactUsClicked } = usePageContext();
  const { setUser, user } = useUserContext();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validationSchema = Yup.object({
    email: Yup.string().required("enter email"),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const url = URLS.BASE + URLS.user + URLS.login;
        const payload = { ...values };

        await toast.promise(
          POST_REQUEST(url, payload).then((response) => {
            const user = {
              firstName: response?.user?.firstName,
              lastName: response?.user?.lastName,
              phoneNumber: response?.user?.phoneNumber,
              email: response?.user?.email,
              id: response?.user?.id,
              userType: response?.user?.userType,
              agentData: response?.user?.agentData,
              accountApproved: response?.user?.accountApproved,
            };
            sessionStorage.setItem("user", JSON.stringify(user));

            if ((response as any)?.user?.id) {
              if (response.user.userType === "Agent") {
                if (!response.user.agentData?.agentType) {
                  router.push("/agent/onboard");
                } else if (response.user.accountApproved === false) {
                  router.push("/agent/under-review");
                } else if (
                  response.user.phoneNumber &&
                  response.user.agentData.agentType
                ) {
                  router.push("/agent/briefs");
                }
              } else {
                router.push("/my_listing");
              }

              toast.success("Sign in successful");
              Cookies.set("token", (response as any).token);
              setUser((response as any).user);

              return "Sign in successful";
            } else {
              throw new Error((response as any).error || "Sign In failed");
            }
          }),
          {
            loading: "Logging in...",
            success: "Welcome Back!",
            error: (error: { message: any }) => {
              console.log("error", error);
              return error.message || "Sign In failed, please try again!";
            },
          },
        );
      } catch (error) {
        console.log("Unexpected error:", error);
      }
    },
  });

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const url = URLS.BASE + URLS.user + URLS.googleLogin;

      await POST_REQUEST(url, { code: codeResponse.code }).then(
        async (response) => {
          if (response.id) {
            toast.success("Sign in successful");
            Cookies.set(
              "token",
              (response as unknown as { token: string }).token,
            );

            const user = {
              firstName: response?.user?.firstName,
              lastName: response?.user?.lastName,
              phoneNumber: response?.user?.phoneNumber,
              email: response?.user?.email,
              id: response?.user?.id,
              userType: response?.user?.userType,
              agentData: response?.user?.agentData,
              accountApproved: response?.user?.accountApproved,
            };

            setUser(user);
            sessionStorage.setItem("user", JSON.stringify(user));

            if (user.userType === "Agent") {
              if (!user.agentData?.agentType) {
                router.push("/agent/onboard");
              } else if (user.accountApproved === false) {
                router.push("/agent/under-review");
              } else if (user.phoneNumber && user.agentData.agentType) {
                router.push("/agent/briefs");
              }
            } else {
              router.push("/my_listing");
            }
          }
          console.log("response", response);
          if (response.error) {
            toast.error(response.error);
          }
        },
      );
    },
    onError: (errorResponse) =>
      toast.error("Sign In failed, please try again!"),
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
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "123456789", // Replace with actual Facebook App ID
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleFacebookLogin = () => {
    if (typeof window !== "undefined" && window.FB) {
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            window.FB.api(
              "/me",
              { fields: "name,email,first_name,last_name" },
              async (userInfo: any) => {
                try {
                  const url = URLS.BASE + URLS.user + URLS.facebookLogin;
                  const payload = {
                    accessToken: response.authResponse.accessToken,
                    userID: response.authResponse.userID,
                    email: userInfo.email,
                    firstName: userInfo.first_name,
                    lastName: userInfo.last_name,
                  };

                  const result = await POST_REQUEST(url, payload);
                  if (result.user?.id) {
                    toast.success("Sign in successful");
                    Cookies.set("token", result.token);

                    const user = {
                      firstName: result?.user?.firstName,
                      lastName: result?.user?.lastName,
                      phoneNumber: result?.user?.phoneNumber,
                      email: result?.user?.email,
                      id: result?.user?.id,
                      userType: result?.user?.userType,
                      agentData: result?.user?.agentData,
                      accountApproved: result?.user?.accountApproved,
                    };

                    setUser(user);
                    sessionStorage.setItem("user", JSON.stringify(user));

                    if (user.userType === "Agent") {
                      if (!user.agentData?.agentType) {
                        router.push("/agent/onboard");
                      } else if (user.accountApproved === false) {
                        router.push("/agent/under-review");
                      } else if (user.phoneNumber && user.agentData.agentType) {
                        router.push("/agent/briefs");
                      }
                    } else {
                      router.push("/my_listing");
                    }
                  } else {
                    toast.error(result.error || "Facebook login failed");
                  }
                } catch (error) {
                  console.error("Facebook login error:", error);
                  toast.error("Facebook login failed, please try again!");
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
    <section
      className={`flex items-center justify-center bg-[#EEF1F1] w-full min-h-screen ${
        isContactUsClicked && "filter brightness-[30%]"
      } transition-all duration-500`}
    >
      <div className="container flex items-center justify-center py-[40px] px-[25px] lg:px-0">
        <div className="w-full max-w-md mx-auto">
          {/* Clean Card Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-semibold text-[#09391C] mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={googleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                <Image src={googleIcon} alt="Google" width={20} height={20} />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                <Image
                  src={facebookIcon}
                  alt="Facebook"
                  width={20}
                  height={20}
                />
                Continue with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200"
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
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent outline-none transition-all duration-200 pr-12"
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

              <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#09391C] hover:text-[#8DDB90] font-medium transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                value={formik.isSubmitting ? "Signing in..." : "Sign In"}
                className="w-full py-3 px-4 bg-[#8DDB90] hover:bg-[#7BC97E] text-white text-base font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                isDisabled={formik.isSubmitting}
                green={true}
              />
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#09391C] hover:text-[#8DDB90] font-semibold transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
