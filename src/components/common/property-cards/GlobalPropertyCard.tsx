/** @format */

"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import markerSVG from "@/svgs/marker.svg";
import randomImage from "@/assets/noImageAvailable.png";
import ImageSwiper from "@/components/new-marketplace/ImageSwiper";

interface GlobalPropertyCardProps {
  tab: "buy" | "rent" | "shortlet";
  property: any;
  cardData: { header: string; value: string }[];
  images: any[];
  isPremium: boolean;
  onPropertyClick?: () => void;
  className?: string;
}

const GlobalPropertyCard: React.FC<GlobalPropertyCardProps> = ({
  tab,
  property,
  cardData,
  images,
  isPremium,
  onPropertyClick,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      className={`w-full max-w-[320px] sm:max-w-[280px] md:w-[280px] lg:w-[285px] xl:w-[280px] h-auto min-h-[300px] sm:min-h-[280px] rounded-md shrink-0 bg-white border-[1px] p-3 gap-[10px] transition-all duration-500 hover:shadow-lg flex flex-col mx-auto ${className}`}
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
                  <h2 key={idx} className="text-lg font-semibold text-[#000000]">
                    {item.value}
                  </h2>
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
          <div className="flex justify-between items-center mt-auto">
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

            {onPropertyClick && (
              <button
                type="button"
                onClick={onPropertyClick}
                className="text-xs font-semibold text-[#0B423D] underline flex-shrink-0 ml-2"
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalPropertyCard;
