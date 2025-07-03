"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/general-components/Input";
import ReactSelect from "react-select";
import RadioCheck from "@/components/general-components/radioCheck";
import { usePostPropertyContext } from "@/context/post-property-context";
import customStyles from "@/styles/inputStyle";
import {
  dummyLocationData,
  getAllStates,
  getLGAs,
  getAreas,
} from "@/data/dummy-location-data";
import { propertyReferenceData } from "@/data/buy_page_data";

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
  const [formatedLandSize, setFormatedLandSize] = useState<string>("");
  const [formatedLeaseHold, setFormatedLeaseHold] = useState<string>("");

  useEffect(() => {
    // Format states data using dummy data
    const states = getAllStates().map((state: string) => ({
      value: state,
      label: state,
    }));
    setStateOptions(states);
  }, []);

  useEffect(() => {
    if (propertyData.state) {
      // Get LGAs for selected state using dummy data
      const lgas = getLGAs(propertyData.state.value).map((lga: string) => ({
        value: lga,
        label: lga,
      }));
      setLgaOptions(lgas);
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
      <div className="mb-8">
        <h2 className="text-[24px] leading-[38.4px] font-semibold font-display text-[#09391C] mb-2">
          Submit brief details
        </h2>
        <p className="text-[16px] text-[#5A5D63]">
          Provide basic information about your property
        </p>
      </div>

      <div className="space-y-6">
        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              name="price"
              label={
                propertyData.propertyType === "sell"
                  ? "Selling Price"
                  : propertyData.propertyType === "rent"
                    ? "Annual Rent"
                    : "Property Value"
              }
              type="text"
              placeholder="Enter amount"
              value={formatedPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
          </div>

          {/* Hold Duration for Joint Venture */}
          {propertyData.propertyType === "jv" && (
            <div>
              <Input
                name="holdDuration"
                label="Hold Duration (Years)"
                type="text"
                placeholder="Enter years"
                value={formatedHold}
                onChange={(e) => handleHoldDurationChange(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Property Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#707281] mb-2">
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
              <label className="block text-sm font-medium text-[#707281] mb-2">
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
              <Input
                name="area"
                label="Area/Neighborhood"
                type="text"
                placeholder="Enter area/neighborhood"
                value={propertyData.area}
                onChange={(e) => updatePropertyData("area", e.target.value)}
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
              <Input
                name="bedrooms"
                label="Bedrooms"
                type="number"
                placeholder="0"
                value={propertyData.bedrooms.toString()}
                onChange={(e) =>
                  updatePropertyData("bedrooms", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Input
                name="bathrooms"
                label="Bathrooms"
                type="number"
                placeholder="0"
                value={propertyData.bathrooms.toString()}
                onChange={(e) =>
                  updatePropertyData("bathrooms", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Input
                name="toilets"
                label="Toilets"
                type="number"
                placeholder="0"
                value={propertyData.toilets.toString()}
                onChange={(e) =>
                  updatePropertyData("toilets", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Input
                name="parkingSpaces"
                label="Parking Spaces"
                type="number"
                placeholder="0"
                value={propertyData.parkingSpaces.toString()}
                onChange={(e) =>
                  updatePropertyData(
                    "parkingSpaces",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#707281] mb-2">
            Property Description (Optional)
          </label>
          <textarea
            placeholder="Describe your property in detail..."
            value={propertyData.description}
            onChange={(e) => updatePropertyData("description", e.target.value)}
            rows={4}
            className="w-full p-[12px] border border-[#C7CAD0] rounded-md focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90] resize-none text-[14px] leading-[22.4px]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Step1BasicDetails;
