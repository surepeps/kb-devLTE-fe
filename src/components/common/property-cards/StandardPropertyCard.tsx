/** @format */

"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react";
import markerSVG from "@/svgs/marker.svg";
import randomImage from "@/assets/noImageAvailable.png";
import ImageSwiper from "../../new-marketplace/ImageSwiper";
import Button from "../../general-components/button";

export interface StandardPropertyCardProps {
  property: any;
  cardData: { header: string; value: string }[];
  images: any[];
  isPremium: boolean;
  onPropertyClick: () => void;
  onInspectionToggle: () => void;
  onPriceNegotiation: () => void;
  onRemoveNegotiation: (propertyId: string) => void;
  isSelected: boolean;
  negotiatedPrice?: {
    propertyId: string;
    originalPrice: number;
    negotiatedPrice: number;
  } | null;
  // Optional props for customization
  showPriceNegotiation?: boolean;
  showInspectionToggle?: boolean;
  className?: string;
  maxSelections?: number;
  currentSelections?: number;
}

const StandardPropertyCard: React.FC<StandardPropertyCardProps> = ({
  property,
  cardData,
  images,
  isPremium,
  onPropertyClick,
  onInspectionToggle,
  onPriceNegotiation,
  onRemoveNegotiation,
  isSelected,
  negotiatedPrice,
  showPriceNegotiation = true,
  showInspectionToggle = true,
  className = "",
  maxSelections = 2,
  currentSelections = 0,
}) => {
  const hasNegotiatedPrice = negotiatedPrice != null && negotiatedPrice !== undefined;
  const canSelectMore = currentSelections < maxSelections;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      className={`w-full max-w-[320px] sm:max-w-[280px] md:w-[280px] lg:w-[285px] xl:w-[280px] h-auto min-h-[420px] sm:min-h-[400px] rounded-md shrink-0 bg-white border-[1px] p-3 gap-[10px] transition-all duration-500 hover:shadow-lg flex flex-col mx-auto ${className}`}
    >
      <div className="flex flex-col gap-[5px] w-full flex-grow">
        {/* Image Section */}
        <div className="w-full h-[148px] bg-gray-200 relative">
          {/* Premium Badge */}
          {isPremium && (
            <div className="w-[88px] z-10 h-[28px] py-[8px] px-[6px] text-white flex gap-x-1 items-center bg-[#FF3D00] absolute rounded-br-md">
              <span className="text-sm">Premium</span>
              <FontAwesomeIcon icon={faStar} size="xs" />
            </div>
          )}
          <ImageSwiper
            images={Array.isArray(images) ? images : [randomImage]}
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-[6px] flex-grow">
          {/* Property Type */}
          <div className="flex gap-[7px]">
            {cardData.map((item, idx) => {
              if (item.header === "Property Type") {
                return (
                  <div
                    key={idx}
                    className="min-w-fit h-[26px] px-[6px] flex items-center rounded-[3px] bg-[#E4EFE7] text-xs text-[#000000]"
                  >
                    {item.value}
                  </div>
                );
              }
            })}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {cardData.map((item, idx) => {
              if (item.header === "Price") {
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {hasNegotiatedPrice ? (
                      <div className="flex items-center gap-2">
                        <h2 className="text-md font-semibold text-[#8DDB90]">
                          ₦
                          {Number(
                            negotiatedPrice!.negotiatedPrice,
                          ).toLocaleString()}
                        </h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveNegotiation(property._id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Clear negotiated price"
                        >
                          <X size={16} className="text-[#5A5D63]" />
                        </button>
                        <span className="text-sm text-[#5A5D63] line-through">
                          {item.value}
                        </span>
                      </div>
                    ) : (
                      <h2 className="text-lg font-semibold text-[#000000]">
                        {item.value}
                      </h2>
                    )}
                  </div>
                );
              }
            })}
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="flex gap-[9px]">
            {cardData.map((item, idx) => {
              if (item.header === "Bedrooms") {
                return (
                  <h2 key={idx} className="text-xs font-normal text-[#000000]">
                    {item.value} Bedrooms
                  </h2>
                );
              }

              if (item.header === "Bathrooms") {
                return (
                  <h2 key={idx} className="text-xs font-normal text-[#000000]">
                    {item.value} Bathrooms
                  </h2>
                );
              }
            })}
          </div>

          {/* Location and View Details */}
          <div className="flex justify-between items-center">
            <div className="flex gap-[5px] flex-1 min-w-0">
              <Image
                src={markerSVG}
                width={16}
                height={16}
                alt="marker"
                className="w-[16px] h-[16px] flex-shrink-0"
              />
              {cardData.map((item, idx) => {
                if (item.header === "Location") {
                  return (
                    <h2
                      key={idx}
                      className="text-xs font-normal text-[#000000] truncate"
                    >
                      {item.value}
                    </h2>
                  );
                }
              })}
            </div>

            <button
              type="button"
              onClick={onPropertyClick}
              className="text-xs font-semibold text-[#0B423D] underline flex-shrink-0 ml-2"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto pt-4">
          {/* Price Negotiation Button */}
          {showPriceNegotiation && (
            <>
              {hasNegotiatedPrice ? (
                <div className="min-h-[50px] py-[12px] px-[24px] bg-[#8DDB90] text-[#FFFFFF] text-base leading-[25.6px] font-bold flex items-center justify-between rounded">
                  <span className="text-xs">
                    New Offer: ₦
                    {Number(negotiatedPrice!.negotiatedPrice).toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveNegotiation(property._id);
                    }}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors ml-2"
                    title="Clear negotiated price"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <Button
                  value="Price Negotiation"
                  type="button"
                  onClick={onPriceNegotiation}
                  className="min-h-[50px] py-[12px] px-[24px] bg-[#1976D2] text-[#FFFFFF] text-base leading-[25.6px] font-bold hover:bg-[#1565C0] transition-colors"
                />
              )}
            </>
          )}

          {/* Select for Inspection Button */}
          {showInspectionToggle && (
            <button
              onClick={onInspectionToggle}
              disabled={!isSelected && !canSelectMore}
              className={`min-h-[50px] py-[12px] px-[24px] ${
                isSelected
                  ? "bg-[#09391C] hover:bg-[#0B423D] cursor-pointer"
                  : canSelectMore
                  ? "bg-[#8DDB90] hover:bg-[#76c77a]"
                  : "bg-gray-400 cursor-not-allowed"
              } text-[#FFFFFF] text-base leading-[25.6px] font-bold flex items-center justify-center gap-2 transition-colors rounded`}
              type="button"
            >
              {isSelected ? (
                <>
                  <span>Selected</span>
                  <X size={16} className="text-white" />
                </>
              ) : !canSelectMore ? (
                "Max Selection Reached"
              ) : (
                "Select for Inspection"
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StandardPropertyCard;
