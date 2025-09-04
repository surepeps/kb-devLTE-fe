/** @format */

export interface AgentSubscription {
  _id: string;
  agentId: string;
  subscriptionType: 'monthly' | 'quarterly' | 'yearly'; // Updated to match new plans
  duration: 1 | 3 | 12; // in months - simplified to match new plans
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  amount: number;
  features: string[];
  transactionReference?: string;
  paymentDetails?: {
    reference: string;
    gateway: string;
    status: string;
    paidAt: string;
  };
  // New fields for agent verification integration
  isVerificationSubscription?: boolean; // Indicates this is from agent upgrade
  agentVerificationData?: {
    kycCompleted: boolean;
    profileCompleted: boolean;
    inspectionFeeSet: boolean;
    publicProfileUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  type: 'monthly' | 'quarterly' | 'yearly'; // Updated to match new plans
  name: string;
  description: string;
  features: string[];
  prices: {
    [key: number]: number; // duration in months -> price
  };
  popular?: boolean;
  // New fields for agent verification
  discount?: number; // percentage discount
  savings?: number; // amount saved
  originalPrice?: number; // price before discount
}

export interface SubscriptionTransaction {
  _id: string;
  reference: string;
  agentId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionType: 'subscription' | 'renewal';
  paymentMode: 'card' | 'bank_transfer';
  platform: 'web' | 'mobile';
  paymentDetails?: {
    authorization_url?: string;
    access_code?: string;
    gateway_response?: string;
    paid_at?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CreateSubscriptionPayload {
  subscriptionType: 'basic' | 'premium' | 'corporate';
  duration: number;
  amount: number;
}

export interface RenewSubscriptionPayload {
  subscriptionId: string;
  duration: number;
  amount: number;
}
