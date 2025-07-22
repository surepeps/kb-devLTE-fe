/** @format */

// Export all property card components
export { default as StandardPropertyCard } from './StandardPropertyCard';
export type { StandardPropertyCardProps } from './StandardPropertyCard';

export { default as JVPropertyCard } from './JVPropertyCard';
export type { JVPropertyCardProps } from './JVPropertyCard';

export { default as UniversalPropertyCard, createPropertyCardData } from './UniversalPropertyCard';
export type { UniversalPropertyCardProps } from './UniversalPropertyCard';

// Re-export for backward compatibility
export { default as PropertyCard } from './UniversalPropertyCard';
