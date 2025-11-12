import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanType, UsageStats, UsageCheck } from '../types/subscription';
import { usageManager } from '../services/usageManager';
import { PLANS } from '../constants/plans';

interface SubscriptionContextType {
  plan: PlanType;
  usage: UsageStats;
  canPerformAction: (action: 'search' | 'enrichment' | 'export', params?: any) => UsageCheck;
  recordAction: (action: 'search' | 'enrichment' | 'export', params?: any) => void;
  upgradePlan: (newPlan: PlanType) => void;
  hasFeature: (feature: string) => boolean;
  getFeatureValue: (feature: string) => any;
  getRemainingQuota: () => any;
  getUsagePercentage: () => { searches: number; enrichments: number; exports: number };
  refreshUsage: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize directly with usageManager (safe defaults built-in)
  const [plan, setPlan] = useState<PlanType>(() => {
    try {
      return usageManager.getUserPlan();
    } catch (error) {
      console.error('Error getting plan:', error);
      return 'free';
    }
  });
  
  const [usage, setUsage] = useState<UsageStats>(() => {
    try {
      return usageManager.getUsage();
    } catch (error) {
      console.error('Error getting usage:', error);
      // Return a minimal safe default
      const now = Date.now();
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      return {
        userId: 'current-user',
        plan: 'free',
        period: { start: now, end: endOfMonth.getTime() },
        usage: {
          searches: { count: 0, history: [] },
          enrichments: { count: 0, history: [] },
          exports: { count: 0, totalLeads: 0, history: [] }
        },
        limits: {
          searches: { daily: 5, monthly: 50 },
          enrichments: { daily: 2, monthly: 10 },
          exports: { monthly: 5, maxPerExport: 20 }
        }
      };
    }
  });

  useEffect(() => {
    // Refresh on mount
    try {
      const currentPlan = usageManager.getUserPlan();
      setPlan(currentPlan);
      setUsage(usageManager.getUsage());
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    }

    // Listen for storage changes (multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lead-gen-user-plan' || e.key === 'lead-gen-usage-stats') {
        setPlan(usageManager.getUserPlan());
        setUsage(usageManager.getUsage());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const canPerformAction = (
    action: 'search' | 'enrichment' | 'export',
    params?: any
  ): UsageCheck => {
    return usageManager.canPerformAction(action, params);
  };

  const recordAction = (
    action: 'search' | 'enrichment' | 'export',
    params?: any
  ): void => {
    usageManager.recordAction(action, params);
    setUsage(usageManager.getUsage());
  };

  const upgradePlan = (newPlan: PlanType): void => {
    usageManager.upgradePlan(newPlan);
    setPlan(newPlan);
    setUsage(usageManager.getUsage());
  };

  const hasFeature = (feature: string): boolean => {
    return usageManager.hasFeature(feature as any);
  };

  const getFeatureValue = (feature: string): any => {
    return usageManager.getFeatureValue(feature as any);
  };

  const getRemainingQuota = () => {
    return usageManager.getRemainingQuota();
  };

  const getUsagePercentage = () => {
    return usageManager.getUsagePercentage();
  };

  const refreshUsage = () => {
    try {
      setUsage(usageManager.getUsage());
    } catch (error) {
      console.error('Error refreshing usage:', error);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        usage,
        canPerformAction,
        recordAction,
        upgradePlan,
        hasFeature,
        getFeatureValue,
        getRemainingQuota,
        getUsagePercentage,
        refreshUsage
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Helper hook for easy feature checking
export const useFeature = (feature: string): boolean => {
  const { hasFeature } = useSubscription();
  return hasFeature(feature);
};

// Helper hook for plan info
export const usePlanInfo = () => {
  const { plan } = useSubscription();
  return PLANS[plan];
};

