// Subscription Types

export type PlanType = 'free' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  searches: {
    daily: number;    // -1 = unlimited
    monthly: number;  // -1 = unlimited
  };
  enrichments: {
    daily: number;
    monthly: number;
  };
  exports: {
    monthly: number;       // -1 = unlimited
    maxPerExport: number;  // -1 = unlimited
  };
}

export interface PlanFeatures {
  googleMaps: boolean;
  geminiAI: boolean;
  socialMedia: string[];  // ['facebook', 'instagram', 'linkedin', 'twitter']
  emailPrediction: boolean;
  emailVerification: boolean;
  advancedFilters: boolean;
  bulkOperations: boolean;
  bulkLimit: number;      // max leads for bulk operations
  apiAccess: boolean;
  apiCallsPerDay: number;
  teamSeats: number;
  exportFormats: string[]; // ['xlsx', 'csv', 'json']
  searchHistory: number;   // days, -1 = unlimited
  leadTags: number;        // max tags, -1 = unlimited
  dataRetention: number;   // days
  support: 'community' | 'email' | 'priority' | 'dedicated';
}

export interface Plan {
  id: PlanType;
  name: string;
  price: number;          // monthly price in USD
  description: string;
  limits: PlanLimits;
  features: PlanFeatures;
  highlighted?: boolean;  // highlight as "Most Popular"
}

export interface UsageHistory {
  timestamp: number;
  action: 'search' | 'enrichment' | 'export';
  details?: any;
}

export interface UsageStats {
  userId: string;
  plan: PlanType;
  period: {
    start: number;  // timestamp
    end: number;    // timestamp (monthly reset)
  };
  usage: {
    searches: {
      count: number;
      history: Array<{ timestamp: number; query: string; resultCount: number }>;
    };
    enrichments: {
      count: number;
      history: Array<{ timestamp: number; leadId: string }>;
    };
    exports: {
      count: number;
      totalLeads: number;
      history: Array<{ timestamp: number; leadCount: number; format: string }>;
    };
  };
  limits: PlanLimits;
}

export interface UsageCheck {
  allowed: boolean;
  reason?: string;
  remaining?: number;
  percentage?: number;
}

export interface Subscription {
  userId: string;
  plan: PlanType;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: number;
  endDate?: number;
  autoRenew: boolean;
  paymentMethod?: string;
}

