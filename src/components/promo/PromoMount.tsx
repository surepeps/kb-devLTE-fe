"use client";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import BannerSlot from './BannerSlot';

interface Props {
  slot: string;
  targetId?: string;
  className?: string;
  height?: string;
}

const PromoMount: React.FC<Props> = ({ slot, targetId, className, height }) => {
  const id = targetId || `promo-${slot}`;

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    // If there's already something mounted, skip
    // Create a root and mount BannerSlot into the element
    const root = ReactDOM.createRoot(el);
    root.render(<BannerSlot slot={slot} className={className} height={height} />);
    return () => {
      try {
        root.unmount();
      } catch (e) {
        // ignore
      }
    };
  }, [id, slot, className, height]);

  return null;
};

export default PromoMount;
