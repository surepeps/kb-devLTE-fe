/** @format */

"use client";
import React from "react";
import ReviewingApplication from "@/components/general-components/applicationUnderReview";
import AgentNav from "@/components/agent-page-components/agent_navbar";

const page = () => {
  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#09391C] font-display mb-2">
            Application Under Review
          </h1>
          <p className="text-[#5A5D63]">
            Your agent application is being reviewed by our team
          </p>
        </div>

        {/* Navigation and Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <AgentNav isDisabled={true} />
          <div className="p-8">
            <ReviewingApplication />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
