import { Phone, Mail, MapPin, Send, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../useI18n';
import { useTheme } from '../useTheme';

export default function AboutContact() {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  /* Only load the iframe when the map container scrolls into view */
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMapVisible(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const contactInfo = [
    { icon: Phone, label: t('contact.phone'), value: "+976 99119000", href: "tel:+97699119000", type: "phone" as const },
    { icon: Mail, label: t('contact.email'), value: "contact@andsoft.com", href: "mailto:contact@andsoft.com", type: "email" as const },
    { icon: MapPin, label: t('contact.location'), value: "Embassy One, 10th Floor", href: "https://maps.app.goo.gl/AnQqmdH7yEd2PeqDA", type: "location" as const },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
    setTimeout(() => setFormStatus('idle'), 4000);
  };

  return (
    <section id="contact" className="px-3 md:px-6 py-3">
      <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-3">

        {/* Left: Settings + Map */}
        <div className="md:col-span-2 space-y-3">
          {/* Contact Info — System Settings */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="os-window"
          >
            <div className="os-titlebar">
              <div className="os-dots">
                <div className="os-dot close" />
                <div className="os-dot minimize" />
                <div className="os-dot maximize" />
              </div>
              <div className="os-title">
                <Settings size={10} className="inline mr-1" />
                {t('contact.settings')}
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/andsoft.png" alt="AndSoft" className="h-5 object-contain opacity-70" />
                <span className="font-mono text-[10px] text-os-dim tracking-wider">v2.5 LTS</span>
              </div>

              {contactInfo.map((item) => (
                <a
                  key={item.type}
                  href={item.href}
                  target={item.type === 'location' ? '_blank' : undefined}
                  rel={item.type === 'location' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 p-2.5 rounded-md hover:bg-os-titlebar transition-colors group"
                >
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-os-titlebar group-hover:bg-emerald-500/10 transition-colors">
                    <item.icon size={14} className="text-os-muted group-hover:text-os-green transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-os-dim tracking-wider uppercase">{item.label}</div>
                    <div className="text-xs text-os-muted group-hover:text-os-text transition-colors">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Map Window */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="os-window"
          >
            <div className="os-titlebar py-2">
              <div className="os-dots">
                <div className="os-dot close" />
                <div className="os-dot minimize" />
                <div className="os-dot maximize" />
              </div>
              <div className="os-title">
                {t('contact.map')}
              </div>
            </div>
            <div ref={mapRef} className="relative h-[180px] group bg-os-bg rounded-b-[10px] overflow-hidden">
              <a
                href="https://maps.app.goo.gl/AnQqmdH7yEd2PeqDA"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">Open in Google Maps</span>
              </a>
              {mapVisible ? (
                <iframe
                  src="https://www.google.com/maps?q=Embassy+One+бизнес+оффис+Job+Job,+Ulaanbaatar&z=17&output=embed"
                  width="100%"
                  height="100%"
                  tabIndex={-1}
                  style={{
                    border: 0,
                    filter: isDark
                      ? 'grayscale(100%) invert(85%) contrast(90%) hue-rotate(180deg)'
                      : 'grayscale(20%) saturate(0.8)',
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  className="opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin size={24} className="text-os-dim animate-pulse" />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: Email Compose */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="md:col-span-3"
        >
          <div className="os-window h-full flex flex-col">
            <div className="os-titlebar">
              <div className="os-dots">
                <div className="os-dot close" />
                <div className="os-dot minimize" />
                <div className="os-dot maximize" />
              </div>
              <div className="os-title">
                <Mail size={10} className="inline mr-1" />
                {t('contact.compose')}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 flex-1 flex flex-col">
              {/* To field */}
              <div className="flex items-center gap-2 pb-3 border-b border-os-border">
                <span className="font-mono text-[11px] text-os-dim w-12">{t('contact.to')}</span>
                <span className="font-mono text-[11px] text-os-cyan">contact@andsoft.com</span>
              </div>

              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">{t('contact.fromName')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('contact.yourName')}
                    className="w-full bg-os-panel border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim
                      focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">{t('contact.replyTo')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('contact.yourEmail')}
                    className="w-full bg-os-panel border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim
                      focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/10 transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">{t('contact.subject')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('contact.projectInquiry')}
                  className="w-full bg-os-panel border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim
                    focus:outline-none focus:border-fuchsia-500/40 focus:ring-1 focus:ring-fuchsia-500/10 transition-colors"
                />
              </div>

              {/* Message */}
              <div className="flex-1">
                <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">{t('contact.body')}</label>
                <textarea
                  required
                  rows={6}
                  placeholder={t('contact.tellUs')}
                  className="w-full h-full min-h-[120px] bg-os-panel border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim resize-none
                    focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-colors"
                />
              </div>

              {/* Send bar */}
              <div className="flex items-center justify-between pt-2 border-t border-os-border">
                <div className="font-mono text-[10px]">
                  {formStatus === 'sent' && <span className="text-os-green">{t('contact.sent')}</span>}
                  {formStatus === 'sending' && <span className="text-os-cyan">{t('contact.sending')}</span>}
                  {formStatus === 'idle' && <span className="text-os-dim">{t('contact.allRequired')}</span>}
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-500/10 border border-emerald-500/20
                    hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-colors
                    disabled:opacity-40 font-mono text-[11px] text-os-green"
                >
                  <Send size={12} />
                  {t('contact.send')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

