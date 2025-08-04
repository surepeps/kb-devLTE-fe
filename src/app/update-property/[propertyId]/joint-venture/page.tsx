"use client";

import React from "react";
import SharedUpdatePropertyForm from "@/components/post-property-components/SharedUpdatePropertyForm";

const UpdateJointVenturePage = () => {
  return (
    <SharedUpdatePropertyForm
      propertyType="jv"
      pageTitle="Update Property - Joint Venture"
      pageDescription="Update your property information to keep your listing current and attractive to potential investment partners"
    />
  );
};

export default UpdateJointVenturePage;
