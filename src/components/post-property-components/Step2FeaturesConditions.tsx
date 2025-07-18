"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import RadioCheck from "@/components/general-components/radioCheck";
import {
  briefTypeConfig,
  documentOptions,
  getFeaturesByCategory,
  landFeatures,
  residentialFeatures,
  commercialFeatures,
  rentalConditions,
  employmentTypes,
  tenantGenderPreferences,
  jvConditions,
  tenancyStatusOptions,
  shortletOptions,
  shouldShowField,
  BRIEF_TYPES,
  PROPERTY_CATEGORIES,
} from "@/data/comprehensive-post-property-config";

interface StepProps {
  errors?: any;
  touched?: any;
}

const Step2FeaturesConditions: React.FC<StepProps> = ({ errors, touched }) => {
  const { propertyData, updatePropertyData } = usePostPropertyContext();

  const handleMultiSelectChange = (field: string, value: string) => {
    const currentValues = (propertyData as any)[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];
    updatePropertyData(field as any, newValues);
  };

  const renderMultiSelectOptions = (
    options: Array<{ value: string; label: string }>,
    field: string,
    title: string,
  ) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#09391C] mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={((propertyData as any)[field] || []).includes(
                option.value,
              )}
              onChange={() => handleMultiSelectChange(field, option.value)}
              className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
            />
            <span className="text-sm text-[#5A5D63]">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderCommercialFeatures = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#09391C] mb-2">
          🧱 Structure & Layout
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commercialFeatures.structure.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={(propertyData.features || []).includes(option.value)}
                onChange={() =>
                  handleMultiSelectChange("features", option.value)
                }
                className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
              />
              <span className="text-sm text-[#5A5D63]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#09391C] mb-2">
          🔌 Utilities & Power
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commercialFeatures.utilities.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={(propertyData.features || []).includes(option.value)}
                onChange={() =>
                  handleMultiSelectChange("features", option.value)
                }
                className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
              />
              <span className="text-sm text-[#5A5D63]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#09391C] mb-2">
          🛡 Security & Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commercialFeatures.security.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={(propertyData.features || []).includes(option.value)}
                onChange={() =>
                  handleMultiSelectChange("features", option.value)
                }
                className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
              />
              <span className="text-sm text-[#5A5D63]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#09391C] mb-2">
          🚗 Parking & Visibility
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commercialFeatures.parking.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={(propertyData.features || []).includes(option.value)}
                onChange={() =>
                  handleMultiSelectChange("features", option.value)
                }
                className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
              />
              <span className="text-sm text-[#5A5D63]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-[24px] leading-[38.4px] font-semibold font-display text-[#09391C] mb-2">
          Features & Conditions
        </h2>
        <p className="text-[16px] text-[#5A5D63]">
          Specify property features, documents, and conditions
        </p>
      </div>

      <div className="space-y-8">
        {/* Property Documents for Sell and JV */}
        {shouldShowField(
          "documents",
          propertyData.propertyType,
          propertyData.propertyCategory,
        ) && (
          <div>
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Property Documents / Title *
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documentOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={(propertyData.documents || []).includes(
                      option.value,
                    )}
                    onChange={() =>
                      handleMultiSelectChange("documents", option.value)
                    }
                    className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm text-[#5A5D63]">{option.label}</span>
                </label>
              ))}
            </div>
            {errors?.documents && touched?.documents && (
              <p className="text-red-500 text-sm mt-2">{errors.documents}</p>
            )}
          </div>
        )}

        {/* Features & Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Features & Amenities
          </h3>

          {/* Residential Features */}
          {propertyData.propertyCategory === PROPERTY_CATEGORIES.RESIDENTIAL &&
            propertyData.propertyType !== BRIEF_TYPES.SHORTLET &&
            renderMultiSelectOptions(residentialFeatures, "features", "")}

          {/* Shortlet Amenities */}
          {propertyData.propertyType === BRIEF_TYPES.SHORTLET &&
            renderMultiSelectOptions(shortletOptions.amenities, "features", "")}

          {/* Land Features */}
          {propertyData.propertyCategory === PROPERTY_CATEGORIES.LAND &&
            renderMultiSelectOptions(landFeatures, "features", "")}

          {/* Commercial Features */}
          {propertyData.propertyCategory === PROPERTY_CATEGORIES.COMMERCIAL &&
            propertyData.propertyType !== BRIEF_TYPES.SHORTLET &&
            renderCommercialFeatures()}
        </div>

        {/* Rental Conditions for Rent properties */}
        {propertyData.propertyType === BRIEF_TYPES.RENT &&
          propertyData.propertyCategory !== PROPERTY_CATEGORIES.LAND && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Rental Conditions
              </h3>

              {/* Rental Conditions Checkboxes */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rentalConditions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(propertyData.rentalConditions || []).includes(
                          option.value,
                        )}
                        onChange={() =>
                          handleMultiSelectChange(
                            "rentalConditions",
                            option.value,
                          )
                        }
                        className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                      />
                      <span className="text-sm text-[#5A5D63]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <h4 className="text-md font-semibold text-[#09391C] mb-3">
                  Employment Type
                </h4>
                <div className="flex flex-wrap gap-4">
                  {employmentTypes.map((option) => (
                    <RadioCheck
                      key={option.value}
                      selectedValue={propertyData.employmentType}
                      handleChange={() =>
                        updatePropertyData("employmentType", option.value)
                      }
                      type="radio"
                      value={option.value}
                      name="employmentType"
                    />
                  ))}
                </div>
              </div>

              {/* Tenant Gender Preference */}
              <div>
                <h4 className="text-md font-semibold text-[#09391C] mb-3">
                  Tenant Gender Preference
                </h4>
                <div className="flex flex-wrap gap-4">
                  {tenantGenderPreferences.map((option) => (
                    <RadioCheck
                      key={option.value}
                      selectedValue={propertyData.tenantGenderPreference}
                      handleChange={() =>
                        updatePropertyData(
                          "tenantGenderPreference",
                          option.value,
                        )
                      }
                      type="radio"
                      value={option.value}
                      name="tenantGenderPreference"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* JV Conditions for Joint Venture */}
        {shouldShowField(
          "jvConditions",
          propertyData.propertyType,
          propertyData.propertyCategory,
        ) && (
          <div>
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              JV Conditions *
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {jvConditions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={(propertyData.jvConditions || []).includes(
                      option.value,
                    )}
                    onChange={() =>
                      handleMultiSelectChange("jvConditions", option.value)
                    }
                    className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm text-[#5A5D63]">{option.label}</span>
                </label>
              ))}
            </div>
            {errors?.jvConditions && touched?.jvConditions && (
              <p className="text-red-500 text-sm mt-2">{errors.jvConditions}</p>
            )}
          </div>
        )}

        {/* Shortlet Specific Fields */}
        {propertyData.propertyType === BRIEF_TYPES.SHORTLET && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Shortlet Details
            </h3>

            {/* Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Minimum Stay (nights) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={propertyData.availability?.minStay || 1}
                  onChange={(e) =>
                    updatePropertyData("availability", {
                      ...propertyData.availability,
                      minStay: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Maximum Stay (nights)
                </label>
                <input
                  type="number"
                  min="1"
                  value={propertyData.availability?.maxStay || ""}
                  onChange={(e) =>
                    updatePropertyData("availability", {
                      ...propertyData.availability,
                      maxStay: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Nightly Rate (₦) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={propertyData.pricing?.nightly || ""}
                  onChange={(e) =>
                    updatePropertyData("pricing", {
                      ...propertyData.pricing,
                      nightly: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Weekly Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={propertyData.pricing?.weeklyDiscount || ""}
                  onChange={(e) =>
                    updatePropertyData("pricing", {
                      ...propertyData.pricing,
                      weeklyDiscount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Monthly Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={propertyData.pricing?.monthlyDiscount || ""}
                  onChange={(e) =>
                    updatePropertyData("pricing", {
                      ...propertyData.pricing,
                      monthlyDiscount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Cleaning Fee (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  value={propertyData.pricing?.cleaningFee || ""}
                  onChange={(e) =>
                    updatePropertyData("pricing", {
                      ...propertyData.pricing,
                      cleaningFee: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Security Deposit (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  value={propertyData.pricing?.securityDeposit || ""}
                  onChange={(e) =>
                    updatePropertyData("pricing", {
                      ...propertyData.pricing,
                      securityDeposit: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                />
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <h4 className="text-md font-semibold text-[#09391C] mb-3">
                Cancellation Policy
              </h4>
              <div className="space-y-2">
                {shortletOptions.cancellationPolicies.map((option) => (
                  <RadioCheck
                    key={option.value}
                    selectedValue={propertyData.pricing?.cancellationPolicy}
                    handleChange={() =>
                      updatePropertyData("pricing", {
                        ...propertyData.pricing,
                        cancellationPolicy: option.value,
                      })
                    }
                    type="radio"
                    value={option.value}
                    name="cancellationPolicy"
                  />
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-[#09391C] mb-3">
                House Rules
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    value={propertyData.houseRules?.checkIn || "15:00"}
                    onChange={(e) =>
                      updatePropertyData("houseRules", {
                        ...propertyData.houseRules,
                        checkIn: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#707281] mb-2">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    value={propertyData.houseRules?.checkOut || "11:00"}
                    onChange={(e) =>
                      updatePropertyData("houseRules", {
                        ...propertyData.houseRules,
                        checkOut: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={propertyData.houseRules?.smoking || false}
                    onChange={(e) =>
                      updatePropertyData("houseRules", {
                        ...propertyData.houseRules,
                        smoking: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm text-[#5A5D63]">
                    Smoking Allowed
                  </span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={propertyData.houseRules?.pets || false}
                    onChange={(e) =>
                      updatePropertyData("houseRules", {
                        ...propertyData.houseRules,
                        pets: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm text-[#5A5D63]">Pets Allowed</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={propertyData.houseRules?.parties || false}
                    onChange={(e) =>
                      updatePropertyData("houseRules", {
                        ...propertyData.houseRules,
                        parties: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm text-[#5A5D63]">
                    Parties Allowed
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#707281] mb-2">
                  Other Rules (Optional)
                </label>
                <textarea
                  value={propertyData.houseRules?.otherRules || ""}
                  onChange={(e) =>
                    updatePropertyData("houseRules", {
                      ...propertyData.houseRules,
                      otherRules: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Specify any additional house rules..."
                  className="w-full p-3 border border-[#C7CAD0] rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90] resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Property Tenancy Status */}
        <div>
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Is the property currently tenanted? *
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {tenancyStatusOptions.map((option) => (
              <RadioCheck
                key={option.value}
                selectedValue={propertyData.isTenanted}
                handleChange={() =>
                  updatePropertyData("isTenanted", option.value)
                }
                type="radio"
                value={option.value}
                name="isTenanted"
              />
            ))}
          </div>
          {errors?.isTenanted && touched?.isTenanted && (
            <p className="text-red-500 text-sm mt-2">{errors.isTenanted}</p>
          )}
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-[#707281] mb-2">
            Additional Information (Optional)
          </label>
          <textarea
            placeholder="Provide any additional details about the property..."
            value={propertyData.additionalInfo}
            onChange={(e) =>
              updatePropertyData("additionalInfo", e.target.value)
            }
            rows={4}
            className="w-full p-[12px] border border-[#C7CAD0] rounded-md focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90] resize-none text-[14px] leading-[22.4px]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Step2FeaturesConditions;
