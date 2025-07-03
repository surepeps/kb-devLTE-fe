"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MarketplacePage = () => {
  const router = useRouter();

  const marketplaceOptions = [
    {
      title: "Buy a Property",
      description:
        "Browse properties available for purchase. Find your perfect investment or dream home.",
      icon: "🏠",
      route: "/market-place/buy-a-property",
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      textColor: "text-blue-600",
    },
    {
      title: "Joint Venture",
      description:
        "Explore joint venture opportunities. Partner with property owners for mutual growth.",
      icon: "🤝",
      route: "/market-place/jv",
      color: "bg-green-50 border-green-200 hover:border-green-400",
      textColor: "text-green-600",
    },
    {
      title: "Rent/Lease",
      description:
        "Find rental properties and lease opportunities across different locations.",
      icon: "🏘️",
      route: "/market-place/rent",
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <nav className="text-sm text-[#5A5D63] mb-4">
            <button
              onClick={() => router.push("/")}
              className="hover:text-[#09391C]"
            >
              Home
            </button>
            <span className="mx-2">›</span>
            <span className="text-[#09391C] font-medium">Marketplace</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-[#09391C] font-display mb-4">
            Welcome to <span className="text-[#8DDB90]">Khabiteq Realty</span>{" "}
            Marketplace
          </h1>
          <p className="text-lg md:text-xl text-[#5A5D63] max-w-3xl mx-auto">
            Whether you're buying, selling, renting, or investing (JV), how can
            we assist you?
          </p>
        </div>

        {/* Marketplace Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-8">
          {marketplaceOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${option.color} border-2 rounded-xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg`}
              onClick={() => router.push(option.route)}
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-4">{option.icon}</div>
                <h3
                  className={`text-xl md:text-2xl font-bold font-display mb-3 ${option.textColor}`}
                >
                  {option.title}
                </h3>
                <p className="text-sm md:text-base text-[#5A5D63] leading-relaxed">
                  {option.description}
                </p>
                <div
                  className={`mt-4 inline-flex items-center ${option.textColor} font-medium`}
                >
                  Explore
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-semibold text-[#09391C] mb-2">
            Didn't find a match for your search?
          </h3>
          <p className="text-[#5A5D63] mb-4">
            Share your preferences and let us help you find the perfect property
          </p>
          <button
            onClick={() => router.push("/preference")}
            className="bg-[#09391C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0a4a20] transition-colors"
          >
            Share Your Preference
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
