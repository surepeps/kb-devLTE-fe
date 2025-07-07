/** @format */

"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { URLS } from "@/utils/URLS";

interface Testimonial {
  _id: string;
  fullName: string;
  occupation: string;
  rating: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ClientTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URLS.BASE}/testimonials`);
      const data = await response.json();

      if (data.success && data.data) {
        setTestimonials(
          data.data.filter((t: Testimonial) => t.status === "approved"),
        );
      } else {
        // Fallback testimonials if API fails
        setTestimonials([
          {
            _id: "1",
            fullName: "Michael .A",
            occupation: "Business Owner",
            rating: 5,
            message:
              "Khabi-teq made finding my dream home so easy! The process was seamless, and the team was incredibly supportive every step of the way",
            status: "approved",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "2",
            fullName: "Tunde Ajayi",
            occupation: "Software Engineer",
            rating: 5,
            message:
              "Khabi-Teq made finding my dream home so easy! The process was seamless, and the team was incredibly supportive every step of the way",
            status: "approved",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      // Fallback testimonials on error
      setTestimonials([
        {
          _id: "1",
          fullName: "Michael .A",
          occupation: "Business Owner",
          rating: 5,
          message:
            "Khabi-teq made finding my dream home so easy! The process was seamless, and the team was incredibly supportive every step of the way",
          status: "approved",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          fullName: "Tunde Ajayi",
          occupation: "Software Engineer",
          rating: 5,
          message:
            "Khabi-Teq made finding my dream home so easy! The process was seamless, and the team was incredibly supportive every step of the way",
          status: "approved",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / testimonials.length;
      container.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / testimonials.length;
      const newIndex = Math.round(container.scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F5F7F9] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[35px] text-[#09391C] font-bold mb-4">
              What our clients are saying
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 h-32 w-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="w-full bg-[#F5F7F9] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[35px] text-[#09391C] font-bold mb-4">
              What our clients are saying
            </h2>
          </div>
          <div className="text-center">
            <p className="text-gray-500">
              No testimonials available at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F7F9] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[35px] text-[#09391C] font-bold mb-4">
            What our clients are saying
          </h2>
        </div>

        <div className="relative max-w-[1240px] mx-auto">
          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-8 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0 w-full max-w-[600px] snap-start"
                style={{ minWidth: "300px" }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    "{testimonial.message}"
                  </p>
                  <div>
                    <h3 className="text-black font-semibold text-xl">
                      {testimonial.fullName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {testimonial.occupation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#8DDB90] scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Hidden desktop navigation for touch gestures */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden md:block"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-[#09391C]" />
              </button>

              <button
                onClick={() =>
                  scrollToIndex(
                    Math.min(testimonials.length - 1, currentIndex + 1),
                  )
                }
                disabled={currentIndex === testimonials.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden md:block"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-[#09391C]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTestimonials;
