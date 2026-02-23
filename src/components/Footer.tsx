import { Facebook, Twitter, Linkedin, Github, Mail, MapPin, Phone, Terminal, Activity, Shield, Zap, Server } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Clock from './Clock';

export default function Footer() {
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(38);
  const [uptime, setUptime] = useState(0);
  const [access, setAccess] = useState(false);
  const [_systemId, _setSystemId] = useState(() => Math.floor(Math.random()*9999));
  const [visitors] = useState(Math.floor(Math.random()*5000));
  const [user, setUser] = useState<"guest" | "root">("guest");
  const [loginUser, setLoginUser] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [bootSequenceShown, setBootSequenceShown] = useState(false);
  const [_theme, _setTheme] = useState<"cyan" | "green" | "amber" | "red">("cyan");
  const [dynamicFiles, setDynamicFiles] = useState<Record<string, { type: "file" | "dir", content?: string, path: string }>>({});
  const [nanoMode, setNanoMode] = useState(false);
  const [nanoFile, setNanoFile] = useState("");
  const [nanoContent, setNanoContent] = useState("");
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [showFloatingTerminal, setShowFloatingTerminal] = useState(false);
  const [activeNode, setActiveNode] = useState("ANDSOFT-CORE");
  const [_aiOnline, _setAiOnline] = useState(false);
  const [_systemCrashed, _setSystemCrashed] = useState(false);
  const [history, setHistory] = useState<Array<{ text: string; type: "input" | "output" | "error" | "system" }>>([
    { text: "System initialized.", type: "system" },
    { text: "Type 'help' to see available commands.", type: "system" }
  ]);
  const [input, setInput] = useState("");
  const [termSize, setTermSize] = useState("normal");
  const [currentDir, setCurrentDir] = useState("/home/guest");
  const [prevDir, setPrevDir] = useState("/home/guest");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingChoice, setAwaitingChoice] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const termHeight =
    termSize === "small"
      ? "h-[150px]"
      : termSize === "large"
      ? "h-[340px]"
      : termSize === "full"
      ? "h-[480px]"
      : "h-[220px]";

  const fileSystem = {
    "/": ["home"],
    "/home": ["guest"],
    "/home/guest": ["about.txt", "contact.md", "system.log", "projects"],
    "/home/guest/projects": ["project1.txt", "project2.txt"]
  };

  const fileContents = {
    "about.txt": `AndSoft Global Partner

We operate across multiple digital sectors.

Infrastructure.
Security.
Control.

Partner nodes active worldwide.`,

    "contact.md": `Contact Protocol

Phone: +976 99212999
Signal: ACTIVE
Node: ANDSOFT_CORE

Authorized access only.`,

    "system.log": `[ OK ] kernel loaded
[ OK ] memory initialized
[ OK ] network connected
[ OK ] interface ready`,

    "project1.txt": `Project: AndSoft Portal
Status: In Development
Progress: 75%`,

    "project2.txt": `Project: Neural Interface
Status: Beta Testing
Progress: 45%`
  };

  const fsocietySpeech = `Are you a one or a zero?

In this world, there are two kinds of people.

Those who control.
And those who are controlled.

The ones who wake up and see the system.
And the zeros who live inside it.

The question is not what you are now.

The question is…

What do you choose to be.`;



  const progressBar = (percent: number): string => {
    const filled = Math.floor(percent / 10);
    return `[${("█".repeat(filled))}${("░".repeat(10 - filled))}] ${percent}%`;
  };

  const requireRoot = async (): Promise<boolean> => {
    if (user !== "root") {
      await typeText("Permission denied.", "error");
      return false;
    }
    return true;
  };

  const resolvePath = (target: string): string => {
    if (target === "/") return "/";
    if (target === "~") return "/home/guest";
    if (target === "-") return prevDir || "/home/guest";
    if (target.startsWith("/")) return target;
    if (target === "..") {
      const parts = currentDir.split("/");
      parts.pop();
      return parts.join("/") || "/";
    }
    return currentDir === "/"
      ? `/${target}`
      : `${currentDir}/${target}`;
  };

  const typeText = async (text: string, type: "output" | "error" | "system" = "output"): Promise<void> => {
    setIsTyping(true);
    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      // Play typing sound every 3 characters
      if (i % 3 === 0) {
        playTypeSound();
      }

      setHistory(prev => {
        const newHistory = [...prev];

        if (
          newHistory.length > 0 &&
          newHistory[newHistory.length - 1].type === type &&
          newHistory[newHistory.length - 1].text.startsWith(current.slice(0, -1))
        ) {
          newHistory[newHistory.length - 1] = {
            text: current,
            type
          };
        } else {
          newHistory.push({
            text: current,
            type
          });
        }

        return newHistory;
      });

      await new Promise(r => setTimeout(r, 20));
    }

    setIsTyping(false);
  };

  const commands = {
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

    ls: (): string => {
      const staticItems = fileSystem[currentDir as keyof typeof fileSystem] || [];
      const dynamicItems = Object.values(dynamicFiles)
        .filter(file => {
          const parent = file.path.substring(0, file.path.lastIndexOf("/")) || "/";
          return parent === currentDir;
        })
        .map(file => {
          const name = file.path.split("/").pop();
          return file.type === "dir"
            ? `[BLUE]${name}[/BLUE]`
            : `[GRAY]${name}[/GRAY]`;
        });
      return [...staticItems.map(i => `[GRAY]${i}[/GRAY]`), ...dynamicItems].join("   ");
    },

    cd: async (args: string[]): Promise<string> => {
      const target = args[0] || "~";
      const newPath = resolvePath(target);

      if (fileSystem[newPath as keyof typeof fileSystem]) {
        setPrevDir(currentDir);
        setCurrentDir(newPath);
        return "";
      }

      const dynamicDir = Object.values(dynamicFiles)
        .find(file => file.type === "dir" && file.path === newPath);

      if (dynamicDir) {
        setPrevDir(currentDir);
        setCurrentDir(newPath);
        return "";
      }

      return `cd: no such directory: ${target}`;
    },

    cat: async (args: string[]): Promise<string> => {
      const file = args[0];
      if (!file) return "usage: cat <file>";
      
      const fullPath = `${currentDir}/${file}`.replace("//", "/");
      const dynamicFile = Object.values(dynamicFiles).find(f => f.path === fullPath && f.type === "file");
      
      if (dynamicFile && dynamicFile.content) {
        await typeText(dynamicFile.content);
        return "";
      }
      
      const content = fileContents[file as keyof typeof fileContents];
      if (!content) return "cat: no such file";
      
      await typeText(content);
      return "";
    },

    whoami: (): string => user,

    pwd: (): string => currentDir,

    date: (): string => new Date().toString(),

    uname: (): string => "Linux andsoft 6.1.0 x86_64",

    echo: (args: string[]): string => args.join(" "),

    clear: (): string => "__CLEAR__",

    sudo: async (args: string[]): Promise<string> => {
      const sub = args.join(" ");

      if (sub === "apt install") {
        await typeText(fsocietySpeech);
        setHistory(prev => [
          ...prev,
          {
            text: "[ENTER 1 OR 0]",
            type: "system"
          }
        ]);
        setAwaitingChoice(true);
        return "";
      }

      if (sub === "apt update") {
        await typeText(`Get:1 andsoft core packages
Get:2 security modules
Fetched 12.4 MB in 2s

Reading package lists...  Done`);
        return "";
      }

      if (sub === "apt upgrade") {
        setAwaitingChoice(true);
        await typeText("Are you a one or a zero?");
        return "";
      }

      return "sudo: command not found";
    },

    tree: (): string => `
/
└── home
    └── guest
        ├── about.txt
        ├── contact.md
        ├── system.log
        └── projects
            ├── project1.txt
            └── project2.txt
`,

    neofetch: (): string => `
AndSoft OS v1.0
─────────────────
Kernel: 6.1.0 x86_64
CPU: ${cpu}%
RAM: ${ram}%
Uptime: ${uptime}s
Node: AX-${_systemId}
Status: ONLINE
`,

    scan: async (): Promise<string> => {
      await typeText("Scanning network...");
      await typeText("Node detected: CORE-AX");
      await typeText("Security: ACTIVE");
      await typeText("Threat level: NONE");
      return "";
    },

    clock: (): string => new Date().toLocaleTimeString(),

    login: async (args: string[]): Promise<string> => {
      const username = args[0] || "root";
      if (username === "root") {
        setLoginUser("root");
        await typeText("Password: ");
        setAwaitingChoice(true);
        return "";
      }
      return `login: user '${username}' does not exist`;
    },

    andsoft: async (): Promise<string> => {
      await typeText("Welcome, operator.");
      await typeText("You have root access.");
      await typeText("System decrypted.");
      return "";
    },

    hack: async (): Promise<string> => {
      if (!await requireRoot()) return "";
      
      for (let i = 0; i <= 100; i += 10) {
        await typeText(progressBar(i));
      }
      await typeText("Root exploit successful.");
      return "";
    },

    netmap: (): string => `
   USER
    │
  ANDSOFT
  /     \\
 NODE1  NODE2

Network Status: CONNECTED
`,

    touch: (args: string[]): string => {
      const name = args[0];
      if (!name) return "usage: touch <filename>";
      const fullPath = `${currentDir}/${name}`.replace("//", "/");
      setDynamicFiles(prev => ({
        ...prev,
        [fullPath]: {
          type: "file",
          content: "",
          path: fullPath
        }
      }));
      return `created ${name}`;
    },

    mkdir: (args: string[]): string => {
      const name = args[0];
      if (!name) return "usage: mkdir <dirname>";
      const fullPath = `${currentDir}/${name}`.replace("//", "/");
      setDynamicFiles(prev => ({
        ...prev,
        [fullPath]: {
          type: "dir",
          path: fullPath
        }
      }));
      return `directory created: ${name}`;
    },

    rm: async (args: string[]): Promise<string> => {
      if (!await requireRoot()) return "";
      const name = args[0];
      if (!name) return "usage: rm <file>";
      const fullPath = `${currentDir}/${name}`.replace("//", "/");
      setDynamicFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fullPath];
        return newFiles;
      });
      return `removed ${name}`;
    },

    nano: async (args: string[]): Promise<string> => {
      const file = args[0];
      if (!file) {
        await typeText("usage: nano <filename>");
        return "";
      }
      setNanoFile(file);
      const fullPath = `${currentDir}/${file}`.replace("//", "/");
      const dynamicFile = Object.values(dynamicFiles).find(f => f.path === fullPath && f.type === "file");
      if (dynamicFile) {
        setNanoContent(dynamicFile.content || "");
      } else if (fileContents[file as keyof typeof fileContents]) {
        setNanoContent(fileContents[file as keyof typeof fileContents]);
      } else {
        setNanoContent("");
      }
      setNanoMode(true);
      return "";
    },

    ps: (): string => {
      return `PID   NAME
102   andsoft-core
211   network-daemon
334   security-module
445   ai-monitor
556   firewall-service`;
    },

    ai: async (): Promise<string> => {
      await typeText("AI CORE INITIALIZING...");
      _setAiOnline(true);
      await typeText("AI CORE ONLINE");
      await typeText("Monitoring system.");
      await typeText("Ready for commands.");
      return "";
    },

    connect: async (args: string[]): Promise<string> => {
      const node = args[0] || "node1";
      setActiveNode(node.toUpperCase());
      _setSystemId(Math.floor(Math.random()*9999));
      await typeText(`Connecting to ${node}...`);
      await typeText("Connection established.");
      return "";
    },

    theme: async (args: string[]): Promise<string> => {
      const newTheme = args[0] as "cyan" | "green" | "amber" | "red";
      if (!["cyan", "green", "amber", "red"].includes(newTheme)) {
        return "Available themes: cyan, green, amber, red";
      }
      _setTheme(newTheme);
      await typeText(`Theme changed to ${newTheme}`);
      return "";
    },

    attack: async (): Promise<string> => {
      if (!await requireRoot()) return "";
      
      await typeText("USER → NODE → FIREWALL → ACCESS");
      await typeText("");
      await typeText("Penetrating NODE...");
      await typeText(progressBar(33));
      await typeText("");
      await typeText("Breaking FIREWALL...");
      await typeText(progressBar(66));
      await typeText("");
      await typeText("Gaining ACCESS...");
      await typeText(progressBar(100));
      await typeText("");
      await typeText("SYSTEM COMPROMISED");
      return "";
    },

    crash: async (): Promise<string> => {
      if (!await requireRoot()) return "";
      
      _setSystemCrashed(true);
      await typeText("INITIATING SYSTEM SHUTDOWN...");
      await typeText("Terminating all processes...");
      await typeText("");
      await typeText("KERNEL PANIC");
      await typeText("SYSTEM FAILURE");
      await typeText("REBOOT REQUIRED");
      
      setTimeout(async () => {
        _setSystemCrashed(false);
        setBootSequenceShown(false);
        setShowBootScreen(true);
        await new Promise(r => setTimeout(r, 2000));
        setShowBootScreen(false);
        await typeText("[ OK ] System rebooted.", "system");
      }, 3000);
      
      return "";
    },
  };

  const getAutocompleteOptions = (): string[] => {
    const trimmed = input.trim();
    if (!trimmed) return [];

    const parts = trimmed.split(" ");
    const lastPart = parts[parts.length - 1];

    if (parts.length === 1) {
      return Object.keys(commands).filter(cmd => cmd.startsWith(lastPart));
    }

    const items = fileSystem[currentDir as keyof typeof fileSystem] || [];
    return items.filter((item: string) => item.startsWith(lastPart));
  };

  const handleTabComplete = (): void => {
    const options = getAutocompleteOptions();
    if (options.length === 1) {
      const parts = input.trim().split(" ");
      parts[parts.length - 1] = options[0];
      setInput(parts.join(" ") + " ");
    }
  };

  const handleCommand = async (cmd: string): Promise<void> => {
    if (awaitingChoice) {
      // Handle login password
      if (loginUser === "root") {
        setHistory(prev => [
          ...prev,
          { text: `${user}@${activeNode}:~$ Password: ••••`, type: "input" }
        ]);
        setUser("root");
        _setTheme("red");
        setHistory(prev => [
          ...prev,
          { text: "Welcome to AndSoft, root.", type: "system" }
        ]);
        setLoginUser("");
        setAwaitingChoice(false);
        return;
      }

      // Handle fsociety choice (1 or 0)
      if (cmd === "1") {
        setHistory(prev => [
          ...prev,
          { text: `${user}@${activeNode}:~$ ` + cmd, type: "input" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "Welcome to fsociety.", type: "output" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "__SHOW_FSOCIETY__", type: "system" }
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          { text: `${user}@${activeNode}:~$ ` + cmd, type: "input" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "You are a loser.", type: "error" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "__SHOW_LOSER__", type: "system" }
        ]);
      }

      setAwaitingChoice(false);
      return;
    }

    const parts = cmd.trim().split(" ");
    const aliases: Record<string, string> = { dir: "ls", cls: "clear", exit: "clear" };
    const base = aliases[parts[0]] || parts[0];
    const args = parts.slice(1);

    if (!cmd.trim()) return;

    setCommandHistory(prev => prev[0] === cmd ? prev : [cmd, ...prev]);

    setHistory(prev => [
      ...prev,
      { text: `${user}@${activeNode}:${currentDir}$ ${cmd}`, type: "input" }
    ]);

    if (commands[base as keyof typeof commands]) {
      const result = await (commands[base as keyof typeof commands] as any)(args);

      if (result === "__CLEAR__") {
        setHistory([]);
      } else {
        if (result) {
          setHistory(prev => [
            ...prev,
            { text: result, type: "output" }
          ]);
        }
      }
    } else {
      setHistory(prev => [
        ...prev,
        { text: `Command not found: ${base}`, type: "error" }
      ]);
    }

    setShowAutocomplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommand(input);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      if (newIndex < commandHistory.length) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      if (newIndex === -1) {
        setHistoryIndex(-1);
        setInput("");
      } else if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 5);
      setRam(Math.floor(Math.random() * 60) + 20);
      setUptime(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [history]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("term_history", JSON.stringify(history));
    } catch (e) {
      // Ignore storage errors
    }
  }, [history]);

  // Load persistent login state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_user");
      if (saved === "root") setUser("root");
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Save persistent login state
  useEffect(() => {
    try {
      localStorage.setItem("term_user", user);
    } catch (e) {
      // Ignore storage errors
    }
  }, [user]);

  // Load command history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cmd_history");
      if (saved) setCommandHistory(JSON.parse(saved));
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save command history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cmd_history", JSON.stringify(commandHistory));
    } catch (e) {
      // Ignore storage errors
    }
  }, [commandHistory]);

  // Load persistent dynamic files
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_files");
      if (saved) setDynamicFiles(JSON.parse(saved));
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save persistent dynamic files
  useEffect(() => {
    try {
      localStorage.setItem("term_files", JSON.stringify(dynamicFiles));
    } catch (e) {
      // Ignore storage errors
    }
  }, [dynamicFiles]);

  // Auto-focus terminal
  useEffect(() => {
    if (showTerminal) {
      textareaRef.current?.focus();
    }
  }, [showTerminal]);

  // Persist theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("term_theme", _theme);
    } catch (e) {
      // Ignore storage errors
    }
  }, [_theme]);

  // Load theme from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_theme");
      if (saved && ["cyan", "green", "amber", "red"].includes(saved)) {
        _setTheme(saved as any);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Persist theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("term_theme", _theme);
    } catch (e) {
      // Ignore storage errors
    }
  }, [_theme]);

  // Load theme from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_theme");
      if (saved && ["cyan", "green", "amber", "red"].includes(saved)) {
        _setTheme(saved as any);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Boot sequence on first terminal open
  useEffect(() => {
    if (showTerminal && !bootSequenceShown && showBootScreen) {
      setBootSequenceShown(true);
      const runBootSequence = async () => {
        setTimeout(() => {
          setShowBootScreen(false);
        }, 4000);
        
        // Delay before showing boot messages
        await new Promise(r => setTimeout(r, 4100));
        
        await typeText("[ OK ] Initializing kernel...", "system");
        await typeText("[ OK ] Loading modules...", "system");
        await typeText("[ OK ] Connecting to network...", "system");
        await typeText("[ OK ] AndSoft system ready.", "system");
      };
      runBootSequence();
    }
  }, [showTerminal, bootSequenceShown, showBootScreen]);

  const handleAccess = () => {
    setAccess(true);
    playAccessSound();
    setTimeout(() => setAccess(false), 2000);
  };

  // Sound effects using Web Audio API
  const playSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = frequency;
      osc.type = type;
      gain.gain.value = 0.05;

      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, duration * 1000);
    } catch (e) {
      // Audio not supported
    }
  };

  const playTypeSound = () => {
    playSound(800 + Math.random() * 200, 0.05, 'square');
  };

  const playAccessSound = () => {
    playSound(1200, 0.1, 'sine');
    setTimeout(() => playSound(1400, 0.1, 'sine'), 100);
  };

  const statusItems = [
    { label: "NETWORK", value: "ONLINE", icon: <Activity size={14} /> },
    { label: "CPU", value: `${cpu}%`, icon: <Zap size={14} /> },
    { label: "RAM", value: `${ram}%`, icon: <Server size={14} /> },
    { label: "UPTIME", value: `${uptime}s`, icon: <Shield size={14} /> },
  ];

  return (
    <footer className="px-3 md:px-6 py-3">
      {/* Boot Screen Overlay */}
      {showBootScreen && showTerminal && (
        <div className="fixed inset-0 bg-os-bg/95 flex items-center justify-center z-[100] font-mono text-os-green text-sm">
          <div className="text-center space-y-4">
            <div className="text-lg font-bold mb-8 glow-green">ANDSOFT BIOS v3.2</div>
            <div className="text-os-muted">Initializing hardware...</div>
            <div className="text-os-muted">Memory check... <span className="text-os-green">OK</span></div>
            <div className="text-os-muted">CPU check... <span className="text-os-green">OK</span></div>
            <div className="text-os-muted">Booting kernel...</div>
            <div className="mt-8 animate-pulse text-os-cyan">Starting system...</div>
          </div>
        </div>
      )}

      {/* Nano Editor Overlay */}
      {nanoMode && (
        <div className="fixed inset-0 bg-os-bg/95 flex items-center justify-center z-[100] font-mono">
          <div className="w-[90%] h-[80%] os-window flex flex-col">
            <div className="os-titlebar flex justify-between items-center">
              <div className="os-dots">
                <div className="os-dot close" />
                <div className="os-dot minimize" />
                <div className="os-dot maximize" />
              </div>
              <div className="os-title">GNU nano 7.2 — {nanoFile}</div>
              <span className="text-os-dim text-[10px] font-mono">^X Exit</span>
            </div>
            <textarea
              value={nanoContent}
              onChange={(e) => setNanoContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'x') {
                  e.preventDefault();
                  const fullPath = `${currentDir}/${nanoFile}`.replace("//", "/");
                  setDynamicFiles(prev => ({
                    ...prev,
                    [fullPath]: {
                      type: "file",
                      content: nanoContent,
                      path: fullPath
                    }
                  }));
                  setNanoMode(false);
                  setTimeout(() => {
                    typeText(`Saved ${nanoFile}`, "system");
                  }, 100);
                }
              }}
              className="flex-1 bg-os-bg/50 text-os-green outline-none p-4 resize-none font-mono text-sm"
              autoFocus
            />
            <div className="px-4 py-2 border-t border-os-border bg-os-titlebar/50 text-os-dim text-[10px] font-mono">
              ^G Get Help  ^X Exit  ^O WriteOut  ^R Read File  ^Y Prev Page  ^K Cut Text  ^U Uncut Text  ^J Justify
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-3">
        {/* ─── Top: Brand + Contact + System ─── */}
        <div className="os-window">
          <div className="os-titlebar">
            <div className="os-dots">
              <div className="os-dot close" />
              <div className="os-dot minimize" />
              <div className="os-dot maximize" />
            </div>
            <div className="os-title">
              /sys/footer — System Info
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

              {/* Brand */}
              <div className="md:col-span-5">
                <div className="mb-3">
                  <span className="text-2xl font-bold font-mono tracking-tight glow-green">ANDSOFT</span>
                  <span className="text-os-dim text-[10px] font-mono tracking-wider ml-2">v2.5 LTS</span>
                </div>
                <p className="text-os-muted text-xs leading-relaxed max-w-sm mb-4">
                  Building the future of digital infrastructure. Secure, scalable, and intelligent solutions for the modern world.
                </p>
                {/* Social icons */}
                <div className="flex items-center gap-2">
                  {[
                    { icon: <Github size={14} />, href: "#" },
                    { icon: <Linkedin size={14} />, href: "#" },
                    { icon: <Twitter size={14} />, href: "#" },
                    { icon: <Facebook size={14} />, href: "#" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="w-8 h-8 rounded-md bg-os-border/30 border border-os-border flex items-center justify-center text-os-dim hover:text-os-green hover:bg-os-green/10 hover:border-os-green/30 transition-all duration-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="md:col-span-3">
                <div className="font-mono text-[10px] text-os-dim tracking-wider uppercase mb-3 flex items-center gap-2">
                  <span className="text-os-green">●</span> CONTACT
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-os-muted text-xs group cursor-default hover:text-os-text transition-colors">
                    <div className="w-7 h-7 rounded flex items-center justify-center bg-os-border/30 group-hover:bg-os-green/10 transition-colors">
                      <Phone size={12} className="text-os-dim group-hover:text-os-green transition-colors" />
                    </div>
                    +976 99212999
                  </li>
                  <li className="flex items-center gap-2.5 text-os-muted text-xs group cursor-default hover:text-os-text transition-colors">
                    <div className="w-7 h-7 rounded flex items-center justify-center bg-os-border/30 group-hover:bg-os-green/10 transition-colors">
                      <Mail size={12} className="text-os-dim group-hover:text-os-green transition-colors" />
                    </div>
                    info@andsoft.mn
                  </li>
                  <li className="flex items-center gap-2.5 text-os-muted text-xs group cursor-default hover:text-os-text transition-colors">
                    <div className="w-7 h-7 rounded flex items-center justify-center bg-os-border/30 group-hover:bg-os-green/10 transition-colors">
                      <MapPin size={12} className="text-os-dim group-hover:text-os-green transition-colors" />
                    </div>
                    Ulaanbaatar, Mongolia
                  </li>
                </ul>
              </div>

              {/* System Status */}
              <div className="md:col-span-4" onClick={handleAccess}>
                <div className="font-mono text-[10px] text-os-dim tracking-wider uppercase mb-3 flex items-center gap-2">
                  <span className="text-os-green">●</span> SYSTEM STATUS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {statusItems.map((item, i) => (
                    <div
                      key={i}
                      className="bg-os-bg/50 border border-os-border/50 rounded-md p-2.5 hover:bg-os-green/[0.03] hover:border-os-green/20 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-os-dim group-hover:text-os-green transition">{item.icon}</span>
                        <span className="text-os-dim text-[9px] uppercase tracking-wider font-mono">{item.label}</span>
                      </div>
                      <div className="text-os-green text-[11px] font-mono font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
                {access && (
                  <div className="text-os-green text-[10px] font-mono mt-2 animate-pulse text-center tracking-wider">
                    ● ACCESS GRANTED
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Terminal (collapsible) ─── */}
        <div className="os-window">
          <div className="os-titlebar">
            <div className="os-dots">
              <div className="os-dot close" />
              <div className="os-dot minimize" />
              <div className="os-dot maximize" />
            </div>
            <div className="os-title">
              {user}@{activeNode.toLowerCase()} — bash — terminal
            </div>
            <button
              onClick={() => {
                setShowTerminal(!showTerminal);
                playSound(600, 0.1, 'sine');
              }}
              className="font-mono text-[10px] text-os-dim hover:text-os-green transition-colors"
            >
              {showTerminal ? "▼ Hide" : "▶ Show"}
            </button>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showTerminal ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className={`
              p-4 md:p-5
              font-mono
              text-xs md:text-sm
              ${termHeight}
              transition-all duration-300
              flex flex-col
              bg-os-bg/50
            `}>
              {/* Terminal size controls */}
              <div className="flex justify-end gap-1 mb-2">
                <button
                  onClick={() => setTermSize("small")}
                  className="text-[10px] w-6 h-5 rounded bg-os-border/30 hover:bg-os-green/10 text-os-dim hover:text-os-green transition flex items-center justify-center"
                >
                  −
                </button>
                <button
                  onClick={() => setTermSize(termSize === "full" ? "normal" : "full")}
                  className="text-[10px] w-6 h-5 rounded bg-os-border/30 hover:bg-os-green/10 text-os-dim hover:text-os-green transition flex items-center justify-center"
                >
                  □
                </button>
                <button
                  onClick={() => setTermSize("large")}
                  className="text-[10px] w-6 h-5 rounded bg-os-border/30 hover:bg-os-green/10 text-os-dim hover:text-os-green transition flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Terminal output */}
              <div
                ref={historyRef}
                className="flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 break-words whitespace-pre-wrap pr-1"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,255,136,0.15) transparent' }}
              >
                {history.map((line, i) => {
                  if (line.text === "__SHOW_FSOCIETY__") {
                    return (
                      <img key={i} src="/fsociety.jpg" alt="fsociety" className="w-40 mt-2 rounded-lg border border-os-green/10" />
                    );
                  }
                  if (line.text === "__SHOW_LOSER__") {
                    return (
                      <img key={i} src="/loser.jpg" alt="loser" className="w-40 mt-2 rounded-lg border border-os-red/10" />
                    );
                  }

                  let baseColor = "text-os-green/80";
                  if (line.type === "input") baseColor = "text-os-muted";
                  if (line.type === "error") baseColor = "text-os-red/80";
                  if (line.type === "system") baseColor = "text-os-dim";

                  const renderColoredText = (text: string) => {
                    const parts = text.split(/(\[BLUE\].*?\[\/BLUE\]|\[GRAY\].*?\[\/GRAY\])/);
                    return parts.map((part: string, idx: number) => {
                      if (part.startsWith("[BLUE]")) {
                        const content = part.replace(/\[BLUE\]|\[\/BLUE\]/g, "");
                        return <span key={idx} className="text-os-cyan">{content}</span>;
                      } else if (part.startsWith("[GRAY]")) {
                        const content = part.replace(/\[GRAY\]|\[\/GRAY\]/g, "");
                        return <span key={idx} className="text-os-dim">{content}</span>;
                      }
                      return part;
                    });
                  };

                  return (
                    <div key={i} className={`${baseColor} break-words whitespace-pre-wrap leading-relaxed`}>
                      {renderColoredText(line.text)}
                    </div>
                  );
                })}
              </div>

              {/* Terminal input */}
              <div className="mt-auto pt-3 border-t border-os-border/30">
                <div className="flex items-start gap-2 relative">
                  <span className="text-os-green/70 shrink-0 whitespace-nowrap text-xs font-mono">
                    {user}@{activeNode}:{currentDir}$
                  </span>
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setShowAutocomplete(e.target.value.length > 0);
                      }}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping || _systemCrashed}
                      rows={1}
                      className="bg-transparent outline-none flex-1 w-full text-os-green caret-current min-w-0 resize-none overflow-hidden whitespace-pre-wrap break-words disabled:opacity-40 leading-relaxed placeholder:text-os-dim/40"
                      placeholder={isTyping ? "" : "type a command..."}
                      autoFocus
                    />
                    {!isTyping && !_systemCrashed && <span className="animate-pulse text-os-green ml-1">█</span>}
                    
                    {/* Autocomplete dropdown */}
                    {showAutocomplete && getAutocompleteOptions().length > 0 && (
                      <div className="absolute bottom-full left-0 w-48 mb-1 bg-os-window border border-os-border rounded-md overflow-hidden shadow-lg z-50">
                        {getAutocompleteOptions().slice(0, 7).map((option, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              const parts = input.trim().split(" ");
                              parts[parts.length - 1] = option;
                              setInput(parts.join(" ") + " ");
                              setShowAutocomplete(false);
                            }}
                            className="px-3 py-1.5 text-os-cyan text-xs hover:bg-os-green/10 cursor-pointer transition border-b border-os-border/30 last:border-b-0"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="os-window">
          <div className="px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
            <div className="flex items-center gap-3">
              <span className="text-os-dim text-[11px] font-mono">
                © {new Date().getFullYear()} AndSoft
              </span>
              <span className="text-os-dim/30 text-[11px]">·</span>
              <a href="#" className="text-os-dim hover:text-os-green text-[11px] font-mono transition-colors">
                Privacy
              </a>
              <span className="text-os-dim/30 text-[11px]">·</span>
              <a href="#" className="text-os-dim hover:text-os-green text-[11px] font-mono transition-colors">
                Terms
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-os-dim text-[10px] font-mono">Visitors: {visitors.toLocaleString()}</span>
              <span className="text-os-dim/30">|</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-os-green status-pulse" />
                <span className="text-os-dim text-[10px] font-mono">v1.0.3</span>
              </div>
              <span className="text-os-dim/30">|</span>
              <Clock />
              <span className="text-os-dim/30">|</span>
              <span className="text-os-dim text-[10px] font-mono">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Terminal Button */}
      {showTerminal && !showFloatingTerminal && (
        <button
          onClick={() => {
            setShowFloatingTerminal(true);
            setShowTerminal(false);
          }}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-os-green/10 border border-os-green/20 hover:bg-os-green/20 transition-all duration-300 shadow-lg z-50"
          title="Minimize Terminal"
        >
          <Terminal size={20} className="text-os-green" />
        </button>
      )}

      {/* Floating Terminal Window */}
      {showFloatingTerminal && (
        <div className="fixed bottom-8 right-8 w-80 os-window shadow-xl z-50">
          <div className="os-titlebar">
            <div className="os-dots">
              <div className="os-dot close" />
              <div className="os-dot minimize" />
              <div className="os-dot maximize" />
            </div>
            <div className="os-title">Terminal (minimized)</div>
            <button
              onClick={() => {
                setShowFloatingTerminal(false);
                setShowTerminal(true);
              }}
              className="text-os-dim hover:text-os-green transition text-xs font-mono"
            >
              ⛶
            </button>
          </div>
          <div className="h-40 bg-os-bg/50 overflow-y-auto text-os-green/70 text-xs font-mono p-3 space-y-1">
            {history.slice(-5).map((line, i) => (
              <div key={i} className="text-os-dim">{line.text.substring(0, 40)}{line.text.length > 40 ? '...' : ''}</div>
            ))}
          </div>
        </div>
      )}
    </footer>
  );
}
