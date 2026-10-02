export type Tone = 'dark-espresso' | 'dark-forest' | 'light';

export interface SectionMeta {
  id: string;
  menu: string;
  tone: Tone;
}

export const sections: SectionMeta[] = [
  { id: 'hero', menu: 'Giriş', tone: 'dark-espresso' },
  { id: 'sorun', menu: 'Sorun', tone: 'light' },
  { id: 'neden-onemli', menu: 'Neden önemli?', tone: 'dark-forest' },
  { id: 'deger-zinciri', menu: 'Değer zinciri', tone: 'light' },
  { id: 'cozum', menu: 'Çözümümüz', tone: 'dark-espresso' },
  { id: 'pilot', menu: 'Pilot kararlar', tone: 'light' },
  { id: 'yol-haritasi', menu: '12 haftalık pilot', tone: 'dark-forest' },
  { id: 'buyume', menu: 'Kontrollü büyüme', tone: 'light' },
  { id: 'olcum', menu: 'İklim etkisi', tone: 'dark-espresso' },
  { id: 'neden-posaver', menu: 'Neden POSAVER?', tone: 'dark-forest' },
  { id: 'blog', menu: 'Blog', tone: 'light' },
  { id: 'iletisim', menu: 'İletişim', tone: 'dark-espresso' },
];
