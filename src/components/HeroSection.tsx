import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n";

const partners = [
  { name: 'IBM', logo: '/1.png' },
  { name: 'Microsoft', logo: '/2.png' },
  { name: 'Oracle', logo: '/3.png' },
  { name: 'Google', logo: '/4.png' },
  { name: 'Amazon', logo: '/5.png' },
];

const infoLineKeys = [
  { label: 'OS', valueKey: 'info.os' as const },
  { label: 'Kernel', valueKey: 'info.kernel' as const },
  { label: 'Uptime', valueKey: 'info.uptime' as const },
  { label: 'Packages', valueKey: 'info.packages' as const },
  { label: 'Shell', valueKey: 'info.shell' as const },
  { label: 'Resolution', valueKey: 'info.resolution' as const },
  { label: 'CPU', valueKey: 'info.cpu' as const },
  { label: 'Memory', valueKey: 'info.memory' as const },
];

export default function HeroSection() {
  const { t } = useI18n();
  const [phase, setPhase] = useState(0);
  const [visibleInfoLines, setVisibleInfoLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase(1), 600));
    timers.push(setTimeout(() => setPhase(2), 1200));

    infoLineKeys.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleInfoLines(i + 1), 1400 + i * 150));
    });

    timers.push(setTimeout(() => setPhase(3), 1400 + infoLineKeys.length * 150 + 500));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section id="home" className="px-3 md:px-6 pt-3 pb-2">
      {/* Main Terminal Window */}
      <div className="os-window max-w-5xl mx-auto">
        <div className="os-titlebar">
          <div className="os-dots">
            <div className="os-dot close" />
            <div className="os-dot minimize" />
            <div className="os-dot maximize" />
          </div>
          <div className="os-title">
            {t('hero.title')}
          </div>
        </div>

        {/* Terminal content */}
        <div className="p-4 md:p-8 font-mono text-sm leading-relaxed min-h-[55vh] md:min-h-[65vh] bg-os-bg/50">
          {/* Command line */}
          <div className="flex flex-wrap gap-0">
            <span className="text-os-green">guest@andsoft-os</span>
            <span className="text-os-muted">:</span>
            <span className="text-os-cyan">~</span>
            <span className="text-os-muted">$&nbsp;</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-os-text"
            >
              neofetch
            </motion.span>
          </div>

          {/* Big name */}
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 mb-2"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-mono tracking-tighter glow-green leading-none">
                ANDSOFT
              </h1>
              <p className="text-os-muted text-[10px] md:text-xs mt-2 tracking-[0.3em] uppercase">
                {t('hero.subtitle')}
              </p>
              <div className="w-full h-px bg-os-border mt-4" />
            </motion.div>
          )}

          {/* Info lines */}
          {phase >= 2 && (
            <div className="mt-4 space-y-1">
              {infoLineKeys.slice(0, visibleInfoLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col sm:flex-row"
                >
                  <span className="text-os-cyan w-28 md:w-32 flex-shrink-0 text-xs md:text-sm">{line.label}</span>
                  <span className="text-os-text text-xs md:text-sm">{t(line.valueKey)}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Second command + output */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <div className="flex flex-wrap gap-0">
                <span className="text-os-green">guest@andsoft-os</span>
                <span className="text-os-muted">:</span>
                <span className="text-os-cyan">~</span>
                <span className="text-os-muted">$&nbsp;</span>
                <span className="text-os-text">cat /etc/motd</span>
              </div>
              <p className="text-os-text mt-2 text-sm md:text-base">
                {t('hero.motd')}
              </p>
              <p className="text-os-dim mt-1 text-xs md:text-sm">
                {t('hero.motdSub')}
              </p>

              {/* Final blinking cursor */}
              <div className="mt-6 flex flex-wrap gap-0">
                <span className="text-os-green">guest@andsoft-os</span>
                <span className="text-os-muted">:</span>
                <span className="text-os-cyan">~</span>
                <span className="text-os-muted">$&nbsp;</span>
                <span className="cursor-blink" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trusted Nodes (Partners) */}
      <div className="max-w-5xl mx-auto mt-3">
        <div className="os-window">
          <div className="os-titlebar py-2">
            <div className="os-dots">
              <div className="os-dot close" />
              <div className="os-dot minimize" />
              <div className="os-dot maximize" />
            </div>
            <div className="os-title">
              {t('hero.trustedNodes')}
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 place-items-center">
              {partners.map((partner, i) => (
                <div key={i} className="flex items-center justify-center h-12 opacity-40 hover:opacity-90 transition-opacity duration-300 grayscale hover:grayscale-0">
                  <img src={partner.logo} alt={partner.name} className="max-h-8 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
