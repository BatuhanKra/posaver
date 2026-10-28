export type Tone = 'dark-espresso' | 'dark-forest' | 'light' | 'light-gray';

export interface SectionMeta {
  id: string;
  menu: string;
  tone: Tone;
}

export const sections: SectionMeta[] = [
  { id: 'hero', menu: 'Giriş', menuEn: 'Intro', tone: 'dark-espresso' },
  { id: 'sorun', menu: 'Sorun', menuEn: 'The problem', tone: 'light' },
  { id: 'neden-onemli', menu: 'Neden önemli?', menuEn: 'Why it matters', tone: 'dark-forest' },
  { id: 'deger-zinciri', menu: 'Değer zinciri', menuEn: 'Value chain', tone: 'light-gray' },
  { id: 'cozum', menu: 'Çözümümüz', menuEn: 'Our solution', tone: 'dark-espresso' },
  { id: 'ilerleme', menu: 'Gelinen nokta', menuEn: 'Where we are', tone: 'light' },
  { id: 'urun-haritasi', menu: 'Ürün haritası', menuEn: 'Product map', tone: 'dark-forest' },
  { id: 'kafe-ortakligi', menu: 'Kafe ortaklığı', menuEn: 'Café partnership', tone: 'dark-espresso' },
  { id: 'pilot', menu: 'Pilot kararlar', menuEn: 'Pilot decisions', tone: 'light' },
  { id: 'yol-haritasi', menu: '12 haftalık pilot', menuEn: '12-week pilot', tone: 'dark-forest' },
  { id: 'buyume', menu: 'Kontrollü büyüme', menuEn: 'Controlled growth', tone: 'light-gray' },
  { id: 'olcum', menu: 'İklim etkisi', menuEn: 'Climate impact', tone: 'dark-espresso' },
  { id: 'neden-posaver', menu: 'Neden POSAVER?', menuEn: 'Why POSAVER?', tone: 'dark-forest' },
  { id: 'blog', menu: 'Blog', menuEn: 'Blog', tone: 'light' },
  { id: 'iletisim', menu: 'İletişim', menuEn: 'Contact', tone: 'dark-espresso' },
];
