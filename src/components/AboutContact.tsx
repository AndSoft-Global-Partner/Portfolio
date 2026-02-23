import { Phone, Mail, MapPin, Send, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+976 99119000", href: "tel:+97699119000" },
  { icon: Mail, label: "Email", value: "contact@andsoft.com", href: "mailto:contact@andsoft.com" },
  { icon: MapPin, label: "Location", value: "Embassy One, 10th Floor", href: "https://maps.app.goo.gl/AnQqmdH7yEd2PeqDA" },
];

export default function AboutContact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

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
                System Settings — Network
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/andsoft.png" alt="AndSoft" className="h-5 object-contain opacity-70" />
                <span className="font-mono text-[10px] text-os-dim tracking-wider">v2.5 LTS</span>
              </div>

              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === 'Location' ? '_blank' : undefined}
                  rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 p-2.5 rounded-md hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-os-border/30 group-hover:bg-os-green/10 transition-colors">
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
                Maps — Ulaanbaatar, Mongolia
              </div>
            </div>
            <div className="relative h-[180px] group">
              <a
                href="https://maps.app.goo.gl/AnQqmdH7yEd2PeqDA"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">Open in Google Maps</span>
              </a>
              <iframe
                src="https://www.google.com/maps?q=Embassy+One+бизнес+оффис+Job+Job,+Ulaanbaatar&z=17&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'grayscale(100%) invert(85%) contrast(90%) hue-rotate(180deg)',
                }}
                allowFullScreen
                loading="lazy"
                className="opacity-40 group-hover:opacity-70 transition-opacity duration-500"
              />
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
                Compose — New Message
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 flex-1 flex flex-col">
              {/* To field */}
              <div className="flex items-center gap-2 pb-3 border-b border-os-border/50">
                <span className="font-mono text-[11px] text-os-dim w-12">To:</span>
                <span className="font-mono text-[11px] text-os-cyan">contact@andsoft.com</span>
              </div>

              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">From (Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full bg-os-bg/50 border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim/40
                      focus:outline-none focus:border-os-green/40 focus:ring-1 focus:ring-os-green/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">Reply-To</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-os-bg/50 border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim/40
                      focus:outline-none focus:border-os-cyan/40 focus:ring-1 focus:ring-os-cyan/10 transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Project inquiry"
                  className="w-full bg-os-bg/50 border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim/40
                    focus:outline-none focus:border-os-magenta/40 focus:ring-1 focus:ring-os-magenta/10 transition-colors"
                />
              </div>

              {/* Message */}
              <div className="flex-1">
                <label className="block font-mono text-[10px] text-os-dim tracking-wider uppercase mb-1.5">Body</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us about your project..."
                  className="w-full h-full min-h-[120px] bg-os-bg/50 border border-os-border rounded px-3 py-2 text-xs text-os-text font-mono placeholder:text-os-dim/40 resize-none
                    focus:outline-none focus:border-os-green/40 focus:ring-1 focus:ring-os-green/10 transition-colors"
                />
              </div>

              {/* Send bar */}
              <div className="flex items-center justify-between pt-2 border-t border-os-border/50">
                <div className="font-mono text-[10px]">
                  {formStatus === 'sent' && <span className="text-os-green">✓ Message sent successfully</span>}
                  {formStatus === 'sending' && <span className="text-os-cyan">Sending...</span>}
                  {formStatus === 'idle' && <span className="text-os-dim">All fields required</span>}
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-os-green/10 border border-os-green/20
                    hover:bg-os-green/20 hover:border-os-green/30 transition-colors
                    disabled:opacity-40 font-mono text-[11px] text-os-green"
                >
                  <Send size={12} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

