# 💰 Lead Generation SaaS - Pricing Strategy

## 🎯 Hedef: Maksimum Değer, Minimum Maliyet

---

## 📊 PAKET YAPISI

### 🆓 FREE Plan (Freemium)
**Fiyat:** $0/ay

**Limitler:**
- ✅ 50 lead search/ay
- ✅ 10 enrichment/ay
- ✅ 5 export/ay (max 20 lead/export)
- ✅ Basic filters
- ✅ Basic search (Google Maps only)
- ❌ Advanced filters
- ❌ Social media data
- ❌ Bulk operations
- ❌ CSV export
- ❌ API access
- ❌ Priority support

**Kullanıcı Profili:**
- Bireysel kullanıcılar
- Test etmek isteyenler
- Küçük işletmeler (aylık <50 lead)

**Maliyet Analizi:**
- Google Maps: 50 search × $0.017 = $0.85/ay
- Gemini: 10 enrichment = $0 (free quota)
- **Kullanıcı başına maliyet: ~$1/ay**

**Kar Marjı:** -$1/ay (acquisition için ok)

---

### ⭐ PRO Plan (Sweet Spot)
**Fiyat:** $29/ay

**Limitler:**
- ✅ 500 lead search/ay
- ✅ 200 enrichment/ay
- ✅ Unlimited exports
- ✅ Advanced filters (rating, reviews, date)
- ✅ Social media data (Facebook, Instagram)
- ✅ Bulk operations (select multiple)
- ✅ CSV + Excel export
- ✅ Email predictions
- ✅ Search history
- ✅ Priority email support
- ❌ API access
- ❌ White label
- ❌ Dedicated support

**Kullanıcı Profili:**
- SMB (Small-Medium Business)
- Marketing agencies
- Sales teams (2-5 kişi)
- Power users

**Maliyet Analizi:**
- Google Maps: 200 search × $0.017 = $3.40/ay (cache ile)
- Gemini: 200 enrichment = $0 (free quota içinde)
- Custom Search: 100 search = $0 (free quota)
- **Kullanıcı başına maliyet: ~$5/ay**

**Kar Marjı:** $24/ay (%83 margin) 🎯

---

### 🚀 BUSINESS Plan (High Volume)
**Fiyat:** $99/ay

**Limitler:**
- ✅ 2,000 lead search/ay
- ✅ 1,000 enrichment/ay
- ✅ Unlimited exports
- ✅ All PRO features
- ✅ API access (500 calls/day)
- ✅ Bulk enrichment (100 at once)
- ✅ Advanced social media (LinkedIn, Twitter)
- ✅ Team collaboration (5 seats)
- ✅ Priority support
- ✅ Custom integrations
- ❌ White label
- ❌ Dedicated account manager

**Kullanıcı Profili:**
- Büyük ajanslar
- Enterprise sales teams
- Lead generation companies

**Maliyet Analizi:**
- Google Maps: 800 search × $0.017 = $13.60/ay (cache ile)
- Gemini: 1000 enrichment = $0 (free quota limits)
- Custom Search: $5/ay (quota aşımı)
- Hunter.io: $49/ay (email verification)
- **Kullanıcı başına maliyet: ~$70/ay**

**Kar Marjı:** $29/ay (%29 margin)

---

### 🏢 ENTERPRISE Plan (Custom)
**Fiyat:** Custom (başlangıç $299/ay)

**Limitler:**
- ✅ Custom limits (negotiate)
- ✅ Unlimited searches
- ✅ Unlimited enrichments
- ✅ All BUSINESS features
- ✅ White label option
- ✅ Dedicated account manager
- ✅ Custom API limits
- ✅ Priority support (24/7)
- ✅ Custom integrations
- ✅ SLA guarantees
- ✅ On-premise option

**Kullanıcı Profili:**
- Fortune 500 companies
- Large enterprises
- Resellers/Partners

**Maliyet Analizi:**
- Variable (scale-based pricing)
- Custom infrastructure
- **Estimated: $100-200/ay per user**

**Kar Marjı:** $100-150/ay (%33-50 margin)

---

## 🎯 ÖZELLIK KARŞILAŞTIRMASI

| Feature | Free | Pro | Business | Enterprise |
|---------|------|-----|----------|------------|
| **Lead Search** | 50/ay | 500/ay | 2,000/ay | Unlimited |
| **Enrichment** | 10/ay | 200/ay | 1,000/ay | Unlimited |
| **Exports** | 5/ay | Unlimited | Unlimited | Unlimited |
| **Export Max** | 20 leads | 100 leads | 500 leads | Unlimited |
| **Export Format** | XLSX | XLSX, CSV | XLSX, CSV | All formats |
| **Google Maps Data** | ✅ | ✅ | ✅ | ✅ |
| **Gemini AI Enrichment** | ❌ | ✅ | ✅ | ✅ |
| **Social Media Data** | ❌ | ✅ Facebook, IG | ✅ All | ✅ All |
| **Email Prediction** | ❌ | ✅ AI-based | ✅ + Verification | ✅ Premium |
| **Advanced Filters** | ❌ | ✅ | ✅ | ✅ |
| **Bulk Operations** | ❌ | ✅ (50) | ✅ (100) | ✅ Unlimited |
| **Search History** | Last 5 | Last 30 | Last 90 | Unlimited |
| **Lead Tags** | ❌ | ✅ (10 tags) | ✅ (50 tags) | ✅ Unlimited |
| **API Access** | ❌ | ❌ | ✅ | ✅ Custom |
| **Team Seats** | 1 | 1 | 5 | Unlimited |
| **Support** | Community | Email (48h) | Priority | 24/7 Dedicated |
| **Data Retention** | 30 days | 90 days | 1 year | Custom |

---

## 💡 KULLANIM LİMİTLERİ

### Search Limits (API Calls)
```typescript
const SEARCH_LIMITS = {
  free: {
    daily: 5,        // 5 search/gün
    monthly: 50,     // 50 search/ay
    concurrent: 1    // 1 search at a time
  },
  pro: {
    daily: 20,       // 20 search/gün
    monthly: 500,    // 500 search/ay
    concurrent: 3    // 3 concurrent searches
  },
  business: {
    daily: 100,      // 100 search/gün
    monthly: 2000,   // 2000 search/ay
    concurrent: 10   // 10 concurrent searches
  },
  enterprise: {
    daily: -1,       // unlimited
    monthly: -1,     // unlimited
    concurrent: 20   // 20 concurrent searches
  }
};
```

### Enrichment Limits
```typescript
const ENRICHMENT_LIMITS = {
  free: {
    daily: 2,        // 2 enrichment/gün
    monthly: 10,     // 10 enrichment/ay
    features: ['gemini_basic']
  },
  pro: {
    daily: 10,       // 10 enrichment/gün
    monthly: 200,    // 200 enrichment/ay
    features: ['gemini_full', 'facebook', 'instagram', 'email_prediction']
  },
  business: {
    daily: 50,       // 50 enrichment/gün
    monthly: 1000,   // 1000 enrichment/ay
    features: ['all_social', 'email_verification', 'phone_validation']
  },
  enterprise: {
    daily: -1,       // unlimited
    monthly: -1,     // unlimited
    features: ['all']
  }
};
```

### Export Limits
```typescript
const EXPORT_LIMITS = {
  free: {
    monthly: 5,           // 5 export/ay
    maxLeadsPerExport: 20,
    formats: ['xlsx']
  },
  pro: {
    monthly: -1,          // unlimited
    maxLeadsPerExport: 100,
    formats: ['xlsx', 'csv']
  },
  business: {
    monthly: -1,          // unlimited
    maxLeadsPerExport: 500,
    formats: ['xlsx', 'csv', 'json']
  },
  enterprise: {
    monthly: -1,          // unlimited
    maxLeadsPerExport: -1,  // unlimited
    formats: ['all']
  }
};
```

---

## 📈 USAGE TRACKING

### Frontend-Only Implementation (LocalStorage)
```typescript
// types.ts

interface UsageStats {
  userId: string;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  period: {
    start: number;  // timestamp
    end: number;    // timestamp
  };
  usage: {
    searches: {
      count: number;
      history: Array<{ timestamp: number; query: string }>;
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
  limits: {
    searches: { daily: number; monthly: number };
    enrichments: { daily: number; monthly: number };
    exports: { monthly: number; maxPerExport: number };
  };
}
```

### Usage Manager
```typescript
// services/usageManager.ts

class UsageManager {
  private storageKey = 'usage-stats';
  
  // Get current usage
  getUsage(): UsageStats {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const usage = JSON.parse(stored);
      // Check if period expired (monthly reset)
      if (Date.now() > usage.period.end) {
        return this.resetMonthlyUsage(usage);
      }
      return usage;
    }
    return this.initializeUsage();
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
  canPerformAction(action: 'search' | 'enrichment' | 'export', params?: any): {
    allowed: boolean;
    reason?: string;
    remaining?: number;
  } {
    const usage = this.getUsage();
    const now = Date.now();
    
    switch (action) {
      case 'search': {
        const monthlyLimit = usage.limits.searches.monthly;
        const dailyLimit = usage.limits.searches.daily;
        const monthlyUsage = usage.usage.searches.count;
        const dailyUsage = this.getDailyUsage(usage.usage.searches.history);
        
        if (monthlyLimit !== -1 && monthlyUsage >= monthlyLimit) {
          return {
            allowed: false,
            reason: `Monthly search limit reached (${monthlyLimit}). Upgrade to continue.`,
            remaining: 0
          };
        }
        
        if (dailyLimit !== -1 && dailyUsage >= dailyLimit) {
          return {
            allowed: false,
            reason: `Daily search limit reached (${dailyLimit}). Try again tomorrow or upgrade.`,
            remaining: 0
          };
        }
        
        return {
          allowed: true,
          remaining: monthlyLimit === -1 ? -1 : monthlyLimit - monthlyUsage
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
            reason: `Monthly enrichment limit reached (${monthlyLimit}). Upgrade for more.`,
            remaining: 0
          };
        }
        
        if (dailyLimit !== -1 && dailyUsage >= dailyLimit) {
          return {
            allowed: false,
            reason: `Daily enrichment limit reached (${dailyLimit}). Upgrade or try tomorrow.`,
            remaining: 0
          };
        }
        
        return {
          allowed: true,
          remaining: monthlyLimit === -1 ? -1 : monthlyLimit - monthlyUsage
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
            reason: `Monthly export limit reached (${monthlyLimit}). Upgrade for unlimited exports.`,
            remaining: 0
          };
        }
        
        if (maxPerExport !== -1 && leadCount > maxPerExport) {
          return {
            allowed: false,
            reason: `Export size exceeds limit (max ${maxPerExport} leads). Upgrade for larger exports.`,
            remaining: 0
          };
        }
        
        return {
          allowed: true,
          remaining: monthlyLimit === -1 ? -1 : monthlyLimit - monthlyUsage
        };
      }
    }
  }
  
  // Record action
  recordAction(action: 'search' | 'enrichment' | 'export', params?: any): void {
    const usage = this.getUsage();
    const now = Date.now();
    
    switch (action) {
      case 'search':
        usage.usage.searches.count++;
        usage.usage.searches.history.push({
          timestamp: now,
          query: params?.query || ''
        });
        break;
        
      case 'enrichment':
        usage.usage.enrichments.count++;
        usage.usage.enrichments.history.push({
          timestamp: now,
          leadId: params?.leadId || ''
        });
        break;
        
      case 'export':
        usage.usage.exports.count++;
        usage.usage.exports.totalLeads += params?.leadCount || 0;
        usage.usage.exports.history.push({
          timestamp: now,
          leadCount: params?.leadCount || 0,
          format: params?.format || 'xlsx'
        });
        break;
    }
    
    this.saveUsage(usage);
  }
  
  // Get daily usage
  private getDailyUsage(history: Array<{ timestamp: number }>): number {
    const oneDayAgo = Date.now() - 86400000;
    return history.filter(h => h.timestamp > oneDayAgo).length;
  }
  
  // Get user plan (from AuthContext or localStorage)
  private getUserPlan(): UsageStats['plan'] {
    const stored = localStorage.getItem('user-plan');
    return (stored as UsageStats['plan']) || 'free';
  }
  
  // Get limits for plan
  private getLimitsForPlan(plan: UsageStats['plan']) {
    const limits = {
      free: {
        searches: { daily: 5, monthly: 50 },
        enrichments: { daily: 2, monthly: 10 },
        exports: { monthly: 5, maxPerExport: 20 }
      },
      pro: {
        searches: { daily: 20, monthly: 500 },
        enrichments: { daily: 10, monthly: 200 },
        exports: { monthly: -1, maxPerExport: 100 }
      },
      business: {
        searches: { daily: 100, monthly: 2000 },
        enrichments: { daily: 50, monthly: 1000 },
        exports: { monthly: -1, maxPerExport: 500 }
      },
      enterprise: {
        searches: { daily: -1, monthly: -1 },
        enrichments: { daily: -1, monthly: -1 },
        exports: { monthly: -1, maxPerExport: -1 }
      }
    };
    
    return limits[plan];
  }
  
  // Save usage
  private saveUsage(usage: UsageStats): void {
    localStorage.setItem(this.storageKey, JSON.stringify(usage));
  }
  
  // Reset monthly usage
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
  
  // Upgrade plan (simulated for now)
  upgradePlan(newPlan: UsageStats['plan']): void {
    localStorage.setItem('user-plan', newPlan);
    const usage = this.getUsage();
    usage.plan = newPlan;
    usage.limits = this.getLimitsForPlan(newPlan);
    this.saveUsage(usage);
  }
  
  // Get usage percentage
  getUsagePercentage(): {
    searches: number;
    enrichments: number;
    exports: number;
  } {
    const usage = this.getUsage();
    
    return {
      searches: usage.limits.searches.monthly === -1 ? 0 :
        (usage.usage.searches.count / usage.limits.searches.monthly) * 100,
      enrichments: usage.limits.enrichments.monthly === -1 ? 0 :
        (usage.usage.enrichments.count / usage.limits.enrichments.monthly) * 100,
      exports: usage.limits.exports.monthly === -1 ? 0 :
        (usage.usage.exports.count / usage.limits.exports.monthly) * 100
    };
  }
}

export const usageManager = new UsageManager();
```

---

## 🎨 PRICING PAGE DESIGN

### Features Section
```typescript
const PLAN_FEATURES = {
  free: [
    'Up to 50 lead searches per month',
    'Basic Google Maps data',
    'Up to 10 AI enrichments per month',
    'Export up to 20 leads (XLSX)',
    'Basic filters only',
    'Community support',
    '30-day data retention'
  ],
  pro: [
    'Up to 500 lead searches per month',
    'Google Maps + Gemini AI data',
    'Up to 200 AI enrichments per month',
    'Unlimited exports (XLSX + CSV)',
    'Advanced filters (rating, reviews, date)',
    'Social media data (Facebook, Instagram)',
    'Email predictions',
    'Search history (30 days)',
    'Priority email support',
    '90-day data retention'
  ],
  business: [
    'Up to 2,000 lead searches per month',
    'All PRO features',
    'Up to 1,000 AI enrichments per month',
    'Export up to 500 leads at once',
    'All social media platforms',
    'Email verification',
    'Bulk operations (100 leads)',
    'API access (500 calls/day)',
    'Team collaboration (5 seats)',
    'Priority support',
    '1-year data retention'
  ],
  enterprise: [
    'Unlimited lead searches',
    'All BUSINESS features',
    'Unlimited AI enrichments',
    'Unlimited exports',
    'White label option',
    'Custom API limits',
    'Dedicated account manager',
    '24/7 priority support',
    'Custom integrations',
    'SLA guarantees',
    'Custom data retention'
  ]
};
```

---

## 🚀 CONVERSION STRATEGY

### 1. Free → Pro ($29/ay)
**Trigger Points:**
- 50 search limit reached (80% notification at 40)
- 10 enrichment limit reached
- Export limit reached (show "Upgrade for unlimited")
- Advanced filter button clicked (show "PRO feature")

**Value Proposition:**
- 10x more searches (50 → 500)
- 20x more enrichments (10 → 200)
- Unlimited exports
- Social media data
- Only $29/ay = less than $1/day

### 2. Pro → Business ($99/ay)
**Trigger Points:**
- 500 search limit approaching
- API access requested
- Team collaboration needed
- Bulk operations (>50 leads)

**Value Proposition:**
- 4x more searches (500 → 2,000)
- 5x more enrichments (200 → 1,000)
- API access
- Team collaboration
- Only $70 more/ay

### 3. Business → Enterprise (Custom)
**Trigger Points:**
- 2,000 search limit reached
- Custom integrations needed
- White label requested
- More than 5 team members

**Value Proposition:**
- Unlimited everything
- Dedicated support
- Custom solutions
- Enterprise-grade SLA

---

## 💳 PAYMENT SIMULATION (For Now)

```typescript
// Mock payment flow (will integrate Stripe/LemonSqueezy later)
const simulatePayment = async (plan: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      usageManager.upgradePlan(plan as any);
      resolve({ success: true, plan });
    }, 2000);
  });
};
```

---

## 📊 SUCCESS METRICS

### Target Conversion Rates:
- Free → Pro: **10-15%**
- Pro → Business: **5-10%**
- Business → Enterprise: **1-3%**

### Revenue Projections (100 users):
- 70 Free × $0 = $0
- 25 Pro × $29 = $725/ay
- 4 Business × $99 = $396/ay
- 1 Enterprise × $299 = $299/ay
- **Total: $1,420/ay**

### Costs (100 users):
- Free: 70 × $1 = $70/ay
- Pro: 25 × $5 = $125/ay
- Business: 4 × $70 = $280/ay
- Enterprise: 1 × $150 = $150/ay
- **Total: $625/ay**

### Net Profit: $795/ay (%56 margin)

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Foundation
- [ ] Create subscription types
- [ ] Build usage manager
- [ ] Implement usage tracking
- [ ] Create feature gates

### Phase 2: UI/UX
- [ ] Complete pricing page
- [ ] Build upgrade modal
- [ ] Add usage dashboard widget
- [ ] Show limit warnings

### Phase 3: Integration
- [ ] Integrate usage checks in leadService
- [ ] Add limit notifications
- [ ] Implement upgrade flow
- [ ] Test all limits

### Phase 4: Payment (Later)
- [ ] Stripe/LemonSqueezy integration
- [ ] Webhook handlers
- [ ] Billing management
- [ ] Invoices

---

🚀 **HEMEN BAŞLAYALIM!**

