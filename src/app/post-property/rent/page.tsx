"use client";

import React from "react";
import SharedPostPropertyForm from "@/components/post-property-components/SharedPostPropertyForm";

const RentPage = () => {
  return (
    <SharedPostPropertyForm
      propertyType="rent"
      pageTitle="List Your Property - For Rent"
      pageDescription="Follow these simple steps to list your property for rent and connect with potential tenants"
    />
  );
};

export default RentPage;
