import { useState, useEffect, useMemo } from 'react';
import { Globe, Wifi, Battery, Volume2, Menu, X, Sun, Moon } from 'lucide-react';
import { useI18n } from '../useI18n';
import { useTheme } from '../useTheme';

function getDateTime() {
  const now = new Date();
  return {
    time: now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    date: now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  };
}

export default function Header() {
  const { lang, toggleLang, t } = useI18n();
  const { isDark, toggleTheme } = useTheme();

  const [{ time, date }, setDateTime] = useState(getDateTime);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ⏱ Update once per minute (performance friendly) */
  useEffect(() => {
    const update = () => setDateTime(getDateTime());
    update();

    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  /* 📱 Close mobile menu on resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navItems = useMemo(
    () => [
      { label: t('nav.home'), href: '#home' },
      { label: t('nav.technologies'), href: '#technologies' },
      { label: t('nav.projects'), href: '#projects' },
      { label: t('nav.contact'), href: '#contact' },
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-50 bg-os-panel/95 backdrop-blur-md border-b border-os-border select-none">
      {/* Main bar */}
      <div className="h-8 flex items-center px-3 md:px-4">
        {/* Left */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-sm bg-os-green/80" />
            <span className="font-mono text-[11px] font-semibold text-os-green tracking-wide">
              AndSoft
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-0.5 ml-2">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-os-muted hover:text-os-text hover:bg-os-border/30 px-2.5 py-0.5 rounded text-[11px] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Center */}
        <div className="hidden sm:block font-mono text-os-text text-[11px] font-medium tracking-wide">
          {date}&nbsp;&nbsp;{time}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5 flex-1 justify-end">
          <button
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className="text-os-muted hover:text-os-text transition-colors"
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>

          <button
            onClick={toggleLang}
            className="text-os-muted hover:text-os-text flex items-center gap-1 text-[10px] font-mono"
          >
            <Globe size={11} />
            {lang}
          </button>

          <Wifi size={12} className="text-os-muted hidden sm:block" />
          <Volume2 size={12} className="text-os-muted hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1 text-os-muted">
            <Battery size={12} />
            <span className="text-[10px] font-mono">98%</span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-os-green status-pulse" />

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden text-os-muted hover:text-os-text p-0.5"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          role="menu"
          className="md:hidden border-t border-os-border bg-os-panel/95 backdrop-blur-md px-4 py-2 space-y-1"
        >
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-os-muted hover:text-os-green text-[12px] font-mono py-1.5 px-2 rounded hover:bg-os-border/20"
            >
              {item.label}
            </a>
          ))}

          <div className="flex items-center gap-3 pt-2 border-t border-os-border/50">
            <button
              onClick={toggleTheme}
              className="text-os-muted hover:text-os-text text-[11px] font-mono flex items-center gap-1"
            >
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
              {isDark ? 'Light' : 'Dark'}
            </button>

            <button
              onClick={toggleLang}
              className="text-os-muted hover:text-os-text text-[11px] font-mono flex items-center gap-1"
            >
              <Globe size={11} />
              {lang}
            </button>
          </div>

          <div className="text-[10px] font-mono text-os-dim">
            {date} {time}
          </div>
        </div>
      )}
    </header>
  );
}