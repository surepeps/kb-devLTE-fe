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
  Edit,
  Trash,
  Share,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  FileText,
  TrendingUp,
  Building,
  Maximize,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ImageSlider from "./ImageSlider";

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
  const router = useRouter();

  const getApprovalStatus = () => {
    if (brief.isApproved && !brief.isRejected) {
      return {
        status: "approved",
        label: "Approved",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
        icon: CheckCircle,
      };
    } else if (brief.isRejected) {
      return {
        status: "rejected",
        label: "Rejected",
        color: "bg-red-50 text-red-700 border-red-200",
        dotColor: "bg-red-500",
        icon: XCircle,
      };
    } else {
      return {
        status: "pending",
        label: "Under Review",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
        icon: Clock,
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B`;
    } else if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const handleEditClick = () => {
    router.push(`/my-listings/edit/${brief._id}`);
  };

  const approval = getApprovalStatus();
  const StatusIcon = approval.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#8DDB90]/20 transition-all duration-300 ${className}`}
    >
      {/* Image Container */}
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {brief.pictures && brief.pictures.length > 0 ? (
          <img
            src={brief.pictures[0]}
            alt={brief.propertyType}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8DDB90]/20 to-[#09391C]/20">
            <div className="text-center">
              <Building size={32} className="mx-auto text-[#09391C]/60 mb-2" />
              <span className="text-[#09391C] text-sm font-medium">
                {brief.propertyType}
              </span>
            </div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${approval.color}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${approval.dotColor}`}
              />
              {approval.label}
            </div>

            {/* Premium Badge */}
            {brief.isPremium && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <Star size={11} className="fill-current" />
                Premium
              </div>
            )}

            {/* Preference Badge */}
            {brief.isPreference && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <TrendingUp size={11} />
                <span className="ml-1">Preference</span>
              </div>
            )}
          </div>

          {/* Picture Count */}
          {brief.pictures && brief.pictures.length > 1 && (
            <div className="bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
              {brief.pictures.length} photos
            </div>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute bottom-3 left-3">
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
              brief.isAvailable === "yes"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {brief.isAvailable === "yes" ? "Available" : "Not Available"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-bold text-[#09391C] text-base sm:text-lg capitalize truncate">
                {brief.propertyType}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-xs text-[#5A5D63] bg-gray-100 px-2 py-1 rounded-md font-medium">
                  {brief.briefType}
                </span>
                {brief.propertyCondition && (
                  <span className="text-xs text-[#5A5D63] bg-gray-50 px-2 py-1 rounded-md">
                    {brief.propertyCondition}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[#8DDB90] font-bold text-lg sm:text-xl">
                {formatPrice(brief.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-[#5A5D63] text-sm mb-3 sm:mb-4">
          <MapPin
            size={12}
            sm:size={14}
            className="text-[#8DDB90] flex-shrink-0"
          />
          <span className="truncate text-xs sm:text-sm">
            {brief.location.area}, {brief.location.localGovernment}
          </span>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
          {brief.additionalFeatures?.noOfBedroom && (
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#5A5D63]">
              <Bed
                size={12}
                sm:size={14}
                className="text-[#8DDB90] flex-shrink-0"
              />
              <span>{brief.additionalFeatures.noOfBedroom}</span>
            </div>
          )}
          {brief.additionalFeatures?.noOfBathroom && (
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#5A5D63]">
              <Bath
                size={12}
                sm:size={14}
                className="text-[#8DDB90] flex-shrink-0"
              />
              <span>{brief.additionalFeatures.noOfBathroom}</span>
            </div>
          )}
          {brief.additionalFeatures?.noOfCarPark && (
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#5A5D63]">
              <Car
                size={12}
                sm:size={14}
                className="text-[#8DDB90] flex-shrink-0"
              />
              <span>{brief.additionalFeatures.noOfCarPark}</span>
            </div>
          )}
        </div>

        {/* Land Size & Documents */}
        <div className="space-y-2 mb-4">
          {brief.landSize && brief.landSize.size && (
            <div className="flex items-center gap-1.5 text-sm text-[#5A5D63]">
              <Maximize size={14} className="text-[#8DDB90]" />
              <span>
                {brief.landSize.size.toLocaleString()}{" "}
                {brief.landSize.measurementType}
              </span>
            </div>
          )}

          {brief.docOnProperty && brief.docOnProperty.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-[#5A5D63]">
              <FileText size={14} className="text-[#8DDB90]" />
              <span>{brief.docOnProperty.length} documents available</span>
            </div>
          )}
        </div>

        {/* Features Tags */}
        {brief.features && brief.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {brief.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="bg-[#8DDB90]/10 text-[#09391C] px-2 py-1 rounded-md text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {brief.features.length > 2 && (
              <span className="text-[#5A5D63] text-xs px-2 py-1 bg-gray-50 rounded-md font-medium">
                +{brief.features.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-[#5A5D63]">
            <Calendar size={12} />
            <span>{formatDate(brief.createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onView && (
              <button
                onClick={onView}
                className="p-2 text-[#5A5D63] hover:text-[#09391C] hover:bg-gray-50 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye size={16} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="p-2 text-[#5A5D63] hover:text-[#09391C] hover:bg-gray-50 rounded-lg transition-colors"
                title="Edit Brief"
              >
                <Edit size={16} />
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 text-[#5A5D63] hover:text-[#09391C] hover:bg-gray-50 rounded-lg transition-colors"
                title="Share"
              >
                <Share size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BriefCard;
