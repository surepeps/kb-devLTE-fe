"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShareAlt,
  faEye,
  faMapMarkerAlt,
  faBed,
  faBath,
  faRuler,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface Property {
  _id: string;
  title: string;
  price: number;
  rentalPrice?: number;
  location: {
    state: string;
    localGovernment: string;
    area?: string;
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  isNegotiable: boolean;
  isFeatured: boolean;
  dateCreated: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface PropertyGridProps {
  properties: Property[];
  onNegotiate: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PropertyCard: React.FC<{
  property: Property;
  onNegotiate: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}> = ({ property, onNegotiate, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const price = property.price || property.rentalPrice || 0;
  const location = `${property.location.area ? property.location.area + ", " : ""}${property.location.localGovernment}, ${property.location.state}`;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1,
    );
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      onClick={() => onViewDetails(property)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {property.images && property.images.length > 0 && (
          <>
            <Image
              src={
                property.images[currentImageIndex] ||
                "/placeholder-property.jpg"
              }
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronLeft} size="sm" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronRight} size="sm" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {property.isFeatured && (
            <span className="bg-[#8DDB90] text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          {property.isNegotiable && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Negotiable
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              liked
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            <FontAwesomeIcon icon={faHeart} size="sm" />
          </button>
          <button
            onClick={handleShare}
            className="w-8 h-8 bg-white/80 text-gray-700 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <FontAwesomeIcon icon={faShareAlt} size="sm" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-gray-900">
            ₦{price.toLocaleString()}
            {property.rentalPrice && (
              <span className="text-sm font-normal text-gray-500"> /year</span>
            )}
          </div>
          <span className="text-sm text-gray-500 capitalize">
            {property.propertyType}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-sm" />
          <span className="text-sm truncate">{location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBed} className="mr-1 text-sm" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBath} className="mr-1 text-sm" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(property.dateCreated).toLocaleDateString()}
          </div>
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(property);
            }}
            className="flex-1 px-4 py-2 border border-[#8DDB90] text-[#8DDB90] rounded-lg hover:bg-[#8DDB90] hover:text-white transition-colors text-sm font-medium"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNegotiate(property);
            }}
            className="flex-1 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors text-sm font-medium"
          >
            Negotiate
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-lg font-medium ${
            currentPage === page
              ? "bg-[#8DDB90] text-white border-[#8DDB90]"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  onNegotiate,
  onViewDetails,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onNegotiate={onNegotiate}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PropertyGrid;
