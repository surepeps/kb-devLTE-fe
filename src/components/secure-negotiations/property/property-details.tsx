"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

interface PropertyDetailsProps {
  propertyData: {
    propertyId: {
      _id: string;
      propertyType: string;
      briefType: string;
      price: number;
      location: {
        state: string;
        localGovernment: string;
        area: string;
      };
      thumbnail?: string;
    };
    inspectionDate: string;
    inspectionTime: string;
    status: string;
    requestedBy: {
      fullName: string;
      email: string;
      phoneNumber: string;
    };
    owner: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      userType: string;
    };
    createdAt: string;
  };
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyData }) => {
  const {
    propertyId,
    inspectionDate,
    inspectionTime,
    requestedBy,
    owner,
    createdAt,
  } = propertyData;
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-[#C7CAD0] overflow-hidden"
    >
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-[#EEF1F1] hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <FiHome className="w-5 h-5 text-[#09391C]" />
          <h3 className="text-lg font-semibold text-[#09391C]">
            Property Details
          </h3>
        </div>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5 text-[#09391C]" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-[#09391C]" />
        )}
      </button>

      {/* Collapsible Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {/* Property Image */}
        {propertyId.thumbnail && (
          <div className="h-32 sm:h-48 bg-gray-200 overflow-hidden">
            <img
              src={propertyId.thumbnail}
              alt="Property"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/assets/noImageAvailable.png";
              }}
            />
          </div>
        )}

        <div className="p-4 sm:p-6">
          {/* Property Basic Info */}
          <div className="mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#EEF1F1] p-3 sm:p-4 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">
                  Property Type
                </div>
                <div className="font-medium text-gray-800 capitalize text-sm sm:text-base">
                  {propertyId.propertyType}
                </div>
              </div>

              <div className="bg-[#EEF1F1] p-3 sm:p-4 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">
                  Brief Type
                </div>
                <div className="font-medium text-gray-800 text-sm sm:text-base">
                  {propertyId.briefType}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#09391C]" />
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                Location
              </h4>
            </div>
            <div className="bg-[#EEF1F1] p-3 sm:p-4 rounded-lg">
              <div className="text-gray-700 text-sm sm:text-base">
                {propertyId.location.area},{" "}
                {propertyId.location.localGovernment},{" "}
                {propertyId.location.state}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#09391C]" />
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                Property Price
              </h4>
            </div>
            <div className="bg-[#09391C] text-white p-3 sm:p-4 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold">
                {formatCurrency(propertyId.price)}
              </div>
            </div>
          </div>

          {/* Inspection Details */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#09391C]" />
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                Inspection Schedule
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#EEF1F1] p-3 sm:p-4 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">
                  Date
                </div>
                <div className="font-medium text-gray-800 text-sm sm:text-base">
                  {formatDate(inspectionDate)}
                </div>
              </div>

              <div className="bg-[#EEF1F1] p-3 sm:p-4 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">
                  Time
                </div>
                <div className="font-medium text-gray-800 text-sm sm:text-base">
                  {inspectionTime}
                </div>
              </div>
            </div>
          </div>

          {/* Request Info */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#09391C]" />
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                Request Information
              </h4>
            </div>
            <div className="bg-[#EEF1F1] p-3 sm:p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">
                Request Created
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                {new Date(createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyDetails;
