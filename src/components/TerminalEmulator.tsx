import { useEffect, useState, useRef, useCallback } from 'react';

/* ══════════════════════════════════════════════════════════════════
   TerminalEmulator — Self-contained interactive terminal
   Extracted from Footer.tsx so it can be reused in OS windows.
   ══════════════════════════════════════════════════════════════════ */

interface Props {
  /** Extra tailwind classes on the wrapper */
  className?: string;
  /** Whether to run the boot sequence on first mount */
  showBoot?: boolean;
}

export default function TerminalEmulator({ className = '', showBoot = false }: Props) {
  /* ── state ── */
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(38);
  const [uptime, setUptime] = useState(0);
  const [user, setUser] = useState<'guest' | 'root'>('guest');
  const [loginUser, setLoginUser] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [bootDone, setBootDone] = useState(!showBoot);
  const [termTheme, setTermTheme] = useState<'cyan' | 'green' | 'amber' | 'red'>('cyan');
  const [dynamicFiles, setDynamicFiles] = useState<Record<string, { type: 'file' | 'dir'; content?: string; path: string }>>({});
  const [nanoMode, setNanoMode] = useState(false);
  const [nanoFile, setNanoFile] = useState('');
  const [nanoContent, setNanoContent] = useState('');
  const [activeNode, setActiveNode] = useState('ANDSOFT-CORE');
  const [systemCrashed, setSystemCrashed] = useState(false);
  const [history, setHistory] = useState<Array<{ text: string; type: 'input' | 'output' | 'error' | 'system' }>>([
    { text: 'System initialized.', type: 'system' },
    { text: "Type 'help' to see available commands.", type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/guest');
  const [prevDir, setPrevDir] = useState('/home/guest');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingChoice, setAwaitingChoice] = useState(false);
  const [_systemId, _setSystemId] = useState(() => Math.floor(Math.random() * 9999));

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);

  /* ── filesystem ── */
  const fileSystem: Record<string, string[]> = {
    '/': ['home'],
    '/home': ['guest'],
    '/home/guest': ['about.txt', 'contact.md', 'system.log', 'projects'],
    '/home/guest/projects': ['project1.txt', 'project2.txt'],
  };

  const fileContents: Record<string, string> = {
    'about.txt': `AndSoft Global Partner\n\nWe operate across multiple digital sectors.\n\nInfrastructure.\nSecurity.\nControl.\n\nPartner nodes active worldwide.`,
    'contact.md': `Contact Protocol\n\nPhone: +976 99212999\nSignal: ACTIVE\nNode: ANDSOFT_CORE\n\nAuthorized access only.`,
    'system.log': `[ OK ] kernel loaded\n[ OK ] memory initialized\n[ OK ] network connected\n[ OK ] interface ready`,
    'project1.txt': `Project: AndSoft Portal\nStatus: In Development\nProgress: 75%`,
    'project2.txt': `Project: Neural Interface\nStatus: Beta Testing\nProgress: 45%`,
  };

  const fsocietySpeech = `Are you a one or a zero?\n\nIn this world, there are two kinds of people.\n\nThose who control.\nAnd those who are controlled.\n\nThe ones who wake up and see the system.\nAnd the zeros who live inside it.\n\nThe question is not what you are now.\n\nThe question is…\n\nWhat do you choose to be.`;

  /* ── helpers ── */
  const progressBar = (pct: number) => {
    const filled = Math.floor(pct / 10);
    return `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}] ${pct}%`;
  };

  const resolvePath = (target: string): string => {
    if (target === '/') return '/';
    if (target === '~') return '/home/guest';
    if (target === '-') return prevDir || '/home/guest';
    if (target.startsWith('/')) return target;
    if (target === '..') {
      const parts = currentDir.split('/');
      parts.pop();
      return parts.join('/') || '/';
    }
    return currentDir === '/' ? `/${target}` : `${currentDir}/${target}`;
  };

  /* ── sound ── */
  const playSound = useCallback((freq: number, dur: number, type: OscillatorType = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      gain.gain.value = 0.05;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, dur * 1000);
    } catch { /* Audio not supported */ }
  }, []);

  const playTypeSound = useCallback(() => playSound(800 + Math.random() * 200, 0.05, 'square'), [playSound]);

  /* ── typeText ── */
  const typeText = useCallback(async (text: string, type: 'output' | 'error' | 'system' = 'output') => {
    setIsTyping(true);
    let current = '';
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      if (i % 3 === 0) playTypeSound();
      const snap = current;
      setHistory(prev => {
        const h = [...prev];
        if (h.length > 0 && h[h.length - 1].type === type && h[h.length - 1].text.startsWith(snap.slice(0, -1))) {
          h[h.length - 1] = { text: snap, type };
        } else {
          h.push({ text: snap, type });
        }
        return h;
      });
      await new Promise(r => setTimeout(r, 20));
    }
    setIsTyping(false);
  }, [playTypeSound]);

  /* ── requireRoot helper ── */
  const requireRoot = useCallback(async (): Promise<boolean> => {
    if (user !== 'root') {
      await typeText('Permission denied.', 'error');
      return false;
    }
    return true;
  }, [user, typeText]);

  /* ── commands ── */
  // We wrap commands in a ref so they always see the latest closure values
  const cmdRef = useRef<Record<string, (args: string[]) => Promise<string> | string>>({});

  cmdRef.current = {
    help: () => `help       list commands
ls         list files
cd         change directory
cat        read file
pwd        show current directory
whoami     show user
date       system date
uname      system info
clear      clear terminal
echo       print text
sudo       system admin commands
clock      show time
login      login to system
hack       inject payload [ROOT]
netmap     show network map
andsoft    secret command
touch      create file
mkdir      make directory
rm         remove file [ROOT]
nano       edit file
ps         process list
ai         AI assistant
connect    connect to node
theme      change theme color
crash      crash system [ROOT]`,

    ls: () => {
      const staticItems = fileSystem[currentDir] || [];
      const dynItems = Object.values(dynamicFiles)
        .filter(f => {
          const parent = f.path.substring(0, f.path.lastIndexOf('/')) || '/';
          return parent === currentDir;
        })
        .map(f => {
          const n = f.path.split('/').pop();
          return f.type === 'dir' ? `[BLUE]${n}[/BLUE]` : `[GRAY]${n}[/GRAY]`;
        });
      return [...staticItems.map(i => `[GRAY]${i}[/GRAY]`), ...dynItems].join('   ');
    },

    cd: async (args: string[]) => {
      const target = args[0] || '~';
      const newPath = resolvePath(target);
      if (fileSystem[newPath]) { setPrevDir(currentDir); setCurrentDir(newPath); return ''; }
      const dynDir = Object.values(dynamicFiles).find(f => f.type === 'dir' && f.path === newPath);
      if (dynDir) { setPrevDir(currentDir); setCurrentDir(newPath); return ''; }
      return `cd: no such directory: ${target}`;
    },

    cat: async (args: string[]) => {
      const file = args[0];
      if (!file) return 'usage: cat <file>';
      const full = `${currentDir}/${file}`.replace('//', '/');
      const dynFile = Object.values(dynamicFiles).find(f => f.path === full && f.type === 'file');
      if (dynFile?.content) { await typeText(dynFile.content); return ''; }
      const content = fileContents[file];
      if (!content) return 'cat: no such file';
      await typeText(content);
      return '';
    },

    whoami: () => user,
    pwd: () => currentDir,
    date: () => new Date().toString(),
    uname: () => 'Linux andsoft 6.1.0 x86_64',
    echo: (args: string[]) => args.join(' '),
    clear: () => '__CLEAR__',

    sudo: async (args: string[]) => {
      const sub = args.join(' ');
      if (sub === 'apt install') {
        await typeText(fsocietySpeech);
        setHistory(p => [...p, { text: '[ENTER 1 OR 0]', type: 'system' }]);
        setAwaitingChoice(true);
        return '';
      }
      if (sub === 'apt update') {
        await typeText('Get:1 andsoft core packages\nGet:2 security modules\nFetched 12.4 MB in 2s\n\nReading package lists...  Done');
        return '';
      }
      if (sub === 'apt upgrade') {
        setAwaitingChoice(true);
        await typeText('Are you a one or a zero?');
        return '';
      }
      return 'sudo: command not found';
    },

    tree: () => `\n/\n└── home\n    └── guest\n        ├── about.txt\n        ├── contact.md\n        ├── system.log\n        └── projects\n            ├── project1.txt\n            └── project2.txt\n`,

    neofetch: () => `\nAndSoft OS v1.0\n─────────────────\nKernel: 6.1.0 x86_64\nCPU: ${cpu}%\nRAM: ${ram}%\nUptime: ${uptime}s\nNode: AX-${_systemId}\nStatus: ONLINE\n`,

    scan: async () => {
      await typeText('Scanning network...'); await typeText('Node detected: CORE-AX');
      await typeText('Security: ACTIVE'); await typeText('Threat level: NONE');
      return '';
    },

    clock: () => new Date().toLocaleTimeString(),

    login: async (args: string[]) => {
      const u = args[0] || 'root';
      if (u === 'root') { setLoginUser('root'); await typeText('Password: '); setAwaitingChoice(true); return ''; }
      return `login: user '${u}' does not exist`;
    },

    andsoft: async () => { await typeText('Welcome, operator.'); await typeText('You have root access.'); await typeText('System decrypted.'); return ''; },

    hack: async () => {
      if (!await requireRoot()) return '';
      for (let i = 0; i <= 100; i += 10) await typeText(progressBar(i));
      await typeText('Root exploit successful.');
      return '';
    },

    netmap: () => `\n   USER\n    │\n  ANDSOFT\n  /     \\\\\n NODE1  NODE2\n\nNetwork Status: CONNECTED\n`,

    touch: (args: string[]) => {
      const name = args[0]; if (!name) return 'usage: touch <filename>';
      const p = `${currentDir}/${name}`.replace('//', '/');
      setDynamicFiles(prev => ({ ...prev, [p]: { type: 'file', content: '', path: p } }));
      return `created ${name}`;
    },

    mkdir: (args: string[]) => {
      const name = args[0]; if (!name) return 'usage: mkdir <dirname>';
      const p = `${currentDir}/${name}`.replace('//', '/');
      setDynamicFiles(prev => ({ ...prev, [p]: { type: 'dir', path: p } }));
      return `directory created: ${name}`;
    },

    rm: async (args: string[]) => {
      if (!await requireRoot()) return '';
      const name = args[0]; if (!name) return 'usage: rm <file>';
      const p = `${currentDir}/${name}`.replace('//', '/');
      setDynamicFiles(prev => { const n = { ...prev }; delete n[p]; return n; });
      return `removed ${name}`;
    },

    nano: async (args: string[]) => {
      const file = args[0];
      if (!file) { await typeText('usage: nano <filename>'); return ''; }
      setNanoFile(file);
      const full = `${currentDir}/${file}`.replace('//', '/');
      const dynFile = Object.values(dynamicFiles).find(f => f.path === full && f.type === 'file');
      if (dynFile) setNanoContent(dynFile.content || '');
      else if (fileContents[file]) setNanoContent(fileContents[file]);
      else setNanoContent('');
      setNanoMode(true);
      return '';
    },

    ps: () => `PID   NAME\n102   andsoft-core\n211   network-daemon\n334   security-module\n445   ai-monitor\n556   firewall-service`,

    ai: async () => { await typeText('AI CORE INITIALIZING...'); await typeText('AI CORE ONLINE'); await typeText('Monitoring system.'); await typeText('Ready for commands.'); return ''; },

    connect: async (args: string[]) => {
      const node = args[0] || 'node1';
      setActiveNode(node.toUpperCase());
      _setSystemId(Math.floor(Math.random() * 9999));
      await typeText(`Connecting to ${node}...`);
      await typeText('Connection established.');
      return '';
    },

    theme: async (args: string[]) => {
      const t = args[0] as typeof termTheme;
      if (!['cyan', 'green', 'amber', 'red'].includes(t)) return 'Available themes: cyan, green, amber, red';
      setTermTheme(t);
      await typeText(`Theme changed to ${t}`);
      return '';
    },

    attack: async () => {
      if (!await requireRoot()) return '';
      await typeText('USER → NODE → FIREWALL → ACCESS');
      await typeText(''); await typeText('Penetrating NODE...'); await typeText(progressBar(33));
      await typeText(''); await typeText('Breaking FIREWALL...'); await typeText(progressBar(66));
      await typeText(''); await typeText('Gaining ACCESS...'); await typeText(progressBar(100));
      await typeText(''); await typeText('SYSTEM COMPROMISED');
      return '';
    },

    crash: async () => {
      if (!await requireRoot()) return '';
      setSystemCrashed(true);
      await typeText('INITIATING SYSTEM SHUTDOWN...');
      await typeText('Terminating all processes...');
      await typeText(''); await typeText('KERNEL PANIC'); await typeText('SYSTEM FAILURE'); await typeText('REBOOT REQUIRED');
      setTimeout(async () => {
        setSystemCrashed(false);
        await typeText('[ OK ] System rebooted.', 'system');
      }, 3000);
      return '';
    },
  };

  /* ── autocomplete ── */
  const getAutocompleteOptions = (): string[] => {
    const trimmed = input.trim();
    if (!trimmed) return [];
    const parts = trimmed.split(' ');
    const last = parts[parts.length - 1];
    if (parts.length === 1) return Object.keys(cmdRef.current).filter(c => c.startsWith(last));
    const items = fileSystem[currentDir] || [];
    return items.filter(i => i.startsWith(last));
  };

  const handleTabComplete = () => {
    const opts = getAutocompleteOptions();
    if (opts.length === 1) {
      const parts = input.trim().split(' ');
      parts[parts.length - 1] = opts[0];
      setInput(parts.join(' ') + ' ');
    }
  };

  /* ── command handler ── */
  const handleCommand = async (cmd: string) => {
    if (awaitingChoice) {
      if (loginUser === 'root') {
        setHistory(p => [...p, { text: `${user}@${activeNode}:~$ Password: ••••`, type: 'input' }]);
        setUser('root'); setTermTheme('red');
        setHistory(p => [...p, { text: 'Welcome to AndSoft, root.', type: 'system' }]);
        setLoginUser(''); setAwaitingChoice(false);
        return;
      }
      if (cmd === '1') {
        setHistory(p => [...p, { text: `${user}@${activeNode}:~$ ${cmd}`, type: 'input' }, { text: 'Welcome to fsociety.', type: 'output' }, { text: '__SHOW_FSOCIETY__', type: 'system' }]);
      } else {
        setHistory(p => [...p, { text: `${user}@${activeNode}:~$ ${cmd}`, type: 'input' }, { text: 'You are a loser.', type: 'error' }, { text: '__SHOW_LOSER__', type: 'system' }]);
      }
      setAwaitingChoice(false);
      return;
    }

    const parts = cmd.trim().split(' ');
    const aliases: Record<string, string> = { dir: 'ls', cls: 'clear', exit: 'clear' };
    const base = aliases[parts[0]] || parts[0];
    const args = parts.slice(1);
    if (!cmd.trim()) return;

    setCommandHistory(p => (p[0] === cmd ? p : [cmd, ...p]));
    setHistory(p => [...p, { text: `${user}@${activeNode}:${currentDir}$ ${cmd}`, type: 'input' }]);

    const handler = cmdRef.current[base];
    if (handler) {
      const result = await handler(args);
      if (result === '__CLEAR__') setHistory([]);
      else if (result) setHistory(p => [...p, { text: result, type: 'output' }]);
    } else {
      setHistory(p => [...p, { text: `Command not found: ${base}`, type: 'error' }]);
    }
    setShowAutocomplete(false);
  };

  /* ── keyboard ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); handleCommand(input); setInput(''); setHistoryIndex(-1);
    } else if (e.key === 'Tab') {
      e.preventDefault(); handleTabComplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const ni = historyIndex + 1;
      if (ni < commandHistory.length) { setHistoryIndex(ni); setInput(commandHistory[ni]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const ni = historyIndex - 1;
      if (ni === -1) { setHistoryIndex(-1); setInput(''); }
      else if (ni >= 0) { setHistoryIndex(ni); setInput(commandHistory[ni]); }
    }
  };

  /* ── effects ── */
  useEffect(() => {
    const id = setInterval(() => { setCpu(Math.floor(Math.random() * 40) + 5); setRam(Math.floor(Math.random() * 60) + 20); setUptime(p => p + 1); }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; }
  }, [input]);

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [history]);

  // auto-focus
  useEffect(() => { textareaRef.current?.focus(); }, []);

  // Load/save localStorage
  useEffect(() => { try { const s = localStorage.getItem('wm_term_history'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) setHistory(p); } } catch {/* */} }, []);
  useEffect(() => { try { localStorage.setItem('wm_term_history', JSON.stringify(history)); } catch {/* */} }, [history]);
  useEffect(() => { try { const s = localStorage.getItem('wm_term_user'); if (s === 'root') setUser('root'); } catch {/* */} }, []);
  useEffect(() => { try { localStorage.setItem('wm_term_user', user); } catch {/* */} }, [user]);
  useEffect(() => { try { const s = localStorage.getItem('wm_cmd_history'); if (s) setCommandHistory(JSON.parse(s)); } catch {/* */} }, []);
  useEffect(() => { try { localStorage.setItem('wm_cmd_history', JSON.stringify(commandHistory)); } catch {/* */} }, [commandHistory]);
  useEffect(() => { try { const s = localStorage.getItem('wm_term_files'); if (s) setDynamicFiles(JSON.parse(s)); } catch {/* */} }, []);
  useEffect(() => { try { localStorage.setItem('wm_term_files', JSON.stringify(dynamicFiles)); } catch {/* */} }, [dynamicFiles]);
  useEffect(() => { try { const s = localStorage.getItem('wm_term_theme'); if (s && ['cyan','green','amber','red'].includes(s)) setTermTheme(s as typeof termTheme); } catch {/* */} }, []);
  useEffect(() => { try { localStorage.setItem('wm_term_theme', termTheme); } catch {/* */} }, [termTheme]);

  // Boot sequence
  useEffect(() => {
    if (!showBoot || bootDone) return;
    setBootDone(true);
    (async () => {
      await typeText('[ OK ] Initializing kernel...', 'system');
      await typeText('[ OK ] Loading modules...', 'system');
      await typeText('[ OK ] Connecting to network...', 'system');
      await typeText('[ OK ] AndSoft system ready.', 'system');
    })();
  }, [showBoot, bootDone, typeText]);

  /* ── nano mode rendering ── */
  if (nanoMode) {
    return (
      <div className={`bg-os-bg font-mono text-[12px] h-full flex flex-col ${className}`}>
        <div className="px-3 py-1 bg-os-titlebar border-b border-os-border flex justify-between text-[10px] text-os-dim">
          <span>GNU nano — {nanoFile}</span>
          <div className="flex gap-3">
            <button onClick={() => {
              const full = `${currentDir}/${nanoFile}`.replace('//', '/');
              setDynamicFiles(prev => ({ ...prev, [full]: { type: 'file', content: nanoContent, path: full } }));
              setNanoMode(false);
              setHistory(p => [...p, { text: `Saved ${nanoFile}`, type: 'system' }]);
            }} className="text-os-green hover:underline">^O Save</button>
            <button onClick={() => setNanoMode(false)} className="text-os-red hover:underline">^X Exit</button>
          </div>
        </div>
        <textarea
          value={nanoContent}
          onChange={e => setNanoContent(e.target.value)}
          className="flex-1 bg-transparent text-os-text p-3 outline-none resize-none"
          autoFocus
        />
      </div>
    );
  }

  /* ── colour helper ── */
  const renderColoredText = (text: string) => {
    const parts = text.split(/(\[BLUE\].*?\[\/BLUE\]|\[GRAY\].*?\[\/GRAY\])/);
    return parts.map((part, idx) => {
      if (part.startsWith('[BLUE]')) return <span key={idx} className="text-os-cyan">{part.replace(/\[BLUE\]|\[\/BLUE\]/g, '')}</span>;
      if (part.startsWith('[GRAY]')) return <span key={idx} className="text-os-dim">{part.replace(/\[GRAY\]|\[\/GRAY\]/g, '')}</span>;
      return part;
    });
  };

  /* ── theme colour ── */
  const themeColor: Record<string, string> = { cyan: 'text-os-cyan', green: 'text-os-green', amber: 'text-os-yellow', red: 'text-os-red' };
  const promptColor = themeColor[termTheme] || 'text-os-green';

  /* ═══ RENDER ═══ */
  return (
    <div
      className={`bg-os-bg/50 font-mono text-xs md:text-sm h-full flex flex-col p-4 md:p-5 ${className}`}
      onClick={() => textareaRef.current?.focus()}
    >
      {/* History */}
      <div
        ref={historyRef}
        className="flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 break-words whitespace-pre-wrap pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,255,136,0.15) transparent' }}
      >
        {history.map((line, i) => {
          if (line.text === '__SHOW_FSOCIETY__') return <img key={i} src="/fsociety.jpg" alt="fsociety" className="w-40 mt-2 rounded-lg border border-os-green/10" />;
          if (line.text === '__SHOW_LOSER__') return <img key={i} src="/loser.jpg" alt="loser" className="w-40 mt-2 rounded-lg border border-os-red/10" />;

          let baseColor = 'text-os-green/80';
          if (line.type === 'input') baseColor = 'text-os-muted';
          if (line.type === 'error') baseColor = 'text-os-red/80';
          if (line.type === 'system') baseColor = 'text-os-dim';

          return (
            <div key={i} className={`${baseColor} break-words whitespace-pre-wrap leading-relaxed`}>
              {renderColoredText(line.text)}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="mt-auto pt-3 border-t border-os-border/30">
        <div className="flex items-start gap-2 relative">
          <span className={`${promptColor} shrink-0 whitespace-nowrap text-xs font-mono`}>
            {user}@{activeNode}:{currentDir}$
          </span>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); setShowAutocomplete(e.target.value.length > 0); }}
              onKeyDown={handleKeyDown}
              disabled={isTyping || systemCrashed}
              rows={1}
              className="bg-transparent outline-none flex-1 w-full text-os-green caret-current min-w-0 resize-none overflow-hidden whitespace-pre-wrap break-words disabled:opacity-40 leading-relaxed placeholder:text-os-dim/40"
              placeholder={isTyping ? '' : 'type a command...'}
              autoFocus
            />
            {!isTyping && !systemCrashed && <span className="animate-pulse text-os-green ml-1">█</span>}

            {showAutocomplete && getAutocompleteOptions().length > 0 && (
              <div className="absolute bottom-full left-0 w-48 mb-1 bg-os-window border border-os-border rounded-md overflow-hidden shadow-lg z-50">
                {getAutocompleteOptions().slice(0, 7).map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const parts = input.trim().split(' ');
                      parts[parts.length - 1] = opt;
                      setInput(parts.join(' ') + ' ');
                      setShowAutocomplete(false);
                    }}
                    className="px-3 py-1.5 text-os-cyan text-xs hover:bg-os-green/10 cursor-pointer transition border-b border-os-border/30 last:border-b-0"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
