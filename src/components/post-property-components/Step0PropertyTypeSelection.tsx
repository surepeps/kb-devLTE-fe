"use client";

import React from "react";
import { motion } from "framer-motion";
import ClickableCard from "./ClickableCard";
import { usePostPropertyContext } from "@/context/post-property-context";

const Step0PropertyTypeSelection: React.FC = () => {
  const { propertyData, updatePropertyData } = usePostPropertyContext();

  const handleCardClick = (type: "sell" | "rent" | "jv") => {
    updatePropertyData("propertyType", type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#09391C] font-display mb-4">
          What would you like to do with your property?
        </h2>
        <p className="text-[#5A5D63] text-lg">
          Choose the type of listing you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <ClickableCard
          title="Sell"
          description="List your property for outright sale"
          isSelected={propertyData.propertyType === "sell"}
          onClick={() => handleCardClick("sell")}
          icon="🏡"
          color="bg-green-500"
        />

        <ClickableCard
          title="Rent"
          description="List your property for rental"
          isSelected={propertyData.propertyType === "rent"}
          onClick={() => handleCardClick("rent")}
          icon="🔑"
          color="bg-blue-500"
        />

        <ClickableCard
          title="Joint Venture"
          description="Partner with investors for development"
          isSelected={propertyData.propertyType === "jv"}
          onClick={() => handleCardClick("jv")}
          icon="🤝"
          color="bg-purple-500"
        />
      </div>

      {propertyData.propertyType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#8DDB90] bg-opacity-10 px-4 py-2 rounded-lg">
            <span className="text-2xl">
              {propertyData.propertyType === "sell"
                ? "🏡"
                : propertyData.propertyType === "rent"
                  ? "🔑"
                  : "🤝"}
            </span>
            <span className="text-[#09391C] font-medium capitalize">
              {propertyData.propertyType} Selected
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Step0PropertyTypeSelection;
