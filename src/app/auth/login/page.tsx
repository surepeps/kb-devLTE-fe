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
      className={`flex items-center justify-center bg-[#EEF1F1] w-full ${
        isContactUsClicked && "filter brightness-[30%]"
      } transition-all duration-500`}
    >
      <div className="container flex items-center justify-center py-[30px] mt-[20px] px-[25px] lg:px-0">
        <form
          onSubmit={formik.handleSubmit}
          className="lg:w-[600px] w-full min-h-[700px] flex flex-col items-center gap-[20px]"
        >
          <h2 className="text-[24px] font-display leading-[38.4px] font-semibold text-[#09391C]">
            Welcome Back
          </h2>
          <div className="w-full flex flex-col gap-[15px] lg:px-[60px]">
            <Input
              formik={formik}
              title="Email"
              id="email"
              icon={mailIcon}
              type="email"
              placeholder="Enter your email"
            />
            <Input
              formik={formik}
              title="Password"
              id="password"
              seePassword={setShowPassword}
              isSeePassword={showPassword}
              icon={""}
              type="password"
              placeholder="Enter your password"
            />
          </div>
          {/**Button */}
          <Button
            value="Sign In"
            className=" w-full py-[12px] px-[24px] bg-[#8DDB90] hover:bg-[#2f4d30] transition-all duration-300 text-[#FAFAFA] text-base leading-[25.6px] font-bold mt-6"
            type="submit"
            onSubmit={formik.handleSubmit}
            green={true}
          />
          {/**Already have an account */}

          <p className="text-base leading-[25.6px] font-normal">
            Don&apos;t have an account?{" "}
            <Link
              className="font-semibold text-[#09391C]"
              href={"/auth/register"}
            >
              Sign Up
            </Link>
          </p>

          <p className="text-base leading-[25.6px] font-normal">
            Forgot your password?{" "}
            <Link
              className="font-semibold text-[#09391C]"
              href={"/auth/forgot-password"}
            >
              Reset
            </Link>
          </p>

          {/**Google | Facebook */}
          <div className="flex justify-between w-full lg:flex-row flex-col gap-[15px]">
            <RegisterWith
              icon={googleIcon}
              text="Continue with Google"
              onClick={googleLogin}
            />
            <RegisterWith
              icon={facebookIcon}
              text="Continue with Facebook"
              onClick={handleFacebookLogin}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

interface InputProps {
  title: string;
  placeholder?: string;
  type: string;
  className?: string;
  id?: string;
  icon: StaticImport | string;
  formik: any;
  seePassword?: (type: boolean) => void;
  isSeePassword?: boolean;
}

const Input: FC<InputProps> = ({
  className,
  id,
  title,
  type,
  placeholder,
  icon,
  formik,
  seePassword,
  isSeePassword,
}) => {
  return (
    <label
      htmlFor={id}
      className={`min-h-[80px] ${className} flex flex-col gap-[4px]`}
    >
      <span className="text-base leading-[25.6px] font-medium text-[#1E1E1E]">
        {title}
      </span>
      <div className="flex items-center relative">
        <input
          name={id}
          type={
            type === "password" ? (isSeePassword ? "text" : "password") : type
          }
          value={formik.values[id || title]}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder={placeholder ?? "This is placeholder"}
          className={`w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] hide-scrollbar`}
        />

        {type === "password" && (
          <FontAwesomeIcon
            title={isSeePassword ? "Hide password" : "See password"}
            className="cursor-pointer transition absolute top-5 right-3 duration-500"
            icon={isSeePassword ? faEye : faEyeSlash}
            size="sm"
            color="black"
            onClick={() => {
              seePassword?.(!isSeePassword);
            }}
          />
        )}
      </div>
      {formik.touched[id || title] ||
        (formik.errors[id || title] && (
          <span className="text-red-600 text-sm">
            {formik.errors[id || title]}
          </span>
        ))}
    </label>
  );
};

export default Login;
