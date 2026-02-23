import { useState, useCallback, useEffect } from 'react';
import { Globe, Wifi, Battery, Volume2, Menu, X } from 'lucide-react';

export default function Header() {
  const [language, setLanguage] = useState('EN');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'EN' ? 'MN' : 'EN'));
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Technologies', href: '#technologies' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-os-panel/95 backdrop-blur-md border-b border-os-border select-none">
      {/* Main bar */}
      <div className="h-8 flex items-center px-3 md:px-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-sm bg-os-green/80" />
            <span className="font-mono text-[11px] font-semibold text-os-green tracking-wide">
              AndSoft
            </span>
          </div>

          <div className="hidden md:flex items-center gap-0.5 ml-2">
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className="text-os-muted hover:text-os-text hover:bg-white/[0.04] px-2.5 py-0.5 rounded text-[11px] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Center: Date & Time */}
        <div className="font-mono text-os-text text-[11px] font-medium tracking-wide hidden sm:block">
          {date}&nbsp;&nbsp;{time}
        </div>

        {/* Right: System tray */}
        <div className="flex items-center gap-2.5 flex-1 justify-end">
          <button
            onClick={toggleLanguage}
            className="text-os-muted hover:text-os-text text-[10px] font-mono transition-colors flex items-center gap-1"
          >
            <Globe size={11} />
            {language}
          </button>
          <Wifi size={12} className="text-os-muted hidden sm:block" />
          <Volume2 size={12} className="text-os-muted hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1 text-os-muted">
            <Battery size={12} />
            <span className="text-[10px] font-mono">98%</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-os-green status-pulse" />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="md:hidden text-os-muted hover:text-os-text p-0.5 transition-colors"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-os-border bg-os-panel/95 backdrop-blur-md px-4 py-2 space-y-1">
          {navItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-os-muted hover:text-os-green text-[12px] font-mono py-1.5 px-2 rounded hover:bg-white/[0.03] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-1 border-t border-os-border/50 mt-1 text-[10px] font-mono text-os-dim">
            {date} {time}
          </div>
        </div>
      )}
    </header>
  );
}
