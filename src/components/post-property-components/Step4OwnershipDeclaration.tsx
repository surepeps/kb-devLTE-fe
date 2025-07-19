"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import { useUserContext } from "@/context/user-context";
import { step4ValidationSchema } from "@/utils/validation/post-property-validation";
import Input from "@/components/general-components/Input";
import RadioCheck from "@/components/general-components/radioCheck";
import EnhancedCheckbox from "@/components/general-components/EnhancedCheckbox";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { DocOnPropertyData } from "@/data/buy_data";
import {
  getCommissionText,
  briefTypeConfig,
} from "@/data/comprehensive-post-property-config";
import "react-phone-number-input/style.css";
import "@/styles/phone-input.css";

interface StepProps {
  // No props needed
}

const Step4OwnershipDeclaration: React.FC<StepProps> = () => {
  const { propertyData, updatePropertyData } = usePostPropertyContext();
  const { user } = useUserContext();
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});

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

  const getUserType = (): "landowner" | "agent" => {
    return user?.userType === "Agent" ? "agent" : "landowner";
  };

  const getCommissionRate = () => {
    const userType = getUserType();
    const config =
      briefTypeConfig[
        propertyData.propertyType as keyof typeof briefTypeConfig
      ];
    if (!config) return 10;
    return userType === "agent"
      ? config.commission.agent
      : config.commission.landowner;
  };

  const getUserName = () => {
    const firstName =
      propertyData.contactInfo.firstName || user?.firstName || "";
    const lastName = propertyData.contactInfo.lastName || user?.lastName || "";
    return `${firstName} ${lastName}`.trim() || "User";
  };

  const getCommissionAgreementText = () => {
    const userType = getUserType();
    const userName = getUserName();
    const briefType = propertyData.propertyType;

    if (!briefType) return "";

    if (briefType === "jv") {
      if (userType === "landowner") {
        return `I, ${userName}, agree that Khabiteq Realty shall earn 10% of the total value generated from this transaction.`;
      } else {
        return `I, ${userName}, agree that Khabiteq Realty shall earn 50% of my commission on this transaction.`;
      }
    }

    if (briefType === "rent") {
      if (userType === "landowner") {
        return `I, ${userName}, agree that Khabiteq Realty shall earn 10% of the total value generated from this transaction as commission when the deal is closed.`;
      } else {
        return `I understand that Khabiteq does not collect commission on agent rental deals.`;
      }
    }

    if (briefType === "sell") {
      if (userType === "landowner") {
        return `I, ${userName}, agree that Khabiteq Realty shall earn 10% of the total value generated from this transaction as commission when the deal is closed.`;
      } else {
        return `I, ${userName}, agree that Khabiteq Realty shall earn 50% of the total commission accrued to me when the deal is closed.`;
      }
    }

    if (briefType === "shortlet") {
      return `I, ${userName}, agree that Khabiteq realty shall earn 5% of the total value generated from this transaction as commission when the deal is closed.`;
    }

    return "";
  };

  const getCommissionDetails = () => {
    const userType = getUserType();
    const briefType = propertyData.propertyType;

    if (!briefType) return { title: "", details: [] };

    const commissionRate = getCommissionRate();

    if (briefType === "jv") {
      return {
        title: "COMMISSION AGREEMENT - Joint Venture",
        details:
          userType === "landowner"
            ? [
                "For Landlords:",
                "• Khabiteq earns a fixed 10% of the transaction value upon deal closure.",
              ]
            : [
                "For Agents:",
                "• Choose commission type:",
                "○ Mandate: Agent has direct authorization from the owner → Khabiteq earns 50% of agent's commission",
              ],
      };
    }

    if (briefType === "rent") {
      return {
        title: "COMMISSION AGREEMENT - Rent",
        details:
          userType === "landowner"
            ? [
                "For Landlords:",
                "• Khabiteq commission is fixed at 10% of the final rental deal value",
              ]
            : ["For Agents:", "• No commission is deducted by Khabiteq"],
      };
    }

    if (briefType === "sell") {
      return {
        title: "COMMISSION AGREEMENT - Sale",
        details:
          userType === "landowner"
            ? [
                "For Landlords:",
                "• Khabiteq commission is fixed at 10% of the sale price.",
              ]
            : [
                "For Agents:",
                "• Choose commission model:",
                "• Mandate – Agent has direct mandate from the owner (Khabiteq earns 50% of agent's commission)",
              ],
      };
    }

    if (briefType === "shortlet") {
      return {
        title: "COMMISSION AGREEMENT - Shortlet",
        details: [
          "• Khabiteq earns 5% of the total value generated from this transaction as commission when the deal is closed",
        ],
      };
    }

    return { title: "", details: [] };
  };

  const commissionInfo = getCommissionDetails();

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

        {/* Commission Agreement */}
        {propertyData.propertyType && (
          <div className="border border-[#E5E7EB] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#09391C] mb-4">
              {commissionInfo.title}
            </h3>

            {/* Commission Details */}
            <div className="bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm text-[#5A5D63]">
                {commissionInfo.details.map((detail, index) => (
                  <p
                    key={index}
                    className={
                      detail.startsWith("•") || detail.startsWith("○")
                        ? "ml-2"
                        : "font-medium"
                    }
                  >
                    {detail}
                  </p>
                ))}
              </div>
            </div>

            {/* Agreement Statement */}
            <div className="bg-[#E4EFE7] border border-[#8DDB90] rounded-lg p-4">
              <h4 className="font-semibold text-[#09391C] mb-2">
                Agreement Statement
              </h4>
              <p className="text-sm text-[#1E1E1E] leading-relaxed">
                "{getCommissionAgreementText()}"
              </p>
            </div>
          </div>
        )}

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
                error={errors?.contactInfo?.firstName}
                touched={touched?.contactInfo?.firstName}
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
                error={errors?.contactInfo?.lastName}
                touched={touched?.contactInfo?.lastName}
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
                error={errors?.contactInfo?.email}
                touched={touched?.contactInfo?.email}
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
              <div
                className={`phone-input-container ${
                  errors?.contactInfo?.phone && touched?.contactInfo?.phone
                    ? "has-error"
                    : ""
                }`}
              >
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="NG"
                  value={propertyData.contactInfo.phone}
                  onChange={(value) =>
                    handleContactInfoChange("phone", value || "")
                  }
                  placeholder="Enter phone number"
                  className="enhanced-phone-input"
                />
              </div>
              {errors?.contactInfo?.phone && touched?.contactInfo?.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactInfo.phone}
                </p>
              )}
              {propertyData.contactInfo.phone &&
                !isValidPhoneNumber(propertyData.contactInfo.phone) && (
                  <p className="text-yellow-600 text-sm mt-1">
                    Please enter a valid phone number
                  </p>
                )}
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
              <span className="font-medium">Commission Rate:</span>{" "}
              {getCommissionRate()}%
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
