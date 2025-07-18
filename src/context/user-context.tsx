/** @format */

"use client";
import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

export interface User {
  accountApproved: boolean;
  _id?: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  selectedRegion?: string[];
  userType?: "Agent" | "Landowners";
  accountId?: string;
  profile_picture?: string;
  address?: {
    localGovtArea: string;
    city: string;
    state: string;
    street: string;
  };
  agentType?: string;
  doc?: string;
  individualAgent?: {
    idNumber: string;
    typeOfId: string;
  };
  agentData?: {
    accountApproved: boolean;
    agentType: string;
  };
  companyAgent?: {
    companyName: string;
    companyRegNumber: string;
  };
} 

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: (callback?: () => void) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  const pathName = usePathname();
  const router = useRouter();

  // Memoize setUser to prevent unnecessary re-renders
  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  const getUser = async () => {
    const url = URLS.BASE + URLS.user + URLS.userProfile;
    const token = Cookies.get("token");

    if (!token) {
      if (pathName && !pathName.includes("/auth")) {
        router.push("/auth/login");
      }
      return;
    }

    try {
      const response = await GET_REQUEST(url, token);
      if (response?._id) {
        setUserState(response);
      } else if (
        typeof response?.message === "string" &&
        (response.message.toLowerCase().includes("unauthorized") ||
          response.message.toLowerCase().includes("jwt") ||
          response.message.toLowerCase().includes("expired") ||
          response.message.toLowerCase().includes("malformed"))
      ) {
        Cookies.remove("token");
        toast.error("Session expired, please login again");
        router.push("/auth/login");
      }
    } catch (error) {
      console.log("Error", error);
      router.push("/auth/login");
    }
  };

  const logout = useCallback(
    async (callback?: () => void) => {
      try {
        Cookies.remove("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("email");
        localStorage.removeItem("fullname");
        localStorage.removeItem("phoneNumber");
        localStorage.removeItem("token");
        setUserState(null);
        toast.success("Logged out successfully");
        await router.push("/auth/login");
        if (callback) await callback();
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("Error during logout");
        throw error;
      }
    },
    [router],
  );

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getUser();
    } else {
      if (pathName && !pathName.includes("/auth")) {
        // Optionally redirect to login
        // router.push("/auth/login");
      }
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      logout,
    }),
    [user, setUser, logout],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
