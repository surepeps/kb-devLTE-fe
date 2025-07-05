/** @format */

"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  propertyType: string;
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  propertyType,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = images && images.length > 0;
  const hasMultipleImages = hasImages && images.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1,
      );
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }
  };

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  if (!hasImages) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8DDB90]/20 to-[#09391C]/20">
          <div className="text-center">
            <Building size={32} className="mx-auto text-[#09391C]/60 mb-2" />
            <span className="text-[#09391C] text-sm font-medium">
              {propertyType}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt={`${propertyType} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Navigation Arrows - Only show if multiple images */}
      {hasMultipleImages && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
            type="button"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if multiple images */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
