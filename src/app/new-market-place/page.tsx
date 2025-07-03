"use client";

import React from "react";
import { MarketplaceProvider } from "@/context/marketplace-context";
import NewMarketplace from "@/components/new-marketplace";

const NewMarketplacePage = () => {
  return (
    <MarketplaceProvider>
      <NewMarketplace />
    </MarketplaceProvider>
  );
};

export default NewMarketplacePage;
