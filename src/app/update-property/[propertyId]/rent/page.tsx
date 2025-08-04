"use client";

import React from "react";
import SharedUpdatePropertyForm from "@/components/post-property-components/SharedUpdatePropertyForm";

const UpdateRentPage = () => {
  return (
    <SharedUpdatePropertyForm
      propertyType="rent"
      pageTitle="Update Property - For Rent"
      pageDescription="Update your property information to keep your listing current and attractive to potential tenants"
    />
  );
};

export default UpdateRentPage;
