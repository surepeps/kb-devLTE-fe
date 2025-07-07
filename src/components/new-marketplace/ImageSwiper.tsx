/** @format */

"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { usePageContext } from "@/context/page-context";
import randomImage from "@/assets/ChatGPT Image Apr 11, 2025, 12_48_47 PM.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ImageSwiperProps {
  images: any[];
}

const getValidImageUrl = (url: any) => {
  if (!url) return randomImage.src;
  if (typeof url === "string") {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("www.")) return `https://${url}`;
    if (url.startsWith("/")) return url;
    return randomImage.src;
  }
  // If it's a StaticImport (local import), return as is
  return url;
};

const ImageSwiper: React.FC<ImageSwiperProps> = ({ images }) => {
  const swiperRef = React.useRef<any>(null);
  const { setViewImage, setImageData } = usePageContext();

  const validImages = images && images.length > 0 ? images : [randomImage];

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
              <Image
                width={1000}
                height={1000}
                src={validImageUrl}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = randomImage.src;
                }}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ImageSwiper;
