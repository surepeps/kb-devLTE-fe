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

interface StepProps {
  errors?: any;
  touched?: any;
}

const Step1BasicDetails: React.FC<StepProps> = ({ errors, touched }) => {
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

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? Number(numericValue).toLocaleString() : "";
  };

  const handleLandSizeChange = (value: string) => {
    const formatted = formatNumber(value);
    setFormatedLandSize(formatted);
    updatePropertyData("landSize", value.replace(/[^0-9]/g, ""));
  };

  const handleLeaseHoldChange = (value: string) => {
    const formatted = formatNumber(value);
    setFormatedLeaseHold(formatted);
    updatePropertyData("leaseHold", value.replace(/[^0-9]/g, ""));
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
        {/* Property Category */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Property Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(propertyData.propertyType === "jv"
              ? ["Residential", "Commercial", "Mixed Development"]
              : ["Residential", "Commercial", "Land"]
            ).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => updatePropertyData("propertyCategory", category)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  propertyData.propertyCategory === category
                    ? "border-[#8DDB90] bg-[#E4EFE7] text-[#09391C] font-semibold"
                    : errors?.propertyCategory && touched?.propertyCategory
                      ? "border-red-500 hover:border-red-600 text-[#5A5D63]"
                      : "border-[#C7CAD0] hover:border-[#8DDB90] text-[#5A5D63]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {errors?.propertyCategory && touched?.propertyCategory && (
            <p className="text-red-500 text-sm mt-2">
              {errors.propertyCategory}
            </p>
          )}
        </div>

        {/* Rental Type (for rent only) */}
        {propertyData.propertyType === "rent" &&
          propertyData.propertyCategory !== "Land" && (
            <div>
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Select your rental type
              </h3>
              <div className="flex gap-6">
                <RadioCheck
                  selectedValue={propertyData.rentalType}
                  handleChange={() => updatePropertyData("rentalType", "Rent")}
                  type="radio"
                  value="Rent"
                  name="rentalType"
                />
                <RadioCheck
                  selectedValue={propertyData.rentalType}
                  handleChange={() => updatePropertyData("rentalType", "Lease")}
                  type="radio"
                  name="rentalType"
                  value="Lease"
                />
              </div>
            </div>
          )}

        {/* Property Condition (for rent only) */}
        {propertyData.propertyType === "rent" &&
          propertyData.propertyCategory !== "Land" && (
            <div>
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Property Condition
              </h3>
              <div className="flex flex-wrap gap-6">
                <RadioCheck
                  selectedValue={propertyData.propertyCondition}
                  handleChange={() =>
                    updatePropertyData("propertyCondition", "Brand New")
                  }
                  type="radio"
                  value="Brand New"
                  name="propertyCondition"
                />
                <RadioCheck
                  selectedValue={propertyData.propertyCondition}
                  handleChange={() =>
                    updatePropertyData("propertyCondition", "Good Condition")
                  }
                  type="radio"
                  name="propertyCondition"
                  value="Good Condition"
                />
                <RadioCheck
                  selectedValue={propertyData.propertyCondition}
                  handleChange={() =>
                    updatePropertyData("propertyCondition", "Needs Renovation")
                  }
                  type="radio"
                  name="propertyCondition"
                  value="Needs Renovation"
                />
              </div>
            </div>
          )}

        {/* Price */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Price Details
          </h3>
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
                className={
                  errors?.price && touched?.price ? "border-red-500" : ""
                }
              />
              {errors?.price && touched?.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Lease Hold for Rent (non-agents) */}
            {propertyData.propertyType === "rent" && (
              <div>
                <Input
                  name="leaseHold"
                  label="Lease Hold"
                  type="text"
                  placeholder="Enter lease hold amount"
                  value={formatedLeaseHold}
                  onChange={(e) => handleLeaseHoldChange(e.target.value)}
                />
              </div>
            )}

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
        </div>

        {/* Land Size (for Land, Sell, JV) */}
        {(propertyData.propertyCategory === "Land" ||
          propertyData.propertyType === "sell" ||
          propertyData.propertyType === "jv") && (
          <div>
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Land Size
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Type of Measurement
                </label>
                <ReactSelect
                  options={[
                    { value: "Plot", label: "Plot" },
                    { value: "Acres", label: "Acres" },
                    { value: "Square Meter", label: "Square Meter" },
                  ]}
                  value={
                    propertyData.measurementType
                      ? {
                          value: propertyData.measurementType,
                          label: propertyData.measurementType,
                        }
                      : null
                  }
                  onChange={(option) =>
                    updatePropertyData("measurementType", option?.value || "")
                  }
                  placeholder="Select measurement type"
                  styles={customStyles}
                />
              </div>
              <div>
                <Input
                  name="landSize"
                  label="Enter Land Size"
                  type="text"
                  placeholder="Enter land size"
                  value={formatedLandSize}
                  onChange={(e) => handleLandSizeChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

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
                styles={{
                  ...customStyles,
                  control: (provided, state) => ({
                    ...customStyles.control?.(provided, state),
                    borderColor:
                      errors?.state && touched?.state
                        ? "#ef4444"
                        : provided.borderColor || "#C7CAD0",
                  }),
                }}
                isSearchable
              />
              {errors?.state && touched?.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
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
                styles={{
                  ...customStyles,
                  control: (provided, state) => ({
                    ...customStyles.control?.(provided, state),
                    borderColor:
                      errors?.lga && touched?.lga
                        ? "#ef4444"
                        : provided.borderColor || "#C7CAD0",
                  }),
                }}
                isSearchable
                isDisabled={!propertyData.state}
              />
              {errors?.lga && touched?.lga && (
                <p className="text-red-500 text-sm mt-1">{errors.lga}</p>
              )}
            </div>
            <div>
              <Input
                name="area"
                label="Area/Neighborhood"
                type="text"
                placeholder="Enter area/neighborhood"
                value={propertyData.area}
                onChange={(e) => updatePropertyData("area", e.target.value)}
                className={
                  errors?.area && touched?.area ? "border-red-500" : ""
                }
              />
              {errors?.area && touched?.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Details (for non-Land properties) */}
        {propertyData.propertyCategory !== "Land" &&
          propertyData.propertyType !== "jv" && (
            <div>
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Type of Building
                  </label>
                  <ReactSelect
                    options={
                      propertyData.propertyCategory === "Residential"
                        ? propertyReferenceData[0].options.map((option) => ({
                            value: option,
                            label: option,
                          }))
                        : propertyData.propertyCategory === "Commercial"
                          ? propertyReferenceData[1].options.map((option) => ({
                              value: option,
                              label: option,
                            }))
                          : []
                    }
                    value={
                      propertyData.typeOfBuilding
                        ? {
                            value: propertyData.typeOfBuilding,
                            label: propertyData.typeOfBuilding,
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData("typeOfBuilding", option?.value || "")
                    }
                    placeholder="Select building type"
                    styles={customStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Number of Bedrooms
                  </label>
                  <ReactSelect
                    options={propertyReferenceData[
                      propertyReferenceData.length - 2
                    ].options.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={
                      propertyData.bedrooms
                        ? {
                            value: propertyData.bedrooms,
                            label: propertyData.bedrooms,
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData(
                        "bedrooms",
                        parseInt(option?.value?.toString() || "0") || 0,
                      )
                    }
                    placeholder="Select bedrooms"
                    styles={customStyles}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Number of Bathrooms
                  </label>
                  <ReactSelect
                    options={propertyReferenceData[
                      propertyReferenceData.length - 2
                    ].options.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={
                      propertyData.bathrooms
                        ? {
                            value: propertyData.bathrooms,
                            label: propertyData.bathrooms,
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData(
                        "bathrooms",
                        parseInt(option?.value?.toString() || "0") || 0,
                      )
                    }
                    placeholder="Select bathrooms"
                    styles={customStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Number of Toilets
                  </label>
                  <ReactSelect
                    options={propertyReferenceData[
                      propertyReferenceData.length - 2
                    ].options.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={
                      propertyData.toilets
                        ? {
                            value: propertyData.toilets,
                            label: propertyData.toilets,
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData(
                        "toilets",
                        parseInt(option?.value?.toString() || "0") || 0,
                      )
                    }
                    placeholder="Select toilets"
                    styles={customStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Number of Car Parks
                  </label>
                  <ReactSelect
                    options={propertyReferenceData[
                      propertyReferenceData.length - 2
                    ].options.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={
                      propertyData.parkingSpaces
                        ? {
                            value: propertyData.parkingSpaces,
                            label: propertyData.parkingSpaces,
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData(
                        "parkingSpaces",
                        parseInt(option?.value?.toString() || "0") || 0,
                      )
                    }
                    placeholder="Select car parks"
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>
          )}

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
