/** @format */

"use client";
import React from "react";
import { NewMarketplaceProvider } from "@/context/new-marketplace-context";
import NewMarketPlace from "@/components/new-marketplace";

const NewMarketplacePage = () => {
  return (
    <NewMarketplaceProvider>
      <NewMarketPlace />
    </NewMarketplaceProvider>
  );
};
 
export default NewMarketplacePage;
