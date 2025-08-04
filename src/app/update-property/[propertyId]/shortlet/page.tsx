"use client";

import React from "react";
import SharedUpdatePropertyForm from "@/components/post-property-components/SharedUpdatePropertyForm";

const UpdateShortletPage = () => {
  return (
    <SharedUpdatePropertyForm
      propertyType="shortlet"
      pageTitle="Update Property - Shortlet"
      pageDescription="Update your property information to keep your listing current and attractive to potential guests"
    />
  );
};

export default UpdateShortletPage;
