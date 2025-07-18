"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/general-components/Input";
import ReactSelect from "react-select";
import RadioCheck from "@/components/general-components/radioCheck";
import { usePostPropertyContext } from "@/context/post-property-context";
import customStyles from "@/styles/inputStyle";
import {
  getStates,
  getLGAsByState,
  getAreasByStateLGA,
} from "@/utils/location-utils";
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
  const [areaOptions, setAreaOptions] = useState<Option[]>([]);
  const [formatedPrice, setFormatedPrice] = useState<string>("");
  const [formatedHold, setFormatedHold] = useState<string>("");
  const [formatedLandSize, setFormatedLandSize] = useState<string>("");
  const [formatedLeaseHold, setFormatedLeaseHold] = useState<string>("");

  useEffect(() => {
    // Format states data using new location data
    const states = getStates().map((state: string) => ({
      value: state,
      label: state,
    }));
    setStateOptions(states);
  }, []);

  useEffect(() => {
    if (propertyData.state) {
      // Get LGAs for selected state using new location data
      const lgas = getLGAsByState(propertyData.state.value).map(
        (lga: string) => ({
          value: lga,
          label: lga,
        }),
      );
      setLgaOptions(lgas);
    } else {
      setLgaOptions([]);
      setAreaOptions([]);
      updatePropertyData("lga", null);
      updatePropertyData("area", "");
    }
  }, [propertyData.state]);

  useEffect(() => {
    if (propertyData.state && propertyData.lga) {
      // Get areas for selected state and LGA
      const areas = getAreasByStateLGA(
        propertyData.state.value,
        propertyData.lga.value,
      ).map((area: string) => ({
        value: area,
        label: area,
      }));
      setAreaOptions(areas);

      // Clear area if it's not valid for new LGA
      if (propertyData.area && typeof propertyData.area === "object") {
        const isValidArea = areas.some(
          (area) =>
            area.value ===
            (typeof propertyData.area === "object"
              ? propertyData.area.value
              : propertyData.area),
        );
        if (!isValidArea) {
          updatePropertyData("area", "");
        }
      }
    } else {
      setAreaOptions([]);
      updatePropertyData("area", "");
    }
  }, [propertyData.state, propertyData.lga]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                Select your rental type *
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
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
              {errors?.rentalType && touched?.rentalType && (
                <p className="text-red-500 text-sm mt-2">{errors.rentalType}</p>
              )}
            </div>
          )}

        {/* Shortlet Duration (for shortlet only) */}
        {propertyData.propertyType === "shortlet" &&
          propertyData.propertyCategory !== "Land" && (
            <div>
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Shortlet Duration *
              </h3>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
                <RadioCheck
                  selectedValue={propertyData.shortletDuration}
                  handleChange={() =>
                    updatePropertyData("shortletDuration", "Daily")
                  }
                  type="radio"
                  value="Daily"
                  name="shortletDuration"
                />
                <RadioCheck
                  selectedValue={propertyData.shortletDuration}
                  handleChange={() =>
                    updatePropertyData("shortletDuration", "Weekly")
                  }
                  type="radio"
                  name="shortletDuration"
                  value="Weekly"
                />
                <RadioCheck
                  selectedValue={propertyData.shortletDuration}
                  handleChange={() =>
                    updatePropertyData("shortletDuration", "Monthly")
                  }
                  type="radio"
                  name="shortletDuration"
                  value="Monthly"
                />
              </div>
              {errors?.shortletDuration && touched?.shortletDuration && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.shortletDuration}
                </p>
              )}
            </div>
          )}

        {/* Property Condition (for rent and shortlet) */}
        {(propertyData.propertyType === "rent" ||
          propertyData.propertyType === "shortlet") &&
          propertyData.propertyCategory !== "Land" && (
            <div>
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Property Condition *
              </h3>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
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
              {errors?.propertyCondition && touched?.propertyCondition && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.propertyCondition}
                </p>
              )}
            </div>
          )}

        {/* Price */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Price Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-[#707281] mb-2">
                State *
              </label>
              <ReactSelect
                options={stateOptions}
                value={propertyData.state}
                onChange={(option) => updatePropertyData("state", option)}
                placeholder="Search and select state"
                styles={{
                  ...customStyles,
                  control: (provided, state) => ({
                    ...customStyles.control?.(provided, state),
                    borderColor:
                      errors?.state && touched?.state
                        ? "#ef4444"
                        : provided.borderColor || "#C7CAD0",
                    minHeight: "44px",
                  }),
                }}
                isSearchable
                isClearable
                filterOption={(option, searchText) =>
                  option.label.toLowerCase().includes(searchText.toLowerCase())
                }
              />
              {errors?.state && touched?.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#707281] mb-2">
                Local Government *
              </label>
              {lgaOptions.length > 0 ? (
                <ReactSelect
                  options={lgaOptions}
                  value={propertyData.lga}
                  onChange={(option) => updatePropertyData("lga", option)}
                  placeholder={
                    propertyData.state
                      ? "Search and select LGA"
                      : "Select state first"
                  }
                  styles={{
                    ...customStyles,
                    control: (provided, state) => ({
                      ...customStyles.control?.(provided, state),
                      borderColor:
                        errors?.lga && touched?.lga
                          ? "#ef4444"
                          : provided.borderColor || "#C7CAD0",
                      minHeight: "44px",
                    }),
                  }}
                  isSearchable
                  isClearable
                  isDisabled={!propertyData.state}
                  filterOption={(option, searchText) =>
                    option.label
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  }
                />
              ) : (
                <Input
                  name="lga"
                  label=""
                  type="text"
                  placeholder={
                    propertyData.state
                      ? "Enter LGA manually"
                      : "Select state first"
                  }
                  value={
                    typeof propertyData.lga === "string"
                      ? propertyData.lga
                      : typeof propertyData.lga === "object" &&
                          propertyData.lga?.value
                        ? propertyData.lga.value
                        : ""
                  }
                  onChange={(e) =>
                    updatePropertyData("lga", {
                      value: e.target.value,
                      label: e.target.value,
                    })
                  }
                  className={
                    errors?.lga && touched?.lga ? "border-red-500" : ""
                  }
                  disabled={!propertyData.state}
                />
              )}
              {errors?.lga && touched?.lga && (
                <p className="text-red-500 text-sm mt-1">{errors.lga}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#707281] mb-2">
                Area/Neighborhood
              </label>
              {areaOptions.length > 0 ? (
                <ReactSelect
                  options={areaOptions}
                  value={
                    propertyData.area
                      ? { value: propertyData.area, label: propertyData.area }
                      : null
                  }
                  onChange={(option) =>
                    updatePropertyData("area", option?.value || "")
                  }
                  placeholder={
                    propertyData.lga
                      ? "Search and select area"
                      : "Select LGA first"
                  }
                  styles={{
                    ...customStyles,
                    control: (provided, state) => ({
                      ...customStyles.control?.(provided, state),
                      borderColor:
                        errors?.area && touched?.area
                          ? "#ef4444"
                          : provided.borderColor || "#C7CAD0",
                      minHeight: "44px",
                    }),
                  }}
                  isSearchable
                  isDisabled={!propertyData.lga}
                  isClearable
                  filterOption={(option, searchText) =>
                    option.label
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  }
                />
              ) : (
                <Input
                  name="area"
                  label=""
                  type="text"
                  placeholder="Enter area/neighborhood"
                  value={
                    typeof propertyData.area === "string"
                      ? propertyData.area
                      : typeof propertyData.area === "object" &&
                          propertyData.area?.value
                        ? propertyData.area.value
                        : ""
                  }
                  onChange={(e) => updatePropertyData("area", e.target.value)}
                  className={
                    errors?.area && touched?.area ? "border-red-500" : ""
                  }
                />
              )}
              {errors?.area && touched?.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Details (for non-Land properties) */}
        {propertyData.propertyCategory !== "Land" && (
          <div>
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Property Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Type of Building *
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
                  styles={{
                    ...customStyles,
                    control: (provided, state) => ({
                      ...customStyles.control?.(provided, state),
                      borderColor:
                        errors?.typeOfBuilding && touched?.typeOfBuilding
                          ? "#ef4444"
                          : provided.borderColor || "#C7CAD0",
                    }),
                  }}
                />
                {errors?.typeOfBuilding && touched?.typeOfBuilding && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.typeOfBuilding}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Number of Bedrooms *
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
                  styles={{
                    ...customStyles,
                    control: (provided, state) => ({
                      ...customStyles.control?.(provided, state),
                      borderColor:
                        errors?.bedrooms && touched?.bedrooms
                          ? "#ef4444"
                          : provided.borderColor || "#C7CAD0",
                    }),
                  }}
                />
                {errors?.bedrooms && touched?.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
