"use client";

import NewMarketPlace from "@/components/new-marketplace";
import { MarketplaceProvider } from "@/context/marketplace-context";
import React from "react";

const MarketplacePage = () => {
  return (
    <MarketplaceProvider>
      <NewMarketPlace />
    </MarketplaceProvider>
  );
};

export default MarketplacePage;
