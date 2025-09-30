"use client";

import React from "react";
import JointVenturePropertyForm from "@/components/post-property-components/forms/JointVenturePropertyForm";
import FeatureGate from "@/components/access/FeatureGate";
import { FEATURE_KEYS } from "@/hooks/useFeatureGate";

const JointVenturePage = () => {
  return (
    <FeatureGate featureKeys={[FEATURE_KEYS.LISTINGS]}>
      <JointVenturePropertyForm
        pageTitle="List Your Property - Joint Venture"
        pageDescription="Follow these simple steps to list your property for joint venture partnerships and connect with potential investors"
      />
    </FeatureGate>
  );
};

export default JointVenturePage;
