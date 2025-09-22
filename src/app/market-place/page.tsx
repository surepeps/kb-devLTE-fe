/** @format */

"use client";
import React from "react";
import NewMarketPlace from "@/components/new-marketplace";
import BannerSlot from '@/components/promo/BannerSlot';

const NewMarketplacePage = () => {
  return (
    <>
      <div id="promo-marketplace-top" className="w-full overflow-hidden bg-transparent h-28 mb-4" />
      <PromoMount slot="marketplace-top" targetId="promo-marketplace-top" height="h-28" />
      <NewMarketPlace />
    </>
  );
};
 
export default NewMarketplacePage;
