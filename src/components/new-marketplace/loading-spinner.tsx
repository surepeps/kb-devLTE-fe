"use client";

import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-4 border-gray-200 border-t-[#8DDB90] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-[#6BC46D] rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Properties
          </h3>
          <p className="text-gray-500">
            Please wait while we fetch the latest listings...
          </p>
        </motion.div>

        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-1 mt-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-[#8DDB90] rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
