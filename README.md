# POSAVER

Kahve posasından parfüm girdisi: EU Climate Ideathon 2026 projesinin tanıtım sitesi ve günlük blogu.
Astro + TypeScript, Three.js (3D fincan), GSAP + Lenis (animasyon ve kaydırma).

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne statik site üretir
```

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
Adres: `https://<kullanıcı>.github.io/<repo-adı>/`. Özel alan adı bağlanınca `BASE_PATH` gerekmez.

`vercel.json` Vercel'e yayın için hazırdır (zorunlu değil).

## Düzenlenecekler

- İletişim e-postası: `src/data/site.ts`
