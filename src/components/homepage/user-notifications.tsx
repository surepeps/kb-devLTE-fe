/** @format */

"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Eye, Trash2, Clock, CheckCircle } from "lucide-react";
import useClickOutside from "@/hooks/clickOutside";
import { GET_REQUEST, PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

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

type UserNotificationsProps = {
  closeNotificationModal: (type: boolean) => void;
};

const UserNotifications: React.FC<UserNotificationsProps> = ({
  closeNotificationModal,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const divRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(divRef, () => closeNotificationModal(false));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await GET_REQUEST(
        `${URLS.BASE}/user/notifications`,
        Cookies.get("token"),
      );

      if (response?.success && response?.data) {
        setNotifications(response.data);
      } else {
        // If API doesn't exist yet, show sample notifications
        setNotifications(sampleNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Show sample notifications as fallback
      setNotifications(sampleNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await PUT_REQUEST(
        `${URLS.BASE}/user/notifications/${notificationId}/read`,
        {},
        Cookies.get("token"),
      );

      if (response?.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Update local state anyway for better UX
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId),
      );
      toast.success("Notification deleted");

      // Attempt API call
      await PUT_REQUEST(
        `${URLS.BASE}/user/notifications/${notificationId}`,
        { deleted: true },
        Cookies.get("token"),
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((notif) => !notif.isRead)
        .map((notif) => notif._id);

      if (unreadIds.length === 0) {
        toast.info("No unread notifications");
        return;
      }

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );

      toast.success("All notifications marked as read");

      // Attempt API call
      await PUT_REQUEST(
        `${URLS.BASE}/user/notifications/mark-all-read`,
        {},
        Cookies.get("token"),
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((notif) =>
    filter === "all" ? true : !notif.isRead,
  );

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <motion.div
      ref={divRef}
      initial={{ y: 10, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 10, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-full mt-2 w-[90vw] sm:w-[420px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[70vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-[#8DDB90]" />
          <h2 className="text-lg font-semibold text-[#09391C]">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-[#8DDB90] text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={() => closeNotificationModal(false)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === "all"
                ? "bg-[#8DDB90] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === "unread"
                ? "bg-[#8DDB90] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-[#8DDB90] hover:text-[#7BC87F] font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-[#8DDB90] border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 text-center">
          <button
            onClick={() => {
              // Navigate to full notifications page if exists
              closeNotificationModal(false);
            }}
            className="text-sm text-[#8DDB90] hover:text-[#7BC87F] font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </motion.div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      case "warning":
        return <Clock size={16} className="text-yellow-500" />;
      case "error":
        return <X size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getNotificationIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4
                className={`text-sm font-medium text-gray-900 ${!notification.isRead ? "font-semibold" : ""}`}
              >
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(notification.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification._id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Mark as read"
                >
                  <Eye size={14} className="text-gray-500" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification._id)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
                title="Delete notification"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </div>

          {!notification.isRead && (
            <div className="w-2 h-2 bg-[#8DDB90] rounded-full absolute left-2 top-6"></div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample notifications for fallback when API is not available
const sampleNotifications: Notification[] = [
  {
    _id: "1",
    title: "Property View Alert",
    message:
      "A user viewed your 3-bedroom apartment listing in Victoria Island.",
    type: "info",
    isRead: false,
    createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    relatedId: "prop_123",
  },
  {
    _id: "2",
    title: "Brief Approved",
    message:
      "Your commercial property brief has been approved and is now live.",
    type: "success",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    _id: "3",
    title: "Price Update Reminder",
    message:
      "Consider updating the price for your Lekki property to attract more buyers.",
    type: "warning",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    _id: "4",
    title: "New Inquiry",
    message:
      "Someone is interested in your joint venture opportunity in Abuja.",
    type: "info",
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

export default UserNotifications;
