import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

type LoadingComponent = () => JSX.Element;

interface DynamicImportOptions {
  ssr?: boolean;
  loading?: LoadingComponent;
  delay?: number;
}

/**
 * Default loading fallback component
 * Displays a subtle skeleton while component loads
 */
const DefaultLoading = () => (
  <div className="min-h-[400px] bg-gradient-to-b from-gray-100 to-gray-50 animate-pulse rounded-lg" />
);

/**
 * Lightweight loading spinner for small modals
 */
const ModalLoading = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

/**
 * Create a dynamically imported component with sensible defaults
 * @param loader - Function that returns a promise resolving to { default: Component }
 * @param options - Configuration for dynamic loading behavior
 * @returns A dynamically loaded React component
 */
export function createDynamicComponent<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicImportOptions = {}
) {
  return dynamic(loader, {
    ssr: options.ssr ?? false,
    loading: options.loading ?? DefaultLoading,
    // Webpack chunk name hint for better debugging
  });
}

/**
 * Create a dynamically imported modal component
 * Modals are often conditionally rendered, so they benefit from lazy loading
 */
export function createDynamicModal<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicImportOptions = {}
) {
  return dynamic(loader, {
    ssr: false,
    loading: options.loading ?? ModalLoading,
  });
}

/**
 * Pre-configured dynamic modals
 * Replace individual imports with these to enable lazy loading
 */
export const DynamicModals = {
  AdvancedLOI: createDynamicModal(
    () => import('@/components/modals/AdvancedLOIUploadModal')
  ),
  AdvancedPriceNegotiation: createDynamicModal(
    () => import('@/components/modals/AdvancedPriceNegotiationModal')
  ),
  Confirmation: createDynamicModal(
    () => import('@/components/modals/confirmation-modal')
  ),
  ContactSuccess: createDynamicModal(
    () => import('@/components/modals/ContactSuccessModal')
  ),
  GlobalLOI: createDynamicModal(
    () => import('@/components/modals/GlobalLOIUploadModal')
  ),
  GlobalPriceNegotiation: createDynamicModal(
    () => import('@/components/modals/GlobalPriceNegotiationModal')
  ),
  InspectionSuccess: createDynamicModal(
    () => import('@/components/modals/InspectionSuccessModal')
  ),
  Price: createDynamicModal(
    () => import('@/components/modals/price-modal')
  ),
  Success: createDynamicModal(
    () => import('@/components/modals/SuccessModal')
  ),
} as const;

/**
 * Pre-configured dynamic marketplace components
 */
export const DynamicMarketplace = {
  FilterModal: createDynamicComponent(
    () => import('@/components/new-marketplace/FilterModal'),
    { ssr: false }
  ),
  LocationSearch: createDynamicComponent(
    () => import('@/components/new-marketplace/search/LocationSearch'),
    { ssr: false }
  ),
  PriceRangeFilter: createDynamicComponent(
    () => import('@/components/new-marketplace/filters/PriceRangeFilter'),
    { ssr: false }
  ),
} as const;