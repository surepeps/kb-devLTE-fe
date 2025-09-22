"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePromos } from "@/context/promo-context";
import Link from "next/link";

interface Props {
  slot: string;
  className?: string;
  height?: string; // tailwind height (eg 'h-16', 'h-24')
  autoRotate?: boolean;
  rotateIntervalMs?: number;
}

const BannerSlot: React.FC<Props> = ({ slot, className, height = "h-20", autoRotate = true, rotateIntervalMs = 5000 }) => {
  const { getPromos } = usePromos();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const promos = useMemo(() => getPromos(slot), [getPromos, slot, pathname]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slot, pathname, promos.length]);

  useEffect(() => {
    if (!autoRotate || promos.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % Math.max(1, promos.length)), rotateIntervalMs);
    return () => clearInterval(t);
  }, [autoRotate, promos.length, rotateIntervalMs]);

  if (!promos || promos.length === 0) return null;

  const active = promos[index % promos.length];

  return (
    <div className={`w-full overflow-hidden bg-transparent ${className || ""}`}>
      <div className={`container mx-auto px-4 ${height}`}>
        {active.link ? (
          <Link href={active.link} className="block w-full h-full">
            <img src={active.imageUrl} alt={`promo-${active.id}`} className="w-full h-full object-contain" />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src={active.imageUrl} alt={`promo-${active.id}`} className="w-full h-full object-contain" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerSlot;
