/** @format */

"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import khabiteqIcon from "@/svgs/khabi-teq.svg";
import Button from "@/components/general-components/button";
import Image from "next/image";
import {
  mainNavigationData,
  marketplaceDropdownData,
  type NavigationItem,
} from "@/data/navigation-data";
import Link from "next/link";
import barIcon from "@/svgs/bars.svg";
import { usePageContext } from "@/context/page-context";
// import { useRouter } from 'next/router';
import { usePathname, useRouter } from "next/navigation";
import SideBar from "../general-components/sideBar";
import { FaCaretDown } from "react-icons/fa";
import useClickOutside from "@/hooks/clickOutside";
import { motion } from "framer-motion";
import { useUserContext } from "@/context/user-context";
import notificationBellIcon from "@/svgs/bell.svg";
import userIcon from "@/svgs/user.svg";
import UserNotifications from "./user-notifications";
import UserProfile from "./my-profile";

const Header = ({ isComingSoon }: { isComingSoon?: boolean }) => {
  const {
    isContactUsClicked,
    rentPage,
    isModalOpened,
    setIsModalOpened,
    viewImage,
    isSubmittedSuccessfully,
    setIsContactUsClicked,
  } = usePageContext();
  const [navigationState, setNavigationState] = useState(mainNavigationData);
  const pathName = usePathname();
  const [isMarketplaceModalOpened, setIsMarketplaceModalOpened] =
    useState<boolean>(false);
  const { user, logout } = useUserContext();
  const [isNotificationModalOpened, setIsNotificationModalOpened] =
    useState<boolean>(false);
  const [isUserProfileModalOpened, setIsUserProfileModal] =
    useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    id: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // console.log(isModalOpened);
  }, [isModalOpened]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    try {
      const parsedUser = user ? JSON.parse(user) : null;
      if (parsedUser && typeof parsedUser === "object") {
        setUserDetails(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      setUserDetails(null);
    }
  }, []);

  useEffect(() => {
    // console.log(user);
  }, [user]);

  useEffect(() => {
    // console.log(pathName)
  }, [pathName]);

  // Handle backdrop click to close sidebar
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      setIsModalOpened(false);
    }
  };

  return (
    <Fragment>
      <header
        className={`w-full flex justify-center ${
          isComingSoon && "filter blur-sm"
        } items-center py-[20px] pl-[10px] bg-[#EEF1F1] pr-[20px] ${
          (isContactUsClicked ||
            rentPage.isSubmitForInspectionClicked ||
            isModalOpened ||
            viewImage ||
            isSubmittedSuccessfully ||
            rentPage.submitPreference) &&
          "filter brightness-[30%] transition-all duration-500 overflow-hidden"
        }`}
      >
        <nav className={`h-[50px] container flex justify-between items-center`}>
          <Image
            src={khabiteqIcon}
            width={1000}
            height={1000}
            className="md:w-[169px] md:h-[25px] w-[144px] h-[30px]"
            alt=""
          />
          <div className="lg:flex gap-[20px] hidden">
            {navigationState.map((item: NavigationItem, idx: number) => {
              if (item.name === "Marketplace" && item.subItems) {
                return (
                  <div
                    key={idx}
                    className="relative flex flex-col"
                    onMouseEnter={() => {
                      // Close other dropdowns if any
                      setIsMarketplaceModalOpened(true);
                    }}
                    onMouseLeave={() => {
                      // Add small delay to prevent flickering
                      setTimeout(() => setIsMarketplaceModalOpened(false), 100);
                    }}
                  >
                    <button
                      className="flex items-center gap-1 cursor-pointer py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMarketplaceModalOpened(!isMarketplaceModalOpened);
                      }}
                    >
                      <span
                        className={`transition-all duration-300 font-medium text-[18px] leading-[21px] hover:text-[#8DDB90] ${
                          pathName.includes(item.url) ||
                          isMarketplaceModalOpened
                            ? "text-[#8DDB90]"
                            : "text-[#000000]"
                        }`}
                      >
                        {item.name}
                      </span>
                      <FaCaretDown
                        className={`transition-transform duration-200 w-3 h-3 ${
                          isMarketplaceModalOpened ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isMarketplaceModalOpened && (
                        <MarketplaceOptions
                          setModal={setIsMarketplaceModalOpened}
                          items={item.subItems}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={idx}
                  href={item.url}
                  onClick={() => {
                    // Close any open dropdowns
                    setIsMarketplaceModalOpened(false);
                    const updatedNav = navigationState.map((navItem) =>
                      navItem.name === item.name
                        ? { ...navItem, isClicked: true }
                        : { ...navItem, isClicked: false },
                    );
                    setNavigationState(updatedNav);
                  }}
                  className={`transition-all duration-300 font-medium text-[18px] leading-[21px] hover:text-[#8DDB90] py-2 ${
                    item.url === pathName ? "text-[#8DDB90]" : "text-[#000000]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          {/**Buttons for desktop screens */}
          <div className="hidden lg:flex items-center gap-6">
            {user?._id ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    type="button"
                    title="Notifications"
                    onClick={() => setIsNotificationModalOpened(true)}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <Image
                      src={notificationBellIcon}
                      width={20}
                      height={20}
                      alt="Notifications"
                      className="w-5 h-5"
                    />
                  </button>
                  {isNotificationModalOpened && (
                    <UserNotifications
                      closeNotificationModal={setIsNotificationModalOpened}
                    />
                  )}
                </div>

                {/* User Profile */}
                <div className="relative">
                  <button
                    type="button"
                    title="Profile"
                    onClick={() =>
                      setIsUserProfileModal(!isUserProfileModalOpened)
                    }
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#8DDB90] to-[#09391C] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {user?.profilePicture ? (
                      <Image
                        src={user?.profilePicture}
                        width={40}
                        height={40}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </button>
                  {isUserProfileModalOpened && (
                    <UserProfile
                      userDetails={user}
                      closeUserProfileModal={setIsUserProfileModal}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  value="Login"
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                  className="text-base bg-transparent border border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white transition-all duration-300 leading-[25px] font-medium px-6 h-[44px] rounded-lg"
                />
                <Button
                  value="Sign up"
                  green={true}
                  onClick={() => {
                    window.localStorage.setItem("signupFromHeader", "true");
                    router.push("/auth");
                  }}
                  className="text-base text-[#FFFFFF] leading-[25px] font-medium px-6 h-[44px] rounded-lg bg-[#8DDB90] hover:bg-[#7BC87F] transition-all duration-300"
                />
              </div>
            )}
          </div>

          {/**Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            {user?._id ? (
              <>
                {/* Mobile Notifications */}
                <button
                  type="button"
                  title="Notifications"
                  onClick={() => setIsNotificationModalOpened(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100"
                >
                  <Image
                    src={notificationBellIcon}
                    width={18}
                    height={18}
                    alt="Notifications"
                    className="w-[18px] h-[18px]"
                  />
                </button>

                {/* Mobile User Profile */}
                <div className="relative">
                  <button
                    type="button"
                    title="Profile"
                    onClick={() =>
                      setIsUserProfileModal(!isUserProfileModalOpened)
                    }
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#8DDB90] to-[#09391C] shadow-sm"
                  >
                    {user?.profilePicture ? (
                      <Image
                        src={user?.profilePicture}
                        width={32}
                        height={32}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-xs">
                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </button>
                  {isUserProfileModalOpened && (
                    <UserProfile
                      userDetails={user}
                      closeUserProfileModal={setIsUserProfileModal}
                    />
                  )}
                </div>

                {/* Mobile Notifications Modal */}
                {isNotificationModalOpened && (
                  <UserNotifications
                    closeNotificationModal={setIsNotificationModalOpened}
                  />
                )}
              </>
            ) : null}

            <button
              onClick={() => {
                setIsModalOpened(!isModalOpened);
              }}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100"
              aria-label="Menu"
            >
              <Image
                src={barIcon}
                width={20}
                height={14}
                alt="Menu"
                className="w-5 h-[14px]"
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Backdrop overlay for sidebar */}
      {isModalOpened && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      <SideBar
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
      />
    </Fragment>
  );
};

const MarketplaceOptions = ({
  setModal,
  items,
}: {
  setModal: (type: boolean) => void;
  items: NavigationItem[];
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setSelectedType } = usePageContext();

  useClickOutside(ref, () => setModal(false));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      ref={ref}
      className="w-[231px] mt-[10px] p-[19px] flex flex-col gap-[15px] bg-[#FFFFFF] shadow-xl border border-gray-100 rounded-lg absolute z-[999]"
      onMouseLeave={() => setModal(false)}
    >
      {items.map((item: NavigationItem, idx: number) => (
        <Link
          onClick={(e) => {
            e.preventDefault();
            if (item.name === "Buy") {
              setSelectedType("Buy a property");
            } else if (item.name === "Rent") {
              setSelectedType("Rent/Lease a property");
            } else if (item.name === "Joint Venture") {
              setSelectedType("Find property for joint venture");
            }
            setModal(false);
            // Navigate after setting type
            setTimeout(() => {
              window.location.href = item.url;
            }, 100);
          }}
          className="text-base font-medium text-[#000000] hover:text-[#8DDB90] transition-colors py-2 px-1 rounded hover:bg-gray-50"
          href={item.url}
          key={idx}
        >
          {item.name}
        </Link>
      ))}
    </motion.div>
  );
};

export default Header;
