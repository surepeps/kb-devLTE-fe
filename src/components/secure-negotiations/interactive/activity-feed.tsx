"use client";

import React, { useState } from "react";
import { useSecureNegotiation } from "@/context/secure-negotiations-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMessageSquare,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSend,
  FiUser,
} from "react-icons/fi";

const ActivityFeed: React.FC = () => {
  const { state, toggleActivityFeed, addActivity, markActivitiesAsRead } =
    useSecureNegotiation();

  const { activityLog, currentUserId, currentUserType } = state;
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "offer_made":
      case "offer_countered":
        return <FiDollarSign className="w-4 h-4 text-green-600" />;
      case "offer_accepted":
        return <FiCheckCircle className="w-4 h-4 text-green-600" />;
      case "offer_rejected":
        return <FiXCircle className="w-4 h-4 text-red-600" />;
      case "inspection_scheduled":
        return <FiCalendar className="w-4 h-4 text-blue-600" />;
      case "message_sent":
        return <FiMessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "offer_made":
      case "offer_countered":
      case "offer_accepted":
        return "border-l-green-400";
      case "offer_rejected":
        return "border-l-red-400";
      case "inspection_scheduled":
        return "border-l-blue-400";
      case "message_sent":
        return "border-l-purple-400";
      default:
        return "border-l-gray-400";
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      // Add message to activity log
      addActivity({
        type: "message_sent",
        message: newMessage.trim(),
        userId: currentUserId!,
        userType: currentUserType!,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(timestamp));
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group activities by date
  const groupedActivities = activityLog.reduce(
    (groups, activity) => {
      const date = formatDate(activity.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    },
    {} as Record<string, typeof activityLog>,
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <FiMessageSquare className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Activity Feed</h3>
        </div>
        <button
          onClick={toggleActivityFeed}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <FiMessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No activities yet</p>
            <p className="text-sm">Start a conversation below</p>
          </div>
        ) : (
          Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="text-xs font-medium text-gray-500 text-center py-2 border-b border-gray-100">
                {date}
              </div>

              {/* Activities for this date */}
              <AnimatePresence>
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`border-l-4 ${getActivityColor(activity.type)} pl-4 py-2 bg-gray-50 rounded-r-lg`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              activity.userType === "seller"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {activity.userType === currentUserType
                              ? "You"
                              : activity.userType}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">
                          {activity.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={2}
              disabled={isSending}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSend className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ActivityFeed;
