"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import { useUserContext } from "@/context/user-context";
import Input from "@/components/general-components/Input";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { DocOnPropertyData } from "@/data/buy_data";
import "react-phone-number-input/style.css";

const Step4OwnershipDeclaration: React.FC = () => {
  const { propertyData, updatePropertyData } = usePostPropertyContext();
  const { user } = useUserContext();

  // Initialize contact info with user data
  useEffect(() => {
    if (
      user &&
      (!propertyData.contactInfo.firstName || !propertyData.contactInfo.email)
    ) {
      updatePropertyData("contactInfo", {
        ...propertyData.contactInfo,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleContactInfoChange = (
    field: keyof typeof propertyData.contactInfo,
    value: string,
  ) => {
    updatePropertyData("contactInfo", {
      ...propertyData.contactInfo,
      [field]: value,
    });
  };

  const handleDocumentToggle = (document: string) => {
    const currentDocs = propertyData.ownershipDocuments;
    const updatedDocs = currentDocs.includes(document)
      ? currentDocs.filter((doc) => doc !== document)
      : [...currentDocs, document];
    updatePropertyData("ownershipDocuments", updatedDocs);
  };

  const handleLegalOwnerChange = (isOwner: boolean) => {
    updatePropertyData("isLegalOwner", isOwner);
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
          Owners Declaration
        </h2>
        <p className="text-[16px] text-[#5A5D63]">
          Verify your ownership and provide contact information
        </p>
      </div>

      <div className="space-y-8">
        {/* Legal Ownership Declaration */}
        <div className="border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#09391C] mb-4">
            Ownership Verification
          </h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-[#5A5D63] mb-4">
                Please confirm that you are the legal owner of this property or
                have been authorized by the legal owner to list this property.
              </p>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="legalOwner"
                    checked={propertyData.isLegalOwner === true}
                    onChange={() => handleLegalOwnerChange(true)}
                    className="w-4 h-4 text-[#8DDB90] focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Yes, I am the legal owner of this property
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="legalOwner"
                    checked={propertyData.isLegalOwner === false}
                    onChange={() => handleLegalOwnerChange(false)}
                    className="w-4 h-4 text-[#8DDB90] focus:ring-[#8DDB90]"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    I am authorized by the legal owner to list this property
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Documents on Property */}
        <div className="border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#09391C] mb-4">
            Available Documents
          </h3>
          <p className="text-[#5A5D63] mb-6">
            Select all documents you have available for this property
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DocOnPropertyData.map((doc, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDocumentToggle(doc)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  propertyData.ownershipDocuments.includes(doc)
                    ? "border-[#8DDB90] bg-[#8DDB90] bg-opacity-10 text-[#09391C]"
                    : "border-gray-200 hover:border-[#8DDB90] text-gray-700"
                }`}
              >
                <span className="text-sm font-medium">{doc}</span>
                {propertyData.ownershipDocuments.includes(doc) && (
                  <div className="mt-2">
                    <span className="inline-block w-2 h-2 bg-[#8DDB90] rounded-full"></span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#09391C] mb-4">
            Contact Information
          </h3>
          <p className="text-[#5A5D63] mb-6">
            This information will be used to contact you about this property
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                name="firstName"
                label="First Name"
                type="text"
                placeholder="Enter first name"
                value={propertyData.contactInfo.firstName}
                onChange={(e) =>
                  handleContactInfoChange("firstName", e.target.value)
                }
              />
            </div>
            <div>
              <Input
                name="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter last name"
                value={propertyData.contactInfo.lastName}
                onChange={(e) =>
                  handleContactInfoChange("lastName", e.target.value)
                }
              />
            </div>
            <div>
              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={propertyData.contactInfo.email}
                onChange={(e) =>
                  handleContactInfoChange("email", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#707281] mb-2">
                Phone Number *
              </label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="NG"
                value={propertyData.contactInfo.phone}
                onChange={(value) =>
                  handleContactInfoChange("phone", value || "")
                }
                className="phone-input"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-800 mb-3">
            Terms and Conditions
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              • I confirm that all information provided is accurate and
              up-to-date
            </p>
            <p>
              • I understand that false information may result in listing
              removal
            </p>
            <p>• I agree to Khabi-Teq's terms of service and privacy policy</p>
            <p>
              • I consent to being contacted by potential buyers/tenants through
              this platform
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-[#09391C] mb-3">
            Declaration Summary
          </h4>
          <div className="space-y-2 text-sm text-[#5A5D63]">
            <p>
              <span className="font-medium">Legal Owner:</span>{" "}
              {propertyData.isLegalOwner ? "Yes" : "Authorized Representative"}
            </p>
            <p>
              <span className="font-medium">Documents Available:</span>{" "}
              {propertyData.ownershipDocuments.length}
            </p>
            <p>
              <span className="font-medium">Contact:</span>{" "}
              {propertyData.contactInfo.firstName &&
              propertyData.contactInfo.lastName
                ? `${propertyData.contactInfo.firstName} ${propertyData.contactInfo.lastName}`
                : "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Step4OwnershipDeclaration;
