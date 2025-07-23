/** @format */

import React from 'react';

export default function RentPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rent-page-layout">
      {children}
    </div>
  );
}
