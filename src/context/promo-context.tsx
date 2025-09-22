"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PROMOTIONS, Promotion } from "@/data/promotions";
import { usePathname } from "next/navigation";

type PromoContextValue = {
  promos: Promotion[];
  getPromos: (slot: string) => Promotion[];
  setPromos: (items: Promotion[]) => void;
};

const PromoContext = createContext<PromoContextValue | null>(null);

export const PromoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Initial load: use local data. In future this can be replaced with an API call.
    setPromos(PROMOTIONS);
  }, []);

  const getPromos = (slot: string) => {
    const p = promos
      .filter((pr) => pr.active !== false && pr.slot === slot)
      .filter((pr) => !pr.pages || pr.pages.length === 0 || pr.pages.includes(pathname || "/"))
      .sort((a, b) => (b.weight || 0) - (a.weight || 0));
    return p;
  };

  return <PromoContext.Provider value={{ promos, getPromos, setPromos }}>{children}</PromoContext.Provider>;
};

export const usePromos = () => {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error("usePromos must be used within a PromoProvider");
  return ctx;
};
