export type Lang = 'tr' | 'en';

export const tx = (lang: Lang, tr: string, en: string) => (lang === 'en' ? en : tr);

/** Home page path for a language. */
export const homePath = (lang: Lang) => (lang === 'en' ? '/en/' : '/');
