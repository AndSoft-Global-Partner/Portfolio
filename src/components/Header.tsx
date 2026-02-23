import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Globe, Wifi, Battery, Volume2, Menu, X, Sun, Moon,
  Search, ArrowRight, Languages,
  Home, Code, FolderOpen, Mail, MonitorDot, AppWindow,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../useI18n';
import { useTheme } from '../useTheme';
import { useWindowManager } from '../windowManager';

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
  const { openWindow } = useWindowManager();

  const [{ time, date }, setDateTime] = useState(getDateTime);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const [scrolled, setScrolled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(98);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  /* ⏱ Clock — update once per minute */
  useEffect(() => {
    const update = () => setDateTime(getDateTime());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  /* 📱 Close mobile menu on desktop resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* 🎯 Active section highlight — IntersectionObserver */
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-80px 0px -35% 0px' },
    );
    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  /* 📜 Scroll‐based header shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ⌨️ Command Palette — Ctrl+K / ⌘K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(v => !v);
        setPaletteQuery('');
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Auto‐focus palette input */
  useEffect(() => {
    if (paletteOpen) setTimeout(() => paletteInputRef.current?.focus(), 50);
  }, [paletteOpen]);

  /* 🔋 Real Battery API */
  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{
        level: number;
        addEventListener: (e: string, cb: () => void) => void;
        removeEventListener: (e: string, cb: () => void) => void;
      }>;
    };
    if (!nav.getBattery) return;
    nav.getBattery().then(bat => {
      setBatteryLevel(Math.round(bat.level * 100));
      const cb = () => setBatteryLevel(Math.round(bat.level * 100));
      bat.addEventListener('levelchange', cb);
    });
  }, []);

  /* ── Nav items ── */
  const navItems = useMemo(
    () => [
      { label: t('nav.home'), href: '#home', icon: Home },
      { label: t('nav.technologies'), href: '#technologies', icon: Code },
      { label: t('nav.projects'), href: '#projects', icon: FolderOpen },
      { label: t('nav.contact'), href: '#contact', icon: Mail },
    ],
    [t],
  );

  /* ── Command palette entries ── */
  const paletteActions = useMemo(
    () => [
      ...navItems.map(item => ({
        id: item.href,
        label: item.label,
        icon: item.icon,
        group: t('palette.navigate'),
        action: () => {
          document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
          setPaletteOpen(false);
        },
      })),
      {
        id: 'open-terminal',
        label: t('palette.openTerminal'),
        icon: MonitorDot,
        group: t('palette.apps'),
        action: () => { openWindow('home'); setPaletteOpen(false); },
      },
      {
        id: 'open-monitor',
        label: t('palette.openMonitor'),
        icon: AppWindow,
        group: t('palette.apps'),
        action: () => { openWindow('technologies'); setPaletteOpen(false); },
      },
      {
        id: 'open-files',
        label: t('palette.openFiles'),
        icon: FolderOpen,
        group: t('palette.apps'),
        action: () => { openWindow('projects'); setPaletteOpen(false); },
      },
      {
        id: 'open-mail',
        label: t('palette.openMail'),
        icon: Mail,
        group: t('palette.apps'),
        action: () => { openWindow('contact'); setPaletteOpen(false); },
      },
      {
        id: 'theme',
        label: t('palette.toggleTheme'),
        icon: isDark ? Sun : Moon,
        group: t('palette.actions'),
        action: () => { toggleTheme(); setPaletteOpen(false); },
      },
      {
        id: 'lang',
        label: t('palette.toggleLang'),
        icon: Languages,
        group: t('palette.actions'),
        action: () => { toggleLang(); setPaletteOpen(false); },
      },
    ],
    [navItems, isDark, t, toggleTheme, toggleLang, openWindow],
  );

  const filteredActions = useMemo(() => {
    if (!paletteQuery.trim()) return paletteActions;
    const q = paletteQuery.toLowerCase();
    return paletteActions.filter(a => a.label.toLowerCase().includes(q));
  }, [paletteQuery, paletteActions]);

  const runAction = useCallback(
    (a: (typeof paletteActions)[number]) => a.action(),
    [],
  );

  /* ══════════════════════════════════════ JSX ══════════════════════════════════════ */
  return (
    <>
      {/* ─── Sticky header ─── */}
      <header
        className={`sticky top-0 z-50 select-none transition-all duration-300 ${
          scrolled
            ? 'bg-os-panel/95 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.4)] border-b border-os-border'
            : 'bg-os-panel/80 backdrop-blur-md border-b border-os-border/50'
        }`}
      >
        <div className="h-9 flex items-center px-3 md:px-5">

          {/* ── Left: logo + nav ── */}
          <div className="flex items-center gap-3 flex-1">
            <a href="#home" className="flex items-center gap-2 group">
              <img
                src="/andsoft.png"
                alt="AndSoft"
                className="w-5 h-5 rounded-[4px] object-contain transition-transform duration-200 group-hover:scale-110"
              />
              <span className="font-mono text-[11px] font-semibold tracking-wide text-os-text/90 group-hover:text-os-green transition-colors duration-200">
                AndSoft
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-0.5 ml-3">
              {navItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                    active === item.href
                      ? 'text-os-green bg-os-green/[0.08]'
                      : 'text-os-muted hover:text-os-text hover:bg-os-border/30'
                  }`}
                >
                  {item.label}
                  {active === item.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-os-green"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* ── Center: command palette trigger + clock ── */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => { setPaletteOpen(true); setPaletteQuery(''); }}
              className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded border border-os-border/50 bg-os-bg/30 hover:bg-os-border/20 hover:border-os-border transition-all duration-200 group"
            >
              <Search size={10} className="text-os-dim group-hover:text-os-muted transition-colors" />
              <span className="text-[10px] font-mono text-os-dim group-hover:text-os-muted transition-colors hidden lg:inline">
                {t('palette.hint')}
              </span>
              <kbd className="text-[9px] font-mono text-os-dim bg-os-border/30 px-1 py-px rounded">⌘K</kbd>
            </button>

            <div className="font-mono text-os-text text-[11px] font-medium tracking-wide">
              {date}&nbsp;&nbsp;{time}
            </div>
          </div>

          {/* ── Right: system tray ── */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={toggleTheme}
              title={isDark ? 'Light mode' : 'Dark mode'}
              className="text-os-muted hover:text-os-text transition-colors duration-200 hover:rotate-12"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            <button
              onClick={toggleLang}
              className="text-os-muted hover:text-os-text flex items-center gap-1 text-[10px] font-mono transition-colors duration-200"
            >
              <Globe size={12} />
              <span className="uppercase">{lang}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-os-muted">
              <Wifi size={12} className="hover:text-os-text transition-colors" />
              <Volume2 size={12} className="hover:text-os-text transition-colors" />
            </div>

            <div className="hidden sm:flex items-center gap-1 text-os-muted">
              <Battery size={13} className={batteryLevel <= 20 ? 'text-os-red' : ''} />
              <span className={`text-[10px] font-mono tabular-nums ${batteryLevel <= 20 ? 'text-os-red' : ''}`}>
                {batteryLevel}%
              </span>
            </div>

            <div className="w-1.5 h-1.5 rounded-full bg-os-green status-pulse" />

            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden text-os-muted hover:text-os-text p-0.5 transition-colors"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-os-border bg-os-panel/95 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 text-[12px] font-mono py-2 px-3 rounded transition-all ${
                      active === item.href
                        ? 'text-os-green bg-os-green/[0.08]'
                        : 'text-os-muted hover:text-os-green hover:bg-os-border/20'
                    }`}
                  >
                    <item.icon size={13} />
                    {item.label}
                    {active === item.href && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-os-green" />
                    )}
                  </a>
                ))}

                <div className="flex items-center gap-3 pt-2 border-t border-os-border/50">
                  <button onClick={toggleTheme} className="text-os-muted hover:text-os-text text-[11px] font-mono flex items-center gap-1">
                    {isDark ? <Sun size={12} /> : <Moon size={12} />}
                    {isDark ? 'Light' : 'Dark'}
                  </button>
                  <button onClick={toggleLang} className="text-os-muted hover:text-os-text text-[11px] font-mono flex items-center gap-1">
                    <Globe size={11} /> {lang}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-os-dim">
                  {date} {time} · <Battery size={10} /> {batteryLevel}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════ Command Palette Overlay ═══════════ */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
            onClick={() => setPaletteOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className="relative w-[90vw] max-w-lg os-window shadow-2xl"
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-os-border">
                <Search size={16} className="text-os-dim flex-shrink-0" />
                <input
                  ref={paletteInputRef}
                  type="text"
                  value={paletteQuery}
                  onChange={e => setPaletteQuery(e.target.value)}
                  placeholder={t('palette.placeholder')}
                  className="flex-1 bg-transparent text-sm text-os-text font-mono placeholder:text-os-dim/60 outline-none"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && filteredActions.length > 0) {
                      runAction(filteredActions[0]);
                    }
                  }}
                />
                <kbd className="text-[10px] font-mono text-os-dim bg-os-border/40 px-1.5 py-0.5 rounded">ESC</kbd>
              </div>

              {/* Action list */}
              <div className="max-h-[300px] overflow-y-auto py-2">
                {filteredActions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-os-dim text-xs font-mono">
                    No results
                  </div>
                ) : (
                  (() => {
                    let lastGroup = '';
                    return filteredActions.map(action => {
                      const showGroup = action.group !== lastGroup;
                      lastGroup = action.group;
                      return (
                        <div key={action.id}>
                          {showGroup && (
                            <div className="px-4 pt-2 pb-1 text-[9px] font-mono text-os-dim tracking-wider uppercase">
                              {action.group}
                            </div>
                          )}
                          <button
                            onClick={() => runAction(action)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-os-border/20 transition-colors group"
                          >
                            <action.icon size={14} className="text-os-dim group-hover:text-os-green transition-colors flex-shrink-0" />
                            <span className="flex-1 text-[12px] font-mono text-os-muted group-hover:text-os-text transition-colors">
                              {action.label}
                            </span>
                            <ArrowRight size={12} className="text-transparent group-hover:text-os-dim transition-colors" />
                          </button>
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
