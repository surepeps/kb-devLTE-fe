"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import { useUserContext } from "@/context/user-context";
import Input from "@/components/general-components/Input";
import RadioCheck from "@/components/general-components/radioCheck";
import EnhancedCheckbox from "@/components/general-components/EnhancedCheckbox";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { DocOnPropertyData } from "@/data/buy_data";
import "react-phone-number-input/style.css";

interface StepProps {
  errors?: any;
  touched?: any;
}

const Step4OwnershipDeclaration: React.FC<StepProps> = ({
  errors,
  touched,
}) => {
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
                <RadioCheck
                  selectedValue={
                    propertyData.isLegalOwner === true
                      ? "owner"
                      : propertyData.isLegalOwner === false
                        ? "authorized"
                        : ""
                  }
                  handleChange={() => handleLegalOwnerChange(true)}
                  type="radio"
                  value="owner"
                  name="legalOwner"
                  variant="card"
                  title="Yes, I am the legal owner of this property"
                />
                <RadioCheck
                  selectedValue={
                    propertyData.isLegalOwner === true
                      ? "owner"
                      : propertyData.isLegalOwner === false
                        ? "authorized"
                        : ""
                  }
                  handleChange={() => handleLegalOwnerChange(false)}
                  type="radio"
                  value="authorized"
                  name="legalOwner"
                  variant="card"
                  title="I am authorized by the legal owner to list this property"
                />
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
              <EnhancedCheckbox
                key={index}
                label={doc}
                name="ownershipDocuments"
                value={doc}
                checked={propertyData.ownershipDocuments.includes(doc)}
                onChange={() => handleDocumentToggle(doc)}
                variant="card"
              />
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
              {errors?.contactInfo?.firstName &&
                touched?.contactInfo?.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactInfo.firstName}
                  </p>
                )}
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
              {errors?.contactInfo?.lastName &&
                touched?.contactInfo?.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactInfo.lastName}
                  </p>
                )}
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
              {errors?.contactInfo?.email && touched?.contactInfo?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactInfo.email}
                </p>
              )}
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
            <p>
              • I agree to Khabi-Teq&apos;s terms of service and privacy policy
            </p>
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
