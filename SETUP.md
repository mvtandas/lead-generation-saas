# 🚀 Lead Generation SaaS - Kurulum Talimatları

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- Google Cloud Console hesabı
- Google API Keys (Gemini AI + Google Maps)

## 🔧 Kurulum Adımları

### 1. Proje Bağımlılıklarını Yükleyin

```bash
npm install
```

### 2. Google Cloud Console Yapılandırması

#### A. Google Cloud Console'a Giriş
1. https://console.cloud.google.com/ adresine gidin
2. Yeni bir proje oluşturun veya mevcut projenizi seçin

#### B. Gerekli API'leri Etkinleştirin

Aşağıdaki API'leri etkinleştirmeniz gerekiyor:

1. **Maps JavaScript API**
   - URL: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
   - "ENABLE" butonuna tıklayın

2. **Places API (New)**
   - URL: https://console.cloud.google.com/apis/library/places-backend.googleapis.com
   - "ENABLE" butonuna tıklayın

3. **Geocoding API**
   - URL: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com
   - "ENABLE" butonuna tıklayın

#### C. API Key Oluşturma

1. "APIs & Services" > "Credentials" bölümüne gidin
2. "+ CREATE CREDENTIALS" > "API key" seçin
3. Oluşturulan API key'i kopyalayın

#### D. API Key'i Güvenli Hale Getirin

1. Oluşturduğunuz API key'e tıklayın
2. **Application restrictions** bölümünde:
   - "HTTP referrers (web sites)" seçin
   - Geliştirme için şu URL'leri ekleyin:
     - `http://localhost:*`
     - `http://127.0.0.1:*`
     - `http://localhost:3000/*`
   
3. **API restrictions** bölümünde:
   - "Restrict key" seçin
   - Şu API'leri seçin:
     - Maps JavaScript API
     - Places API
     - Geocoding API

4. "SAVE" butonuna tıklayın

### 3. Gemini AI API Key Oluşturma

1. https://aistudio.google.com/app/apikey adresine gidin
2. "Create API Key" butonuna tıklayın
3. API key'i kopyalayın

### 4. Environment Variables Yapılandırması

1. `.env.example` dosyasını kopyalayın ve `.env` adıyla kaydedin:

```bash
cp .env.example .env
```

2. `.env` dosyasını açın ve API key'lerinizi ekleyin:

```env
GEMINI_API_KEY=buraya-gemini-api-key-yapistirin
GOOGLE_API_KEY=buraya-google-maps-api-key-yapistirin
```

⚠️ **ÖNEMLİ**: `.env` dosyasını asla Git'e commit etmeyin! Bu dosya `.gitignore`'da listelenmiştir.

### 5. Uygulamayı Çalıştırın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata: ApiNotActivatedMapError

**Sorun**: Google Maps API'leri etkinleştirilmemiş.

**Çözüm**: 
- Google Cloud Console'da yukarıdaki API'lerin tümünün etkinleştirildiğinden emin olun
- API'leri etkinleştirdikten sonra birkaç dakika bekleyin
- Tarayıcı cache'ini temizleyin ve sayfayı yenileyin

### Hata: Google Maps authentication failed

**Sorun**: API key yanlış veya geçersiz.

**Çözüm**:
- `.env` dosyasındaki `GOOGLE_API_KEY` değerinin doğru olduğundan emin olun
- API key'in kısıtlamalarını kontrol edin
- Dev server'ı yeniden başlatın: `npm run dev`

### Hata: 404 (Not Found)

**Sorun**: Bir kaynak dosyası bulunamıyor.

**Çözüm**:
- `index.html` dosyasında eksik CSS referansını kaldırdık
- Tarayıcı cache'ini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)

### Uyarı: PlacesService is deprecated

**Not**: Google, eski PlacesService API'sini kullanımdan kaldırıyor. Şu anda hala çalışıyor ancak gelecekte yeni Place API'sine geçiş yapmanız gerekebilir.

Bu bir hata değil, sadece bir uyarıdır ve uygulamanın çalışmasını engellemez.

## 📝 Notlar

- **Free Tier Limitleri**: Google Maps API'nin ücretsiz katmanı aylık belirli sayıda istek içerir. Aşırı kullanımdan kaçının.
- **API Key Güvenliği**: Production ortamında mutlaka domain kısıtlamaları ekleyin.
- **Faturalama**: Google Cloud'da faturalama etkinleştirilmelidir (ücretsiz kullanım limitleri içinde kalabilirsiniz).

## 🆘 Yardım

Sorun yaşıyorsanız:
1. Tarayıcı konsolunu kontrol edin (F12)
2. Terminal çıktısını inceleyin
3. `.env` dosyasının doğru yapılandırıldığından emin olun
4. Google Cloud Console'da tüm API'lerin etkinleştirildiğini doğrulayın

---

**Başarılar! 🎉**

