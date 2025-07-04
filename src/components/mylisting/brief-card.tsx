/** @format */

"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Calendar,
  Eye,
  MoreVertical,
  Edit,
  Trash,
  Share,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  FileText,
} from "lucide-react";
import { useState } from "react";

interface Brief {
  _id: string;
  propertyType: string;
  propertyCondition: string;
  briefType: string;
  price: number;
  features: string[];
  tenantCriteria: string[];
  owner: string;
  areYouTheOwner: boolean;
  isAvailable: string;
  pictures: string[];
  isApproved: boolean;
  isRejected: boolean;
  docOnProperty: Array<{
    docName: string;
    isProvided: boolean;
    _id: string;
  }>;
  isPreference: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  landSize: {
    measurementType: string;
    size: number;
  };
  additionalFeatures: {
    additionalFeatures: string[];
    noOfBedroom?: string;
    noOfBathroom?: string;
    noOfToilet?: string;
    noOfCarPark?: string;
  };
}

interface BriefCardProps {
  brief: Brief;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  className?: string;
}

const BriefCard: React.FC<BriefCardProps> = ({
  brief,
  onView,
  onEdit,
  onDelete,
  onShare,
  className = "",
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getApprovalStatus = () => {
    if (brief.isApproved && !brief.isRejected) {
      return {
        status: "approved",
        label: "Approved",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    } else if (brief.isRejected) {
      return {
        status: "rejected",
        label: "Rejected",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      };
    } else {
      return {
        status: "pending",
        label: "Pending Review",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(1)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const approval = getApprovalStatus();
  const StatusIcon = approval.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {brief.pictures && brief.pictures.length > 0 ? (
          <img
            src={brief.pictures[0]}
            alt={brief.propertyType}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8DDB90] to-[#09391C]">
            <span className="text-white text-lg font-semibold">
              {brief.propertyType.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Approval Status Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${approval.color}`}
          >
            <StatusIcon size={12} />
            {approval.label}
          </div>
        </div>

        {/* Premium Badge */}
        {brief.isPremium && (
          <div className="absolute top-3 left-3 mt-8">
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star size={12} />
              Premium
            </div>
          </div>
        )}

        {/* Preference Badge */}
        {brief.isPreference && (
          <div className="absolute top-3 left-3 mt-16">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              Preference
            </div>
          </div>
        )}

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[140px] z-10"
              >
                {onView && (
                  <button
                    onClick={() => {
                      onView();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={14} />
                    Edit Brief
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={() => {
                      onShare();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Share size={14} />
                    Share
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash size={14} />
                    Delete
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Picture Count */}
        {brief.pictures && brief.pictures.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              {brief.pictures.length} photos
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type and Price */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-[#09391C] text-lg capitalize">
              {brief.propertyType}
            </h3>
            <span className="text-xs text-[#5A5D63] bg-gray-100 px-2 py-1 rounded-full">
              {brief.briefType}
            </span>
          </div>
          <p className="text-[#8DDB90] font-bold text-xl">
            {formatPrice(brief.price)}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-[#5A5D63] text-sm mb-3">
          <MapPin size={14} />
          <span className="truncate">
            {brief.location.area}, {brief.location.localGovernment},{" "}
            {brief.location.state}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-[#5A5D63] text-sm mb-3">
          {brief.additionalFeatures?.noOfBedroom && (
            <div className="flex items-center gap-1">
              <Bed size={14} />
              <span>{brief.additionalFeatures.noOfBedroom}</span>
            </div>
          )}
          {brief.additionalFeatures?.noOfBathroom && (
            <div className="flex items-center gap-1">
              <Bath size={14} />
              <span>{brief.additionalFeatures.noOfBathroom}</span>
            </div>
          )}
          {brief.additionalFeatures?.noOfCarPark && (
            <div className="flex items-center gap-1">
              <Car size={14} />
              <span>{brief.additionalFeatures.noOfCarPark}</span>
            </div>
          )}
        </div>

        {/* Documents */}
        {brief.docOnProperty && brief.docOnProperty.length > 0 && (
          <div className="flex items-center gap-1 text-[#5A5D63] text-sm mb-3">
            <FileText size={14} />
            <span>{brief.docOnProperty.length} documents</span>
          </div>
        )}

        {/* Land Size */}
        {brief.landSize && brief.landSize.size && (
          <div className="text-[#5A5D63] text-sm mb-3">
            <span>
              {brief.landSize.size.toLocaleString()}{" "}
              {brief.landSize.measurementType}
            </span>
          </div>
        )}

        {/* Property Condition */}
        {brief.propertyCondition && (
          <div className="text-[#5A5D63] text-sm mb-3">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              {brief.propertyCondition}
            </span>
          </div>
        )}

        {/* Features Tags */}
        {brief.features && brief.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {brief.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-[#8DDB90] bg-opacity-10 text-[#09391C] px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {brief.features.length > 3 && (
              <span className="text-[#5A5D63] text-xs px-2 py-1">
                +{brief.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-[#5A5D63]">
            <Calendar size={12} />
            <span>{formatDate(brief.createdAt)}</span>
          </div>

          <div className="text-xs text-[#5A5D63]">
            {brief.isAvailable === "yes" ? "Available" : "Not Available"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BriefCard;
