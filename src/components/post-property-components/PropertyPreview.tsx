"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import {
  MapPin as MapPinIcon,
  Bed as BedIcon,
  Bath as BathIcon,
  Car as CarIcon,
  Home as HomeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  Tag as TagIcon,
  CheckCircle as CheckCircleIcon,
} from "lucide-react";
import Image from "next/image";

const PropertyPreview: React.FC = () => {
  const { propertyData, images } = usePostPropertyContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const validImages = images.filter(
    (img) => img.file !== null && img.preview !== null,
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length,
    );
  };

  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    return `₦${numPrice.toLocaleString()}`;
  };

  const getPropertyTypeLabel = () => {
    switch (propertyData.propertyType) {
      case "sell":
        return "For Sale";
      case "rent":
        return "For Rent";
      case "jv":
        return "Joint Venture";
      default:
        return "";
    }
  };

  const getPropertyTypeColor = () => {
    switch (propertyData.propertyType) {
      case "sell":
        return "bg-green-500";
      case "rent":
        return "bg-blue-500";
      case "jv":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#09391C] font-display mb-4">
          Property Preview
        </h2>
        <p className="text-[#5A5D63] text-lg">
          Review your property listing before submission
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-96 bg-gray-200">
          <AnimatePresence mode="wait">
            {validImages.length > 0 && validImages[currentImageIndex] ? (
              <motion.img
                key={currentImageIndex}
                src={validImages[currentImageIndex].preview!}
                alt={`Property image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HomeIcon size={64} className="text-gray-400" />
              </div>
            )}
          </AnimatePresence>

          {/* Property Type Badge */}
          <div
            className={`absolute top-4 left-4 ${getPropertyTypeColor()} text-white px-3 py-1 rounded-full text-sm font-semibold`}
          >
            {getPropertyTypeLabel()}
          </div>

          {/* Image Navigation */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <ChevronLeftIcon size={24} className="text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <ChevronRightIcon size={24} className="text-gray-700" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {validImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {validImages.length}
          </div>
        </div>

        {/* Property Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2">
              {/* Price and Location */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-[#09391C]">
                    {formatPrice(propertyData.price)}
                    {propertyData.propertyType === "rent" && (
                      <span className="text-lg font-normal text-gray-600">
                        {" "}
                        /year
                      </span>
                    )}
                  </h1>
                  {propertyData.propertyType === "jv" &&
                    propertyData.holdDuration && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {propertyData.holdDuration} years
                      </span>
                    )}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon size={18} className="mr-2" />
                  <span className="text-lg">
                    {propertyData.area}, {propertyData.lga?.label},{" "}
                    {propertyData.state?.label}
                  </span>
                </div>
              </div>

              {/* Property Specifications */}
              <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BedIcon size={20} className="text-[#8DDB90]" />
                  <span className="font-medium">
                    {propertyData.bedrooms} Bedrooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BathIcon size={20} className="text-[#8DDB90]" />
                  <span className="font-medium">
                    {propertyData.bathrooms} Bathrooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HomeIcon size={20} className="text-[#8DDB90]" />
                  <span className="font-medium">
                    {propertyData.toilets} Toilets
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CarIcon size={20} className="text-[#8DDB90]" />
                  <span className="font-medium">
                    {propertyData.parkingSpaces} Parking
                  </span>
                </div>
              </div>

              {/* Description */}
              {propertyData.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#09391C] mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {propertyData.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {propertyData.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#09391C] mb-3">
                    Features
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {propertyData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircleIcon size={16} className="text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tenant Criteria (for rent) */}
              {propertyData.propertyType === "rent" &&
                propertyData.tenantCriteria.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#09391C] mb-3">
                      Tenant Requirements
                    </h3>
                    <div className="space-y-2">
                      {propertyData.tenantCriteria.map((criteria, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <TagIcon size={16} className="text-blue-500" />
                          <span>{criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* JV Conditions */}
              {propertyData.propertyType === "jv" &&
                propertyData.jvConditions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#09391C] mb-3">
                      Joint Venture Terms
                    </h3>
                    <div className="space-y-2">
                      {propertyData.jvConditions.map((condition, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <TagIcon size={16} className="text-purple-500" />
                          <span>{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h3 className="text-xl font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                  <UserIcon size={20} />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {propertyData.contactInfo.firstName}{" "}
                      {propertyData.contactInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Property Owner</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <PhoneIcon size={16} />
                    <span>{propertyData.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MailIcon size={16} />
                    <span>{propertyData.contactInfo.email}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircleIcon size={16} />
                      <span>Verified Owner</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full bg-[#8DDB90] hover:bg-[#7BC87F] text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                    Contact Owner
                  </button>
                  <button className="w-full border-2 border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                    Schedule Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Images Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-[#09391C] mb-3">
            All Images
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? "border-[#8DDB90]"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={image.preview!}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyPreview;
