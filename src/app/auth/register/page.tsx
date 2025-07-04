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
import { useSearchParams } from "next/navigation";
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
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
    <section
      className={`flex items-center justify-center bg-[#EEF1F1] w-full ${
        isContactUsClicked && "filter brightness-[30%]"
      } transition-all duration-500`}
    >
      <div className="container flex items-center justify-center py-[20px] md:py-[30px] md:mt-[60px] px-[25px] lg:px-0">
        <form
          onSubmit={formik.handleSubmit}
          className="lg:w-[600px] w-full min-h-[700px] flex flex-col items-center gap-[20px]"
        >
          <h2 className="text-3xl md:text-[24px] font-display leading-[38.4px] font-semibold text-[#09391C]">
            Register with us
          </h2>

          {/* Account Type Selection */}
          <div className="w-full flex flex-col gap-[15px] lg:px-[60px]">
            <span className="text-base leading-[25.6px] font-medium text-[#1E1E1E]">
              Are you a Landlord or Agent?
            </span>
            <div className="flex gap-[20px]">
              <label className="flex items-center gap-[8px] cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="Landlord"
                  checked={formik.values.userType === "Landlord"}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-[#8DDB90] bg-gray-100 border-gray-300 focus:ring-[#8DDB90] focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-900">
                  Landlord
                </span>
              </label>
              <label className="flex items-center gap-[8px] cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="Agent"
                  checked={formik.values.userType === "Agent"}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-[#8DDB90] bg-gray-100 border-gray-300 focus:ring-[#8DDB90] focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-900">Agent</span>
              </label>
            </div>
            {formik.touched.userType && formik.errors.userType && (
              <span className="text-red-600 text-sm">
                {formik.errors.userType}
              </span>
            )}
          </div>

          <div className="w-full min-h-[460px] flex flex-col gap-[15px] lg:px-[60px]">
            <div className="flex flex-col lg:flex-row gap-[15px] w-full">
              <Input
                formik={formik}
                title="First name"
                isDisabled={isDisabled}
                id="firstName"
                icon={""}
                type="text"
                placeholder="Enter your first name"
                className="w-full"
              />
              <Input
                formik={formik}
                title="Last name"
                isDisabled={isDisabled}
                id="lastName"
                icon={""}
                type="text"
                placeholder="Enter your last name"
                className="w-full"
              />
            </div>
            <Input
              formik={formik}
              title="Phone"
              id="phone"
              icon={phoneIcon}
              type="number"
              placeholder="Enter your phone number"
              isDisabled={isDisabled}
            />
            <Input
              formik={formik}
              title="Email"
              isDisabled={isDisabled}
              id="email"
              icon={mailIcon}
              type="email"
              placeholder="Enter your email"
            />
            <Input
              formik={formik}
              title="Password"
              isDisabled={isDisabled}
              seePassword={setShowPassword}
              isSeePassword={showPassword}
              id="password"
              icon={""}
              type="password"
              placeholder="Enter your password"
            />
            <Input
              formik={formik}
              title="Confirm Password"
              isDisabled={isDisabled}
              seePassword={setShowConfirmPassword}
              isSeePassword={showConfirmPassword}
              id="confirmPassword"
              icon={""}
              type="password"
              placeholder="Confirm your password"
            />
          </div>
          <div className="flex justify-center items-center w-full lg:px-[60px]">
            <RadioCheck
              isDisabled={isDisabled}
              isChecked={agreed}
              handleChange={() => setAgreed(!agreed)}
              type="checkbox"
              name="agree"
              className="w-full"
              value={`By clicking here, I agree to the Khabi-Teq realty <br/> <a href='/policies_page'><span style='color: #0B423D; font-weight: bold'>Policy</span> and <span style='color: #0B423D; font-weight: bold'>Rules</span></a>`}
            />
          </div>
          {/**Button */}
          <Button
            value={`${isDisabled ? "Registering..." : "Register"}`}
            isDisabled={
              isDisabled ||
              !agreed ||
              !formik.values.email ||
              !formik.values.password ||
              !formik.values.firstName ||
              !formik.values.lastName ||
              !formik.values.phone ||
              !formik.values.userType
            }
            className="min-h-[65px] w-full py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold"
            type="submit"
            green={true}
          />
          {/**Already have an account */}
          <span className="text-base leading-[25.6px] font-normal">
            Already have an account?{" "}
            <Link className="font-semibold text-[#09391C]" href={"/auth/login"}>
              Sign In
            </Link>
          </span>
          {/**Google | Facebook */}
          <div className="flex justify-between lg:flex-row flex-col gap-[15px] w-full">
            <RegisterWith
              icon={googleIcon}
              text="Continue with Google"
              onClick={googleLogin}
            />
            <RegisterWith
              icon={facebookIcon}
              text="Continue with Facebook"
              onClick={handleFacebookSignup}
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
  id: string;
  icon: StaticImport | string;
  formik: any;
  isDisabled?: boolean;
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
  isDisabled,
  seePassword,
  isSeePassword,
}) => {
  const fieldError = formik.errors[id];
  const fieldTouched = formik.touched[id];
  return (
    <label
      htmlFor={id}
      className={`min-h-[80px] ${className} flex flex-col gap-[4px]`}
    >
      <span className="text-base leading-[25.6px] font-medium text-[#1E1E1E]">
        {title}
      </span>
      <div className="flex items-center">
        <input
          name={id}
          type={
            type === "password" ? (isSeePassword ? "text" : "password") : type
          }
          value={formik.values[id]}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          disabled={isDisabled}
          placeholder={placeholder ?? "This is placeholder"}
          className="w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] hide-scrollbar disabled:bg-gray-200"
        />
        {type === "password" && (
          <div className="bg-[#FAFAFA] w-[50px] h-[50px] border-l-0 flex items-center justify-center">
            <FontAwesomeIcon
              title={isSeePassword ? "Hide password" : "See password"}
              className="cursor-pointer transition duration-500"
              icon={isSeePassword ? faEye : faEyeSlash}
              size="sm"
              color="black"
              onClick={() => {
                seePassword?.(!isSeePassword);
              }}
            />
          </div>
        )}
        {icon && type !== "password" ? (
          <Image
            src={icon}
            alt=""
            width={20}
            height={20}
            className="w-[20px] h-[20px] absolute ml-[330px] lg:ml-[440px] z-20 mt-[15px]"
          />
        ) : null}
      </div>
      {fieldError && fieldTouched && (
        <span className="text-red-600 text-sm">{fieldError}</span>
      )}
    </label>
  );
};

export default function RegisterPage() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
