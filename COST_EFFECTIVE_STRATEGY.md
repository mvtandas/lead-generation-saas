# 💰 Maliyet-Etkin Lead Generation Stratejisi

## 🎯 Hedef: Maksimum Veri, Minimum Maliyet

---

## ✅ ÖNERİLEN ÜCRETSIZ STACK

### TIER 1: TAMAMEN ÜCRETSİZ (Ana Veri Kaynakları)

#### 1. ✅ **Google Maps Places API** (MEVCUT)
**Ücretsiz Quota:** 
- $200/ay free credit
- ~28,000 Places API call/ay
- Her arama ~$0.017

**Strateji:**
- Cache kullan (aynı yeri tekrar arama)
- Batch işlemler yap
- Gerekli field'ları sınırla

```typescript
// Optimized kullanım
fields: 'name,formatted_phone_number,website,rating,user_ratings_total'
// Sadece gerekli field'lar = daha ucuz
```

**Kullanım:** ANA veri kaynağı ✅

---

#### 2. ✅ **Google Gemini AI** (MEVCUT)
**Ücretsiz Quota:**
- 60 request/dakika
- 1500 request/gün
- Text generation ücretsiz

**Strateji:**
- Web search ile data enrichment
- Email pattern tahmin et
- Social media link'leri tahmin et
- Company description oluştur

```typescript
// AI ile akıllı enrichment
const enriched = await gemini.analyze({
  companyName: "ABC Restaurant",
  website: "abc.com",
  prompt: "Find email, social media, and contact info"
});
```

**Kullanım:** Enrichment + Web search ✅

---

#### 3. 🆕 **Google Custom Search API**
**Ücretsiz Quota:**
- 100 search/gün ücretsiz
- $5 per 1000 queries sonra

**Neler Bulunur:**
- Company websites
- Social media profiles
- Contact pages
- News mentions
- Directory listings

**Strateji:**
```typescript
// Targeted search
const queries = [
  `"${companyName}" email contact`,
  `"${companyName}" facebook`,
  `"${companyName}" instagram`,
  `"${companyName}" linkedin`
];
// 4 query = 1 lead için tüm sosyal medya!
```

**Kullanım:** Social media + email finder ✅

---

#### 4. 🆕 **Facebook Graph API**
**Ücretsiz Quota:**
- Rate limit var ama ücretsiz
- 200 calls/user/hour

**Neler Bulunur:**
- Business page info
- Page likes/followers
- Contact button
- About info
- Page category

**Strateji:**
```typescript
// Company name ile page search
const page = await searchFacebookPage(companyName);
// Phone, website, about info ücretsiz!
```

**Kullanım:** Social presence + extra contact info ✅

---

#### 5. 🆕 **Instagram Basic Display API**
**Ücretsiz Quota:**
- Rate limit var ama ücretsiz
- Public profile data

**Neler Bulunur:**
- Business account detection
- Follower count
- Bio (often has phone/email)
- Contact button

**Strateji:**
```typescript
// Username tahmin et ve check et
const usernames = generateInstagramUsernames(companyName);
const profile = await findInstagramProfile(usernames);
```

**Kullanım:** B2C için social proof ✅

---

### TIER 2: SINIRLI ÜCRETSİZ (Akıllıca Kullan)

#### 6. 🆕 **Hunter.io** (25 ücretsiz/ay)
**Ücretsiz Quota:**
- 25 email search/ay
- 50 email verification/ay

**Strateji:**
- Sadece HIGH-VALUE lead'ler için kullan
- Gemini AI'nin bulduğu email'leri verify et
- Quality score 60+ olan lead'ler için

```typescript
// Smart usage
if (lead.qualityScore >= 60 && !lead.email) {
  const email = await hunter.findEmail(lead.website);
}
```

**Kullanım:** High-value lead'ler için email ✅

---

### TIER 3: TAMAMEN ÜCRETSİZ AMA DEVELOPMENT GEREKTİRİR

#### 7. 🆕 **Smart Web Scraping**
**Maliyet:** $0 (sadece development time)

**Hedef Siteler:**
- Company contact pages
- About us pages
- Footer'daki social links
- Schema.org markup

**Strateji:**
```typescript
// Website'den otomatik bilgi çıkar
const scrapedData = await scrapeCompanyWebsite(lead.website);
// Email, phone, social media links
```

**Kullanım:** Website varsa otomatik enrich ✅

---

#### 8. 🆕 **Social Media Username Prediction**
**Maliyet:** $0 (Pure AI logic)

**Nasıl Çalışır:**
```typescript
// Pattern matching ile username tahmin et
const patterns = [
  companyName.toLowerCase().replace(/\s/g, ''),
  companyName.toLowerCase().replace(/\s/g, '_'),
  companyName.toLowerCase().replace(/\s/g, '.'),
  // ... more patterns
];

// Check if exists (HEAD request - super cheap)
for (const pattern of patterns) {
  const exists = await checkSocialMediaExists(platform, pattern);
  if (exists) return `https://${platform}.com/${pattern}`;
}
```

**Kullanım:** Tüm lead'ler için social media bul ✅

---

## 🎯 ÖNERİLEN IMPLEMENTATİON PLAN

### PHASE 1: ÜCRETSİZ API'LER (1 hafta)

```typescript
// services/freeDataSources.ts

// 1. Google Custom Search ile social media bul
export async function findSocialMediaWithSearch(companyName: string) {
  const queries = [
    `"${companyName}" facebook`,
    `"${companyName}" instagram`, 
    `"${companyName}" linkedin`,
    `"${companyName}" twitter`
  ];
  
  const results = await Promise.all(
    queries.map(q => googleCustomSearch(q))
  );
  
  return extractSocialLinks(results);
}

// 2. Facebook Graph API ile page info al
export async function enrichWithFacebook(companyName: string) {
  const page = await searchFacebookPage(companyName);
  if (page) {
    return {
      facebook: page.link,
      phone: page.phone,
      likes: page.fan_count,
      category: page.category
    };
  }
}

// 3. Smart username prediction
export async function predictSocialMediaProfiles(companyName: string) {
  const predictions = {
    instagram: await predictInstagram(companyName),
    linkedin: await predictLinkedIn(companyName),
    twitter: await predictTwitter(companyName)
  };
  
  // Verify predictions with HEAD requests (very cheap)
  return verifyPredictions(predictions);
}
```

---

### PHASE 2: AKILLI ENRICHMENT (1 hafta)

```typescript
// services/smartEnrichment.ts

export async function smartEnrich(lead: Lead) {
  const enrichmentSteps = [];
  
  // STEP 1: Ücretsiz Google Custom Search (100/gün)
  if (lead.website) {
    enrichmentSteps.push(findSocialMediaWithSearch(lead.companyName));
  }
  
  // STEP 2: Facebook ücretsiz
  enrichmentSteps.push(enrichWithFacebook(lead.companyName));
  
  // STEP 3: Username prediction (ücretsiz)
  enrichmentSteps.push(predictSocialMediaProfiles(lead.companyName));
  
  // STEP 4: Website scraping (ücretsiz)
  if (lead.website) {
    enrichmentSteps.push(scrapeContactInfo(lead.website));
  }
  
  // STEP 5: Gemini AI akıllı tahmin (ücretsiz)
  enrichmentSteps.push(geminiPredictContacts(lead));
  
  // STEP 6: Hunter.io SADECE high-value için (25/ay limit)
  if (lead.qualityScore >= 60 && !lead.email) {
    enrichmentSteps.push(hunterFindEmail(lead.website));
  }
  
  const results = await Promise.all(enrichmentSteps);
  return mergeEnrichmentData(results);
}
```

---

### PHASE 3: CACHING & OPTIMIZATION (sürekli)

```typescript
// services/cache.ts

// Local cache ile API call'ları minimize et
const cache = new Map<string, CachedData>();

export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 86400000 // 24 hours
): Promise<T> {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    console.log(`Cache HIT: ${key}`);
    return cached.data;
  }
  
  console.log(`Cache MISS: ${key}`);
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
}

// Kullanım
const facebookData = await getCachedOrFetch(
  `facebook:${companyName}`,
  () => enrichWithFacebook(companyName)
);
```

---

## 💰 MALİYET ANALİZİ

### Aylık Maliyet (1000 lead için)

| Kaynak | Ücretsiz Quota | Maliyet/Lead | 1000 Lead |
|--------|----------------|--------------|-----------|
| Google Maps | 28,000 call/ay | $0 | **$0** |
| Gemini AI | 1,500/gün | $0 | **$0** |
| Custom Search | 100/gün (3000/ay) | $0 | **$0** |
| Facebook API | Unlimited | $0 | **$0** |
| Instagram API | Unlimited | $0 | **$0** |
| Hunter.io | 25/ay | $0 (limited) | **$0** |
| Web Scraping | ∞ | $0 | **$0** |
| **TOPLAM** | - | - | **$0/ay** |

### Ücretsiz Quota Biterse:
- Google Custom Search: $5/1000 = **$5/ay** (1000 extra search)
- Hunter.io: $49/ay = **$49/ay** (1000 search)
- **Maksimum Maliyet: ~$50/ay**

---

## 🚀 VERİ TOPLAMA STRATEJİSİ

### Her Lead İçin Otomatik:

```typescript
const dataCollectionPipeline = {
  // 1. Google Maps (PRIMARY - ücretsiz quota içinde)
  primary: await fetchFromGoogleMaps(query),
  
  // 2. Custom Search - Social media (100/gün ücretsiz)
  social: await findSocialMediaWithSearch(companyName),
  
  // 3. Facebook enrichment (ücretsiz)
  facebook: await enrichWithFacebook(companyName),
  
  // 4. Smart username prediction (ücretsiz)
  predicted: await predictSocialMediaProfiles(companyName),
  
  // 5. Website scraping (eğer website varsa, ücretsiz)
  scraped: website ? await scrapeContactInfo(website) : null,
  
  // 6. Gemini AI enrichment (ücretsiz quota içinde)
  aiEnriched: await geminiEnrichLead(lead),
  
  // 7. Hunter.io (sadece high-value, 25/ay)
  email: qualityScore >= 60 ? await hunterFindEmail(website) : null
};

// Merge all data
const enrichedLead = mergeAllSources(dataCollectionPipeline);
```

### Beklenen Sonuç:
✅ **Şirket Adı** - Google Maps
✅ **Telefon** - Google Maps
✅ **Website** - Google Maps
✅ **Adres** - Google Maps
✅ **Rating** - Google Maps
✅ **Review Count** - Google Maps
✅ **Facebook** - Custom Search + Facebook API
✅ **Instagram** - Prediction + Verification
✅ **LinkedIn** - Prediction + Custom Search
✅ **Email** - Scraping + AI + Hunter.io (high-value)
✅ **Description** - Gemini AI
✅ **Business Hours** - Google Maps
✅ **Photos** - Google Maps

**Total Fields: 13+ field per lead**
**Total Cost: $0** (ücretsiz quota içinde)

---

## 📊 OPTIMIZATION TRICKS

### 1. **Rate Limit Management**
```typescript
// Queue system ile rate limit'leri yönet
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  
  async add<T>(fn: () => Promise<T>, limit: number): Promise<T> {
    return new Promise((resolve) => {
      this.queue.push(async () => {
        await this.wait(limit);
        const result = await fn();
        resolve(result);
      });
      this.process();
    });
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      await fn?.();
    }
    
    this.processing = false;
  }
  
  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Kullanım
const limiter = new RateLimiter();
const result = await limiter.add(
  () => customSearch(query),
  1000 // 1 saniye wait
);
```

### 2. **Batch Processing**
```typescript
// 100 lead'i batch'le işle
const leads = [...]; // 100 leads
const batchSize = 10;

for (let i = 0; i < leads.length; i += batchSize) {
  const batch = leads.slice(i, i + batchSize);
  await Promise.all(batch.map(lead => enrichLead(lead)));
  
  // Rate limit için wait
  await sleep(1000);
}
```

### 3. **Progressive Enhancement**
```typescript
// İlk önce hızlı ve ücretsiz olanları yap
const quickEnrich = await Promise.all([
  fetchFromGoogleMaps(query),      // Fast, free
  predictSocialMedia(companyName)   // Instant, free
]);

// Sonra yavaş olanları background'da yap
setTimeout(async () => {
  const deepEnrich = await Promise.all([
    customSearch(companyName),      // Slower, limited
    scrapeWebsite(website),         // Slower, free
    facebookAPI(companyName)        // Medium, free
  ]);
  
  updateLead(leadId, deepEnrich);
}, 0);
```

---

## ✅ SONUÇ: MAKSIMUM VERİ, MİNİMUM MALİYET

### Ekleyeceğimiz 5 Ücretsiz Kaynak:
1. ✅ **Google Custom Search API** - Social media finder
2. ✅ **Facebook Graph API** - Business page enrichment
3. ✅ **Instagram Detection** - Profile finder
4. ✅ **Smart Username Prediction** - AI-powered guessing
5. ✅ **Website Scraping** - Contact page extraction

### Bonus: Akıllı Kullanım
6. ✅ **Hunter.io** - 25/ay ücretsiz (sadece high-value için)
7. ✅ **Gemini AI** - Prediction & enrichment

### Beklenen Veri Artışı:
- **Şu an:** 7-8 field per lead
- **Sonra:** 13-15 field per lead
- **Artış:** %75+ daha fazla veri

### Beklenen Maliyet:
- **İlk 3000 lead/ay:** $0 (tamamen ücretsiz)
- **Sonrası:** ~$5-50/ay (sadece limit aşımları)

---

## 🚀 HEMEN BAŞLAYALIM MI?

Bu 5 kaynağı implement edelim:
1. Google Custom Search
2. Facebook Graph API  
3. Instagram Detection
4. Username Prediction
5. Website Scraping

Hepsi ücretsiz ve maksimum veri sağlıyor! ✅

