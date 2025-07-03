"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faEye,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

interface Property {
  _id: string;
  title: string;
  price: number;
  rentalPrice?: number;
  location: {
    state: string;
    localGovernment: string;
    area?: string;
    coordinates?: [number, number];
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  onNegotiate: (property: Property) => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onPropertySelect,
  onNegotiate,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    9.0765, 7.3986,
  ]); // Nigeria center

  // Mock coordinates for demonstration
  const getPropertyCoordinates = (property: Property): [number, number] => {
    // In a real implementation, you would use actual coordinates or geocoding
    const stateCoordinates: { [key: string]: [number, number] } = {
      Lagos: [6.5244, 3.3792],
      Abuja: [9.0765, 7.4986],
      Rivers: [4.8156, 7.0498],
      Kano: [12.0022, 8.5919],
      Oyo: [7.8878, 3.947],
      Kaduna: [10.6055, 7.4389],
      Ogun: [7.1608, 3.3503],
    };

    const baseCoord = stateCoordinates[property.location.state] || [
      9.0765, 7.3986,
    ];
    // Add small random offset for multiple properties in same area
    const randomOffset = () => (Math.random() - 0.5) * 0.1;

    return [baseCoord[0] + randomOffset(), baseCoord[1] + randomOffset()];
  };

  // Generate map markers data
  const mapMarkers = properties.map((property) => ({
    ...property,
    coordinates: getPropertyCoordinates(property),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Container */}
      <div className="lg:col-span-2 bg-gray-100 rounded-xl overflow-hidden relative">
        {/* Placeholder for map - In a real implementation, use Google Maps, Mapbox, etc. */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
          <div className="text-center">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-6xl text-[#8DDB90] mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Interactive Map
            </h3>
            <p className="text-gray-600">
              Map integration would show {properties.length} properties
            </p>
          </div>
        </div>

        {/* Mock Map Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {mapMarkers.slice(0, 10).map((property, index) => (
            <div
              key={property._id}
              className="absolute pointer-events-auto"
              style={{
                left: `${20 + (index % 4) * 20}%`,
                top: `${20 + Math.floor(index / 4) * 20}%`,
              }}
            >
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProperty(property)}
                className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all ${
                  selectedProperty?._id === property._id
                    ? "bg-[#8DDB90] text-white"
                    : "bg-white text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white"
                }`}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </motion.button>

              {/* Price tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                ₦
                {(property.price || property.rentalPrice || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property List Sidebar */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Properties ({properties.length})
          </h3>
          <p className="text-sm text-gray-600">Click markers to view details</p>
        </div>

        <div className="overflow-y-auto max-h-[500px]">
          {properties.map((property) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedProperty?._id === property._id
                  ? "bg-[#8DDB90]/10 border-[#8DDB90]"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedProperty(property)}
            >
              {/* Property Image */}
              <div className="flex space-x-3 mb-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {property.title}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {property.location.area && `${property.location.area}, `}
                    {property.location.localGovernment},{" "}
                    {property.location.state}
                  </p>
                  <p className="text-lg font-bold text-[#8DDB90] mt-1">
                    ₦
                    {(
                      property.price ||
                      property.rentalPrice ||
                      0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex space-x-4">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                </div>
                <span className="capitalize">{property.propertyType}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropertySelect(property);
                  }}
                  className="flex-1 px-3 py-2 border border-[#8DDB90] text-[#8DDB90] rounded-lg hover:bg-[#8DDB90] hover:text-white transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNegotiate(property);
                  }}
                  className="flex-1 px-3 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors text-sm"
                >
                  Negotiate
                </button>
              </div>
            </motion.div>
          ))}

          {properties.length === 0 && (
            <div className="p-8 text-center">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-4xl text-gray-300 mb-4"
              />
              <p className="text-gray-500">No properties found</p>
              <p className="text-sm text-gray-400">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
