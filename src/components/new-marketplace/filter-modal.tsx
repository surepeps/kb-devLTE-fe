"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFilter, faCheck } from "@fortawesome/free-solid-svg-icons";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onApply: (filters: any) => void;
}

const propertyFeatures = [
  "Swimming Pool",
  "Gym",
  "Security",
  "Parking",
  "Garden",
  "Balcony",
  "Air Conditioning",
  "Furnished",
  "WiFi",
  "Generator",
  "Elevator",
  "CCTV",
  "Gated Community",
  "Playground",
  "Shopping Center",
];

const amenities = [
  "Hospital Nearby",
  "School Nearby",
  "Shopping Mall",
  "Public Transport",
  "Restaurant",
  "Bank",
  "Pharmacy",
  "Gas Station",
  "Airport Access",
  "Beach Access",
  "Golf Course",
  "Park",
  "Library",
  "University",
];

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = localFilters.features || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f: string) => f !== feature)
      : [...currentFeatures, feature];

    setLocalFilters({
      ...localFilters,
      features: updatedFeatures,
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = localFilters.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];

    setLocalFilters({
      ...localFilters,
      amenities: updatedAmenities,
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      ...localFilters,
      features: [],
      amenities: [],
      bedrooms: undefined,
      bathrooms: undefined,
    };
    setLocalFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8DDB90] to-[#6BC46D] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FontAwesomeIcon icon={faClose} className="text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faFilter} className="text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">Advanced Filters</h2>
                <p className="text-white/90">Customize your property search</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Property Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Property Specifications
                </h3>

                {/* Bedrooms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Bedrooms
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          setLocalFilters({ ...localFilters, bedrooms: num })
                        }
                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                          localFilters.bedrooms === num
                            ? "border-[#8DDB90] bg-[#8DDB90] text-white"
                            : "border-gray-200 hover:border-[#8DDB90] text-gray-700"
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Bathrooms
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          setLocalFilters({ ...localFilters, bathrooms: num })
                        }
                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                          localFilters.bathrooms === num
                            ? "border-[#8DDB90] bg-[#8DDB90] text-white"
                            : "border-gray-200 hover:border-[#8DDB90] text-gray-700"
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Property Features
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {propertyFeatures.map((feature) => (
                      <button
                        key={feature}
                        onClick={() => handleFeatureToggle(feature)}
                        className={`p-2 text-left text-sm border rounded-lg transition-colors ${
                          localFilters.features?.includes(feature)
                            ? "border-[#8DDB90] bg-[#8DDB90] text-white"
                            : "border-gray-200 hover:border-[#8DDB90] text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{feature}</span>
                          {localFilters.features?.includes(feature) && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-xs"
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities & Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Nearby Amenities
                </h3>

                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-2 text-left text-sm border rounded-lg transition-colors ${
                        localFilters.amenities?.includes(amenity)
                          ? "border-[#8DDB90] bg-[#8DDB90] text-white"
                          : "border-gray-200 hover:border-[#8DDB90] text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{amenity}</span>
                        {localFilters.amenities?.includes(amenity) && (
                          <FontAwesomeIcon icon={faCheck} className="text-xs" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Additional Options */}
                <div className="mt-6 space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localFilters.negotiable || false}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          negotiable: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                    />
                    <span className="text-sm text-gray-700">
                      Negotiable prices only
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localFilters.featured || false}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                    />
                    <span className="text-sm text-gray-700">
                      Featured properties only
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localFilters.newListings || false}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          newListings: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                    />
                    <span className="text-sm text-gray-700">
                      New listings (last 7 days)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset All Filters
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors font-medium"
              >
                Apply Filters
                {(localFilters.features?.length > 0 ||
                  localFilters.amenities?.length > 0) && (
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                    {(localFilters.features?.length || 0) +
                      (localFilters.amenities?.length || 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FilterModal;
