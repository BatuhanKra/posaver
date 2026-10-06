# POSAVER

Kahve posasından parfüm girdisi: EU Climate Ideathon 2026 projesinin tanıtım sitesi ve günlük blogu.
Astro + TypeScript, Three.js (3D fincan), GSAP + Lenis (animasyon ve kaydırma).

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne statik site üretir
```

## Yönetici paneli

`/admin/` adresindeki panelden (Sveltia CMS) blog yazıları yönetilir. Kurulum ve kullanım: [YONETICI-REHBERI.md](YONETICI-REHBERI.md)

## Blog yazısı eklemek

`src/content/blog/` altına bir `.md` dosyası ekleyin:

```md
---
title: 'Başlık'
description: 'Kısa özet'
date: 2026-10-05
---

Yazı metni...
```

## Yayın

`main` dalına her push, GitHub Actions ile GitHub Pages'e yayınlanır (`.github/workflows/deploy.yml`).
Repo ayarlarında **Settings → Pages → Source: GitHub Actions** seçili olmalıdır.
Adres: https://posaver.com (özel alan adı; DNS Cloudflare'de, kayıt Natro'da). Alt dizinde yayın gerekirse build sırasında `BASE_PATH` ve `SITE_URL` ortam değişkenlerini verin.

`vercel.json` Vercel'e yayın için hazırdır (zorunlu değil).

## Düzenlenecekler

- İletişim e-postası: `src/data/site.ts` (şu an posaver.info@gmail.com)
