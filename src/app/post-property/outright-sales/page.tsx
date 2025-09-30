"use client";

import React from "react";
import OutrightSalesPropertyForm from "@/components/post-property-components/forms/OutrightSalesPropertyForm";
import FeatureGate from "@/components/access/FeatureGate";
import { FEATURE_KEYS } from "@/hooks/useFeatureGate";

const OutrightSalesPage = () => {
  return (
    <FeatureGate featureKeys={[FEATURE_KEYS.LISTINGS]}>
      <OutrightSalesPropertyForm
        pageTitle="List Your Property - Outright Sales"
        pageDescription="Follow these simple steps to list your property for outright sales and connect with potential buyers"
      />
    </FeatureGate>
  );
};
 
export default OutrightSalesPage;
