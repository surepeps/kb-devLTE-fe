/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useClickOutside from "@/hooks/clickOutside";
import Image from "next/image";
import userIcon from "@/svgs/user2.svg";
import faLock from "@/svgs/lock.svg";
import { User, useUserContext } from "@/context/user-context";
import { archivo } from "@/styles/font";
import { LayoutDashboardIcon, BellIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import microphonesvg from "@/svgs/microphone.svg";
import Link from "next/link";
import { usePageContext } from "@/context/page-context";
import { AgentNavData } from "@/enums";
import notificationBellIcon from "@/svgs/bell.svg";

type userDetailsProps = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  id: string;
  _id: string;
} | null;
interface UserProfileModalProps {
  closeUserProfileModal: (type: boolean) => void;
  userDetails: User | null;
}

const UserProfile: React.FC<UserProfileModalProps> = ({
  closeUserProfileModal,
  userDetails,
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { logout } = useUserContext();
  const { setSelectedNav } = usePageContext();
  const [userType, setUserType] = useState<"Agent" | "Landowners">("Agent");

  const router = useRouter();

  useClickOutside(ref, () => closeUserProfileModal(false));

  useEffect(() => {
    setUserType(userDetails?.userType as "Agent" | "Landowners");
  }, [userDetails]);
  return (
    <motion.div
      ref={ref}
      initial={{ y: 10, opacity: 0, scale: 0.95 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, type: "spring", damping: 20, stiffness: 300 }}
      viewport={{ once: true }}
      className="absolute top-full right-0 z-50 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      style={{
        // Dynamic positioning for mobile
        transform:
          window.innerWidth < 768 ? "translateX(-50%)" : "translateX(-75%)",
      }}
    >
      <div className="bg-gradient-to-r from-[#8DDB90] to-[#09391C] p-4">
        <h2 className="text-lg font-semibold text-white">My Profile</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {/**User Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7C8493] font-medium">
              {userType === "Agent" ? "Agent Type" : "User Type"}
            </span>
            <span className="text-sm text-[#25324B] font-semibold">
              {userType === "Agent"
                ? userDetails?.agentData?.agentType || "N/A"
                : userType}
            </span>
          </div>

          {/**User ID */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7C8493] font-medium">ID</span>
            <span className="text-sm text-[#25324B] font-mono bg-white px-2 py-1 rounded border">
              {userDetails?.accountId}
            </span>
          </div>

          {/**Name */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7C8493] font-medium">Name</span>
            <span className="text-sm text-[#25324B] font-semibold">
              {userDetails?.firstName} {userDetails?.lastName}
            </span>
          </div>

          {/**Email */}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#7C8493] font-medium">Email</span>
            <span className="text-sm text-[#25324B] break-all">
              {userDetails?.email}
            </span>
          </div>

          {/**Phone number */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7C8493] font-medium">Phone</span>
            <span className="text-base text-[#25324B]">
              {userDetails?.phoneNumber}
            </span>
          </div>
        </div>

        {userType === "Agent" ? (
          <button
            onClick={() => router.push("/post_property")}
            className="h-[50px] bg-[#8DDB90] border-[1px] border-[#5A5D63]/[50%] text-[#FFFFFF]"
            type="button"
          >
            List a property
          </button>
        ) : null}
      </div>

      {/**Dashboard */}
      {userType === "Agent" ? (
        <button
          type="button"
          className="w-full h-[26px] flex items-end gap-[10px]"
        >
          <LayoutDashboardIcon
            size={"sm"}
            width={24}
            height={24}
            color="#5A5D63"
            className="w-[24px] h-[24px]"
          />
          <Link
            href={"/agent/briefs"}
            className="text-base font-medium underline"
          >
            Dashboard
          </Link>
        </button>
      ) : null}

      {/**Agent marketplace */}
      {userType === "Agent" ? (
        <button
          onClick={() => router.push("/agent/agent-marketplace")}
          type="button"
          className="w-full h-[26px] flex items-end gap-[10px]"
        >
          <Image
            alt="lock"
            src={microphonesvg}
            width={24}
            height={24}
            className="w-[24px] h-[24px]"
          />
          <span className="text-base font-medium underline">marketplace</span>
        </button>
      ) : null}

      {/**Referral */}
      <button
        type="button"
        className="w-full h-[26px] flex items-end gap-[10px]"
      >
        <Image
          alt="lock"
          src={userIcon}
          width={24}
          height={24}
          className="w-[24px] h-[24px]"
        />
        <Link href={"/referral"} className="text-base font-medium underline">
          Referral
        </Link>
      </button>

      {/**Notifications */}
      <button
        type="button"
        className="w-full h-[26px] flex items-end gap-[10px]"
      >
        <Image
          alt="notifications"
          src={notificationBellIcon}
          width={24}
          height={24}
          className="w-[24px] h-[24px]"
        />
        <span
          onClick={() => {
            // TODO: Add notification handling
            console.log("Notifications clicked");
          }}
          className="text-base font-medium underline"
        >
          Notifications
        </span>
      </button>

      {/**Change Password */}
      <button
        type="button"
        className="w-full h-[26px] flex items-end gap-[10px]"
      >
        <Image
          alt="lock"
          src={faLock}
          width={24}
          height={24}
          className="w-[24px] h-[24px]"
        />
        <span
          onClick={() => {
            setSelectedNav(AgentNavData.SETTINGS);
            router.push("/agent/briefs");
          }}
          className="text-base font-medium underline"
        >
          Change Password
        </span>
      </button>

      {/**button to sign out */}
      <button
        type="button"
        onClick={() => {
          console.log("Sign out button clicked");
          logout(() => closeUserProfileModal(false));
        }}
        className="w-full h-[50px] border-[1px] text-base font-medium border-[#FF3D00] text-[#FF2539]"
      >
        Sign out
      </button>
    </motion.div>
  );
};

export default UserProfile;
