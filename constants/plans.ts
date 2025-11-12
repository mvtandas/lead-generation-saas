import { Plan } from '../types/subscription';

// Lead görüntüleme limitleri (sayfa başına)
export const RESULT_LIMITS = {
  free: 10,        // 10 lead per page
  pro: 20,         // 20 lead per page
  business: 50,    // 50 lead per page
  enterprise: 100  // 100 lead per page
};

// API'den çekilecek toplam lead sayısı
// LEGACY Google Places API: Max 20 sonuç per request
export const API_FETCH_LIMITS = {
  free: 20,        // Max 20 lead (Legacy API limit)
  pro: 20,         // Max 20 lead (Legacy API limit)
  business: 20,    // Max 20 lead (Legacy API limit)
  enterprise: 20   // Max 20 lead (Legacy API limit)
};

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    limits: {
      searches: { daily: 5, monthly: 50 },
      enrichments: { daily: 2, monthly: 10 },
      exports: { monthly: 5, maxPerExport: 20 }
    },
    features: {
      googleMaps: true,
      geminiAI: false,
      socialMedia: [],
      emailPrediction: false,
      emailVerification: false,
      advancedFilters: false,
      bulkOperations: false,
      bulkLimit: 0,
      apiAccess: false,
      apiCallsPerDay: 0,
      teamSeats: 1,
      exportFormats: ['xlsx'],
      searchHistory: 5,
      leadTags: 0,
      dataRetention: 30,
      support: 'community'
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Best for small businesses',
    limits: {
      searches: { daily: 20, monthly: 500 },
      enrichments: { daily: 10, monthly: 200 },
      exports: { monthly: -1, maxPerExport: 100 }
    },
    features: {
      googleMaps: true,
      geminiAI: true,
      socialMedia: ['facebook', 'instagram'],
      emailPrediction: true,
      emailVerification: false,
      advancedFilters: true,
      bulkOperations: true,
      bulkLimit: 50,
      apiAccess: false,
      apiCallsPerDay: 0,
      teamSeats: 1,
      exportFormats: ['xlsx', 'csv'],
      searchHistory: 30,
      leadTags: 10,
      dataRetention: 90,
      support: 'email'
    },
    highlighted: true
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 99,
    description: 'For growing teams',
    limits: {
      searches: { daily: 100, monthly: 2000 },
      enrichments: { daily: 50, monthly: 1000 },
      exports: { monthly: -1, maxPerExport: 500 }
    },
    features: {
      googleMaps: true,
      geminiAI: true,
      socialMedia: ['facebook', 'instagram', 'linkedin', 'twitter'],
      emailPrediction: true,
      emailVerification: true,
      advancedFilters: true,
      bulkOperations: true,
      bulkLimit: 100,
      apiAccess: true,
      apiCallsPerDay: 500,
      teamSeats: 5,
      exportFormats: ['xlsx', 'csv', 'json'],
      searchHistory: 90,
      leadTags: 50,
      dataRetention: 365,
      support: 'priority'
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    description: 'Custom solutions for large teams',
    limits: {
      searches: { daily: -1, monthly: -1 },
      enrichments: { daily: -1, monthly: -1 },
      exports: { monthly: -1, maxPerExport: -1 }
    },
    features: {
      googleMaps: true,
      geminiAI: true,
      socialMedia: ['facebook', 'instagram', 'linkedin', 'twitter'],
      emailPrediction: true,
      emailVerification: true,
      advancedFilters: true,
      bulkOperations: true,
      bulkLimit: -1,
      apiAccess: true,
      apiCallsPerDay: -1,
      teamSeats: -1,
      exportFormats: ['xlsx', 'csv', 'json', 'xml'],
      searchHistory: -1,
      leadTags: -1,
      dataRetention: -1,
      support: 'dedicated'
    }
  }
};

export const PLAN_FEATURE_LIST = {
  free: [
    '50 arama/ay • Her aramada 20 lead',
    'Sayfa başına 10 lead (2 sayfa)',
    'Google Maps API + Telefon/Website',
    '10 zenginleştirme/ay (email/sosyal medya)',
    '5 export/ay (Max 20 lead)',
    'Temel filtreler',
    'Topluluk desteği',
    '30 gün veri saklama'
  ],
  pro: [
    '500 arama/ay • Her aramada 20 lead',
    'Sayfa başına 20 lead (1 sayfa)',
    'Google Maps API + Telefon/Website',
    '200 zenginleştirme/ay (email/sosyal medya)',
    'Sınırsız export (XLSX + CSV)',
    'Gelişmiş filtreler',
    '30 gün arama geçmişi',
    '10 lead etiketi',
    'Öncelikli destek',
    '90 gün veri saklama'
  ],
  business: [
    '2,000 arama/ay • Her aramada 20 lead',
    'Sayfa başına 20 lead (1 sayfa)',
    'Google Maps API + Telefon/Website',
    '1,000 zenginleştirme/ay',
    'Max 500 lead/export',
    'Toplu işlemler (100 lead)',
    'API erişimi (500 call/gün)',
    'Takım çalışması (5 kişi)',
    '50 lead etiketi',
    'Öncelikli destek',
    '1 yıl veri saklama'
  ],
  enterprise: [
    'Sınırsız arama • Her aramada 20 lead',
    'Sayfa başına 20 lead (1 sayfa)',
    'Google Maps API + Telefon/Website',
    'Sınırsız zenginleştirme',
    'Sınırsız export',
    'White label seçeneği',
    'Özel API limitleri',
    'Sınırsız takım üyesi',
    'Sınırsız lead etiketi',
    'Özel hesap yöneticisi',
    '24/7 öncelikli destek',
    'Özel entegrasyonlar',
    'SLA garantisi',
    'Özel veri saklama'
  ]
};

