"use client";

import useEmblaCarousel from "embla-carousel-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function ActivitiesScroll() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  return (
    <div className="relative w-full py-8 px-20  bg-white rounded-lg shadow-md">
      {/* Carousel Wrapper */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="min-w-[350px] h-40 bg-gray-50  rounded-lg p-4 shadow-sm cursor-pointer"
            >
              <div className="flex justify-between text-[#7C88B1] text-sm">
                <p>Admin Attendant</p>
                <p className="text-[#414357]">Topic</p>
              </div>
              <div className="flex justify-between items-center border-b-2 pb-2">
                <h3 className="font-medium text-[#25324B]">Hope Tope</h3>
                <p className="text-red-500 cursor-pointer">
                  Deactivate Account
                </p>
              </div>
              <p className="text-gray-700 text-sm mt-2">
                James Joseph Bond account has been deactivated because he&apos;s a...
                <span className="text-blue-500 cursor-pointer"> view more</span>
              </p>
              <p className="flex text-xs justify-end text-gray-400 mt-2">
                Date: Thu, Nov 4, 2021 9:56 AM
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2">
        <div
          className="bg-white border rounded-full shadow-md px-5 py-4 cursor-pointer hover:bg-[#8DDB90] text-gray-600 hover:text-white"
          onClick={() => emblaApi && emblaApi.scrollPrev()}
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 ">
        <div
          className="bg-white border rounded-full shadow-md p-3 cursor-pointer px-5 py-4 hover:bg-[#8DDB90] text-gray-600 hover:text-white"
          onClick={() => emblaApi && emblaApi.scrollNext()}
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </div>
      </div>
    </div>
  );
}
