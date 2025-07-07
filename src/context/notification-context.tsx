/** @format */

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  const fetchNotifications = async () => {
    if (hasFetchedRef.current) return;

    try {
      setIsLoading(true);
      hasFetchedRef.current = true;

      const response = await GET_REQUEST(
        `${URLS.BASE}/user/notifications?limit=20&page=1`,
        Cookies.get("token"),
      );

      if (response?.success && response?.data) {
        setNotifications(response.data);
      } else {
        // Fallback notifications for demo
        setNotifications([
          {
            _id: "1",
            title: "Property View Alert",
            message:
              "A user viewed your 3-bedroom apartment listing in Victoria Island.",
            type: "info",
            isRead: false,
            createdAt: new Date(Date.now() - 300000).toISOString(),
          },
          {
            _id: "2",
            title: "Brief Approved",
            message:
              "Your commercial property brief has been approved and is now live.",
            type: "success",
            isRead: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            _id: "3",
            title: "New Inquiry Received",
            message:
              "Someone is interested in your joint venture opportunity in Abuja.",
            type: "info",
            isRead: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Set empty array on error
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );

      // Update server
      await fetch(
        `${URLS.BASE}/user/notifications/${notificationId}/markRead`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );

      // Update server
      await fetch(`${URLS.BASE}/user/notifications/mark-all-read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
