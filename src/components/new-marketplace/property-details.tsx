"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faMapMarkerAlt,
  faBed,
  faBath,
  faRuler,
  faHeart,
  faShareAlt,
  faPhone,
  faEnvelope,
  faChevronLeft,
  faChevronRight,
  faCalendarAlt,
  faUser,
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

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
  onNegotiate: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  onClose,
  onNegotiate,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "features" | "location"
  >("overview");

  const price = property.price || property.rentalPrice || 0;
  const location = `${property.location.area ? property.location.area + ", " : ""}${property.location.localGovernment}, ${property.location.state}`;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1,
    );
  };

  const handleShare = () => {
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
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>

            {/* Image Gallery */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <>
                  <Image
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {property.isFeatured && (
                  <span className="bg-[#8DDB90] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {property.isNegotiable && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Negotiable
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Title and Price */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {property.title}
                      </h1>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="mr-2"
                        />
                        <span>{location}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setLiked(!liked)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          liked
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <FontAwesomeIcon icon={faShareAlt} />
                      </button>
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-[#8DDB90] mb-4">
                    ₦{price.toLocaleString()}
                    {property.rentalPrice && (
                      <span className="text-lg font-normal text-gray-500">
                        {" "}
                        /year
                      </span>
                    )}
                  </div>

                  {/* Property Stats */}
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faBed} className="mr-2" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faBath} className="mr-2" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      <span>
                        {new Date(property.dateCreated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "features", label: "Features" },
                      { id: "location", label: "Location" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? "border-[#8DDB90] text-[#8DDB90]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === "overview" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {property.description ||
                          "No description available for this property."}
                      </p>
                    </div>
                  )}

                  {activeTab === "features" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {property.features && property.features.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Property Features
                          </h3>
                          <div className="space-y-2">
                            {property.features.map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-2 h-2 bg-[#8DDB90] rounded-full mr-3"></div>
                                <span className="text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {property.amenities && property.amenities.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Nearby Amenities
                          </h3>
                          <div className="space-y-2">
                            {property.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="text-gray-600">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "location" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Location Details
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              State:
                            </span>
                            <p className="text-gray-600">
                              {property.location.state}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              LGA:
                            </span>
                            <p className="text-gray-600">
                              {property.location.localGovernment}
                            </p>
                          </div>
                          {property.location.area && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Area:
                              </span>
                              <p className="text-gray-600">
                                {property.location.area}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Map placeholder */}
                      <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="text-3xl text-gray-400 mb-2"
                          />
                          <p className="text-gray-500">
                            Interactive map would be shown here
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Contact Agent */}
                {property.agent && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Agent
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#8DDB90] rounded-full flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faUser} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {property.agent.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Real Estate Agent
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="w-full bg-[#8DDB90] text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-[#7BC87F] transition-colors"
                      >
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Call Agent
                      </a>

                      {property.agent.email && (
                        <a
                          href={`mailto:${property.agent.email}`}
                          className="w-full bg-white border border-[#8DDB90] text-[#8DDB90] px-4 py-3 rounded-lg flex items-center justify-center hover:bg-[#8DDB90] hover:text-white transition-colors"
                        >
                          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                          Email Agent
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={onNegotiate}
                    className="w-full bg-[#8DDB90] text-white px-6 py-3 rounded-lg hover:bg-[#7BC87F] transition-colors font-medium"
                  >
                    Negotiate Price
                  </button>

                  <button className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Schedule Inspection
                  </button>

                  <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    Request Information
                  </button>
                </div>

                {/* Property Summary */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Property Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium capitalize">
                        {property.propertyType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed:</span>
                      <span className="font-medium">
                        {new Date(property.dateCreated).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property ID:</span>
                      <span className="font-medium">
                        {property._id.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PropertyDetails;
