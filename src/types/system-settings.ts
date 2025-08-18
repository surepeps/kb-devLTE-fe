/** @format */

export interface SystemSetting {
  _id: string;
  key: string;
  value: string | number | boolean;
  description: string;
  category: 'home-page' | 'subscription' | 'document-verification' | 'continue-inspection';
  isEditable: boolean;
  status: 'active' | 'inactive';
}

export interface SystemSettingsApiResponse {
  success: boolean;
  message: string;
  data: SystemSetting[];
}

export interface SubscriptionSettings {
  monthly_fee?: number;
  quarterly_fee?: number;
  yearly_fee?: number;
  features?: string;
  auto_renew?: boolean;
  free_trial_days?: number;
  free_trial_status?: string;
}

export interface HomePageSettings {
  hero_video_url?: string;
  document_verification_video_url?: string;
  submit_preference_video_url?: string;
  agent_marketplace_video_url?: string;
  subscription_plan_video_url?: string;
  post_property_video_url?: string;
}

export interface DocumentVerificationSettings {
  verification_price?: number;
  multi_document_price?: number;
  // Individual document prices
  'certificate-of-occupancy'?: number;
  'deed-of-partition'?: number;
  'deed-of-assignment'?: number;
  'governors-consent'?: number;
  'survey-plan'?: number;
  'deed-of-lease'?: number;
}

export interface InspectionSettings {
  inspection_base_fee?: number;
  inspection_different_lga_fee?: number;
  max_counter_counts?: number;
}

export type SystemSettingsCategory = 'home-page' | 'subscription' | 'document-verification' | 'continue-inspection';
