/** @format */

"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { usePageContext } from "@/context/page-context";
import randomImage from "@/assets/ChatGPT Image Apr 11, 2025, 12_48_47 PM.png";
import CloudinaryImage from "@/components/general-components/CloudinaryImage";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ImageSwiperProps {
  images: any[];
}

const getValidImageUrl = (url: any): string => {
  if (!url) return randomImage.src;
  if (typeof url === "string") {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("www.")) return `https://${url}`;
    if (url.startsWith("/")) return url;
    return randomImage.src;
  }
  // If it's a StaticImport (local import), try to get src property
  if (typeof url === "object" && url.src) {
    return url.src;
  }
  // Fallback to random image if we can't determine the URL
  return randomImage.src;
};

const ImageSwiper: React.FC<ImageSwiperProps> = ({ images }) => {
  const swiperRef = React.useRef<any>(null);
  const { setViewImage, setImageData } = usePageContext();

  // Handle both images array and pictures array from API
  let imageArray = images;
  if (!imageArray || imageArray.length === 0) {
    // Check if the first item has a pictures property (API data structure)
    if (images && images[0] && images[0].pictures) {
      imageArray = images[0].pictures;
    }
  }

  const validImages =
    imageArray && imageArray.length > 0 ? imageArray : [randomImage];

  return (
    <div className="w-full h-full absolute">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={3}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full h-[148px] cursor-pointer"
      >
        {validImages.map((src, i) => {
          const validImageUrl = getValidImageUrl(src);
          return (
            <SwiperSlide
              onClick={() => {
                setImageData(validImages);
                setViewImage(true);
              }}
              key={i}
            >
              <CloudinaryImage
                width={1000}
                height={1000}
                src={validImageUrl}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                fallbackSrc={randomImage.src}
                priority={i === 0} // Only first image is priority
                timeout={8000} // 8 second timeout
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ImageSwiper;
