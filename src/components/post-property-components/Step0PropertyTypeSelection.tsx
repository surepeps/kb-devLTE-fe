"use client";

import React from "react";
import { motion } from "framer-motion";
import RadioCheck from "@/components/general-components/radioCheck";
import { usePostPropertyContext } from "@/context/post-property-context";

interface StepProps {
  errors?: any;
  touched?: any;
}

const Step0PropertyTypeSelection: React.FC<StepProps> = ({
  errors,
  touched,
}) => {
  const { propertyData, updatePropertyData } = usePostPropertyContext();

  const propertyTypes = [
    {
      value: "sell",
      label: "Sell Property",
      description: "I want to sell my property for an outright sale",
      icon: "🏡",
    },
    {
      value: "rent",
      label: "Rent Property",
      description: "I want to rent out my property to tenants",
      icon: "🔑",
    },
    {
      value: "jv",
      label: "Joint Venture",
      description: "I want to partner with investors for development",
      icon: "🤝",
    },
  ];

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePropertyData(
      "propertyType",
      e.target.value as "sell" | "rent" | "jv",
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-[24px] leading-[38.4px] font-semibold font-display text-[#09391C] mb-2">
          Type of Brief
        </h2>
        <p className="text-[16px] text-[#5A5D63]">
          What would you like to do with your property?
        </p>
      </div>

      <div className="space-y-4">
        {propertyTypes.map((type) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
              propertyData.propertyType === type.value
                ? "border-[#8DDB90] bg-[#8DDB90] bg-opacity-10"
                : "border-[#E5E7EB] hover:border-[#8DDB90] hover:bg-gray-50"
            }`}
            onClick={() =>
              updatePropertyData(
                "propertyType",
                type.value as "sell" | "rent" | "jv",
              )
            }
          >
            <div className="flex items-start gap-4">
              <RadioCheck
                name="propertyType"
                value={type.value}
                type="radio"
                isChecked={propertyData.propertyType === type.value}
                handleChange={handlePropertyTypeChange}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{type.icon}</span>
                  <h3 className="text-lg font-semibold text-[#09391C]">
                    {type.label}
                  </h3>
                </div>
                <p className="text-[#5A5D63] text-sm leading-relaxed">
                  {type.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {propertyData.propertyType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-[#E4EFE7] rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {
                propertyTypes.find((t) => t.value === propertyData.propertyType)
                  ?.icon
              }
            </span>
            <span className="text-[#09391C] font-medium">
              {
                propertyTypes.find((t) => t.value === propertyData.propertyType)
                  ?.label
              }{" "}
              selected
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Step0PropertyTypeSelection;
