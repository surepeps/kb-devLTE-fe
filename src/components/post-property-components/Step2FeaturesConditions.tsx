"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import {
  featuresData,
  JvConditionData,
  DocOnPropertyData,
} from "@/data/buy_data";
import { tenantCriteriaData } from "@/data/landlord";
import RadioCheck from "@/components/general-components/radioCheck";
import Input from "@/components/general-components/Input";

interface StepProps {
  errors?: any;
  touched?: any;
}

const Step2FeaturesConditions: React.FC<StepProps> = ({ errors, touched }) => {
  const { propertyData, updatePropertyData } = usePostPropertyContext();

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = propertyData.features;
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature];
    updatePropertyData("features", updatedFeatures);
  };

  const handleTenantCriteriaToggle = (criteria: string) => {
    const currentCriteria = propertyData.tenantCriteria;
    const updatedCriteria = currentCriteria.includes(criteria)
      ? currentCriteria.filter((c) => c !== criteria)
      : [...currentCriteria, criteria];
    updatePropertyData("tenantCriteria", updatedCriteria);
  };

  const handleJvConditionToggle = (condition: string) => {
    const currentConditions = propertyData.jvConditions;
    const updatedConditions = currentConditions.includes(condition)
      ? currentConditions.filter((c) => c !== condition)
      : [...currentConditions, condition];
    updatePropertyData("jvConditions", updatedConditions);
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
          Features & Conditions
        </h2>
        <p className="text-[16px] text-[#5A5D63]">
          Select features and set conditions for your property
        </p>
      </div>

      <div className="space-y-8">
        {/* Documents (for sell and jv) */}
        {propertyData.propertyType !== "rent" && (
          <div className="border border-[#E5E7EB] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">
              Document on the property
            </h3>
            <p className="text-[#5A5D63] mb-6">
              Select all documents available for this property
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DocOnPropertyData.map((document, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const currentDocuments = propertyData.documents;
                    const updatedDocuments = currentDocuments.includes(document)
                      ? currentDocuments.filter((doc) => doc !== document)
                      : [...currentDocuments, document];
                    updatePropertyData("documents", updatedDocuments);
                  }}
                  className={`p-3 rounded-md border text-left transition-all text-sm ${
                    propertyData.documents.includes(document)
                      ? "border-[#8DDB90] bg-[#E4EFE7] text-[#09391C] font-medium"
                      : "border-[#C7CAD0] hover:border-[#8DDB90] text-[#5A5D63] hover:bg-gray-50"
                  }`}
                >
                  <span>{document}</span>
                  {propertyData.documents.includes(document) && (
                    <div className="mt-1">
                      <span className="inline-block w-1.5 h-1.5 bg-[#8DDB90] rounded-full"></span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Property Features */}
        <div className="border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Property Features
          </h3>
          <p className="text-[#5A5D63] mb-6">
            Select all features that apply to your property
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {featuresData.map((feature, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFeatureToggle(feature)}
                className={`p-3 rounded-md border text-left transition-all text-sm ${
                  propertyData.features.includes(feature)
                    ? "border-[#8DDB90] bg-[#E4EFE7] text-[#09391C] font-medium"
                    : "border-[#C7CAD0] hover:border-[#8DDB90] text-[#5A5D63] hover:bg-gray-50"
                }`}
              >
                <span>{feature}</span>
                {propertyData.features.includes(feature) && (
                  <div className="mt-1">
                    <span className="inline-block w-1.5 h-1.5 bg-[#8DDB90] rounded-full"></span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tenant Criteria (for rent) */}
        {propertyData.propertyType === "rent" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#09391C] mb-4">
              Tenant Requirements
            </h3>
            <p className="text-[#5A5D63] mb-6">
              Set criteria for potential tenants
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tenantCriteriaData.map((criteria, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTenantCriteriaToggle(criteria)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    propertyData.tenantCriteria.includes(criteria)
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-blue-500 text-gray-700"
                  }`}
                >
                  <span className="text-sm font-medium">{criteria}</span>
                  {propertyData.tenantCriteria.includes(criteria) && (
                    <div className="mt-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Joint Venture Conditions */}
        {propertyData.propertyType === "jv" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#09391C] mb-4">
              Joint Venture Terms
            </h3>
            <p className="text-[#5A5D63] mb-6">
              Select applicable conditions for the joint venture
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {JvConditionData.map((condition, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJvConditionToggle(condition)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    propertyData.jvConditions.includes(condition)
                      ? "border-purple-500 bg-purple-50 text-purple-900"
                      : "border-gray-200 hover:border-purple-500 text-gray-700"
                  }`}
                >
                  <span className="text-sm font-medium">{condition}</span>
                  {propertyData.jvConditions.includes(condition) && (
                    <div className="mt-2">
                      <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Property Tenancy Status */}
        <div className="border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Is your property currently tenanted?
          </h3>
          <div className="flex flex-wrap gap-6">
            <RadioCheck
              type="radio"
              value="Yes"
              name="isTenanted"
              handleChange={() => updatePropertyData("isTenanted", "Yes")}
              selectedValue={propertyData.isTenanted}
            />
            <RadioCheck
              type="radio"
              value="No"
              name="isTenanted"
              handleChange={() => updatePropertyData("isTenanted", "No")}
              selectedValue={propertyData.isTenanted}
            />
            <RadioCheck
              type="radio"
              value="I live in it"
              name="isTenanted"
              handleChange={() =>
                updatePropertyData("isTenanted", "I live in it")
              }
              selectedValue={propertyData.isTenanted}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#09391C] mb-4">
            Additional Information
          </h3>
          <Input
            name="additionalInfo"
            label=""
            type="textArea"
            placeholder="Enter any additional information about your property"
            value={propertyData.additionalInfo}
            onChange={(e) =>
              updatePropertyData("additionalInfo", e.target.value)
            }
            multiline={true}
            rows={4}
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-[#09391C] mb-3">Summary</h4>
          <div className="space-y-2 text-sm text-[#5A5D63]">
            {propertyData.propertyType !== "rent" && (
              <p>
                <span className="font-medium">Documents selected:</span>{" "}
                {propertyData.documents.length}
              </p>
            )}
            <p>
              <span className="font-medium">Features selected:</span>{" "}
              {propertyData.features.length}
            </p>
            {propertyData.propertyType === "rent" && (
              <p>
                <span className="font-medium">Tenant criteria:</span>{" "}
                {propertyData.tenantCriteria.length}
              </p>
            )}
            {propertyData.propertyType === "jv" && (
              <p>
                <span className="font-medium">JV conditions:</span>{" "}
                {propertyData.jvConditions.length}
              </p>
            )}
            <p>
              <span className="font-medium">Tenancy status:</span>{" "}
              {propertyData.isTenanted || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2FeaturesConditions;
