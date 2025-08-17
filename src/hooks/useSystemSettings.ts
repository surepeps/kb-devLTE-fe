/** @format */

import { useState, useEffect } from 'react';
import { 
  getSystemSettings, 
  getSubscriptionSettings, 
  getHomePageSettings, 
  getDocumentVerificationSettings, 
  getInspectionSettings 
} from '@/services/systemSettingsService';
import { 
  SystemSettingsCategory, 
  SubscriptionSettings, 
  HomePageSettings, 
  DocumentVerificationSettings, 
  InspectionSettings 
} from '@/types/system-settings';

interface UseSystemSettingsReturn<T> {
  settings: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching system settings by category
 */
export const useSystemSettings = <T>(
  category?: SystemSettingsCategory
): UseSystemSettingsReturn<T> => {
  const [settings, setSettings] = useState<T>({} as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      let result: any = {};

      switch (category) {
        case 'subscription':
          result = await getSubscriptionSettings();
          break;
        case 'home-page':
          result = await getHomePageSettings();
          break;
        case 'document-verification':
          result = await getDocumentVerificationSettings();
          break;
        case 'continue-inspection':
          result = await getInspectionSettings();
          break;
        default:
          const response = await getSystemSettings();
          result = response.data || [];
          break;
      }

      setSettings(result);
    } catch (err) {
      console.error(`Error fetching ${category || 'all'} settings:`, err);
      setError(`Failed to load ${category || 'system'} settings`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [category]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };
};

/**
 * Specialized hooks for specific settings categories
 */
export const useSubscriptionSettings = (): UseSystemSettingsReturn<SubscriptionSettings> => {
  return useSystemSettings<SubscriptionSettings>('subscription');
};

export const useHomePageSettings = (): UseSystemSettingsReturn<HomePageSettings> => {
  return useSystemSettings<HomePageSettings>('home-page');
};

export const useDocumentVerificationSettings = (): UseSystemSettingsReturn<DocumentVerificationSettings> => {
  return useSystemSettings<DocumentVerificationSettings>('document-verification');
};

export const useInspectionSettings = (): UseSystemSettingsReturn<InspectionSettings> => {
  return useSystemSettings<InspectionSettings>('continue-inspection');
};
