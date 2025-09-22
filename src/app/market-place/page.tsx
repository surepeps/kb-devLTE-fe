/** @format */

"use client";
import React from "react";
import NewMarketPlace from "@/components/new-marketplace";
import BannerSlot from '@/components/promo/BannerSlot';

const NewMarketplacePage = () => {
  return (
    <>
      {typeof window !== 'undefined' && (
        <React.Suspense fallback={null}>
          {React.createElement(require('@/components/promo/BannerSlot').default, { slot: 'marketplace-top', className: 'mb-4', height: 'h-28' })}
        </React.Suspense>
      )}
      <NewMarketPlace />
    </>
  );
};
 
export default NewMarketplacePage;
