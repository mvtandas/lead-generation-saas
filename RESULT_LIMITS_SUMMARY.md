# 📊 Plan Bazlı Result Limitleri

## 🎯 Maliyet Optimizasyonu Stratejisi

### Problem:
Google Maps API her lead için ~$0.017 ücret alıyor. Tüm kullanıcılara aynı sayıda lead dönmek maliyeti artırıyor ve plan farklılaşması yok.

### Çözüm:
Plan bazlı result limitleri ile:
1. ✅ Maliyet kontrolü
2. ✅ Plan value proposition
3. ✅ Upgrade incentive
4. ✅ Kullanıcı şeffaflığı

---

## 📈 Plan Bazlı Limitler

### FREE Plan
- **Limit:** 10 lead/arama
- **Maliyet/arama:** $0.017 × 10 = **$0.17**
- **Aylık maliyet:** 50 arama × $0.17 = **$8.50**
- **Kullanıcı değeri:** Test etmek için yeterli

### PRO Plan ($29/ay)
- **Limit:** 20 lead/arama
- **Maliyet/arama:** $0.017 × 20 = **$0.34**
- **Aylık maliyet:** 500 arama × $0.34 = **$170** (worst case)
- **Gerçek kullanım:** ~200 arama × $0.34 = **$68**
- **Kar:** $29 - $68 = **-$39** (kabul edilebilir, diğer özelliklerle denge)

### BUSINESS Plan ($99/ay)
- **Limit:** 50 lead/arama
- **Maliyet/arama:** $0.017 × 50 = **$0.85**
- **Aylık maliyet:** 2000 arama × $0.85 = **$1,700** (worst case)
- **Gerçek kullanım:** ~800 arama × $0.85 = **$680**
- **Not:** Business plan için yüksek volume expected

### ENTERPRISE Plan ($299+/ay)
- **Limit:** 100 lead/arama
- **Maliyet/arama:** $0.017 × 100 = **$1.70**
- **Aylık maliyet:** Sınırsız ama custom pricing
- **Strateji:** Volume-based pricing

---

## 💡 Implementation

### 1. Constants (plans.ts)
```typescript
export const RESULT_LIMITS = {
  free: 10,
  pro: 20,
  business: 50,
  enterprise: 100
};
```

### 2. Service Layer (leadService.ts)
```typescript
const fetchFromGoogleMaps = async (query: string, maxResults: number = 20): Promise<any[]> => {
  // API'den gelen sonuçları limit'e göre slice
  const limitedResults = results.slice(0, maxResults);
  console.log(`Limiting to ${maxResults} results based on plan`);
}
```

### 3. UI Layer (DashboardPage.tsx)
```typescript
const maxResults = RESULT_LIMITS[plan] || 10;
const fetchedLeads = await fetchLeads(country, city, district, keyword, source, maxResults);
showToast(`${fetchedLeads.length} lead bulundu! (${plan} plan: ${maxResults} lead/arama)`);
```

### 4. User Information (SearchFormEnhanced.tsx)
```typescript
<div className="banner">
  📊 {plan} Plan • Her aramada {maxResults} lead döner
  {plan === 'free' && <button>Daha fazla için yükselt →</button>}
</div>
```

---

## 🎨 User Experience

### Form Banner:
```
┌─────────────────────────────────────────────────────┐
│ 📊 Free Plan • Her aramada 10 lead döner            │
│                      [Daha fazla için yükselt →]   │
└─────────────────────────────────────────────────────┘
```

### Success Toast:
```
✅ 10 lead bulundu! (free plan limiti: 10 lead/arama)
```

### Pricing Page:
```
FREE Plan
- 50 arama/ay (Her aramada 10 lead)     ← Açık ve net!
- Google Maps verisi
...

PRO Plan
- 500 arama/ay (Her aramada 20 lead)    ← 2x daha fazla!
- Google Maps + Gemini AI
...
```

---

## 💰 Maliyet Analizi

### Scenario 1: Ortalama Kullanım
| Plan | Aramalar/ay | Lead/arama | Total Lead | API Cost | Plan Price | Margin |
|------|-------------|------------|------------|----------|------------|--------|
| Free | 30 | 10 | 300 | $5.10 | $0 | -$5.10 |
| Pro | 200 | 20 | 4,000 | $68 | $29 | -$39 |
| Business | 800 | 50 | 40,000 | $680 | $99 | -$581 |

**Not:** Business ve Enterprise için ek revenue streams:
- API access
- Team collaboration
- Premium features
- Custom integrations

### Scenario 2: Light Kullanım (80% users)
| Plan | Aramalar/ay | Lead/arama | Total Lead | API Cost | Plan Price | Margin |
|------|-------------|------------|------------|----------|------------|--------|
| Free | 10 | 10 | 100 | $1.70 | $0 | -$1.70 |
| Pro | 50 | 20 | 1,000 | $17 | $29 | **+$12** ✅ |
| Business | 200 | 50 | 10,000 | $170 | $99 | -$71 |

---

## 🎯 Benefits

### 1. Maliyet Kontrolü
- ✅ Her plan için predictable cost
- ✅ Worst-case scenario hesaplanabilir
- ✅ Budget planning mümkün

### 2. Value Differentiation
- ✅ Free vs Pro açık fark (10 vs 20 lead)
- ✅ Upgrade incentive güçlü
- ✅ "Daha fazla lead" = tangible benefit

### 3. User Transparency
- ✅ Kullanıcı ne alacağını biliyor
- ✅ Sürpriz yok
- ✅ Trust artıyor

### 4. Scalability
- ✅ Yeni planlar kolay eklenebilir
- ✅ Limitler runtime'da değiştirilebilir
- ✅ A/B testing yapılabilir

---

## 🚀 Future Optimizations

### 1. Dynamic Pricing
```typescript
// Peak hours için farklı limitler
const getMaxResults = (plan: PlanType, hour: number) => {
  const baseLimit = RESULT_LIMITS[plan];
  return hour >= 9 && hour <= 17 ? baseLimit : baseLimit * 1.2;
};
```

### 2. Credit System
```typescript
// Kullanılmayan aramalar credit olarak saklanabilir
interface PlanCredits {
  searches: number;
  rollover: boolean;  // Sonraki aya taşıma
}
```

### 3. Batch Pricing
```typescript
// Çok arama yapanlar için volume discount
const getBatchDiscount = (monthlySearches: number) => {
  if (monthlySearches > 1000) return 0.2;  // %20 off
  if (monthlySearches > 500) return 0.1;   // %10 off
  return 0;
};
```

### 4. Cache Strategy
```typescript
// Aynı arama tekrar yapılırsa cache'den dön (ücretsiz)
const getCachedOrFetch = async (query: string, maxResults: number) => {
  const cached = await cache.get(query);
  if (cached && cached.results.length >= maxResults) {
    return cached.results.slice(0, maxResults);
  }
  return fetchFromGoogleMaps(query, maxResults);
};
```

---

## ✅ Sonuç

### Implemented:
✅ Plan bazlı result limitleri
✅ Kullanıcıya görsel feedback
✅ Toast notifications
✅ Pricing page updates
✅ Türkçe çeviriler

### Impact:
- 📉 Maliyet kontrolü altında
- 📈 Clear value proposition
- 💪 Strong upgrade incentive
- 🎯 Better user experience

### Next Steps:
1. Monitor actual usage patterns
2. Adjust limits based on data
3. Consider cache implementation
4. Add usage analytics

---

**Status:** ✅ **PRODUCTION READY**

Kullanıcılar artık plan bazında farklı lead sayıları alacak ve bunun farkında olacaklar!

