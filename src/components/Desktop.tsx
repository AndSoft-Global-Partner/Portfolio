import { AnimatePresence } from 'framer-motion';
import { useWindowManager, type AppId } from '../windowManager';
import OSWindow from './OSWindow';
import { useI18n } from '../useI18n';
import TerminalEmulator from './TerminalEmulator';
import { useState } from 'react';
import { Send } from 'lucide-react';

/* ─── System Monitor (technologies) ─── */
const processes = [
  { pid: 1001, name: 'React', cpu: 89, mem: 72, color: '#61DAFB' },
  { pid: 1002, name: 'TailwindCSS', cpu: 76, mem: 45, color: '#06B6D4' },
  { pid: 1003, name: 'Node.js', cpu: 82, mem: 68, color: '#68A063' },
  { pid: 1004, name: 'Python', cpu: 71, mem: 54, color: '#FFD43B' },
  { pid: 1005, name: 'PHP', cpu: 65, mem: 42, color: '#8892BF' },
  { pid: 1006, name: 'Flutter', cpu: 78, mem: 61, color: '#02569B' },
  { pid: 1007, name: 'Kotlin', cpu: 74, mem: 55, color: '#B125EA' },
  { pid: 1008, name: 'PostgreSQL', cpu: 58, mem: 83, color: '#336791' },
  { pid: 1009, name: 'AWS', cpu: 45, mem: 38, color: '#FF9900' },
];

function MonitorApp() {
  return (
    <div className="bg-os-bg h-full flex flex-col">
      {/* Info bar */}
      <div className="px-4 py-2 border-b border-os-border flex items-center justify-between bg-os-titlebar/50 text-[10px] font-mono text-os-muted">
        <span><span className="text-os-green">●</span> {processes.length} ACTIVE PROCESSES</span>
        <span>LOAD: 0.82 · UPTIME: 99.9%</span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[50px_1fr_70px_70px_80px] gap-2 px-4 py-1.5 border-b border-os-border/50 text-[9px] font-mono text-os-dim tracking-wider uppercase">
        <div>PID</div><div>PROCESS</div><div>CPU</div><div>MEM</div><div>STATUS</div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-auto">
        {processes.map(p => (
          <div
            key={p.pid}
            className="grid grid-cols-[50px_1fr_70px_70px_80px] gap-2 px-4 py-2 border-b border-os-border/20 hover:bg-os-border/10 transition-colors text-[11px] font-mono"
          >
            <div className="text-os-dim">{p.pid}</div>
            <div className="text-os-text flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
              {p.name}
            </div>
            <div className="text-os-muted">{p.cpu}%</div>
            <div>
              <div className="os-progress mt-1">
                <div className="os-progress-fill" style={{ width: `${p.mem}%`, background: p.color }} />
              </div>
            </div>
            <div className="text-os-green text-[9px]">● ACTIVE</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── File Manager (projects) ─── */
const projectFiles = [
  { name: 'E-Commerce Platform', image: '/1.png', type: 'React · Node.js · PostgreSQL', size: '24.6 MB', modified: 'Jan 15, 2025' },
  { name: 'HealthTrack App', image: '/2.png', type: 'Flutter · Firebase · ML', size: '18.2 MB', modified: 'Feb 8, 2025' },
  { name: 'Corporate Portal', image: '/5.png', type: 'React · Python · AWS', size: '31.4 MB', modified: 'Dec 20, 2024' },
  { name: 'Financial Dashboard', image: '/4.png', type: 'React · D3.js · Node.js', size: '22.1 MB', modified: 'Nov 5, 2024' },
];

function FilesApp() {
  return (
    <div className="bg-os-bg h-full flex flex-col">
      {/* Path bar */}
      <div className="px-4 py-2 border-b border-os-border bg-os-titlebar/50 font-mono text-[11px]">
        <span className="text-os-dim">~/</span>
        <span className="text-os-muted">home/</span>
        <span className="text-os-text">andsoft/</span>
        <span className="text-os-green">projects</span>
      </div>

      {/* File grid */}
      <div className="flex-1 overflow-auto p-3 grid grid-cols-2 gap-3">
        {projectFiles.map(f => (
          <div
            key={f.name}
            className="file-card p-2.5 flex flex-col gap-2 bg-os-window hover:bg-os-titlebar/60"
          >
            {/* Thumbnail */}
            <div className="aspect-video rounded-md bg-os-bg overflow-hidden border border-os-border/30">
              <img
                src={f.image}
                alt={f.name}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-mono text-os-text truncate">{f.name}</p>
              <p className="text-[9px] font-mono text-os-dim mt-0.5">{f.type}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] font-mono text-os-dim">{f.size}</span>
                <span className="text-[9px] font-mono text-os-dim">{f.modified}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="px-4 py-1.5 border-t border-os-border text-[10px] font-mono text-os-dim flex justify-between">
        <span>{projectFiles.length} items</span>
        <span>72 GB free</span>
      </div>
    </div>
  );
}

/* ─── Mail (contact) ─── */
function MailApp() {
  const { t } = useI18n();
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !body) return;
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
    setTimeout(() => {
      setFormStatus('idle');
      setName(''); setEmail(''); setSubject(''); setBody('');
    }, 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-os-bg h-full flex flex-col font-mono text-[12px]">
      {/* Mail headers */}
      <div className="border-b border-os-border flex-shrink-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-os-border/50">
          <span className="text-os-dim w-14 text-right text-[10px]">{t('contact.to')}</span>
          <span className="text-os-cyan">contact@andsoft.com</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-b border-os-border/50">
          <span className="text-os-dim w-14 text-right text-[10px]">{t('contact.fromName')}</span>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 bg-transparent text-os-text placeholder:text-os-dim/40 outline-none"
            placeholder={t('contact.yourName')}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-b border-os-border/50">
          <span className="text-os-dim w-14 text-right text-[10px]">{t('contact.replyTo')}</span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-os-text placeholder:text-os-dim/40 outline-none"
            placeholder={t('contact.yourEmail')}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-os-dim w-14 text-right text-[10px]">{t('contact.subject')}</span>
          <input
            type="text"
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="flex-1 bg-transparent text-os-text placeholder:text-os-dim/40 outline-none"
            placeholder={t('contact.projectInquiry')}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 min-h-0">
        <textarea
          required
          value={body}
          onChange={e => setBody(e.target.value)}
          className="w-full h-full bg-transparent text-os-text placeholder:text-os-dim/40 outline-none resize-none"
          placeholder={t('contact.tellUs')}
        />
      </div>

      {/* Send bar */}
      <div className="px-4 py-2.5 border-t border-os-border flex justify-between items-center flex-shrink-0">
        <div className="text-[10px]">
          {formStatus === 'sent' && <span className="text-os-green">{t('contact.sent')}</span>}
          {formStatus === 'sending' && <span className="text-os-cyan">{t('contact.sending')}</span>}
          {formStatus === 'idle' && <span className="text-os-dim">{t('contact.allRequired')}</span>}
        </div>
        <button
          type="submit"
          disabled={formStatus === 'sending'}
          className="flex items-center gap-2 px-4 py-1.5 rounded bg-os-green/10 border border-os-green/20 text-os-green text-[11px] hover:bg-os-green/20 hover:border-os-green/30 transition-colors disabled:opacity-40"
        >
          <Send size={12} />
          {t('contact.send')}
        </button>
      </div>
    </form>
  );
}

/* ═══ Content router ═══ */
function TerminalWindow() {
  return <TerminalEmulator showBoot />;
}

const APP_CONTENT: Record<AppId, () => JSX.Element> = {
  home: TerminalWindow,
  technologies: MonitorApp,
  projects: FilesApp,
  contact: MailApp,
  terminal: TerminalWindow,
};

export default function Desktop() {
  const { windows, activeId } = useWindowManager();

  const handleDesktopClick = () => {
    // Click on empty desktop area — deselect active window
    // (handled by the gap between windows)
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 40 }}
      onClick={handleDesktopClick}
    >
      <AnimatePresence>
        {windows
          .filter(w => !w.minimized)
          .map(win => {
            const Content = APP_CONTENT[win.id as AppId] ?? TerminalWindow;
            return (
              <OSWindow key={win.id} win={win}>
                <Content />
              </OSWindow>
            );
          })}
      </AnimatePresence>

      {/* Click overlay for deselecting — behind windows */}
      {activeId && (
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{ zIndex: -1 }}
          onClick={() => {
            // TODO: deselect
          }}
        />
      )}
    </div>
  );
}
