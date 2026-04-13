# 🎯 Lead Generation SaaS

<div align="center">

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

**Google Gemini AI destekli, akıllı lead keşfi ve yönetim platformu.**

</div>

---

## ✨ Özellikler

- 🤖 **AI Lead Keşfi** — Google Gemini ile akıllı potansiyel müşteri bulma
- 📊 **Dashboard & Analitik** — Gerçek zamanlı istatistikler ve grafikler
- 🔍 **Gelişmiş Filtreleme** — Sektör, lokasyon, büyüklük bazlı arama
- ⭐ **Lead Skorlama** — AI destekli kalite değerlendirmesi
- 📤 **Dışa Aktarma** — Excel ve CSV formatlarında export
- 🌙 **Dark Mode** — Karanlık tema desteği
- 🔔 **Bildirimler** — Toast notification sistemi
- 📱 **Responsive** — Mobil uyumlu tasarım

## 🛠 Teknolojiler

| Teknoloji | Versiyon |
|-----------|----------|
| React | 19.2.0 |
| TypeScript | 5.8.2 |
| Vite | 6.2.0 |
| Google Generative AI SDK | 1.29.0 |
| Tailwind CSS | CDN |

## 📁 Proje Yapısı

```
src/
├── components/         # 12+ UI bileşeni
│   ├── DashboardStats/
│   ├── FilterControls/
│   ├── LeadDetailModal/
│   └── SearchForm/
├── pages/              # Sayfa bileşenleri
├── context/            # Auth, Theme, Toast context
├── services/           # API servisleri
├── hooks/              # Custom hooks
├── utils/              # Export, validation
└── types/              # TypeScript tanımları
```

## 🚀 Kurulum

```bash
git clone https://github.com/mvtandas/lead-generation-saas.git
cd lead-generation-saas
npm install
# .env dosyasına GOOGLE_GENAI_API_KEY ekle
npm run dev
```

## 📝 Lisans

MIT
