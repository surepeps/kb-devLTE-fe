"use client";

import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

interface EmptyStateProps {
  onReset: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  const suggestions = [
    "Try adjusting your location search",
    "Increase your price range",
    "Remove some filters",
    "Search for different property types",
    "Check nearby areas",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center max-w-md mx-auto">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <FontAwesomeIcon
                icon={faHome}
                className="text-4xl text-gray-400"
              />
            </div>

            {/* Floating Search Icon */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-[#8DDB90] rounded-full flex items-center justify-center"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FontAwesomeIcon icon={faSearch} className="text-white text-sm" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            No Properties Found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any properties matching your search criteria. Try
            adjusting your filters or search terms.
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            Suggestions:
          </h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center text-gray-600 text-sm"
              >
                <div className="w-2 h-2 bg-[#8DDB90] rounded-full mr-3 flex-shrink-0" />
                <span>{suggestion}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={onReset}
            className="w-full bg-[#8DDB90] text-white px-6 py-3 rounded-lg hover:bg-[#7BC87F] transition-colors font-medium"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Reset All Filters
          </button>

          <button
            onClick={() => (window.location.href = "/preference")}
            className="w-full bg-white border border-[#8DDB90] text-[#8DDB90] px-6 py-3 rounded-lg hover:bg-[#8DDB90] hover:text-white transition-colors font-medium"
          >
            Share Your Preference
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-gray-500"
        >
          <p>
            Still can't find what you're looking for?{" "}
            <a href="/contact-us" className="text-[#8DDB90] hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
