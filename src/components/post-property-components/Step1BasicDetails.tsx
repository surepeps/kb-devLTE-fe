"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/general-components/Input";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import RadioCheck from "@/components/general-components/radioCheck";
import EnhancedPriceInput from "@/components/general-components/EnhancedPriceInput";
import { useFormikContext } from "formik";
import { usePostPropertyContext } from "@/context/post-property-context";
import customStyles from "@/styles/inputStyle";
import {
  getStates,
  getLGAsByState,
  getAreasByStateLGA,
} from "@/utils/location-utils";
import { propertyReferenceData } from "@/data/buy_page_data";
import {
  briefTypeConfig,
  propertyConditionOptions,
  buildingTypeOptions,
  numberOptions,
  shouldShowField,
  getFieldsToClearOnCategoryChange,
} from "@/data/comprehensive-post-property-config";

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
  const formik = useFormikContext();
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [lgaOptions, setLgaOptions] = useState<Option[]>([]);
  const [areaOptions, setAreaOptions] = useState<Option[]>([]);

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
      if (propertyData.area) {
        const isValidArea = areas.some(
          (area) => area.value === propertyData.area,
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
            {briefTypeConfig[
              propertyData.propertyType as keyof typeof briefTypeConfig
            ]?.propertyCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  // Clear subsequent fields if category changes
                  if (
                    propertyData.propertyCategory &&
                    propertyData.propertyCategory !== category
                  ) {
                    const fieldsToClear = getFieldsToClearOnCategoryChange(
                      propertyData.propertyType,
                    );
                    updatePropertyData(
                      "resetFieldsAfterCategory",
                      fieldsToClear,
                    );
                  }
                  updatePropertyData("propertyCategory", category);
                }}
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
            )) || []}
          </div>
          {errors?.propertyCategory && touched?.propertyCategory && (
            <p className="text-red-500 text-sm mt-2">
              {errors.propertyCategory}
            </p>
          )}
        </div>

        {/* Rental Type (for rent only) */}
        {shouldShowField(
          "rentalType",
          propertyData.propertyType,
          propertyData.propertyCategory,
        ) && (
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
                variant="card"
                error={errors?.rentalType && touched?.rentalType}
              />
              <RadioCheck
                selectedValue={propertyData.rentalType}
                handleChange={() => updatePropertyData("rentalType", "Lease")}
                type="radio"
                name="rentalType"
                value="Lease"
                variant="card"
                error={errors?.rentalType && touched?.rentalType}
              />
            </div>
            {errors?.rentalType && touched?.rentalType && (
              <p className="text-red-500 text-sm mt-2">{errors.rentalType}</p>
            )}
          </div>
        )}

        {/* Shortlet Duration (for shortlet only) */}
        {shouldShowField(
          "shortletDuration",
          propertyData.propertyType,
          propertyData.propertyCategory,
        ) && (
          <div>
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Shortlet Duration *
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RadioCheck
                selectedValue={propertyData.shortletDuration}
                handleChange={() =>
                  updatePropertyData("shortletDuration", "Daily")
                }
                type="radio"
                value="Daily"
                name="shortletDuration"
                variant="card"
                error={errors?.shortletDuration && touched?.shortletDuration}
              />
              <RadioCheck
                selectedValue={propertyData.shortletDuration}
                handleChange={() =>
                  updatePropertyData("shortletDuration", "Weekly")
                }
                type="radio"
                name="shortletDuration"
                value="Weekly"
                variant="card"
                error={errors?.shortletDuration && touched?.shortletDuration}
              />
              <RadioCheck
                selectedValue={propertyData.shortletDuration}
                handleChange={() =>
                  updatePropertyData("shortletDuration", "Monthly")
                }
                type="radio"
                name="shortletDuration"
                value="Monthly"
                variant="card"
                error={errors?.shortletDuration && touched?.shortletDuration}
              />
            </div>
            {errors?.shortletDuration && touched?.shortletDuration && (
              <p className="text-red-500 text-sm mt-2">
                {errors.shortletDuration}
              </p>
            )}
          </div>
        )}

        {/* Property Condition (for sell, rent and shortlet) */}
        {shouldShowField(
          "propertyCondition",
          propertyData.propertyType,
          propertyData.propertyCategory,
        ) && (
          <div>
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Property Condition *
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {propertyConditionOptions.map((option) => (
                <RadioCheck
                  key={option.value}
                  selectedValue={propertyData.propertyCondition}
                  handleChange={() =>
                    updatePropertyData("propertyCondition", option.value)
                  }
                  type="radio"
                  value={option.value}
                  name="propertyCondition"
                  variant="card"
                  error={
                    errors?.propertyCondition && touched?.propertyCondition
                  }
                />
              ))}
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
              <EnhancedPriceInput
                name="price"
                label={
                  propertyData.propertyType === "sell"
                    ? "Selling Price"
                    : propertyData.propertyType === "rent"
                      ? "Annual Rent"
                      : "Property Value"
                }
                value={propertyData.price}
                onChange={(value) => updatePropertyData("price", value)}
                placeholder="Enter amount"
                prefix="₦"
                error={errors?.price}
                touched={touched?.price}
                required
                description={
                  propertyData.propertyType === "rent"
                    ? "Enter the total annual rent amount"
                    : propertyData.propertyType === "sell"
                      ? "Enter your desired selling price"
                      : "Enter the estimated property value"
                }
              />
            </div>

            {/* Lease Hold for Rent (when Lease is selected) */}
            {shouldShowField(
              "leaseHold",
              propertyData.propertyType,
              propertyData.propertyCategory,
              { rentalType: propertyData.rentalType },
            ) && (
              <div>
                <EnhancedPriceInput
                  name="leaseHold"
                  label="Lease Hold Duration"
                  value={propertyData.leaseHold}
                  onChange={(value) => updatePropertyData("leaseHold", value)}
                  placeholder="Enter duration"
                  suffix="years"
                  description="How many years is the lease valid for?"
                />
              </div>
            )}

            {/* Hold Duration for Joint Venture */}
            {propertyData.propertyType === "jv" && (
              <div>
                <EnhancedPriceInput
                  name="holdDuration"
                  label="Hold Duration"
                  value={propertyData.holdDuration || ""}
                  onChange={(value) =>
                    updatePropertyData("holdDuration", value)
                  }
                  placeholder="Enter duration"
                  suffix="years"
                  description="Expected duration of the joint venture"
                />
              </div>
            )}
          </div>
        </div>

        {/* Land Size (for Land, Sell, JV) */}
        {shouldShowField(
          "landSize",
          propertyData.propertyType,
          propertyData.propertyCategory,
        ) && (
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
                <EnhancedPriceInput
                  name="landSize"
                  label="Land Size"
                  value={propertyData.landSize}
                  onChange={(value) => updatePropertyData("landSize", value)}
                  placeholder="Enter size"
                  prefix=""
                  suffix={propertyData.measurementType || ""}
                  description="Enter the size of the land"
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
              <CreatableSelect
                options={lgaOptions}
                value={propertyData.lga}
                onChange={(option) => updatePropertyData("lga", option)}
                onCreateOption={(inputValue) => {
                  const newOption = { value: inputValue, label: inputValue };
                  updatePropertyData("lga", newOption);
                }}
                placeholder={
                  propertyData.state
                    ? lgaOptions.length > 0
                      ? "Search or type LGA"
                      : "Type LGA name"
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
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                noOptionsMessage={() => "Type to add LGA"}
                filterOption={(option, searchText) =>
                  option.label.toLowerCase().includes(searchText.toLowerCase())
                }
              />
              {errors?.lga && touched?.lga && (
                <p className="text-red-500 text-sm mt-1">{errors.lga}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#707281] mb-2">
                Area/Neighborhood
              </label>
              <CreatableSelect
                options={areaOptions}
                value={
                  propertyData.area
                    ? { value: propertyData.area, label: propertyData.area }
                    : null
                }
                onChange={(option) =>
                  updatePropertyData("area", option?.value || "")
                }
                onCreateOption={(inputValue) => {
                  updatePropertyData("area", inputValue);
                }}
                placeholder={
                  propertyData.lga
                    ? areaOptions.length > 0
                      ? "Search or type area"
                      : "Type area name"
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
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                noOptionsMessage={() => "Type to add area"}
                filterOption={(option, searchText) =>
                  option.label.toLowerCase().includes(searchText.toLowerCase())
                }
              />
              {errors?.area && touched?.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Details (for non-Land properties) */}
        {shouldShowField(
          "typeOfBuilding",
          propertyData.propertyType,
          propertyData.propertyCategory,
        ) && (
          <div>
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Property Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Building Type *
                </label>
                <ReactSelect
                  options={
                    propertyData.propertyCategory === "Residential"
                      ? buildingTypeOptions.residential
                      : propertyData.propertyCategory === "Commercial"
                        ? buildingTypeOptions.commercial
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

              {/* Room Details */}
              {shouldShowField(
                "bedrooms",
                propertyData.propertyType,
                propertyData.propertyCategory,
              ) && (
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Number of Bedrooms *
                  </label>
                  <ReactSelect
                    options={numberOptions}
                    value={
                      propertyData.bedrooms
                        ? {
                            value: propertyData.bedrooms.toString(),
                            label: propertyData.bedrooms.toString(),
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData(
                        "bedrooms",
                        parseInt(option?.value || "0") || 0,
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bedrooms}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shouldShowField(
                "bathrooms",
                propertyData.propertyType,
                propertyData.propertyCategory,
              ) && (
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Number of Bathrooms
                  </label>
                  <ReactSelect
                    options={numberOptions}
                    value={
                      propertyData.bathrooms
                        ? {
                            value: propertyData.bathrooms.toString(),
                            label: propertyData.bathrooms.toString(),
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData(
                        "bathrooms",
                        parseInt(option?.value || "0") || 0,
                      )
                    }
                    placeholder="Select bathrooms"
                    styles={customStyles}
                  />
                </div>
              )}

              {shouldShowField(
                "toilets",
                propertyData.propertyType,
                propertyData.propertyCategory,
              ) && (
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Number of Toilets
                  </label>
                  <ReactSelect
                    options={numberOptions}
                    value={
                      propertyData.toilets
                        ? {
                            value: propertyData.toilets.toString(),
                            label: propertyData.toilets.toString(),
                          }
                        : null
                    }
                    onChange={(option) =>
                      updatePropertyData(
                        "toilets",
                        parseInt(option?.value || "0") || 0,
                      )
                    }
                    placeholder="Select toilets"
                    styles={customStyles}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Number of Car Parks
                </label>
                <ReactSelect
                  options={numberOptions}
                  value={
                    propertyData.parkingSpaces
                      ? {
                          value: propertyData.parkingSpaces.toString(),
                          label: propertyData.parkingSpaces.toString(),
                        }
                      : null
                  }
                  onChange={(option) =>
                    updatePropertyData(
                      "parkingSpaces",
                      parseInt(option?.value || "0") || 0,
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
