# 💸 Mevcut Uygulamayı Daha Ucuz Hale Getirme

## 🎯 Hedef: Mevcut Maliyetleri Minimize Et

---

## 📊 MEVCUT DURUM ANALİZİ

### Şu Anki Maliyet Noktaları:

1. **Google Maps API**
   - Places Search: $0.017 per request
   - Place Details: $0.017 per request
   - **Sorun:** Her arama için API call yapılıyor
   - **Sorun:** Tüm field'lar çekiliyor (pahalı)
   - **Sorun:** Cache yok, aynı yerler tekrar aranıyor

2. **Gemini AI**
   - Ücretsiz: 60 req/dakika, 1500 req/gün
   - **Sorun:** Rate limit aşımı riski
   - **Sorun:** Her lead için enrichment yapılıyor

---

## ✅ OPTİMİZASYON STRATEJİLERİ

### 1. 🗄️ CACHE SİSTEMİ (EN ÖNEMLİ!)

**Maliyet Azaltma:** %60-80

**Neden Önemli:**
- Aynı "Restaurant Kadıköy" araması 10 kez yapılıyorsa
- 10 API call yerine 1 API call = %90 tasarruf

**Implementation:**

```typescript
// utils/cacheManager.ts

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private dbName = 'lead-gen-cache';
  private storeName = 'queries';
  
  constructor() {
    this.cache = new Map();
    this.initIndexedDB();
  }
  
  // IndexedDB için persistent cache
  private async initIndexedDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }
  
  // Generate cache key
  private generateKey(type: string, params: any): string {
    return `${type}:${JSON.stringify(params)}`;
  }
  
  // Get from cache
  async get<T>(type: string, params: any): Promise<T | null> {
    const key = this.generateKey(type, params);
    
    // Check memory cache first (fast)
    const memoryEntry = this.cache.get(key);
    if (memoryEntry && Date.now() < memoryEntry.expiresAt) {
      console.log(`✅ Memory Cache HIT: ${key}`);
      return memoryEntry.data;
    }
    
    // Check IndexedDB (persistent)
    try {
      const db = await this.initIndexedDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const entry = request.result;
          if (entry && Date.now() < entry.expiresAt) {
            console.log(`✅ IndexedDB Cache HIT: ${key}`);
            // Restore to memory cache
            this.cache.set(key, entry);
            resolve(entry.data);
          } else {
            console.log(`❌ Cache MISS: ${key}`);
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error('IndexedDB error:', error);
      return null;
    }
  }
  
  // Set cache
  async set<T>(type: string, params: any, data: T, ttl: number = 86400000): Promise<void> {
    const key = this.generateKey(type, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };
    
    // Set in memory
    this.cache.set(key, entry);
    
    // Set in IndexedDB
    try {
      const db = await this.initIndexedDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.put({ key, ...entry });
    } catch (error) {
      console.error('IndexedDB write error:', error);
    }
  }
  
  // Clear expired entries
  async clearExpired(): Promise<void> {
    const now = Date.now();
    
    // Clear memory
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
      }
    }
    
    // Clear IndexedDB
    try {
      const db = await this.initIndexedDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (now >= cursor.value.expiresAt) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('IndexedDB clear error:', error);
    }
  }
  
  // Get cache stats
  getStats() {
    return {
      memorySize: this.cache.size,
      oldestEntry: Math.min(...Array.from(this.cache.values()).map(e => e.timestamp)),
      newestEntry: Math.max(...Array.from(this.cache.values()).map(e => e.timestamp))
    };
  }
}

export const cacheManager = new CacheManager();

// Auto-cleanup every hour
setInterval(() => {
  cacheManager.clearExpired();
}, 3600000);
```

**Kullanım:**
```typescript
// leadService.ts içinde

// ❌ BEFORE (her seferinde API call)
const results = await fetchFromGoogleMaps(query);

// ✅ AFTER (cache'den al veya API call yap)
const cacheKey = { keyword, location };
let results = await cacheManager.get('google-maps', cacheKey);

if (!results) {
  results = await fetchFromGoogleMaps(query);
  // 24 saat cache (same search sonraki gün de geçerli)
  await cacheManager.set('google-maps', cacheKey, results, 86400000);
}
```

**Beklenen Tasarruf:**
- İlk arama: $0.017
- Sonraki aramalar (24 saat içinde): $0
- Ortalama: %60-80 tasarruf

---

### 2. 📊 GOOGLE MAPS FIELD OPTİMİZASYONU

**Maliyet Azaltma:** %30-40

**Neden Önemli:**
- Her field ayrı fiyatlandırılıyor
- Gereksiz field'lar para kaybı

**Şu Anki Durum:**
```typescript
// Tüm field'lar çekiliyor (PAHALI!)
fields: [
  'name', 'formatted_phone_number', 'international_phone_number',
  'website', 'url', 'rating', 'user_ratings_total',
  'formatted_address', 'address_components', 'geometry',
  'opening_hours', 'photos', 'reviews', 'types',
  'business_status', 'price_level', 'vicinity'
  // ... daha fazla
]
```

**Optimized:**
```typescript
// SADECE gerekli field'lar (UCUZ!)
fields: [
  'name',                    // Şirket adı ✅
  'formatted_phone_number',  // Telefon ✅
  'website',                 // Website ✅
  'rating',                  // Rating ✅
  'user_ratings_total',      // Review count ✅
  'formatted_address',       // Adres ✅
  'geometry.location'        // Lat/Lng ✅
  // Toplam: 7 field
]

// Extra field'lar için lazy load
// Kullanıcı "Detay Göster" tıklarsa o zaman çek
lazyFields: [
  'opening_hours',           // İş saatleri
  'photos',                  // Fotoğraflar
  'reviews'                  // Yorumlar
]
```

**Implementation:**
```typescript
// services/leadService.ts

const BASIC_FIELDS = [
  'name',
  'formatted_phone_number',
  'website',
  'rating',
  'user_ratings_total',
  'formatted_address',
  'geometry.location'
];

const DETAILED_FIELDS = [
  ...BASIC_FIELDS,
  'opening_hours',
  'photos',
  'reviews',
  'price_level'
];

// İlk arama: sadece basic fields
export const fetchLeadsBasic = async (query: string) => {
  const request = {
    query,
    fields: BASIC_FIELDS  // UCUZ!
  };
  // ...
};

// Detay görüntüleme: detailed fields
export const fetchLeadDetails = async (placeId: string) => {
  const cached = await cacheManager.get('place-details', { placeId });
  if (cached) return cached;
  
  const request = {
    placeId,
    fields: DETAILED_FIELDS  // Sadece gerektiğinde!
  };
  
  const details = await service.getDetails(request);
  await cacheManager.set('place-details', { placeId }, details);
  return details;
};
```

**Beklenen Tasarruf:**
- 17 field → 7 field = %60 field azaltma
- Maliyet: ~%30-40 azalma

---

### 3. ⚡ BATCH PROCESSING & RATE LIMITING

**Maliyet Azaltma:** %20-30

**Neden Önemli:**
- Aynı anda çok fazla istek atılıyor
- Rate limit aşımı risky
- Gereksiz concurrent call'lar

**Implementation:**
```typescript
// utils/rateLimiter.ts

class RateLimiter {
  private queue: Array<{
    fn: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  
  private processing = false;
  private lastCallTime = 0;
  private minInterval: number; // ms between calls
  private maxConcurrent: number;
  private activeCount = 0;
  
  constructor(callsPerSecond: number, maxConcurrent: number = 5) {
    this.minInterval = 1000 / callsPerSecond;
    this.maxConcurrent = maxConcurrent;
  }
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    if (this.activeCount >= this.maxConcurrent) return;
    
    this.processing = true;
    
    const item = this.queue.shift();
    if (!item) {
      this.processing = false;
      return;
    }
    
    // Wait for rate limit
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    
    this.lastCallTime = Date.now();
    this.activeCount++;
    
    try {
      const result = await item.fn();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.activeCount--;
      this.processing = false;
      this.process(); // Process next item
    }
  }
  
  getQueueSize() {
    return this.queue.length;
  }
}

// Google Maps: 100 req/10sec = 10 req/sec
export const googleMapsLimiter = new RateLimiter(10, 5);

// Gemini: 60 req/min = 1 req/sec
export const geminiLimiter = new RateLimiter(1, 3);
```

**Kullanım:**
```typescript
// leadService.ts

// ❌ BEFORE (sınırsız concurrent calls)
const results = await Promise.all(
  places.map(place => enrichWithGemini(place))
);

// ✅ AFTER (rate limited)
const results = await Promise.all(
  places.map(place => 
    geminiLimiter.add(() => enrichWithGemini(place))
  )
);
```

---

### 4. 🎯 SMART ENRICHMENT (Sadece Gerektiğinde)

**Maliyet Azaltma:** %40-50

**Neden Önemli:**
- Her lead'i enrich etmek gereksiz
- Sadece user'ın ilgilendiği lead'leri enrich et

**Strateji:**

```typescript
// types.ts

interface Lead {
  // ... existing fields
  enrichmentStatus: 'none' | 'basic' | 'full';
  lastEnriched?: number;
}
```

```typescript
// services/leadService.ts

export const fetchLeads = async (query: string) => {
  // STEP 1: Sadece Google Maps basic search (UCUZ)
  const results = await fetchFromGoogleMaps(query);
  
  return results.map(place => ({
    ...place,
    enrichmentStatus: 'basic',  // Henüz enrich edilmedi
    qualityScore: calculateBasicQuality(place)  // Basic score
  }));
};

// STEP 2: User "Enrich" butonuna bastığında
export const enrichLead = async (lead: Lead) => {
  // Cache check
  const cached = await cacheManager.get('enriched', { placeId: lead.placeId });
  if (cached) return cached;
  
  // Gemini ile enrich et
  const enriched = await geminiLimiter.add(() => 
    enrichWithGemini(lead)
  );
  
  const result = {
    ...lead,
    ...enriched,
    enrichmentStatus: 'full',
    lastEnriched: Date.now()
  };
  
  // Cache it
  await cacheManager.set('enriched', { placeId: lead.placeId }, result, 604800000); // 7 days
  
  return result;
};

// STEP 3: Toplu enrich (sadece görünen lead'ler)
export const enrichVisibleLeads = async (leads: Lead[], limit: number = 10) => {
  // İlk 10 lead'i enrich et (sayfalama için)
  const toEnrich = leads
    .filter(l => l.enrichmentStatus === 'basic')
    .slice(0, limit);
  
  return Promise.all(toEnrich.map(enrichLead));
};
```

**UI Değişikliği:**
```typescript
// DashboardPage.tsx

const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());

const handleEnrichLead = async (leadId: string) => {
  setEnrichingIds(prev => new Set(prev).add(leadId));
  
  const enriched = await enrichLead(leads.find(l => l.id === leadId));
  
  setLeads(prev => prev.map(l => 
    l.id === leadId ? enriched : l
  ));
  
  setEnrichingIds(prev => {
    const next = new Set(prev);
    next.delete(leadId);
    return next;
  });
  
  showToast('Lead enriched successfully!', 'success');
};

// Auto-enrich first page
useEffect(() => {
  if (leads.length > 0) {
    enrichVisibleLeads(leads, 10);
  }
}, [leads]);
```

**Beklenen Tasarruf:**
- 100 lead arama yapılırsa
- Eski: 100 Gemini call = 100 quota
- Yeni: 10 Gemini call (sadece görünenler) = 10 quota
- **%90 tasarruf!**

---

### 5. 📦 PAGINATION OPTİMİZASYONU

**Maliyet Azaltma:** %30-50

**Neden Önemli:**
- User ilk sayfayı görüyor genelde
- Tüm sonuçları çekmek gereksiz

**Implementation:**
```typescript
// services/leadService.ts

export const fetchLeadsPaginated = async (
  query: string,
  page: number = 1,
  pageSize: number = 20
) => {
  // Cache check
  const cacheKey = { query, page, pageSize };
  const cached = await cacheManager.get('paginated', cacheKey);
  if (cached) return cached;
  
  // Google Maps supports pagination via pageToken
  const request = {
    query,
    fields: BASIC_FIELDS,
    // Only fetch current page
    maxResults: pageSize
  };
  
  const results = await fetchFromGoogleMaps(request);
  
  await cacheManager.set('paginated', cacheKey, results);
  return results;
};
```

---

### 6. 💾 PERSISTENT STORAGE (LocalStorage + IndexedDB)

**Maliyet Azaltma:** %50-70

**Neden Önemli:**
- User refresh atsa bile cache'den yükle
- Aynı arama history'den gelse API call yapma

**Implementation:**
```typescript
// hooks/useLeadStorage.ts

export const useLeadStorage = () => {
  const [storedLeads, setStoredLeads] = useState<Lead[]>([]);
  
  useEffect(() => {
    // Load from IndexedDB on mount
    const loadStored = async () => {
      const stored = await cacheManager.get('user-leads', { userId: 'current' });
      if (stored) {
        setStoredLeads(stored);
      }
    };
    loadStored();
  }, []);
  
  const saveLeads = async (leads: Lead[]) => {
    await cacheManager.set('user-leads', { userId: 'current' }, leads, 604800000); // 7 days
    setStoredLeads(leads);
  };
  
  return { storedLeads, saveLeads };
};
```

---

## 📊 BEKLENEN TOPLAM TASARRUF

### Mevcut Maliyet (1000 lead/ay):
- Google Maps: 1000 search × $0.017 = **$17/ay**
- Place Details: 1000 × $0.017 = **$17/ay**
- Gemini AI: Ücretsiz (quota içinde)
- **TOPLAM: ~$34/ay**

### Optimize Sonrası:
- Google Maps: 400 search × $0.017 = **$6.80** (cache %60)
- Place Details: 100 × $0.012 = **$1.20** (field optimize %30 + lazy load)
- Gemini AI: Ücretsiz (sadece 10% enrich)
- **TOPLAM: ~$8/ay**

### 🎉 TASARRUF: %76 ($26/ay)

---

## ✅ IMPLEMENTATİON SIRASI

### PHASE 1: Critical Optimizations (Bugün)
1. ✅ Cache Manager oluştur
2. ✅ Google Maps field'ları optimize et
3. ✅ leadService'e cache entegre et

### PHASE 2: Advanced Optimizations (Yarın)
4. ✅ Rate Limiter ekle
5. ✅ Smart enrichment sistemi
6. ✅ Lazy loading for details

### PHASE 3: Polish (Bu hafta)
7. ✅ IndexedDB persistent cache
8. ✅ Cache statistics dashboard
9. ✅ Auto-cleanup mechanism

---

## 🚀 HEMEN BAŞLAYALIM MI?

3 kritik optimization'ı hemen implement edelim:
1. **Cache Manager** - %60-80 tasarruf
2. **Field Optimization** - %30-40 tasarruf
3. **Smart Enrichment** - %40-50 tasarruf

**Toplam: %76 maliyet azaltma!**

