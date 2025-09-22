"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BannerSlot from './BannerSlot';

interface Props {
  slot: string;
  targetId?: string;
  className?: string;
  height?: string;
}

const PromoMount: React.FC<Props> = ({ slot, targetId, className, height }) => {
  const id = targetId || `promo-${slot}`;
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById(id);
    setContainer(el);
  }, [id]);

  if (!container) return null;

  return createPortal(<BannerSlot slot={slot} className={className} height={height} />, container);
};

export default PromoMount;
