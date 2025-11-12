# 🔍 Lead Generation - Veri Kaynakları

## ✅ Mevcut Kaynaklar

### 1. Google Maps Places API
- ✅ Lokal işletmeler
- ✅ Adres, telefon, website
- ✅ Rating ve review'lar
- ✅ Business hours
- ✅ Photos

### 2. Google Gemini AI (Web Search)
- ✅ Geniş web araması
- ✅ Şirket bilgileri
- ✅ AI destekli veri çıkarımı

---

## 🚀 Eklenebilecek Veri Kaynakları

### A. Social Media Platforms

#### 1. 📘 **Facebook/Meta Business Search**
**Neler Sağlar:**
- Facebook Business Pages
- Instagram Business Profiles
- WhatsApp Business numaraları
- Page likes, followers
- Post engagement metrikleri
- Business categories

**API:** Facebook Graph API
**Maliyet:** Ücretsiz (rate limits var)
**Değer:** Sosyal medya varlığı + engagement

```typescript
// Örnek kullanım
await searchFacebookBusinesses({
  query: 'restaurant',
  location: 'Istanbul',
  fields: 'name,phone,website,fan_count,engagement'
});
```

#### 2. 💼 **LinkedIn Company Search**
**Neler Sağlar:**
- Şirket profilleri
- Çalışan sayısı
- Sektör bilgisi
- Şirket büyüklüğü
- Karar vericilerin profilleri
- Job postings

**API:** LinkedIn API (kısıtlı), alternatif Proxycurl API
**Maliyet:** Ücretli ($$$)
**Değer:** B2B için çok yüksek

```typescript
// B2B lead'ler için ALTIN!
await searchLinkedInCompanies({
  keywords: 'software company',
  location: 'Istanbul',
  employeeCount: '50-200'
});
```

#### 3. 📸 **Instagram Business API**
**Neler Sağlar:**
- Business account bilgileri
- Follower count
- Contact button
- Bio link
- Engagement rate

**API:** Instagram Graph API
**Maliyet:** Ücretsiz
**Değer:** B2C businesses için harika

#### 4. 🐦 **Twitter/X Business Search**
**Neler Sağlar:**
- Business profiles
- Follower metrics
- Tweet engagement
- Website links
- Location data

**API:** Twitter API v2
**Maliyet:** Ücretli (Basic $100/ay)
**Değer:** Brand awareness ölçümü

---

### B. Business Directories & Review Sites

#### 5. ⭐ **Yelp API**
**Neler Sağlar:**
- Detaylı business bilgileri
- Review'lar ve rating'ler
- Photos ve menu'ler
- Price range ($-$$$$)
- Popular dishes/services
- Business attributes

**API:** Yelp Fusion API
**Maliyet:** Ücretsiz (5000 calls/day)
**Değer:** Restaurant, cafe, service businesses için mükemmel

```typescript
await searchYelp({
  term: 'italian restaurant',
  location: 'Istanbul',
  radius: 5000,
  price: '2,3', // $$ ve $$$
  open_now: true
});
```

#### 6. 🏢 **Yellow Pages / Yandex Directory**
**Neler Sağlar:**
- Traditional business listings
- Contact info
- Categories
- Türkiye için yerel directory'ler

**API:** Custom scraping veya 3rd party
**Maliyet:** Varies
**Değer:** Türkiye'de güçlü presence

#### 7. 🏨 **TripAdvisor API**
**Neler Sağlar:**
- Hotels, restaurants, attractions
- Detailed reviews
- Photos
- Rankings
- Awards/certificates

**API:** TripAdvisor Content API
**Maliyet:** Partner program gerekli
**Değer:** Tourism & hospitality için perfect

---

### C. Email & Contact Finders

#### 8. 📧 **Hunter.io**
**Neler Sağlar:**
- Email pattern tespiti
- Domain search
- Email verification
- Confidence score
- Department/role detection

**API:** Hunter API
**Maliyet:** 25 search/ay free, sonra ücretli
**Değer:** Email bulma için en iyi

```typescript
// Website'den email bulma
await hunterFindEmail({
  domain: 'example.com',
  first_name: 'John',
  last_name: 'Doe'
});
```

#### 9. 📞 **Snov.io**
**Neler Sağlar:**
- Email finder
- Email verifier
- LinkedIn scraper
- Bulk search

**API:** Snov.io API
**Maliyet:** Ücretli (paketler var)
**Değer:** Toplu email bulma

#### 10. 🔍 **Clearbit**
**Neler Sağlar:**
- Company enrichment
- Email discovery
- Logo, description
- Tech stack
- Employee count, revenue

**API:** Clearbit API
**Maliyet:** Ücretli ($$$)
**Değer:** Premium B2B enrichment

---

### D. Company Data & Intelligence

#### 11. 💼 **ZoomInfo / Apollo.io**
**Neler Sağlar:**
- Company database
- Contact database
- Org charts
- Technographics
- Intent data
- Direct dials

**API:** ZoomInfo/Apollo API
**Maliyet:** Çok ücretli ($$$$)
**Değer:** Enterprise B2B sales için

#### 12. 🏦 **Crunchbase**
**Neler Sağlar:**
- Startup bilgileri
- Funding rounds
- Investors
- Founders
- News & events

**API:** Crunchbase API
**Maliyet:** Ücretli ($$)
**Değer:** Startup ecosystem için

#### 13. 📊 **Dunn & Bradstreet**
**Neler Sağlar:**
- Company credit ratings
- Financial data
- Business risk
- Industry classification
- Global coverage

**API:** D&B API
**Maliyet:** Enterprise pricing
**Değer:** Financial due diligence

---

### E. Web Scraping & Custom Sources

#### 14. 🕷️ **Custom Web Scraping**
**Neler Sağlar:**
- Industry-specific sites
- Local directories
- Competitor analysis
- Job boards

**Tools:** 
- Puppeteer / Playwright
- Scrapy (Python)
- Beautiful Soup
- Apify platform

**Maliyet:** Development time
**Değer:** Niche markets için unique data

```typescript
// Örnek: Specific industry portal scraping
await scrapeTurkishBusinessDirectory({
  category: 'manufacturing',
  city: 'Bursa'
});
```

#### 15. 🌐 **Google Custom Search API**
**Neler Sağlar:**
- Targeted web search
- Specific site search
- Custom filters

**API:** Google Custom Search JSON API
**Maliyet:** 100 search/day free
**Değer:** Niche bilgi toplama

---

### F. Specialized Sources

#### 16. 🏭 **Industry-Specific Platforms**

**E-Commerce:**
- Shopify API - Online stores
- WooCommerce - WP stores
- Etsy API - Handmade sellers

**Real Estate:**
- Zillow API
- Realtor.com
- Türkiye: Sahibinden, Emlakjet

**Restaurants:**
- Zomato API
- OpenTable
- Yemeksepeti API (Türkiye)

**Health:**
- Healthgrades
- Zocdoc
- Türkiye: Doktortakvimi

**Automotive:**
- Edmunds API
- Cars.com

---

## 🎯 Öncelikli Entegrasyonlar (Sizin için)

### TIER 1 - HEMEN EKLEYİN (Ücretsiz/Ucuz)
1. ✅ **Yelp API** - Restaurant, cafe, service businesses
2. ✅ **Hunter.io** - Email finding (25 free/month)
3. ✅ **Facebook Graph API** - Social media presence
4. ✅ **Google Custom Search** - Targeted web search

### TIER 2 - ORTA VADELİ (Ücretli ama değerli)
5. ⭐ **LinkedIn (Proxycurl)** - B2B için kritik
6. ⭐ **Instagram Business API** - B2C için önemli
7. ⭐ **Clearbit** - Premium enrichment

### TIER 3 - İLERİ SEVİYE (Pahalı ama enterprise)
8. 💎 **ZoomInfo / Apollo** - Enterprise B2B
9. 💎 **Custom scraping** - Unique data sources

---

## 💡 Önerilen Uygulama Stratejisi

### Phase 1: FREE/LOW-COST APIs (1-2 hafta)
```typescript
// services/additionalSources.ts

// 1. Yelp entegrasyonu
export async function fetchFromYelp(query: SearchParams) {
  // Yelp Fusion API implementation
}

// 2. Hunter.io email finder
export async function findEmail(domain: string) {
  // Hunter API implementation
}

// 3. Facebook business search
export async function searchFacebook(query: SearchParams) {
  // Facebook Graph API implementation
}
```

### Phase 2: SOCIAL MEDIA (2-3 hafta)
```typescript
// Instagram, LinkedIn, Twitter entegrasyonları
export async function enrichWithSocialMedia(lead: Lead) {
  const instagram = await findInstagram(lead.companyName);
  const linkedin = await findLinkedIn(lead.companyName);
  const facebook = await findFacebook(lead.companyName);
  
  return { ...lead, instagram, linkedin, facebook };
}
```

### Phase 3: PREMIUM SERVICES (1 ay)
```typescript
// Clearbit, Apollo entegrasyonları
export async function premiumEnrichment(lead: Lead) {
  const clearbitData = await enrichWithClearbit(lead.website);
  const apolloData = await findContacts(lead.companyName);
  
  return { ...lead, ...clearbitData, ...apolloData };
}
```

---

## 🔧 Teknik Implementation

### Multi-Source Search Architecture

```typescript
// services/multiSourceSearch.ts

interface DataSource {
  name: string;
  fetch: (query: SearchParams) => Promise<Lead[]>;
  priority: number;
  cost: number;
}

const dataSources: DataSource[] = [
  {
    name: 'Google Maps',
    fetch: fetchFromGoogleMaps,
    priority: 1,
    cost: 1
  },
  {
    name: 'Yelp',
    fetch: fetchFromYelp,
    priority: 2,
    cost: 0 // Free tier
  },
  {
    name: 'Facebook',
    fetch: fetchFromFacebook,
    priority: 3,
    cost: 0
  },
  {
    name: 'Gemini Web',
    fetch: fetchFromGemini,
    priority: 4,
    cost: 1
  }
];

export async function searchMultipleSources(
  query: SearchParams,
  sources: string[]
) {
  const selectedSources = dataSources.filter(s => 
    sources.includes(s.name)
  );
  
  const results = await Promise.all(
    selectedSources.map(source => source.fetch(query))
  );
  
  // Merge and deduplicate
  return mergLeads(results.flat());
}
```

---

## 📊 Comparison Matrix

| Kaynak | Ücretsiz | Email | Phone | Social | B2B | B2C | Türkiye |
|--------|----------|-------|-------|--------|-----|-----|---------|
| Google Maps | ✅ | ❌ | ✅ | ❌ | ⭐⭐ | ⭐⭐⭐ | ✅ |
| Gemini | ✅ | ❌ | ❌ | ❌ | ⭐⭐ | ⭐⭐ | ✅ |
| Yelp | ✅ | ❌ | ✅ | ❌ | ⭐ | ⭐⭐⭐ | ⭐ |
| Facebook | ✅ | ❌ | ⭐ | ✅ | ⭐ | ⭐⭐⭐ | ✅ |
| Hunter.io | ⭐ | ✅ | ❌ | ❌ | ⭐⭐⭐ | ⭐⭐ | ✅ |
| LinkedIn | ❌ | ⭐ | ❌ | ✅ | ⭐⭐⭐ | ⭐ | ✅ |
| Clearbit | ❌ | ✅ | ⭐ | ✅ | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| Apollo | ❌ | ✅ | ✅ | ✅ | ⭐⭐⭐ | ⭐ | ⭐ |

---

## 🎁 Bonus: AI-Powered Features

### 1. Multi-Source Data Fusion
Gemini AI ile farklı kaynaklardan gelen verileri birleştir:
```typescript
// AI decides best data from multiple sources
const fusedLead = await gemini.fuseData({
  googleMaps: {...},
  yelp: {...},
  facebook: {...}
});
```

### 2. Predictive Lead Scoring
AI ile lead kalitesini tahmin et:
```typescript
const prediction = await gemini.predictLeadQuality({
  industry: 'restaurant',
  location: 'Istanbul',
  competitors: [...],
  seasonality: 'summer'
});
```

### 3. Smart Contact Discovery
AI ile contact pattern'leri öğren:
```typescript
const contacts = await gemini.discoverContacts({
  companyName: 'ABC Corp',
  website: 'abc.com',
  linkedInPage: '...'
});
```

---

## 🚀 Hemen Başlamak İçin

Sizin için en mantıklı 3 entegrasyon:

1. **Yelp API** - Restaurant/cafe lead'leri için perfect match
2. **Hunter.io** - Email bulma (free tier ile başla)
3. **Facebook Graph API** - Social presence check

Bu 3'ünü ekleyelim mi? 🎯

