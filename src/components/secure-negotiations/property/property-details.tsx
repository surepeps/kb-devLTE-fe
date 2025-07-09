"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiFileText,
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
      className="bg-white rounded-lg border border-[#C7CAD0] shadow-sm overflow-hidden"
    >
      {/* Property Image */}
      {propertyId.thumbnail && (
        <div className="h-48 bg-gray-200 overflow-hidden">
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

      <div className="p-6">
        {/* Property Basic Info */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FiHome className="w-5 h-5 text-[#09391C]" />
            <h3 className="text-xl font-semibold text-[#09391C]">
              Property Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#EEF1F1] p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Property Type</div>
              <div className="font-medium text-gray-800 capitalize">
                {propertyId.propertyType}
              </div>
            </div>

            <div className="bg-[#EEF1F1] p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Brief Type</div>
              <div className="font-medium text-gray-800">
                {propertyId.briefType}
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FiMapPin className="w-5 h-5 text-[#09391C]" />
            <h4 className="font-medium text-gray-800">Location</h4>
          </div>
          <div className="bg-[#EEF1F1] p-4 rounded-lg">
            <div className="text-gray-700">
              {propertyId.location.area}, {propertyId.location.localGovernment},{" "}
              {propertyId.location.state}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FiDollarSign className="w-5 h-5 text-[#09391C]" />
            <h4 className="font-medium text-gray-800">Property Price</h4>
          </div>
          <div className="bg-[#09391C] text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {formatCurrency(propertyId.price)}
            </div>
          </div>
        </div>

        {/* Inspection Details */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FiCalendar className="w-5 h-5 text-[#09391C]" />
            <h4 className="font-medium text-gray-800">Inspection Schedule</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#EEF1F1] p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Date</div>
              <div className="font-medium text-gray-800">
                {formatDate(inspectionDate)}
              </div>
            </div>

            <div className="bg-[#EEF1F1] p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Time</div>
              <div className="font-medium text-gray-800">{inspectionTime}</div>
            </div>
          </div>
        </div>

        {/* Parties Involved */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Info */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FiUser className="w-5 h-5 text-[#09391C]" />
              <h4 className="font-medium text-gray-800">Buyer Information</h4>
            </div>
            <div className="bg-[#EEF1F1] p-4 rounded-lg space-y-2">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium text-gray-800">
                  {requestedBy.fullName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="text-gray-700 text-sm">{requestedBy.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="text-gray-700">{requestedBy.phoneNumber}</div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FiUser className="w-5 h-5 text-[#09391C]" />
              <h4 className="font-medium text-gray-800">Seller Information</h4>
            </div>
            <div className="bg-[#EEF1F1] p-4 rounded-lg space-y-2">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium text-gray-800">
                  {owner.firstName} {owner.lastName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Type</div>
                <div className="text-gray-700">{owner.userType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="text-gray-700 text-sm">{owner.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="text-gray-700">{owner.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <FiFileText className="w-5 h-5 text-[#09391C]" />
            <h4 className="font-medium text-gray-800">Request Information</h4>
          </div>
          <div className="bg-[#EEF1F1] p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Request Created</div>
            <div className="text-gray-700">
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
