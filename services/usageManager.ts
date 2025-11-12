import { UsageStats, UsageCheck, PlanType, PlanLimits } from '../types/subscription';
import { PLANS } from '../constants/plans';

class UsageManager {
  private storageKey = 'lead-gen-usage-stats';
  private planKey = 'lead-gen-user-plan';

  // Get current usage stats
  getUsage(): UsageStats {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const usage: UsageStats = JSON.parse(stored);
          // Check if period expired (monthly reset)
          if (Date.now() > usage.period.end) {
            return this.resetMonthlyUsage(usage);
          }
          return usage;
        } catch (error) {
          console.error('Error parsing usage stats:', error);
          return this.initializeUsage();
        }
      }
      return this.initializeUsage();
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Return a safe default if localStorage fails
      return this.createDefaultUsage();
    }
  }

  // Create default usage without localStorage
  private createDefaultUsage(): UsageStats {
    const now = Date.now();
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    return {
      userId: 'current-user',
      plan: 'free',
      period: {
        start: now,
        end: endOfMonth.getTime()
      },
      usage: {
        searches: { count: 0, history: [] },
        enrichments: { count: 0, history: [] },
        exports: { count: 0, totalLeads: 0, history: [] }
      },
      limits: PLANS.free.limits
    };
  }

  // Initialize usage for new user
  private initializeUsage(): UsageStats {
    const now = Date.now();
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const plan = this.getUserPlan();
    const limits = this.getLimitsForPlan(plan);

    const usage: UsageStats = {
      userId: 'current-user',
      plan,
      period: {
        start: now,
        end: endOfMonth.getTime()
      },
      usage: {
        searches: { count: 0, history: [] },
        enrichments: { count: 0, history: [] },
        exports: { count: 0, totalLeads: 0, history: [] }
      },
      limits
    };

    this.saveUsage(usage);
    return usage;
  }

  // Check if action is allowed
  canPerformAction(
    action: 'search' | 'enrichment' | 'export',
    params?: { leadCount?: number }
  ): UsageCheck {
    const usage = this.getUsage();

    switch (action) {
      case 'search': {
        const monthlyLimit = usage.limits.searches.monthly;
        const dailyLimit = usage.limits.searches.daily;
        const monthlyUsage = usage.usage.searches.count;
        const dailyUsage = this.getDailyUsage(usage.usage.searches.history);

        if (monthlyLimit !== -1 && monthlyUsage >= monthlyLimit) {
          return {
            allowed: false,
            reason: `Aylık arama limitiniz doldu (${monthlyLimit}). Devam etmek için yükseltin.`,
            remaining: 0,
            percentage: 100
          };
        }

        if (dailyLimit !== -1 && dailyUsage >= dailyLimit) {
          return {
            allowed: false,
            reason: `Günlük arama limitiniz doldu (${dailyLimit}). Yarın tekrar deneyin veya yükseltin.`,
            remaining: 0,
            percentage: 100
          };
        }

        const remaining = monthlyLimit === -1 ? -1 : monthlyLimit - monthlyUsage;
        const percentage = monthlyLimit === -1 ? 0 : (monthlyUsage / monthlyLimit) * 100;

        return {
          allowed: true,
          remaining,
          percentage
        };
      }

      case 'enrichment': {
        const monthlyLimit = usage.limits.enrichments.monthly;
        const dailyLimit = usage.limits.enrichments.daily;
        const monthlyUsage = usage.usage.enrichments.count;
        const dailyUsage = this.getDailyUsage(usage.usage.enrichments.history);

        if (monthlyLimit !== -1 && monthlyUsage >= monthlyLimit) {
          return {
            allowed: false,
            reason: `Aylık zenginleştirme limitiniz doldu (${monthlyLimit}). Daha fazlası için yükseltin.`,
            remaining: 0,
            percentage: 100
          };
        }

        if (dailyLimit !== -1 && dailyUsage >= dailyLimit) {
          return {
            allowed: false,
            reason: `Günlük zenginleştirme limitiniz doldu (${dailyLimit}). Yarın veya yükseltin.`,
            remaining: 0,
            percentage: 100
          };
        }

        const remaining = monthlyLimit === -1 ? -1 : monthlyLimit - monthlyUsage;
        const percentage = monthlyLimit === -1 ? 0 : (monthlyUsage / monthlyLimit) * 100;

        return {
          allowed: true,
          remaining,
          percentage
        };
      }

      case 'export': {
        const monthlyLimit = usage.limits.exports.monthly;
        const maxPerExport = usage.limits.exports.maxPerExport;
        const monthlyUsage = usage.usage.exports.count;
        const leadCount = params?.leadCount || 0;

        if (monthlyLimit !== -1 && monthlyUsage >= monthlyLimit) {
          return {
            allowed: false,
            reason: `Aylık export limitiniz doldu (${monthlyLimit}). Sınırsız export için yükseltin.`,
            remaining: 0,
            percentage: 100
          };
        }

        if (maxPerExport !== -1 && leadCount > maxPerExport) {
          return {
            allowed: false,
            reason: `Export boyutu limiti aşıyor (max ${maxPerExport} lead). Daha büyük export'lar için yükseltin.`,
            remaining: 0,
            percentage: 100
          };
        }

        const remaining = monthlyLimit === -1 ? -1 : monthlyLimit - monthlyUsage;
        const percentage = monthlyLimit === -1 ? 0 : (monthlyUsage / monthlyLimit) * 100;

        return {
          allowed: true,
          remaining,
          percentage
        };
      }

      default:
        return { allowed: false, reason: 'Unknown action' };
    }
  }

  // Record action
  recordAction(
    action: 'search' | 'enrichment' | 'export',
    params?: { query?: string; resultCount?: number; leadId?: string; leadCount?: number; format?: string }
  ): void {
    const usage = this.getUsage();
    const now = Date.now();

    switch (action) {
      case 'search':
        usage.usage.searches.count++;
        usage.usage.searches.history.push({
          timestamp: now,
          query: params?.query || '',
          resultCount: params?.resultCount || 0
        });
        // Keep only last 100 records
        if (usage.usage.searches.history.length > 100) {
          usage.usage.searches.history = usage.usage.searches.history.slice(-100);
        }
        break;

      case 'enrichment':
        usage.usage.enrichments.count++;
        usage.usage.enrichments.history.push({
          timestamp: now,
          leadId: params?.leadId || ''
        });
        if (usage.usage.enrichments.history.length > 100) {
          usage.usage.enrichments.history = usage.usage.enrichments.history.slice(-100);
        }
        break;

      case 'export':
        usage.usage.exports.count++;
        usage.usage.exports.totalLeads += params?.leadCount || 0;
        usage.usage.exports.history.push({
          timestamp: now,
          leadCount: params?.leadCount || 0,
          format: params?.format || 'xlsx'
        });
        if (usage.usage.exports.history.length > 100) {
          usage.usage.exports.history = usage.usage.exports.history.slice(-100);
        }
        break;
    }

    this.saveUsage(usage);
  }

  // Get daily usage count
  private getDailyUsage(history: Array<{ timestamp: number }>): number {
    const oneDayAgo = Date.now() - 86400000; // 24 hours
    return history.filter(h => h.timestamp > oneDayAgo).length;
  }

  // Get user's current plan
  getUserPlan(): PlanType {
    try {
      const stored = localStorage.getItem(this.planKey);
      if (stored && ['free', 'pro', 'business', 'enterprise'].includes(stored)) {
        return stored as PlanType;
      }
    } catch (error) {
      console.error('Error accessing localStorage for plan:', error);
    }
    return 'free';
  }

  // Get plan details
  getPlanDetails(planType?: PlanType) {
    const plan = planType || this.getUserPlan();
    return PLANS[plan];
  }

  // Get limits for plan
  private getLimitsForPlan(plan: PlanType): PlanLimits {
    return PLANS[plan].limits;
  }

  // Save usage to localStorage
  private saveUsage(usage: UsageStats): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(usage));
    } catch (error) {
      console.error('Error saving usage stats:', error);
      // Silently fail if localStorage is not available
    }
  }

  // Reset monthly usage (called automatically when period expires)
  private resetMonthlyUsage(oldUsage: UsageStats): UsageStats {
    const now = Date.now();
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const newUsage: UsageStats = {
      ...oldUsage,
      period: {
        start: now,
        end: endOfMonth.getTime()
      },
      usage: {
        searches: { count: 0, history: [] },
        enrichments: { count: 0, history: [] },
        exports: { count: 0, totalLeads: 0, history: [] }
      }
    };

    this.saveUsage(newUsage);
    return newUsage;
  }

  // Upgrade plan
  upgradePlan(newPlan: PlanType): void {
    try {
      localStorage.setItem(this.planKey, newPlan);
      const usage = this.getUsage();
      usage.plan = newPlan;
      usage.limits = this.getLimitsForPlan(newPlan);
      this.saveUsage(usage);
    } catch (error) {
      console.error('Error upgrading plan:', error);
    }
  }

  // Get usage percentage for each metric
  getUsagePercentage(): {
    searches: number;
    enrichments: number;
    exports: number;
  } {
    const usage = this.getUsage();

    return {
      searches:
        usage.limits.searches.monthly === -1
          ? 0
          : Math.min(100, (usage.usage.searches.count / usage.limits.searches.monthly) * 100),
      enrichments:
        usage.limits.enrichments.monthly === -1
          ? 0
          : Math.min(100, (usage.usage.enrichments.count / usage.limits.enrichments.monthly) * 100),
      exports:
        usage.limits.exports.monthly === -1
          ? 0
          : Math.min(100, (usage.usage.exports.count / usage.limits.exports.monthly) * 100)
    };
  }

  // Get remaining quota
  getRemainingQuota(): {
    searches: { daily: number; monthly: number };
    enrichments: { daily: number; monthly: number };
    exports: { monthly: number };
  } {
    const usage = this.getUsage();
    const dailySearches = this.getDailyUsage(usage.usage.searches.history);
    const dailyEnrichments = this.getDailyUsage(usage.usage.enrichments.history);

    return {
      searches: {
        daily:
          usage.limits.searches.daily === -1
            ? -1
            : Math.max(0, usage.limits.searches.daily - dailySearches),
        monthly:
          usage.limits.searches.monthly === -1
            ? -1
            : Math.max(0, usage.limits.searches.monthly - usage.usage.searches.count)
      },
      enrichments: {
        daily:
          usage.limits.enrichments.daily === -1
            ? -1
            : Math.max(0, usage.limits.enrichments.daily - dailyEnrichments),
        monthly:
          usage.limits.enrichments.monthly === -1
            ? -1
            : Math.max(0, usage.limits.enrichments.monthly - usage.usage.enrichments.count)
      },
      exports: {
        monthly:
          usage.limits.exports.monthly === -1
            ? -1
            : Math.max(0, usage.limits.exports.monthly - usage.usage.exports.count)
      }
    };
  }

  // Check if feature is available for current plan
  hasFeature(feature: keyof typeof PLANS.free.features): boolean {
    const plan = this.getUserPlan();
    const planDetails = PLANS[plan];
    return !!planDetails.features[feature];
  }

  // Get feature value
  getFeatureValue(feature: keyof typeof PLANS.free.features): any {
    const plan = this.getUserPlan();
    const planDetails = PLANS[plan];
    return planDetails.features[feature];
  }

  // Reset usage (for testing)
  resetUsage(): void {
    localStorage.removeItem(this.storageKey);
    this.initializeUsage();
  }

  // Export usage stats for analytics
  exportUsageStats(): UsageStats {
    return this.getUsage();
  }
}

export const usageManager = new UsageManager();

