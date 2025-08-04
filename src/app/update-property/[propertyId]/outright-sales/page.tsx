"use client";

import React from "react";
import SharedUpdatePropertyForm from "@/components/post-property-components/SharedUpdatePropertyForm";

const UpdateOutrightSalesPage = () => {
  return (
    <SharedUpdatePropertyForm
      propertyType="sell"
      pageTitle="Update Property - Outright Sales"
      pageDescription="Update your property information to keep your listing current and attractive to potential buyers"
    />
  );
};

export default UpdateOutrightSalesPage;
