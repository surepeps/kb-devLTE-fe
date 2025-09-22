/** @format */

"use client";
import React from "react";
import NewMarketPlace from "@/components/new-marketplace";
import BannerSlot from '@/components/promo/BannerSlot';

const NewMarketplacePage = () => {
  return (
    <>
      <BannerSlot slot="marketplace-top" className="mb-4" height="h-28" />
      <NewMarketPlace />
    </>
  );
};
 
export default NewMarketplacePage;
