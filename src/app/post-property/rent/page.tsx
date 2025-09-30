"use client";

import React from "react";
import RentPropertyForm from "@/components/post-property-components/forms/RentPropertyForm";
import FeatureGate from "@/components/access/FeatureGate";
import { FEATURE_KEYS } from "@/hooks/useFeatureGate";

const RentPage = () => {
  return (
    <FeatureGate featureKeys={[FEATURE_KEYS.LISTINGS]}>
      <RentPropertyForm
        pageTitle="List Your Property - For Rent"
        pageDescription="Follow these simple steps to list your property for rent and connect with potential tenants"
      />
    </FeatureGate>
  );
};

export default RentPage;
