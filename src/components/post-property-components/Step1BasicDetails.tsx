"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/general-components/Input";
import ReactSelect from "react-select";
import { usePostPropertyContext } from "@/context/post-property-context";
import customStyles from "@/styles/inputStyle";
import data from "@/data/state-lga";

interface Option {
  value: string;
  label: string;
}

const Step1BasicDetails: React.FC = () => {
  const { propertyData, updatePropertyData } = usePostPropertyContext();
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [lgaOptions, setLgaOptions] = useState<Option[]>([]);
  const [formatedPrice, setFormatedPrice] = useState<string>("");
  const [formatedHold, setFormatedHold] = useState<string>("");

  useEffect(() => {
    // Format states data
    const states = data.map((state: any) => ({
      value: state.state,
      label: state.state,
    }));
    setStateOptions(states);
  }, []);

  useEffect(() => {
    if (propertyData.state) {
      // Find the selected state and get its LGAs
      const selectedStateData = data.find(
        (state: any) => state.state === propertyData.state?.value,
      );
      if (selectedStateData) {
        const lgas = selectedStateData.lgas.map((lga: string) => ({
          value: lga,
          label: lga,
        }));
        setLgaOptions(lgas);
      }
    } else {
      setLgaOptions([]);
      updatePropertyData("lga", null);
    }
  }, [propertyData.state]);

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    updatePropertyData("price", numericValue);
    setFormatedPrice(
      numericValue ? `₦${Number(numericValue).toLocaleString()}` : "",
    );
  };

  const handleHoldDurationChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    updatePropertyData("holdDuration", numericValue);
    setFormatedHold(numericValue ? `${numericValue} years` : "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#09391C] font-display mb-4">
          Property Details
        </h2>
        <p className="text-[#5A5D63] text-lg">
          Provide basic information about your property
        </p>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm space-y-6">
        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#09391C] mb-2">
              {propertyData.propertyType === "sell"
                ? "Selling Price"
                : propertyData.propertyType === "rent"
                  ? "Annual Rent"
                  : "Property Value"}{" "}
              *
            </label>
            <Input
              type="text"
              placeholder="Enter amount"
              value={formatedPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
            />
          </div>

          {/* Hold Duration for Joint Venture */}
          {propertyData.propertyType === "jv" && (
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Hold Duration (Years) *
              </label>
              <Input
                type="text"
                placeholder="Enter years"
                value={formatedHold}
                onChange={(e) => handleHoldDurationChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                State *
              </label>
              <ReactSelect
                options={stateOptions}
                value={propertyData.state}
                onChange={(option) => updatePropertyData("state", option)}
                placeholder="Select state"
                styles={customStyles}
                isSearchable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Local Government *
              </label>
              <ReactSelect
                options={lgaOptions}
                value={propertyData.lga}
                onChange={(option) => updatePropertyData("lga", option)}
                placeholder="Select LGA"
                styles={customStyles}
                isSearchable
                isDisabled={!propertyData.state}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Area *
              </label>
              <Input
                type="text"
                placeholder="Enter area/neighborhood"
                value={propertyData.area}
                onChange={(e) => updatePropertyData("area", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Property Specifications */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Property Specifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Bedrooms *
              </label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={propertyData.bedrooms}
                onChange={(e) =>
                  updatePropertyData("bedrooms", parseInt(e.target.value) || 0)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Bathrooms
              </label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={propertyData.bathrooms}
                onChange={(e) =>
                  updatePropertyData("bathrooms", parseInt(e.target.value) || 0)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Toilets
              </label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={propertyData.toilets}
                onChange={(e) =>
                  updatePropertyData("toilets", parseInt(e.target.value) || 0)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Parking Spaces
              </label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={propertyData.parkingSpaces}
                onChange={(e) =>
                  updatePropertyData(
                    "parkingSpaces",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#09391C] mb-2">
            Property Description
          </label>
          <textarea
            placeholder="Describe your property in detail..."
            value={propertyData.description}
            onChange={(e) => updatePropertyData("description", e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Step1BasicDetails;
