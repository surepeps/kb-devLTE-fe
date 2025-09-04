/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { User, MapPin, Phone, Mail, Camera, Upload } from "lucide-react";
import { motion } from "framer-motion";
import AttachFile from "@/components/general-components/attach_file";
import toast from "react-hot-toast";

interface BasicProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  address: {
    street: string;
    localGovtArea: string;
    state: string;
  };
}

interface BasicProfileStepProps {
  data: BasicProfileData;
  onDataChange: (data: BasicProfileData) => void;
  onNext: () => void;
  user: any;
}

const BasicProfileStep: React.FC<BasicProfileStepProps> = ({
  data,
  onDataChange,
  onNext,
  user,
}) => {
  const [formData, setFormData] = useState<BasicProfileData>(data);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    data.profilePicture || user?.profile_picture || null
  );

  useEffect(() => {
    // Update form data with latest changes
    const updatedData = {
      ...formData,
      profilePicture: profilePictureUrl || "",
    };
    setFormData(updatedData);
    onDataChange(updatedData);
  }, [profilePictureUrl]);

  const handleInputChange = (
    field: keyof BasicProfileData | string,
    value: string
  ) => {
    if (field.includes(".")) {
      // Handle nested fields like address.street
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNext = () => {
    // Validate required fields
    const requiredFields = [
      { field: "firstName", label: "First Name" },
      { field: "lastName", label: "Last Name" },
      { field: "phoneNumber", label: "Phone Number" },
      { field: "address.street", label: "Street Address" },
      { field: "address.localGovtArea", label: "Local Government Area" },
      { field: "address.state", label: "State" },
    ];

    const missingFields = requiredFields.filter(({ field }) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return !formData[parent as keyof BasicProfileData]?.[child as keyof any];
      }
      return !formData[field as keyof BasicProfileData];
    });

    if (missingFields.length > 0) {
      missingFields.forEach(({ label }) => {
        toast.error(`${label} is required`);
      });
      return;
    }

    // Update parent component and proceed
    onDataChange({
      ...formData,
      profilePicture: profilePictureUrl || "",
    });
    onNext();
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-[#09391C] mb-4 font-display">
            Let's verify your basic information
          </h3>
          <p className="text-[#5A5D63] max-w-2xl mx-auto">
            Most of this information is already filled from your account. Please review and update if necessary.
            Your profile picture helps clients recognize and trust you as a professional agent.
          </p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8DDB90]/20 to-[#09391C]/20 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-[#8DDB90]" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <AttachFile
                setFileUrl={setProfilePictureUrl}
                id="profile-picture-upload"
                customTrigger={
                  <button
                    type="button"
                    className="w-10 h-10 bg-[#8DDB90] text-white rounded-full flex items-center justify-center hover:bg-[#7BC87F] transition-colors shadow-lg"
                  >
                    <Camera size={16} />
                  </button>
                }
              />
            </div>
          </div>
          <p className="text-sm text-[#5A5D63] mt-2 text-center">
            Upload a professional profile picture
          </p>
        </div>

        {/* Personal Information */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <User size={20} />
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A5D63]" size={18} />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                  placeholder="Enter your first name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A5D63]" size={18} />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A5D63]" size={18} />
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A5D63]" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  placeholder="Your email address"
                />
              </div>
              <p className="text-xs text-[#5A5D63] mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <MapPin size={20} />
            Address Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleInputChange("address.street", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                placeholder="Enter street address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Local Government Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address.localGovtArea}
                onChange={(e) => handleInputChange("address.localGovtArea", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                placeholder="Enter LGA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleInputChange("address.state", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                placeholder="Enter state"
              />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <User size={16} />
            Profile Requirements
          </h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Use a clear, professional profile picture
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Ensure all information is accurate and up-to-date
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Your profile will be visible to potential clients
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              Address information helps clients find agents in their area
            </li>
          </ul>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8DDB90]/50 focus:ring-offset-2 font-medium"
          >
            Continue to Professional Profile
            <User size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BasicProfileStep;
