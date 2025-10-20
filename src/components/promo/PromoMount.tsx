"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BannerSlot from './BannerSlot';
import { usePromos } from '@/context/promo-context';

interface Props {
  slot: string;
  targetId?: string;
  className?: string;
  height?: string;
}

const PromoMount: React.FC<Props> = ({ slot, targetId, className, height }) => {
  const id = targetId || `promo-${slot}`;
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { getPromos } = usePromos();
  const promos = getPromos(slot);

  useEffect(() => {
    const el = document.getElementById(id);
    if (el) {
      // Remove server-rendered placeholder children to prevent stacking and overflow clipping
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
      // Hide placeholder container if no promos
      if (promos.length === 0) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    }
    setContainer(el);
  }, [id, promos.length]);

  if (!container || promos.length === 0) return null;

  return createPortal(<BannerSlot slot={slot} className={className} height={height} />, container);
};

export default PromoMount;
