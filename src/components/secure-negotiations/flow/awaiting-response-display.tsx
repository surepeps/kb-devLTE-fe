"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiRefreshCw } from "react-icons/fi";

interface AwaitingResponseDisplayProps {
  userType: "seller" | "buyer";
  pendingResponseFrom: string;
  timeRemaining: string;
}

const AwaitingResponseDisplay: React.FC<AwaitingResponseDisplayProps> = ({
  userType,
  pendingResponseFrom,
  timeRemaining,
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getWaitingMessage = () => {
    const otherParty = pendingResponseFrom === "seller" ? "seller" : "buyer";
    return `Awaiting response from ${otherParty}${dots}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-8 text-center">
          {/* Animated Clock Icon */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6"
          >
            <FiClock className="w-8 h-8 text-yellow-600" />
          </motion.div>

          {/* Waiting Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {getWaitingMessage()}
          </h2>

          <p className="text-gray-600 mb-6">
            You have submitted your response and it's now the other party's turn
            to respond. You'll be notified once they take action.
          </p>

          {/* Timer Display */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FiUser className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                Response Timer
              </span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {timeRemaining || "Loading..."}
            </div>
            <div className="text-sm text-yellow-700 mt-1">
              remaining for {pendingResponseFrom} to respond
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className={`p-3 rounded-lg border ${
                userType === pendingResponseFrom
                  ? "bg-gray-50 border-gray-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="text-sm font-medium text-gray-700 mb-1">You</div>
              <div
                className={`text-sm ${
                  userType === pendingResponseFrom
                    ? "text-gray-600"
                    : "text-green-600"
                }`}
              >
                {userType === pendingResponseFrom ? "Pending" : "✓ Responded"}
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border ${
                pendingResponseFrom !== userType
                  ? "bg-gray-50 border-gray-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="text-sm font-medium text-gray-700 mb-1">
                {pendingResponseFrom === "seller" ? "Seller" : "Buyer"}
              </div>
              <div
                className={`text-sm ${
                  pendingResponseFrom !== userType
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {pendingResponseFrom !== userType ? "✓ Responded" : "Pending"}
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">
              What happens next?
            </h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>
                • The {pendingResponseFrom} has {timeRemaining} to respond
              </li>
              <li>• You'll receive a notification when they take action</li>
              <li>
                • If they don't respond in time, the negotiation may expire
              </li>
              <li>• You can refresh this page to check for updates</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AwaitingResponseDisplay;
