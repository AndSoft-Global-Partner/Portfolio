import { useState, useCallback, type ReactNode } from 'react';
import { I18nContext, translations, type Lang } from './i18nConfig';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('app_lang');
      return (saved === 'MN' ? 'MN' : 'EN') as Lang;
    } catch {
      return 'EN';
    }
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'EN' ? 'MN' : 'EN';
      try { localStorage.setItem('app_lang', next); } catch { /* noop */ }
      return next;
    });
  }, []);

  const handleSetLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    try { localStorage.setItem('app_lang', newLang); } catch { /* noop */ }
  }, []);

  const t = useCallback((key: keyof typeof translations): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry['EN'] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}
