"use client";

import MarketPlace from "@/components/marketplace";
import { MarketplaceProvider } from "@/context/marketplace-context";
import React from "react";

const MarketplacePage = () => {
  return (
    <MarketplaceProvider>
      <MarketPlace />
    </MarketplaceProvider>
  );
};

export default MarketplacePage;
